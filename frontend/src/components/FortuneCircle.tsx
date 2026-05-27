// ─────────────────────────────────────────────
// FortuneCircle — 운세 원형 게이지 카드
//
// uiux 6/7 (결과화면 lg), uiux 15 (FortuneBadge sm)
// SVG arc + 중앙 수치 오버레이
// ─────────────────────────────────────────────

import { FORTUNE_COLORS, FORTUNE_LABELS } from '../constants/zodiacs'
import type { FortuneType } from '../types'

interface Props {
  type: FortuneType
  score: number
  /** lg: 결과 화면 메인 (120px) | sm: FortuneBadge 소형 (56px) */
  size?: 'sm' | 'lg'
}

export default function FortuneCircle({ type, score, size = 'lg' }: Props) {
  const dim = size === 'lg' ? 120 : 56
  const strokeW = size === 'lg' ? 8 : 5
  const radius = dim / 2 - strokeW
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - score / 100)
  const color = FORTUNE_COLORS[type]
  const label = FORTUNE_LABELS[type]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={`${color}30`}
            strokeWidth={strokeW}
          />
          {/* Progress arc */}
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
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>

        {/* Score text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-gowun font-bold"
            style={{ color, fontSize: size === 'lg' ? 22 : 11 }}
          >
            {score}
          </span>
        </div>
      </div>

      <span
        className="font-gowun text-xs"
        style={{ color: `${color}cc` }}
      >
        {label}
      </span>
    </div>
  )
}
