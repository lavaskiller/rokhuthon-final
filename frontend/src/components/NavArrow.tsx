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
}

export default function NavArrow({ direction, label, to, opacity = 0.6 }: Props) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 font-gowun text-sm text-white transition-opacity hover:opacity-100"
      style={{ opacity }}
    >
      {direction === 'left' && <span>←</span>}
      <span>{label}</span>
      {direction === 'right' && <span>→</span>}
    </Link>
  )
}
