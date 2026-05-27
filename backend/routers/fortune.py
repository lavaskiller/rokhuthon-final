# ─────────────────────────────────────────────
# routers/fortune.py — 운세 관련 엔드포인트
# ─────────────────────────────────────────────

# POST /api/fortune
#   요청: { zodiac: str }
#   응답: FortuneResult
#     { zodiac, date, summary: str, scores: { relationship, money, work } }
#   처리: fortune_service.generate_fortune(zodiac) 호출

# POST /api/lucky
#   요청: { zodiac: str }
#   응답: LuckyElements
#     { place: str, action: str, color: str }
#   처리: fortune_service.generate_lucky(zodiac) 호출

# GET /api/zodiacs
#   응답: ZodiacMeta[]
#     [{ id, name, dateRange, rank, iconUrl }]
#   처리: 오늘 날짜 시드로 12개 별자리 순위 랜덤 생성 후 반환
#         (같은 날 같은 결과 보장 위해 date 기반 seed 사용)

# TODO: 라우터 구현
# from fastapi import APIRouter
# from services.fortune_service import generate_fortune, generate_lucky, get_zodiacs
# router = APIRouter()
