// ─────────────────────────────────────────────
// 운세 문구 헬퍼 — "가장 부족한 운을 채워줄 꽃" 흐름을 화면마다 같은 말로 보여주기 위함
// ─────────────────────────────────────────────

import type { FortuneScores, FortuneType } from '../types'

export const FORTUNE_NAME: Record<FortuneType, string> = {
  relationship: '관계운',
  money: '금전운',
  work: '업무운',
}

const ORDER: FortuneType[] = ['relationship', 'money', 'work']

/** 가장 낮은 운 — 백엔드 get_flower 와 동일하게 점수 오름차순, 동점이면 관계 → 금전 → 업무 순 */
export function weakestFortune(scores: FortuneScores): FortuneType {
  return ORDER.reduce((low, type) => (scores[type] < scores[low] ? type : low))
}

/** 총운 점수 — 관계·금전·업무 평균 */
export function overallScore(scores: FortuneScores): number {
  return Math.round((scores.relationship + scores.money + scores.work) / 3)
}
