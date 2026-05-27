import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
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
  /** 별자리 선택 → fetchFortune 자동 호출 */
  selectZodiac: (zodiac: ZodiacSign) => Promise<void>
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

  const selectZodiac = useCallback(async (zodiac: ZodiacSign) => {
    dispatch({ type: 'SELECT_ZODIAC', zodiac })
    dispatch({ type: 'SET_LOADING_FORTUNE', loading: true })
    try {
      const fortune = await fetchFortune(zodiac)
      dispatch({ type: 'SET_FORTUNE', fortune })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) })
    }
  }, [])

  const loadLucky = useCallback(async () => {
    if (!state.selectedZodiac || state.lucky) return  // 이미 로드됐으면 스킵
    try {
      const lucky = await fetchLucky(state.selectedZodiac)
      dispatch({ type: 'SET_LUCKY', lucky })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) })
    }
  }, [state.selectedZodiac, state.lucky])

  const loadFlower = useCallback(async () => {
    if (!state.selectedZodiac || !state.fortune) return
    dispatch({ type: 'SET_LOADING_FLOWER', loading: true })
    try {
      const flower = await fetchFlower(state.selectedZodiac, state.fortune.scores)
      dispatch({ type: 'SET_FLOWER', flower })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) })
    }
  }, [state.selectedZodiac, state.fortune])

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return createElement(FortuneContext.Provider, { value: { state, selectZodiac, loadLucky, loadFlower, reset } }, children)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFortuneFlow() {
  const ctx = useContext(FortuneContext)
  if (!ctx) throw new Error('useFortuneFlow must be used within <FortuneProvider>')
  return ctx
}
