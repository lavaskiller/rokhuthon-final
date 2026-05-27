// ─────────────────────────────────────────────
// FlowerBloom — 꽃 개화 상태 컴포넌트
//
// uiux 11(25%)→12(50%)→13(75%)→14(100%) 로딩 화면에서 사용
// animated=true 시 800ms 간격으로 25→50→75→100 자동 전환
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import type { BloomState } from '../types'

interface Props {
  state?: BloomState
  animated?: boolean
  onComplete?: () => void
}

const SEQUENCE: BloomState[] = [25, 50, 75, 100]

export default function FlowerBloom({ state = 25, animated = false, onComplete }: Props) {
  const [current, setCurrent] = useState<BloomState>(animated ? 25 : state)

  useEffect(() => {
    if (!animated) return
    let step = 0
    const id = setInterval(() => {
      step++
      if (step < SEQUENCE.length) {
        setCurrent(SEQUENCE[step])
      }
      if (step >= SEQUENCE.length - 1) {
        clearInterval(id)
        onComplete?.()
      }
    }, 800)
    return () => clearInterval(id)
  }, [animated, onComplete])

  const pct = animated ? current : state
  const layers = pct === 25 ? 1 : pct === 50 ? 2 : pct === 75 ? 3 : 4

  // Each petal layer: bigger & lighter as bloom opens
  const petals = [
    { size: 70,  bg: 'radial-gradient(circle, #ffd6e8, #ffb3d9)', opacity: 0.55 },
    { size: 90,  bg: 'radial-gradient(circle, #ffb3d9, #ff91ca)', opacity: 0.45 },
    { size: 110, bg: 'radial-gradient(circle, #ff91ca, #ff6bb5)', opacity: 0.35 },
    { size: 130, bg: 'radial-gradient(circle, #ff6bb5, #ff4da6)', opacity: 0.25 },
  ]

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 180, height: 180 }}
    >
      {petals.slice(0, layers).map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full transition-all duration-700"
          style={{
            width: p.size,
            height: p.size,
            background: p.bg,
            opacity: p.opacity,
            transform: `rotate(${i * 30}deg)`,
          }}
        />
      ))}

      {/* Center disc */}
      <div
        className="relative z-10 rounded-full flex flex-col items-center justify-center gap-0.5"
        style={{ width: 64, height: 64, background: 'rgba(255,243,160,0.9)' }}
      >
        <span className="font-gowun text-xs font-bold text-amber-900">{pct}%</span>
      </div>
    </div>
  )
}
