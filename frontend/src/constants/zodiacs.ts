// ─────────────────────────────────────────────
// 별자리 정적 데이터
// rank는 런타임에 서버에서 내려받으나, 폴백용 기본값 포함
// ─────────────────────────────────────────────

import type { ZodiacMeta, ZodiacSign } from '../types';

// 별자리 기본 정보 (이름, 날짜범위, 기호)
// iconUrl 은 추후 실제 에셋 경로로 교체 — 없으면 symbol(Unicode 기호) 로 폴백 표시
export const ZODIAC_LIST: Omit<ZodiacMeta, 'rank'>[] = [
  { id: 'aries',       name: '양자리',     dateRange: '3.21–4.19',  symbol: '♈', iconUrl: '/assets/zodiacs/aries.png' },
  { id: 'taurus',      name: '황소자리',   dateRange: '4.20–5.20',  symbol: '♉', iconUrl: '/assets/zodiacs/taurus.png' },
  { id: 'gemini',      name: '쌍둥이자리', dateRange: '5.21–6.21',  symbol: '♊', iconUrl: '/assets/zodiacs/gemini.png' },
  { id: 'cancer',      name: '게자리',     dateRange: '6.22–7.22',  symbol: '♋', iconUrl: '/assets/zodiacs/cancer.png' },
  { id: 'leo',         name: '사자자리',   dateRange: '7.23–8.22',  symbol: '♌', iconUrl: '/assets/zodiacs/leo.png' },
  { id: 'virgo',       name: '처녀자리',   dateRange: '8.23–9.22',  symbol: '♍', iconUrl: '/assets/zodiacs/virgo.png' },
  { id: 'libra',       name: '천칭자리',   dateRange: '9.23–10.22', symbol: '♎', iconUrl: '/assets/zodiacs/libra.png' },
  { id: 'scorpio',     name: '전갈자리',   dateRange: '10.23–11.21',symbol: '♏', iconUrl: '/assets/zodiacs/scorpio.png' },
  { id: 'sagittarius', name: '사수자리',   dateRange: '11.22–12.21',symbol: '♐', iconUrl: '/assets/zodiacs/sagittarius.png' },
  { id: 'capricorn',   name: '염소자리',   dateRange: '12.22–1.19', symbol: '♑', iconUrl: '/assets/zodiacs/capricorn.png' },
  { id: 'aquarius',    name: '물병자리',   dateRange: '1.20–2.18',  symbol: '♒', iconUrl: '/assets/zodiacs/aquarius.png' },
  { id: 'pisces',      name: '물고기자리', dateRange: '2.19–3.20',  symbol: '♓', iconUrl: '/assets/zodiacs/pisces.png' },
];

// 별자리 ID → 메타 조회 헬퍼
export const getZodiacMeta = (id: ZodiacSign) =>
  ZODIAC_LIST.find(z => z.id === id);

// 운세 타입별 색상 토큰 (Figma 디자인 토큰 기준)
export const FORTUNE_COLORS = {
  relationship: '#aff3ff', // 청록
  money:        '#afceff', // 파랑
  work:         '#bfafff', // 보라
} as const;

// 운세 타입별 한글 레이블
export const FORTUNE_LABELS = {
  relationship: '관계 운',
  money:        '금전 운',
  work:         '업무 운',
} as const;
