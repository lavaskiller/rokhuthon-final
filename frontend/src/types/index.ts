// ─────────────────────────────────────────────
// 도메인 타입 정의
// ─────────────────────────────────────────────

// 별자리 식별자 (12종)
// 영문 소문자로 통일 — API 키 및 라우트 파라미터로 사용
export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

// 별자리 메타데이터 (ZodiacSelect 화면에서 렌더링)
// 아이콘: iconUrl 이 로드되면 그 PNG, 실패하면 Figma placeholder(ZodiacIconPlaceholder) 표시
export interface ZodiacMeta {
  id: ZodiacSign;
  name: string;       // 한글 이름 ex. "물고기 자리"
  dateRange: string;  // ex. "2.19–3.20"
  rank: number;       // 오늘의 별자리 순위 1~12 (서버에서 결정)
  iconUrl: string;    // 원형 아이콘 이미지 경로 (미배치 시 placeholder 폴백)
}

// 운세 수치 (0~100)
export interface FortuneScores {
  relationship: number; // 관계 운 — #aff3ff
  money: number;        // 금전 운 — #afceff
  work: number;         // 업무 운 — #bfafff
}

// 운세 결과 (POST /api/fortune 응답)
export interface FortuneResult {
  zodiac: ZodiacSign;
  date: string;         // "YYYY. MM. DD"
  summary: string;      // 총운 텍스트 (2줄 이내)
  scores: FortuneScores;
}

// 행운 요소 (POST /api/lucky 응답)
export interface LuckyElements {
  place: string;   // ex. "조용한 카페 - 창가 자리"
  action: string;  // ex. "산책하기 - 차분한 음악 듣기"
  color: string;   // ex. "라벤더 퍼플"
}

// 꽃 단일 항목
export interface FlowerItem {
  name: string;           // ex. "아네모네"
  fortuneType: FortuneType; // 어떤 운을 보완하는 꽃인지
  subtitle: string;       // ex. "관계운을 담은 꽃"
  description: string;    // 꽃 소개 2줄
  meanings: string[];     // 꽃말 3가지
  luckItems: string[];    // 기대되는 행운 3가지
  places: string[];       // 함께 두면 좋은 장소 3가지
  imageUrl?: string;
}

// 꽃 추천 결과 (POST /api/flower 응답)
// main: 가장 낮은 운 → 보완 꽃 (크게 표시)
// subs: 나머지 2개 운 → 서브 꽃 (작게 표시, UX 디자인 예정)
export interface FlowerResult {
  main: FlowerItem;
  subs: [FlowerItem, FlowerItem];
}

// 꽃 개화 상태 (FlowerBloom 컴포넌트 prop)
export type BloomState = 25 | 50 | 75 | 100;

// 운세 타입 레이블 (FortuneCircle / FortuneBadge)
export type FortuneType = 'relationship' | 'money' | 'work';
