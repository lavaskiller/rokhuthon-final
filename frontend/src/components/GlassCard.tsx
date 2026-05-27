import type { ReactNode } from 'react'

interface Props {
  /** pill: CTA 버튼형 (radius 200px) | rounded: 카드형 (radius 20px) */
  variant?: 'pill' | 'rounded'
  className?: string
  onClick?: () => void
  children: ReactNode
}

/**
 * 글래스모피즘 카드
 * bg: rgba(218,249,255,0.2) + backdrop-blur
 */
export default function GlassCard({ variant = 'rounded', className = '', onClick, children }: Props) {
  const radius = variant === 'pill' ? 'rounded-[200px]' : 'rounded-[20px]'
  const cursor = onClick ? 'cursor-pointer hover:bg-[rgba(218,249,255,0.28)] transition-colors' : ''

  return (
    <div
      className={`bg-[rgba(218,249,255,0.2)] backdrop-blur-md ${radius} ${cursor} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
