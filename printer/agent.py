"""
라즈베리파이 출력 에이전트 — 카드 PNG 를 받아 Paperang P2 로 USB 출력.

작업을 받는 경로 두 가지:
1. 중계(기본 운영): RELAY_URL/RELAY_TOKEN 이 있으면 백엔드(/api/print/next)를 롱폴링해 작업을 가져옴
   — 키오스크(아이패드)는 HTTPS 사이트라 LAN 의 HTTP 에이전트를 직접 부를 수 없어서 백엔드를 거침
2. 직접: POST /print (image/png) — 같은 기기 브라우저·개발용 (?printAgent=http://localhost:8765)

    GET /health → 상태 확인

실행:  uvicorn agent:app --host 127.0.0.1 --port 8765
환경변수는 .env.example 참고. PAPERANG_DRY_RUN=1 이면 프린터 대신 out/ 에 미리보기 PNG 저장.
"""

from __future__ import annotations

import asyncio
import io
import json
import logging
import os
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from paperang import Paperang, compact_rows, image_to_rows

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("paperang-agent")

USB_DEVICE = os.getenv("PAPERANG_USB_DEVICE", "/dev/usb/lp0")
WIDTH = 576  # P2: 72바이트/줄
DENSITY = int(os.getenv("PAPERANG_DENSITY", "75"))
FEED_LINES = int(os.getenv("PAPERANG_FEED_LINES", "120"))
MAX_GAP = int(os.getenv("PAPERANG_MAX_GAP", "28"))  # 빈 줄 구간 최대 길이 (0 = 줄이지 않음)
RETRIES = int(os.getenv("PAPERANG_RETRIES", "2"))
DRY_RUN = os.getenv("PAPERANG_DRY_RUN", "0") == "1"
KEEPALIVE_SEC = int(os.getenv("PAPERANG_KEEPALIVE_SEC", "60"))  # 0 = 끄기
RELAY_URL = os.getenv("RELAY_URL", "").rstrip("/")
RELAY_TOKEN = os.getenv("RELAY_TOKEN", "")
OUT_DIR = Path(__file__).parent / "out"
MAX_BYTES = 10 * 1024 * 1024

