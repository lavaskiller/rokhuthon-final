# ─────────────────────────────────────────────
# fortune_table.py — 별자리별 운세 + 행운 요소 가상 테이블
#
# 구조:
#   FORTUNE_TABLE[zodiac_id] = List[FortuneEntry]
#   날짜 기반 인덱스 선택: day_of_year % len(entries)
#
# 각 entry:
#   summary       : 총운 텍스트 (2문장 이내)
#   scores        : 관계/금전/업무 운 (0~100)
#   lucky_place   : 행운 장소
#   lucky_action  : 행운 행동
#   lucky_color   : 행운 색상
# ─────────────────────────────────────────────

FORTUNE_TABLE: dict = {
    "aries": [
        {
            "summary": "오늘의 별빛은 당신의 용기 있는 발걸음을 응원합니다. 망설이던 일을 시작하기에 더없이 좋은 하루입니다.",
            "scores": {"relationship": 80, "money": 65, "work": 90},
            "lucky_place": "탁 트인 공원 - 언덕 위",
            "lucky_action": "새로운 프로젝트 시작하기",
            "lucky_color": "선명한 빨강",
        },
        {
            "summary": "주변 사람들과의 연결이 오늘 당신에게 따뜻한 에너지를 줍니다. 먼저 손을 내밀어 보세요.",
            "scores": {"relationship": 90, "money": 55, "work": 70},
            "lucky_place": "활기찬 카페 - 창가 자리",
            "lucky_action": "오래된 친구에게 연락하기",
            "lucky_color": "산호 오렌지",
        },
        {
            "summary": "재정적인 흐름이 서서히 좋아지는 기운이 감지됩니다. 작은 절약이 큰 변화의 씨앗이 됩니다.",
            "scores": {"relationship": 60, "money": 85, "work": 75},
            "lucky_place": "조용한 서점 - 구석 자리",
            "lucky_action": "가계부 정리하기",
            "lucky_color": "황금빛 노랑",
        },
    ],
    "taurus": [
        {
            "summary": "안정된 땅 위에서 당신의 꽃이 피어납니다. 오늘은 내면의 아름다움을 바깥으로 표현해 보세요.",
            "scores": {"relationship": 75, "money": 85, "work": 65},
            "lucky_place": "향기로운 꽃집 근처",
            "lucky_action": "좋아하는 음식 직접 만들기",
            "lucky_color": "연한 민트 그린",
        },
        {
            "summary": "오늘은 성실한 노력이 빛을 발하는 날입니다. 꾸준히 쌓아온 것들이 결실을 맺기 시작합니다.",
            "scores": {"relationship": 65, "money": 75, "work": 90},
            "lucky_place": "익숙한 동네 산책로",
            "lucky_action": "미완성 작업 마무리하기",
            "lucky_color": "짙은 에메랄드",
        },
        {
            "summary": "소중한 인연이 오늘 더 깊어질 기운입니다. 진심 어린 대화가 관계의 뿌리를 단단하게 합니다.",
            "scores": {"relationship": 90, "money": 60, "work": 70},
            "lucky_place": "조용한 공원 벤치",
            "lucky_action": "솔직한 감정 전하기",
            "lucky_color": "로즈 핑크",
        },
    ],
    "gemini": [
        {
            "summary": "오늘 당신의 언어는 특별한 힘을 가집니다. 아이디어를 망설임 없이 세상에 내놓으세요.",
            "scores": {"relationship": 70, "money": 75, "work": 85},
            "lucky_place": "활기찬 도서관 - 열람실",
            "lucky_action": "새로운 취미 탐색하기",
            "lucky_color": "하늘빛 블루",
        },
        {
            "summary": "이중적인 매력이 오늘 빛을 발합니다. 다양한 관점에서 상황을 바라보면 뜻밖의 해답이 보입니다.",
            "scores": {"relationship": 85, "money": 60, "work": 80},
            "lucky_place": "북적이는 시장 골목",
            "lucky_action": "새로운 사람과 대화 나누기",
            "lucky_color": "라임 옐로우",
        },
        {
            "summary": "오늘은 머릿속을 맴도는 아이디어를 글로 정리해 보세요. 생각이 구체화될수록 금전 운이 따릅니다.",
            "scores": {"relationship": 60, "money": 90, "work": 70},
            "lucky_place": "조용한 카페 - 혼자 앉는 자리",
            "lucky_action": "아이디어 노트에 기록하기",
            "lucky_color": "밝은 보라",
        },
    ],
    "cancer": [
        {
            "summary": "달의 품처럼 따뜻한 기운이 당신을 감싸는 하루입니다. 사랑하는 사람들과 시간을 나누세요.",
            "scores": {"relationship": 90, "money": 60, "work": 70},
            "lucky_place": "집 근처 단골 카페",
            "lucky_action": "소중한 사람에게 요리 해주기",
            "lucky_color": "진주빛 흰색",
        },
        {
            "summary": "직감이 유독 예리한 날입니다. 마음이 이끄는 방향으로 용기 있게 한 걸음 내딛어 보세요.",
            "scores": {"relationship": 70, "money": 80, "work": 75},
            "lucky_place": "수변 공원 - 물가 벤치",
            "lucky_action": "일기 쓰며 감정 정리하기",
            "lucky_color": "은은한 실버",
        },
        {
            "summary": "업무에서 세심한 배려가 좋은 평가를 가져옵니다. 작은 디테일에 집중하면 큰 성과가 따릅니다.",
            "scores": {"relationship": 65, "money": 70, "work": 90},
            "lucky_place": "조용한 사무실 - 창가 자리",
            "lucky_action": "꼼꼼하게 계획표 작성하기",
            "lucky_color": "연한 파랑",
        },
    ],
    "leo": [
        {
            "summary": "오늘의 태양은 당신을 위해 빛납니다. 자신감 있게 나서면 주변이 자연스럽게 따라옵니다.",
            "scores": {"relationship": 80, "money": 70, "work": 90},
            "lucky_place": "무대 혹은 발표 공간",
            "lucky_action": "당당하게 의견 발표하기",
            "lucky_color": "금빛 오렌지",
        },
        {
            "summary": "당신의 넉넉한 마음이 오늘 특별한 인연을 끌어당깁니다. 베풀수록 더 많이 돌아오는 날입니다.",
            "scores": {"relationship": 95, "money": 65, "work": 70},
            "lucky_place": "사람이 많은 광장",
            "lucky_action": "주변 사람 칭찬해 주기",
            "lucky_color": "로열 골드",
        },
        {
            "summary": "창의적인 에너지가 넘치는 하루입니다. 예술적 감각을 발휘하면 뜻밖의 수입이 생길 수 있습니다.",
            "scores": {"relationship": 65, "money": 85, "work": 80},
            "lucky_place": "갤러리 혹은 전시 공간",
            "lucky_action": "창작 활동에 시간 투자하기",
            "lucky_color": "선명한 버밀리온",
        },
    ],
    "virgo": [
        {
            "summary": "세심한 관찰력이 오늘 빛을 발합니다. 놓쳤던 작은 기회가 눈앞에 있습니다.",
            "scores": {"relationship": 65, "money": 80, "work": 90},
            "lucky_place": "정갈한 서점 - 실용서 코너",
            "lucky_action": "체계적으로 할 일 목록 정리하기",
            "lucky_color": "내추럴 베이지",
        },
        {
            "summary": "오늘은 건강과 루틴에 집중하면 좋은 날입니다. 몸과 마음의 균형이 모든 운을 끌어올립니다.",
            "scores": {"relationship": 70, "money": 75, "work": 85},
            "lucky_place": "가까운 헬스장 혹은 요가 스튜디오",
            "lucky_action": "가벼운 스트레칭 혹은 산책",
            "lucky_color": "세이지 그린",
        },
        {
            "summary": "진심 어린 배려가 관계를 한층 깊게 만드는 날입니다. 상대방의 말을 끝까지 들어주세요.",
            "scores": {"relationship": 90, "money": 60, "work": 70},
            "lucky_place": "조용한 찻집",
            "lucky_action": "상대방 이야기 경청하기",
            "lucky_color": "연한 라일락",
        },
    ],
    "libra": [
        {
            "summary": "아름다운 균형 속에서 오늘의 행운이 피어납니다. 결정을 미루기보다 직관을 믿어 보세요.",
            "scores": {"relationship": 85, "money": 75, "work": 70},
            "lucky_place": "세련된 카페 - 창가 자리",
            "lucky_action": "마음에 담아둔 결정 내리기",
            "lucky_color": "파스텔 핑크",
        },
        {
            "summary": "오늘은 파트너십에서 행운이 찾아옵니다. 혼자보다 함께할 때 더 큰 성과를 거둘 수 있습니다.",
            "scores": {"relationship": 90, "money": 70, "work": 80},
            "lucky_place": "공동 작업 공간 (코워킹)",
            "lucky_action": "협업 프로젝트 제안하기",
            "lucky_color": "소프트 퍼플",
        },
        {
            "summary": "재정 감각이 예리해지는 하루입니다. 아름다움과 실용성을 동시에 잡는 소비가 행운을 부릅니다.",
            "scores": {"relationship": 65, "money": 90, "work": 75},
            "lucky_place": "아늑한 편집샵",
            "lucky_action": "현명한 소비 계획 세우기",
            "lucky_color": "아이보리 화이트",
        },
    ],
    "scorpio": [
        {
            "summary": "깊은 통찰력이 오늘 당신만의 무기입니다. 표면 너머의 진실을 꿰뚫는 감각을 믿으세요.",
            "scores": {"relationship": 75, "money": 80, "work": 90},
            "lucky_place": "고즈넉한 재즈 바 혹은 독립 서점",
            "lucky_action": "복잡한 문제 집중해서 풀기",
            "lucky_color": "딥 버건디",
        },
        {
            "summary": "변화를 두려워하지 마세요. 오늘의 작은 변화가 내일의 큰 도약으로 이어집니다.",
            "scores": {"relationship": 70, "money": 85, "work": 80},
            "lucky_place": "새로 생긴 거리 혹은 낯선 골목",
            "lucky_action": "루틴 하나 과감히 바꿔보기",
            "lucky_color": "미스티 블랙",
        },
        {
            "summary": "신뢰하는 사람과 깊은 대화가 오늘의 관계 운을 크게 높입니다. 진심은 진심으로 통합니다.",
            "scores": {"relationship": 90, "money": 65, "work": 70},
            "lucky_place": "조용한 야외 테라스",
            "lucky_action": "속마음 털어놓기",
            "lucky_color": "다크 플럼",
        },
    ],
    "sagittarius": [
        {
            "summary": "자유로운 바람처럼 오늘의 기회는 예상치 못한 곳에서 찾아옵니다. 열린 마음으로 모험을 즐기세요.",
            "scores": {"relationship": 70, "money": 75, "work": 85},
            "lucky_place": "처음 가보는 동네 혹은 여행지",
            "lucky_action": "즉흥적인 여행 계획 세우기",
            "lucky_color": "터콰이즈 블루",
        },
        {
            "summary": "지식과 철학에 대한 탐구가 오늘 운을 불러옵니다. 배움에 시간을 투자하면 뜻밖의 수확이 있습니다.",
            "scores": {"relationship": 65, "money": 85, "work": 80},
            "lucky_place": "대형 서점 혹은 강연장",
            "lucky_action": "관심 분야 강의 찾아 듣기",
            "lucky_color": "인디고 블루",
        },
        {
            "summary": "유머와 긍정 에너지가 오늘의 인간관계를 빛나게 합니다. 웃음 한 번이 천 냥 빚을 갚습니다.",
            "scores": {"relationship": 90, "money": 65, "work": 70},
            "lucky_place": "활기찬 야외 광장",
            "lucky_action": "웃음이 넘치는 모임 주선하기",
            "lucky_color": "선셋 오렌지",
        },
    ],
    "capricorn": [
        {
            "summary": "산의 정상처럼 오늘 당신의 목표가 선명해집니다. 한 걸음씩 꾸준히 오르는 것이 승리의 비결입니다.",
            "scores": {"relationship": 60, "money": 80, "work": 95},
            "lucky_place": "조용한 사무실 혹은 독서실",
            "lucky_action": "장기 목표 점검 및 수정하기",
            "lucky_color": "차콜 그레이",
        },
        {
            "summary": "재정적 판단력이 날카로워지는 날입니다. 현명한 투자나 절약이 미래의 안정을 만들어냅니다.",
            "scores": {"relationship": 65, "money": 90, "work": 80},
            "lucky_place": "금융가 혹은 서점 경제 코너",
            "lucky_action": "재정 계획 꼼꼼히 검토하기",
            "lucky_color": "딥 네이비",
        },
        {
            "summary": "오늘은 주변의 신뢰가 당신을 한층 성장시킵니다. 책임감 있는 행동이 좋은 평판을 만듭니다.",
            "scores": {"relationship": 80, "money": 70, "work": 85},
            "lucky_place": "공식적인 미팅 장소",
            "lucky_action": "약속 시간보다 10분 먼저 도착하기",
            "lucky_color": "포레스트 그린",
        },
    ],
    "aquarius": [
        {
            "summary": "혁신적인 아이디어가 오늘 특별한 기회를 만들어냅니다. 남다른 시각이 당신만의 강점입니다.",
            "scores": {"relationship": 70, "money": 80, "work": 90},
            "lucky_place": "트렌디한 공유 오피스",
            "lucky_action": "기존 방식을 뒤집는 아이디어 적어보기",
            "lucky_color": "일렉트릭 블루",
        },
        {
            "summary": "공동체와의 연결이 오늘 행운을 끌어당깁니다. 함께하는 가치를 추구할 때 더 빛이 납니다.",
            "scores": {"relationship": 90, "money": 65, "work": 75},
            "lucky_place": "커뮤니티 센터 혹은 소셜 모임",
            "lucky_action": "관심 있는 소모임 참여하기",
            "lucky_color": "아쿠아 민트",
        },
        {
            "summary": "독창적인 방식으로 돈을 버는 아이디어가 떠오릅니다. 색다른 발상을 현실화해 보세요.",
            "scores": {"relationship": 65, "money": 90, "work": 80},
            "lucky_place": "신기한 물건 파는 편집샵",
            "lucky_action": "부업 혹은 새 수입원 탐색하기",
            "lucky_color": "네온 민트",
        },
    ],
    "pisces": [
        {
            "summary": "별의 강을 따라 오늘의 직감이 흐릅니다. 꿈에서 떠오른 영감을 현실에서 펼쳐보세요.",
            "scores": {"relationship": 85, "money": 60, "work": 75},
            "lucky_place": "조용한 카페 - 창가 자리",
            "lucky_action": "산책하기 - 차분한 음악 듣기",
            "lucky_color": "라벤더 퍼플",
        },
        {
            "summary": "오늘은 예술적 감수성이 빛을 발하는 날입니다. 창의적인 작업에 집중하면 금전 운이 열립니다.",
            "scores": {"relationship": 70, "money": 85, "work": 75},
            "lucky_place": "작은 갤러리 혹은 미술관",
            "lucky_action": "그림 그리기 혹은 글쓰기",
            "lucky_color": "오션 블루",
        },
        {
            "summary": "깊은 공감 능력이 오늘 소중한 인연을 더 단단히 묶어줍니다. 먼저 이해하려는 마음이 열쇠입니다.",
            "scores": {"relationship": 95, "money": 60, "work": 65},
            "lucky_place": "수변 카페 혹은 분수 앞 벤치",
            "lucky_action": "소중한 사람에게 손편지 쓰기",
            "lucky_color": "페일 아쿠아",
        },
    ],
}
