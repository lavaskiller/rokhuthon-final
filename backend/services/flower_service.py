# ─────────────────────────────────────────────
# services/flower_service.py — 꽃 추천 로직
# ─────────────────────────────────────────────

# recommend_flower(zodiac: str, scores: dict) -> FlowerResult
#   선정 로직:
#     1. scores에서 가장 높은 운세 타입 파악 (relationship/money/work)
#     2. prompts/flower.txt 로드
#     3. Claude API 호출:
#        "오늘 {zodiac_name}에게 어울리는 꽃을 추천해줘.
#         오늘의 가장 강한 운세는 {type}운({score}점)이야.
#         다음 JSON 형식으로 응답해줘: { name, subtitle, description,
#         meanings: [3개], luckItems: [3개], places: [3개] }"
#     4. imageUrl: 꽃 이름으로 assets 폴더 매핑
#        (프리지아 → freesia.jpg 등, 없으면 None)

# TODO: 서비스 구현
# import anthropic
# import json
# client = anthropic.Anthropic()
