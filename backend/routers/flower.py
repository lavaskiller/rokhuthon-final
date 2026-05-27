# ─────────────────────────────────────────────
# routers/flower.py — 꽃 추천 엔드포인트
# ─────────────────────────────────────────────

# POST /api/flower
#   요청: { zodiac: str, scores: { relationship: int, money: int, work: int } }
#   응답: FlowerResult
#     { name, subtitle, description, meanings: list[str],
#       luckItems: list[str], places: list[str], imageUrl: str | None }
#   처리:
#     1. flower_service.recommend_flower(zodiac, scores) 호출
#        — scores 중 가장 높은 운세 타입에 맞는 꽃 선정
#        — Claude API로 꽃말/행운/장소 텍스트 생성
#     2. imageUrl: public/assets/flowers/{flower_name}.jpg 경로 반환
#        (이미지 없으면 None, 프론트에서 플레이스홀더 표시)

# TODO: 라우터 구현
# from fastapi import APIRouter
# from services.flower_service import recommend_flower
# router = APIRouter()
