import random
from datetime import date
from data.fortune_table import FORTUNE_TABLE
from data.flower_table import FLOWER_TABLE, SUBTITLE_BY_TYPE

ZODIAC_META = [
    {"id": "aries",       "name": "양자리",     "dateRange": "3.21–4.19"},
    {"id": "taurus",      "name": "황소자리",   "dateRange": "4.20–5.20"},
    {"id": "gemini",      "name": "쌍둥이자리", "dateRange": "5.21–6.21"},
    {"id": "cancer",      "name": "게자리",     "dateRange": "6.22–7.22"},
    {"id": "leo",         "name": "사자자리",   "dateRange": "7.23–8.22"},
    {"id": "virgo",       "name": "처녀자리",   "dateRange": "8.23–9.22"},
    {"id": "libra",       "name": "천칭자리",   "dateRange": "9.23–10.22"},
    {"id": "scorpio",     "name": "전갈자리",   "dateRange": "10.23–11.21"},
    {"id": "sagittarius", "name": "사수자리",   "dateRange": "11.22–12.21"},
    {"id": "capricorn",   "name": "염소자리",   "dateRange": "12.22–1.19"},
    {"id": "aquarius",    "name": "물병자리",   "dateRange": "1.20–2.18"},
    {"id": "pisces",      "name": "물고기자리", "dateRange": "2.19–3.20"},
]


def _day_seed() -> int:
    """오늘 날짜 기반 시드 — 같은 날 같은 결과 보장"""
    today = date.today()
    return today.year * 10000 + today.month * 100 + today.day


def get_zodiacs() -> list[dict]:
    """12개 별자리 메타 + 오늘의 순위 반환"""
    rng = random.Random(_day_seed())
    shuffled = ZODIAC_META.copy()
    rng.shuffle(shuffled)
    return [
        {**meta, "rank": rank + 1, "iconUrl": f"/assets/zodiacs/{meta['id']}.png"}
        for rank, meta in enumerate(shuffled)
    ]


def get_fortune(zodiac: str) -> dict:
    """별자리 → 오늘의 운세 엔트리 반환 (날짜 기반 로테이션)"""
    entries = FORTUNE_TABLE.get(zodiac)
    if not entries:
        raise ValueError(f"Unknown zodiac: {zodiac}")

    idx = _day_seed() % len(entries)
    entry = entries[idx]
    today = date.today()

    return {
        "zodiac": zodiac,
        "date": f"{today.year}. {today.month:02d}. {today.day:02d}",
        "summary": entry["summary"],
        "scores": {
            "relationship": entry["scores"]["relationship"],
            "money":        entry["scores"]["money"],
            "work":         entry["scores"]["work"],
        },
    }


def get_lucky(zodiac: str) -> dict:
    """별자리 → 오늘의 행운 요소 반환 (날짜 기반 로테이션)"""
    entries = FORTUNE_TABLE.get(zodiac)
    if not entries:
        raise ValueError(f"Unknown zodiac: {zodiac}")

    idx = _day_seed() % len(entries)
    entry = entries[idx]

    return {
        "place":  entry["lucky_place"],
        "action": entry["lucky_action"],
        "color":  entry["lucky_color"],
    }


def get_flower(zodiac: str, scores: dict) -> dict:
    """별자리 + 운세 수치 → 꽃 추천 반환
    main  : 가장 낮은 운 타입 → 보완해주는 꽃
    subs  : 나머지 2개 운 타입 꽃 (작게 표시용)
    """
    zodiac_flowers = FLOWER_TABLE.get(zodiac)
    if not zodiac_flowers:
        raise ValueError(f"Unknown zodiac: {zodiac}")

    sorted_types = sorted(scores, key=lambda k: scores[k])  # 낮은 순
    lowest_type  = sorted_types[0]
    sub_types    = sorted_types[1:]

    def build_entry(fortune_type: str) -> dict:
        f = zodiac_flowers[fortune_type]
        return {
            "name":        f["name"],
            "fortuneType": fortune_type,
            "subtitle":    SUBTITLE_BY_TYPE.get(fortune_type, "오늘의 꽃"),
            "description": f["description"],
            "meanings":    f["meanings"],
            "luckItems":   f["luck_items"],
            "places":      f["places"],
            "imageUrl":    f"/assets/flowers/{zodiac}_{fortune_type}.jpg",
        }

    return {
        "main": build_entry(lowest_type),
        "subs": [build_entry(t) for t in sub_types],
    }
