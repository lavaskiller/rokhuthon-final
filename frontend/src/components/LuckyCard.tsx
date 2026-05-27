// ─────────────────────────────────────────────
// LuckyCard — 행운 요소 카드 (장소 / 행동 / 색상)
//
// 구조: SVG circle 의 stroke-dasharray 로 상단(12시 위치) 에 gap → 테두리 진짜 끊김
// 라벨이 그 gap 영역에 떠있어 ✦ 다이아몬드 양옆에 여유 공간으로 끊긴 효과.
// content 가 "A - B" 형식이면 [A] / "-" / [B] 3 줄로 분리 표시.
// ─────────────────────────────────────────────

import { Fragment } from 'react'

interface Props {
  category: '장소' | '행동' | '색상'
  content: string
}

const RADIUS = 49           // viewBox 100x100 기준
const CIRC = 2 * Math.PI * RADIUS   // 원주 ≈ 307.88
const GAP = 75              // 라벨 위치 비울 호 길이 (≈88°) — 다이아몬드 sign 과 여유 확보

export default function LuckyCard({ category, content }: Props) {
  const lines = content.split(/\s*-\s*/).filter(Boolean)
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      {/* 흰색 원 테두리 — 상단 GAP 영역만 비워 라벨에 자리를 양보 */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="0.8"
          strokeDasharray={`${CIRC - GAP} ${GAP}`}
          strokeDashoffset={-GAP / 2}
          transform="rotate(-90 50 50)"
        />
      </svg>

      {/* 라벨 — 원 상단 gap 영역에 위치 (배경 박스 없음) */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-gowun text-base text-white tracking-wide">
        ✦ {category} ✦
      </span>

      {/* 원 안 내용 — 가운데 정렬 */}
      <p className="px-4 text-center font-gowun text-sm leading-snug text-white">
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <>
                <br />
                <span className="opacity-70">-</span>
                <br />
              </>
            )}
            {line}
          </Fragment>
        ))}
      </p>
    </div>
  )
}
