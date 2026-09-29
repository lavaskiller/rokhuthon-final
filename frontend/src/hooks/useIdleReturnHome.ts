// ─────────────────────────────────────────────
// useIdleReturnHome — 키오스크: 일정 시간 아무 입력이 없으면 처음 화면(/)으로
//
// 터치·클릭·키보드·스크롤이 있을 때마다 타이머를 다시 시작. 표지(/)에서는 동작하지 않음.
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const IDLE_RETURN_MS = 90_000

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const

export function useIdleReturnHome(timeoutMs = IDLE_RETURN_MS) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/') return
    let timer = setTimeout(goHome, timeoutMs)
    function goHome() { navigate('/', { replace: true }) }
    function restart() {
      clearTimeout(timer)
      timer = setTimeout(goHome, timeoutMs)
    }
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, restart, { passive: true, capture: true }))
    return () => {
      clearTimeout(timer)
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, restart, { capture: true }))
    }
  }, [pathname, navigate, timeoutMs])
}
