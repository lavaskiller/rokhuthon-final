import { createContext, useContext, useReducer, useCallback, useRef, type ReactNode } from 'react'
import { createElement } from 'react'
import type { ZodiacSign, FortuneResult, LuckyElements, FlowerResult } from '../types'
import { fetchFortune, fetchLucky, fetchFlower } from '../api/client'

// ── State ────────────────────────────────────────────────────────────────────

interface State {
  selectedZodiac: ZodiacSign | null
  fortune: FortuneResult | null
  lucky: LuckyElements | null
  flower: FlowerResult | null
  isLoadingFortune: boolean  // uiux 3 로딩 화면 표시 여부
  isLoadingFlower: boolean   // uiux 11~14 로딩 화면 표시 여부
  error: string | null
}

const initialState: State = {
  selectedZodiac: null,
  fortune: null,
  lucky: null,
  flower: null,
  isLoadingFortune: false,
  isLoadingFlower: false,
  error: null,
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_ZODIAC'; zodiac: ZodiacSign }
  | { type: 'SET_FORTUNE'; fortune: FortuneResult }
  | { type: 'SET_LUCKY'; lucky: LuckyElements }
  | { type: 'SET_FLOWER'; flower: FlowerResult }
  | { type: 'SET_LOADING_FORTUNE'; loading: boolean }
  | { type: 'SET_LOADING_FLOWER'; loading: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_ZODIAC':
      // 새 별자리 선택 시 이전 결과 초기화
      return { ...initialState, selectedZodiac: action.zodiac }
    case 'SET_FORTUNE':
      return { ...state, fortune: action.fortune, isLoadingFortune: false }
    case 'SET_LUCKY':
      return { ...state, lucky: action.lucky }
    case 'SET_FLOWER':
      return { ...state, flower: action.flower, isLoadingFlower: false }
    case 'SET_LOADING_FORTUNE':
      return { ...state, isLoadingFortune: action.loading, error: null }
    case 'SET_LOADING_FLOWER':
      return { ...state, isLoadingFlower: action.loading, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoadingFortune: false, isLoadingFlower: false }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface ContextValue {
  state: State
  /** 별자리 선택 → fetchFortune 자동 호출. 캐시 히트 시 true 반환 (로딩 스킵 가능) */
  selectZodiac: (zodiac: ZodiacSign) => Promise<boolean>
  /** hover 시 미리 운세 fetch — 클릭 전 캐시 워밍 */
  prefetchFortune: (zodiac: ZodiacSign) => void
  /** 행운 요소 로드 (FortuneResult 페이지 진입 시 호출) */
  loadLucky: () => Promise<void>
  /** 꽃 추천 로드 (LuckyElements 페이지 CTA 클릭 시 호출) */
  loadFlower: () => Promise<void>
  /** 전체 상태 초기화 (랜딩으로 돌아갈 때) */
  reset: () => void
}

const FortuneContext = createContext<ContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function FortuneProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const prefetchCache = useRef<Partial<Record<ZodiacSign, FortuneResult>>>({})
  const inflight = useRef<Partial<Record<ZodiacSign, Promise<FortuneResult>>>>({})

  const prefetchFortune = useCallback((zodiac: ZodiacSign) => {
    if (prefetchCache.current[zodiac] || inflight.current[zodiac]) return
    const p = fetchFortune(zodiac)
    inflight.current[zodiac] = p
    p.then(fortune => {
      prefetchCache.current[zodiac] = fortune
    }).catch(() => {}).finally(() => {
      delete inflight.current[zodiac]
    })
  }, [])

  const selectZodiac = useCallback(async (zodiac: ZodiacSign): Promise<boolean> => {
    dispatch({ type: 'SELECT_ZODIAC', zodiac })
    const cached = prefetchCache.current[zodiac]
    if (cached) {
      dispatch({ type: 'SET_FORTUNE', fortune: cached })
      return true
    }
    dispatch({ type: 'SET_LOADING_FORTUNE', loading: true })
    try {
      const fortune = await (inflight.current[zodiac] ?? fetchFortune(zodiac))
      prefetchCache.current[zodiac] = fortune
      dispatch({ type: 'SET_FORTUNE', fortune })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) })
    }
    return false
  }, [])

  const loadLucky = useCallback(async () => {
    if (state.lucky) return  // 이미 로드됐으면 스킵
    const isDev = import.meta.env.DEV
    const zodiac = state.selectedZodiac ?? (isDev ? 'aries' : null)
    if (!zodiac) return
    try {
      const lucky = await fetchLucky(zodiac as ZodiacSign)
      dispatch({ type: 'SET_LUCKY', lucky })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) })
    }
  }, [state.selectedZodiac, state.lucky])

  const loadFlower = useCallback(async () => {
    const isDev = import.meta.env.DEV
    const zodiac = state.selectedZodiac ?? (isDev ? 'aries' : null)
    if (!zodiac) return
    const scores = state.fortune?.scores ?? (isDev ? { relationship: 80, money: 67, work: 91 } : null)
    if (!scores) return
    dispatch({ type: 'SET_LOADING_FLOWER', loading: true })
    try {
      const flower = await fetchFlower(zodiac as ZodiacSign, scores)
      dispatch({ type: 'SET_FLOWER', flower })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) })
    }
  }, [state.selectedZodiac, state.fortune])

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return createElement(FortuneContext.Provider, { value: { state, selectZodiac, prefetchFortune, loadLucky, loadFlower, reset } }, children)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFortuneFlow() {
  const ctx = useContext(FortuneContext)
  if (!ctx) throw new Error('useFortuneFlow must be used within <FortuneProvider>')
  return ctx
}
