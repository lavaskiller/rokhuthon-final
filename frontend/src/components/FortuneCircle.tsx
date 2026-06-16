// ─────────────────────────────────────────────
// FortuneCircle — 운세 원형 카드
//
// size='lg' — uiux 6/7 결과 화면 메인: SVG arc 진행 게이지
// size='sm' — uiux 15 총운 미니: Figma 매칭
//   · 외곽 글로우 (radial blur, 시안 톤)
//   · 그라디언트 ring (linear 48.78°, 4 stops — 운별 다름)
//   · navy(#2B4DA4) 내부 원
//   · 가운데 점수 텍스트 (운별 시안/파랑/보라)
//   · 하단 라벨 (관계 운 / 금전 운 / 업무 운)
// ─────────────────────────────────────────────

import { useId, useEffect, useState } from 'react'

import { FORTUNE_COLORS, FORTUNE_LABELS } from '../constants/zodiacs'

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}
import type { FortuneType } from '../types'

interface Props {
  type: FortuneType
  score: number
  /** lg: 결과 화면 메인 (120px) | sm: 총운 미니 (Figma uiux 15 매칭) */
  size?: 'sm' | 'lg'
}

// 운별 SVG linearGradient stops (Figma Ellipse 31 fill 그대로 — 4 stops)
const RING_STOPS: Record<FortuneType, { offset: string; color: string }[]> = {
  relationship: [
    { offset: '0%', color: '#DFFFF6' },
    { offset: '44%', color: '#78D8F8' },
    { offset: '81%', color: '#9CFFD4' },
    { offset: '100%', color: '#5AD3D6' },
  ],
  money: [
    { offset: '0%', color: '#DFF6FF' },
    { offset: '44%', color: '#78B6F8' },
    { offset: '81%', color: '#9CBDFF' },
    { offset: '100%', color: '#5A8FD6' },
  ],
  work: [
    { offset: '0%', color: '#DFDFFF' },
    { offset: '44%', color: '#9C78F8' },
    { offset: '81%', color: '#9CAEFF' },
    { offset: '100%', color: '#985AD6' },
  ],
}

export default function FortuneCircle({ type, score, size = 'lg' }: Props) {
  if (size === 'sm') return <FortuneMini type={type} score={score} />
  return <FortuneArc type={type} score={score} />
}

// ─────────── sm (Figma uiux 15 총운 미니) ───────────
function FortuneMini({ type, score }: { type: FortuneType; score: number }) {
  const animated = useCountUp(score)
  const dim = 80
  const strokeW = 2.5
  const radius = dim / 2 - strokeW
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - animated / 100)
  const scoreColor = FORTUNE_COLORS[type]
  const label = FORTUNE_LABELS[type]
  const stops = RING_STOPS[type]
  const gradId = `mini-${type}-${useId().replace(/:/g, '')}`

  return (
    <div className="relative" style={{ width: dim, height: dim }}>
      {/* Figma Ellipse 32: 가운데 부드러운 inner glow (radial blur) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(159,221,255,0.55) 0%, rgba(67,128,193,0.25) 60%, transparent 100%)',
          filter: 'blur(7px)',
        }}
      />
      <svg
        width={dim}
        height={dim}
        style={{
          transform: 'rotate(-90deg)',
          filter: `drop-shadow(0 0 3px ${scoreColor}aa) drop-shadow(0 0 8px ${scoreColor}55)`,
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            {stops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        {/* 미점수 track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeW}
        />
        {/* 점수 progress arc */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {/* 원 안 — 라벨 위, 점수 아래 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-gowun text-[13px] text-white/95 leading-none">
          {label}
        </span>
        <span
          className="font-gowun text-xl font-bold leading-none"
          style={{ color: scoreColor }}
        >
          {animated}
          <span className="ml-1 font-normal">%</span>
        </span>
      </div>
    </div>
  )
}

// ─────────── lg (결과 화면 메인, uiux 6/7) ───────────
function FortuneArc({ type, score }: { type: FortuneType; score: number }) {
  const animated = useCountUp(score)
  const dim = 120
  const strokeW = 8
  const radius = dim / 2 - strokeW
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - animated / 100)
  const color = FORTUNE_COLORS[type]
  const label = FORTUNE_LABELS[type]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        >
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={`${color}25`}
            strokeWidth={strokeW}
          />
          {/* Progress arc (glow via drop-shadow) */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease',
              filter: `drop-shadow(0 0 6px ${color}cc) drop-shadow(0 0 12px ${color}66)`,
            }}
          />
        </svg>

        {/* Center overlay: 라벨 위, 점수 아래 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span
            className="font-gowun mb-1 text-white"
            style={{ fontSize: 15 }}
          >
            {label}
          </span>
          <span
            className="font-gowun font-bold"
            style={{ color, fontSize: 26 }}
          >
            {animated}
            <span style={{ fontSize: 16, marginLeft: 1 }}>%</span>
          </span>
        </div>
      </div>
    </div>
  )
}
