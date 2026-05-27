import type { ZodiacMeta, FortuneResult, LuckyElements, FlowerResult, FortuneScores } from '../types'

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

/** 12개 별자리 + 오늘의 순위 */
export const fetchZodiacs = (): Promise<ZodiacMeta[]> =>
  request('/zodiacs')

/** 별자리 → 총운 텍스트 + 관계/금전/업무 수치 */
export const fetchFortune = (zodiac: string): Promise<FortuneResult> =>
  request('/fortune', { method: 'POST', body: JSON.stringify({ zodiac }) })

/** 별자리 → 행운 요소 (장소/행동/색상) */
export const fetchLucky = (zodiac: string): Promise<LuckyElements> =>
  request('/lucky', { method: 'POST', body: JSON.stringify({ zodiac }) })

/** 별자리 + 운세 수치 → 꽃 추천 (main 1 + subs 2) */
export const fetchFlower = (zodiac: string, scores: FortuneScores): Promise<FlowerResult> =>
  request('/flower', { method: 'POST', body: JSON.stringify({ zodiac, scores }) })
