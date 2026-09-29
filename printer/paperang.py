"""
Paperang P2 드라이버 — USB(/dev/usb/lp0) 로 A5 프로토콜 래스터 출력.

실기기(P2, USB 4348:5584) 확인 결과 구형 0x02 프로토콜은 응답만 하고 인쇄는 무시하며,
A5 프로토콜로만 출력된다. (참고: xtawa/paperang_research web/src/protocol.js·transport.js)

프레임:  A5 | ver(1) | len(2, LE) | payload | crc32(payload, seed 0x35769521)(4, LE) | 5A
payload: domain(1) | command(1) | kind(1) | argsLen(2, LE) | args
  kind: 01 요청 / 02 응답 / 03 (마지막 데이터 청크 등)
출력 순서: 상태(05/0F) → 시작(05/19) → 데이터(05/1B, 줄 단위 청크) → 종료(05/22)
이미지: 한 줄 576 픽셀 = 72바이트, 1비트/픽셀(MSB first), 1 = 검정
"""

from __future__ import annotations

import logging
import os
import select
import struct
import time
import zlib

from PIL import Image, ImageFilter, ImageOps

log = logging.getLogger(__name__)

CRC_SEED = 0x35769521
FRAME_VER = 0x01
DEFAULT_MAX_FRAME = 237  # BLE 공개 구현의 프레임 예산 — 프린터가 최대 길이를 안 알려줄 때
MAX_FRAME_CAP = 1024     # P2 USB 가 01/14 로 알려주는 값
PRINT_DATA_OVERHEAD = 26

DOMAIN_SYSTEM = 0x01
SYS_MAX_LEN = 0x14

DOMAIN_THERMAL = 0x05
CMD_STATUS = 0x0F
CMD_SET_DENSITY = 0x11
CMD_START = 0x19
CMD_DATA = 0x1B
CMD_FINISH = 0x22
KIND_REQUEST = 0x01
KIND_FINAL = 0x03


class PrinterError(OSError):
    pass


def image_to_rows(img: Image.Image, width: int, autocontrast: bool = True) -> bytes:
    """임의 이미지 → 프린터 폭에 맞춘 1비트 래스터 (1 = 검정)."""
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img)
    gray = img.convert("L")
    height = max(1, round(gray.height * width / gray.width))
    if gray.size != (width, height):
        gray = gray.resize((width, height), Image.LANCZOS)
    if autocontrast:
        gray = ImageOps.autocontrast(gray, cutoff=1)

    # 글자·선은 임계값으로 또렷하게, 사진(중간톤이 넓게 퍼진 영역)만 디더링 —
    # 전체를 디더링하면 작은 글씨의 안티앨리어싱 가장자리가 점으로 흩어져 끊겨 보임
    midtone = gray.point(lambda v: 255 if 40 < v < 215 else 0)
    photo = midtone.filter(ImageFilter.BoxBlur(6)).point(lambda v: 255 if v > 110 else 0)
    photo = photo.filter(ImageFilter.MaxFilter(9))
    # 감열지는 중간톤이 흐리게 나옴 — 옅은 회색은 흰색으로, 나머지는 어둡게 당김
    dithered = gray.point(lambda v: 255 if v >= 225 else int((v / 225) ** 1.4 * 225)).convert("1")
    thresholded = gray.point(lambda v: 255 if v >= 170 else 0).convert("1")
    mono = Image.composite(dithered, thresholded, photo)
    # PIL '1' 모드는 1 = 흰색 → 비트 반전
    return bytes(b ^ 0xFF for b in mono.tobytes())


def compact_rows(rows: bytes, width_bytes: int, max_gap: int, edge: int = 8) -> bytes:
    """빈 줄 구간을 max_gap 줄로 줄이고 위아래 여백은 edge 줄만 남김 — 레이아웃은 유지한 채 용지 절약."""
    if max_gap <= 0:
        return rows
    lines = [rows[i:i + width_bytes] for i in range(0, len(rows), width_bytes)]
    blank = bytes(width_bytes)
    out: list[bytes] = []
    run = 0
    started = False
    for line in lines:
        if line == blank:
            run += 1
            if run <= (max_gap if started else edge):
                out.append(line)
        else:
            run = 0
            started = True
            out.append(line)
    while len(out) > edge and all(l == blank for l in out[-edge - 1:]):
        out.pop()
    return b"".join(out)


# ── 프레이밍 ─────────────────────────────────
def _crc(data: bytes) -> int:
    return zlib.crc32(data, CRC_SEED) & 0xFFFFFFFF


def pack_frame(payload: bytes) -> bytes:
    return bytes([0xA5, FRAME_VER]) + struct.pack("<H", len(payload)) + payload + struct.pack("<I", _crc(payload)) + b"\x5a"


def build_payload(domain: int, command: int, args: bytes = b"", kind: int = KIND_REQUEST) -> bytes:
    return bytes([domain, command, kind]) + struct.pack("<H", len(args)) + args


