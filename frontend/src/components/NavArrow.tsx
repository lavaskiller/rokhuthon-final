// ─────────────────────────────────────────────
// NavArrow — 화면 간 이동 화살표 네비게이션
//
// uiux 6/7/8/9/10 하단 좌우에 사용
// ─────────────────────────────────────────────

import { Link } from 'react-router-dom'

interface Props {
  direction: 'left' | 'right'
  label: string
  to: string
  opacity?: number
  /** true: 화살표 위 + 글씨 아래 (FortuneResult 좌우 측면 배치용) */
  vertical?: boolean
}

export default function NavArrow({ direction, label, to, opacity, vertical = false }: Props) {
  const arrow = direction === 'left' ? '←' : '→'
  // vertical은 기본 1.0, horizontal은 기본 0.6
  const effectiveOpacity = opacity ?? (vertical ? 1 : 0.6)

  if (vertical) {
    return (
      <Link
        to={to}
        className="flex flex-col items-center gap-2 font-gowun text-base text-white transition-opacity hover:opacity-100"
        style={{ opacity: effectiveOpacity }}
      >
        <span className="text-3xl leading-none">{arrow}</span>
        <span className="whitespace-nowrap">{label}</span>
      </Link>
    )
  }

  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 font-gowun text-sm text-white transition-opacity hover:opacity-100"
      style={{ opacity: effectiveOpacity }}
    >
      {direction === 'left' && <span>{arrow}</span>}
      <span>{label}</span>
      {direction === 'right' && <span>{arrow}</span>}
    </Link>
  )
}