app = FastAPI(title="Paperang print agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def private_network_access(request: Request, call_next):
    # 공개 HTTPS 사이트 → localhost 요청 시 Chrome Private Network Access 프리플라이트 허용
    response = await call_next(request)
    if request.headers.get("access-control-request-private-network") == "true":
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response


# 직접 요청과 중계 작업이 동시에 와도 한 장씩 — 둘 다 스레드에서 돌므로 threading.Lock
_print_lock = threading.Lock()


class NotReady(Exception):
    """프린터를 쓸 수 없는 상태 (사용자에게 보여줄 메시지)."""


def _configured() -> bool:
    return DRY_RUN or os.path.exists(USB_DEVICE)


def _print_blocking(rows: bytes) -> None:
    # 연결·상태 확인까지만 재시도 — 데이터 전송 중 실패를 재시도하면 반쪽 출력이 두 번 나옴
    last: Exception | None = None
    for attempt in range(1, RETRIES + 2):
        p = Paperang(USB_DEVICE, WIDTH)
        try:
            p.connect()
            p.status()
        except OSError as e:  # 절전 복귀·케이블 재연결 직후
            p.close()
            last = e
            log.warning("printer not ready (attempt %d): %s", attempt, e)
            time.sleep(1.5)
            continue
        started = time.monotonic()
        try:
            p.print_rows(rows, DENSITY, FEED_LINES)
        finally:
            p.close()
        log.info("printed %d lines in %.1fs (frame %dB)", len(rows) // (WIDTH // 8), time.monotonic() - started, p.max_frame)
        return
    raise last  # type: ignore[misc]


def _dry_run(rows: bytes, original: bytes) -> str:
    OUT_DIR.mkdir(exist_ok=True)
    height = len(rows) // (WIDTH // 8)
    preview = Image.frombytes("1", (WIDTH, height), bytes(b ^ 0xFF for b in rows))
    path = OUT_DIR / f"print-{time.strftime('%Y%m%d-%H%M%S')}.png"
    preview.save(path)
    path.with_name(path.stem + "-input.png").write_bytes(original)  # 변환 전 원본 (튜닝용)
    return str(path)


def handle_png(png: bytes) -> str | None:
    """PNG → 변환 → 출력 (dry-run 이면 미리보기 경로 반환). 실패 시 NotReady/ValueError."""
    try:
        img = Image.open(io.BytesIO(png))
        img.load()
    except UnidentifiedImageError:
        raise ValueError("PNG/JPEG 이미지만 지원합니다")
    rows = compact_rows(image_to_rows(img, WIDTH), WIDTH // 8, MAX_GAP)
    if DRY_RUN:
        return _dry_run(rows, png)
    if not _configured():
        raise NotReady("프린터가 연결되어 있지 않아요 — 전원과 케이블을 확인해 주세요")
    with _print_lock:
        try:
            _print_blocking(rows)
        except OSError as e:
            log.error("print failed: %s", e)
            raise NotReady("프린터 전원과 연결을 확인해 주세요")
    return None


# ── 직접 요청 ────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "dryRun": DRY_RUN, "ready": _configured(), "width": WIDTH, "relay": bool(RELAY_URL and RELAY_TOKEN)}


@app.post("/print")
async def print_image(request: Request):
    body = await request.body()
    if not body or len(body) > MAX_BYTES:
        raise HTTPException(400, "빈 요청이거나 이미지가 너무 큽니다")
    try:
        preview = await asyncio.to_thread(handle_png, body)
    except ValueError as e:
        raise HTTPException(415, str(e))
    except NotReady as e:
        raise HTTPException(503, str(e))
    return {"status": "ok", "dryRun": DRY_RUN, "preview": preview} if DRY_RUN else {"status": "ok"}


# ── 중계 폴링 ────────────────────────────────
def _relay_request(path: str, data: bytes | None = None, timeout: float = 35) -> urllib.request.addinfourl:
    req = urllib.request.Request(
        f"{RELAY_URL}{path}",
        data=data,
        headers={"Authorization": f"Bearer {RELAY_TOKEN}", **({"Content-Type": "application/json"} if data else {})},
        method="POST" if data is not None else "GET",
    )
    return urllib.request.urlopen(req, timeout=timeout)


def _relay_loop() -> None:
    log.info("relay polling %s", RELAY_URL)
    while True:
        # 프린터가 빠져 있으면 폴링을 멈춰 백엔드가 곧바로 '프린터 연결 안 됨' 을 알리게 함
        if not _configured():
            time.sleep(3)
            continue
        try:
            with _relay_request("/api/print/next?wait=20") as res:
                if res.status == 204:
                    continue
                job_id = res.headers.get("X-Job-Id", "")
                png = res.read()
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            log.warning("relay poll failed: %s", e)
            time.sleep(5)
            continue

        log.info("relay job %s (%d bytes)", job_id, len(png))
        try:
            handle_png(png)
            result = {"ok": True}
        except (NotReady, ValueError) as e:
            result = {"ok": False, "error": str(e)}
        try:
            _relay_request(f"/api/print/{job_id}/done", json.dumps(result).encode(), timeout=10).close()
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            log.warning("relay done report failed: %s", e)


# ── 절전 방지 ────────────────────────────────
def _keepalive_loop() -> None:
    """P2 는 약 10분 유휴 시 스스로 꺼짐(USB 에서도 사라짐) — 주기적으로 상태를 물어 깨어 있게 함."""
    while True:
        time.sleep(KEEPALIVE_SEC)
        if DRY_RUN or not os.path.exists(USB_DEVICE) or not _print_lock.acquire(blocking=False):
            continue
        try:
            with Paperang(USB_DEVICE, WIDTH) as p:
                p.status()
        except OSError as e:
            log.warning("keepalive failed: %s", e)
        finally:
            _print_lock.release()


@app.on_event("startup")
def _start_background() -> None:
    if RELAY_URL and RELAY_TOKEN:
        threading.Thread(target=_relay_loop, name="relay", daemon=True).start()
    if KEEPALIVE_SEC > 0:
        threading.Thread(target=_keepalive_loop, name="keepalive", daemon=True).start()