def parse_frames(buf: bytearray) -> list[tuple[int, int, int, bytes]]:
    """버퍼에서 완성된 프레임을 꺼내 (domain, command, kind, args) 목록으로. 소비한 바이트는 제거."""
    out = []
    while True:
        start = buf.find(b"\xa5")
        if start < 0:
            buf.clear()
            break
        del buf[:start]
        if len(buf) < 4:
            break
        n = struct.unpack_from("<H", buf, 2)[0]
        total = 4 + n + 5
        if len(buf) < total:
            break
        payload = bytes(buf[4:4 + n])
        ok = buf[total - 1] == 0x5A and struct.unpack_from("<I", buf, 4 + n)[0] == _crc(payload)
        if not ok or n < 5:
            del buf[:1]
            continue
        del buf[:total]
        out.append((payload[0], payload[1], payload[2], payload[5:]))
    return out


# ── 프린터 ───────────────────────────────────
class Paperang:
    def __init__(self, device: str = "/dev/usb/lp0", width: int = 576, timeout: float = 3.0):
        self.device = device
        self.width_bytes = width // 8
        self.timeout = timeout
        self.fd: int | None = None
        self._rx = bytearray()
        self.max_frame = DEFAULT_MAX_FRAME

    def connect(self) -> None:
        self.fd = os.open(self.device, os.O_RDWR)
        self._rx.clear()
        self._read(0.3)  # 연결 시 밀려 있던 알림 비우기
        self.max_frame = self._query_max_frame()

    def _query_max_frame(self) -> int:
        """프린터가 받는 최대 프레임 길이 (TLV 01, u16 LE). 실패 시 보수적인 기본값."""
        args = self._query(build_payload(DOMAIN_SYSTEM, SYS_MAX_LEN), required=False)
        if args and len(args) >= 5 and args[0] == 0x01:
            value = struct.unpack_from("<H", args, 3)[0]
            if value > PRINT_DATA_OVERHEAD:
                return min(value, MAX_FRAME_CAP)
        return DEFAULT_MAX_FRAME

    def close(self) -> None:
        if self.fd is not None:
            os.close(self.fd)
            self.fd = None

    def __enter__(self) -> "Paperang":
        self.connect()
        return self

    def __exit__(self, *exc) -> None:
        self.close()

    # ── 저수준 ────────────────────────────────
    def _write(self, data: bytes) -> None:
        assert self.fd is not None
        view = memoryview(data)
        while view:
            view = view[os.write(self.fd, view):]

    def _read(self, wait: float) -> list[tuple[int, int, int, bytes]]:
        assert self.fd is not None
        end = time.monotonic() + wait
        while True:
            left = end - time.monotonic()
            r, _, _ = select.select([self.fd], [], [], max(0.0, min(left, 0.1)))
            if r:
                chunk = os.read(self.fd, 1024)
                if chunk:
                    self._rx += chunk
                    frames = parse_frames(self._rx)
                    if frames:
                        return frames
            if left <= 0:
                break
        return parse_frames(self._rx)

    def _query(self, payload: bytes, required: bool = True) -> bytes | None:
        """요청 전송 후 같은 domain/command 응답 대기 → args 반환."""
        domain, command = payload[0], payload[1]
        self._write(pack_frame(payload))
        end = time.monotonic() + self.timeout
        while time.monotonic() < end:
            for d, c, _kind, args in self._read(end - time.monotonic()):
                if (d, c) == (domain, command):
                    return args
                log.debug("ignored frame %02x/%02x %s", d, c, args.hex())
        if required:
            raise PrinterError(f"프린터 응답 없음 ({domain:02x}/{command:02x})")
        return None

    # ── 명령 ──────────────────────────────────
    def status(self) -> bytes:
        # 참고 구현의 바이트 그대로 (argsLen 0 뒤에 0x00 한 바이트)
        return self._query(bytes([DOMAIN_THERMAL, CMD_STATUS, KIND_REQUEST, 0x00, 0x00, 0x00]))  # type: ignore[return-value]

    def set_density(self, density: int) -> None:
        d = max(0, min(100, density))
        self._query(bytes([DOMAIN_THERMAL, CMD_SET_DENSITY, 0x03, 0x02, 0x00, d, 0x00]), required=False)

    def print_rows(self, rows: bytes, density: int = 75, feed_after: int = 200) -> None:
        wb = self.width_bytes
        if len(rows) % wb:
            raise ValueError("raster must contain whole rows")
        data = rows + bytes(feed_after * wb)  # 이송은 빈 줄로
        self.status()
        self.set_density(density)
        self._query(build_payload(DOMAIN_THERMAL, CMD_START))

        chunk = max(1, (self.max_frame - PRINT_DATA_OVERHEAD) // wb) * wb
        num = 1
        for off in range(0, len(data), chunk):
            part = data[off:off + chunk]
            final = off + len(part) >= len(data)
            args = (struct.pack("<HH", num & 0xFFFF, len(part) + 8) + bytes([0x01, wb, 0, 0, 0, 0])
                    + struct.pack("<H", len(part)) + part)
            self._write(pack_frame(build_payload(DOMAIN_THERMAL, CMD_DATA, args, KIND_FINAL if final else KIND_REQUEST)))
            num += 1
            if num % 8 == 0:
                self._read(0)  # 청크별 ACK 가 쌓여 막히지 않도록 수시로 비움

        self._query(bytes([DOMAIN_THERMAL, CMD_FINISH, 0x01, 0x02, 0x00, 0x00, 0x00]), required=False)
