# Paperang P2 출력 에이전트 (라즈베리파이)

키오스크(아이패드 웹앱)에서 "출력하기" → 카드(`#print-card`)를 576px PNG 로 렌더 → 백엔드 중계 → 라즈베리파이 에이전트가 가져가 USB 로 Paperang P2 출력.

```
[아이패드 웹앱 starflowernori.com] --POST /api/print (PNG, X-Kiosk-Key)--> [백엔드 api.starflowernori.com]
                                                                              ▲ 롱폴링 GET /api/print/next (Bearer)
                                                        [라즈베리파이 agent.py] ┘ --USB /dev/usb/lp0--> [Paperang P2]
```

- HTTPS 사이트에서 매장 LAN 의 HTTP 에이전트를 직접 부르면 Safari 가 혼합 콘텐츠로 차단하므로 백엔드를 거칩니다.
  파이는 바깥으로 요청만 하므로 공유기 포트포워딩·인증서가 필요 없습니다.
- 키오스크 키가 없는 일반 방문자 브라우저는 기존처럼 `window.print()` 로 동작합니다.
- 파이가 90초 안에 가져가지 않은 작업은 폐기됩니다 (늦게 켜진 파이가 지난 카드를 몰아서 출력하지 않도록).

## 프로토콜

P2(USB `4348:5584`, 펌웨어 01.03.11)는 구형 `0x02` 프레임에 응답만 하고 인쇄는 하지 않습니다. **A5 프로토콜**로만 출력됩니다.

```
A5 | 01 | len(2,LE) | payload | crc32(payload, seed 0x35769521)(4,LE) | 5A
payload = domain | command | kind | argsLen(2,LE) | args
출력: 05/0F 상태 → 05/11 농도 → 05/19 시작 → 05/1B 데이터(13줄씩, 마지막 kind=03) → 05/22 종료
```

최대 프레임 길이는 연결 시 `01/14` 로 조회합니다(P2 = 1024B). 참고: [xtawa/paperang_research](https://github.com/xtawa/paperang_research)

## 1. 에이전트 설치

```bash
sudo usermod -aG lp $USER          # /dev/usb/lp0 쓰기 권한 (재로그인 필요)
cd ~/rokhuthon_final/printer
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env               # RELAY_TOKEN 입력
```

토큰 만들기:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 2. 부팅 시 자동 실행

```bash
sudo cp paperang-agent.service /etc/systemd/system/   # User/경로가 다르면 수정
sudo systemctl enable --now paperang-agent
journalctl -u paperang-agent -f
```

## 3. 백엔드 환경변수 (호스팅 대시보드)

| 변수 | 값 |
|------|-----|
| `PRINT_AGENT_TOKEN` | 파이 `.env` 의 `RELAY_TOKEN` 과 동일 |
| `PRINT_KIOSK_KEY` | 키오스크 전용 키 (아래 아이패드 URL 에 사용) |

둘 중 하나라도 비어 있으면 출력 API 는 503 으로 꺼져 있습니다. 작업 큐가 프로세스 메모리에 있으므로 백엔드는 인스턴스 1개로 운영해야 합니다.

## 4. 아이패드 웹앱

Safari 로 아래 주소를 연 뒤 **공유 → 홈 화면에 추가**. 키는 그 웹앱 저장소에 기억됩니다.
(홈 화면 웹앱은 Safari 와 저장소가 분리되어 있으므로 반드시 키가 붙은 주소에서 추가하세요.)

```
https://starflowernori.com/?printKey=<PRINT_KIOSK_KEY>
```

키 해제: `?printKey=` (빈 값)

## 테스트

```bash
curl http://127.0.0.1:8765/health
curl -X POST --data-binary @card.png -H 'Content-Type: image/png' http://127.0.0.1:8765/print   # 파이에서 직접 출력
```

- `PAPERANG_DRY_RUN=1`: 프린터 대신 `out/` 에 변환 결과와 원본 PNG 저장
- 개발 PC 브라우저에서 직접 호출: `http://localhost:5173/...?printAgent=http://localhost:8765`

## 튜닝 (`.env`)

| 변수 | 기본 | 설명 |
|------|------|------|
| `PAPERANG_DENSITY` | 75 | 인쇄 농도(0~100). 흐리면 올리기 |
| `PAPERANG_FEED_LINES` | 120 | 출력 후 용지 이송(빈 줄 수, 12줄 ≈ 1mm) |
| `PAPERANG_MAX_GAP` | 28 | 카드 속 빈 구간을 이 줄 수까지 줄여 용지 절약 (0 = 원본 그대로) |

이미지 변환: 글자·선은 임계값으로 또렷하게, 사진 영역(중간톤이 넓게 퍼진 곳)만 디더링합니다.
