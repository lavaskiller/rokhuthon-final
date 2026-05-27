// ─────────────────────────────────────────────
// useFortuneFlow — 전체 운세 플로우 상태 관리
//
// 역할: 별자리 선택부터 꽃 추천까지 단일 흐름의 서버 상태를 캡슐화
// 사용처: FortuneResult, LuckyElements, FlowerResult 페이지에서 공유
// ─────────────────────────────────────────────

import type { ZodiacSign, FortuneResult, LuckyElements, FlowerResult } from '../types';

// TODO: 상태 관리 라이브러리 선택 — Zustand 권장 (경량, 보일러플레이트 없음)
//       단순하면 React Context + useReducer 로도 충분

interface FortuneFlowState {
  selectedZodiac: ZodiacSign | null;
  fortune: FortuneResult | null;
  lucky: LuckyElements | null;
  flower: FlowerResult | null;
  isLoadingFortune: boolean;  // uiux 3 로딩 화면 표시 여부
  isLoadingFlower: boolean;   // uiux 11~14 로딩 화면 표시 여부
  error: string | null;
}

// TODO: 훅 구현
// export function useFortuneFlow() {
//   - selectZodiac(zodiac): 별자리 선택 → POST /api/fortune 호출 → 로딩 화면으로 이동
//   - fetchLucky(): POST /api/lucky 호출 (fortune 결과 의존)
//   - fetchFlower(): POST /api/flower 호출 (fortune + lucky 결과 의존)
//   - reset(): 전체 상태 초기화 (랜딩으로 돌아갈 때)
//   return { state, selectZodiac, fetchLucky, fetchFlower, reset }
// }
