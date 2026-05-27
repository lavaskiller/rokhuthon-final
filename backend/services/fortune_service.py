# ─────────────────────────────────────────────
# services/fortune_service.py — 운세 생성 로직
# ─────────────────────────────────────────────

# generate_fortune(zodiac: str) -> FortuneResult
#   - prompts/fortune.txt 로드
#   - Claude API 호출: claude-sonnet-4-6 모델
#   - 프롬프트: "오늘({date}) {zodiac_name}의 운세를 JSON으로 작성해줘"
#     응답 스키마: { summary: str, relationship: int, money: int, work: int }
#   - JSON 파싱 후 FortuneResult 반환

# generate_lucky(zodiac: str) -> LuckyElements
#   - prompts/fortune.txt 내 lucky 섹션 프롬프트 사용
#   - Claude API 호출
#   - 응답 스키마: { place: str, action: str, color: str }

# get_zodiacs(date: str) -> list[ZodiacMeta]
#   - date 문자열을 seed로 random.shuffle
#   - ZODIAC_LIST에 rank 1~12 할당 후 반환

# TODO: 서비스 구현
# import anthropic
# import json
# from pathlib import Path
# client = anthropic.Anthropic()  # ANTHROPIC_API_KEY 환경변수 자동 인식
