// ─────────────────────────────────────────────
// RadarChart — 오늘의운세 삼각 레이더 (Figma 1:377)
//
// 격자·축은 Figma 벡터 그대로, 데이터 영역만 점수(0~100)로 그린다.
// Figma 그대로 위=총운 / 오른쪽=금전 운 / 왼쪽=업무 운. 총운 점수는 관계·금전·업무 평균.
// 좌표는 FigmaStage(1194×834) 기준.
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { StageImage } from './FigmaStage'
import type { FortuneScores } from '../types'

type Axis = 'overall' | 'money' | 'work'

// 바깥 삼각형 꼭짓점 (r-tri4) 과 무게중심
const CENTER: [number, number] = [596.3, 406.1]
const VERTEX: Record<Axis, [number, number]> = {
  overall: [596.3, 221.9],
  money: [755.9, 498.2],
  work: [436.8, 498.2],
}

const point = (type: Axis, score: number): [number, number] => [
  CENTER[0] + ((VERTEX[type][0] - CENTER[0]) * score) / 100,
  CENTER[1] + ((VERTEX[type][1] - CENTER[1]) * score) / 100,
]

/** 0 → 목표값 이징 애니메이션 (마운트·값 변경 시) */
function useAnimatedProgress(key: string, duration = 900) {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setT(1 - (1 - p) ** 3)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setT(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [key, duration])
  return t
}

const GRID: { src: string; box: [number, number, number, number]; inset: string }[] = [
  { src: 'r-tri1.svg', box: [556.7, 360.1, 79.9, 69.1], inset: '-1.45% -1.09% -0.72% -1.09%' },
  { src: 'r-tri2.svg', box: [516.7, 314, 159.8, 138.4], inset: '-0.72% -0.54% -0.36% -0.54%' },
  { src: 'r-tri3.svg', box: [476.8, 268, 239.7, 207.5], inset: '-0.48% -0.36% -0.24% -0.36%' },
  { src: 'r-tri4.svg', box: [436.8, 221.9, 319.6, 276.6], inset: '-0.72% -0.54% -0.36% -0.54%' },
  { src: 'r-axis-v.svg', box: [596.6, 221.9, 0, 184.4], inset: '0 -0.5px' },
  { src: 'r-axis-a.svg', box: [596.6, 406.2, 159.8, 92.3], inset: '-0.47% -0.16%' },
  { src: 'r-axis-b.svg', box: [436.8, 406.2, 159.8, 92.3], inset: '-0.47% -0.16%' },
]

const DOT_CLASS: Record<Axis, string> = {
  overall: 'fill-radar-overall',
  money: 'fill-radar-money',
  work: 'fill-radar-work',
}

interface Props {
  scores: FortuneScores
}

export default function RadarChart({ scores }: Props) {
  const values: Record<Axis, number> = {
    overall: Math.round((scores.relationship + scores.money + scores.work) / 3),
    money: scores.money,
    work: scores.work,
  }
  const t = useAnimatedProgress(`${values.overall}-${values.money}-${values.work}`)
  const types: Axis[] = ['overall', 'money', 'work']
  const pts = types.map(type => point(type, values[type] * t))
  const pct = (type: Axis) => `${Math.round(values[type] * t)}%`

  return (
    <div role="img" aria-label={`총운 ${values.overall}%, 금전 운 ${values.money}%, 업무 운 ${values.work}%`}>
      {GRID.map(g => <StageImage key={g.src} src={`/assets/fortune/${g.src}`} box={g.box} inset={g.inset} />)}

      <svg aria-hidden className="pointer-events-none absolute left-0 top-0 overflow-visible" width={1194} height={834} viewBox="0 0 1194 834">
        <polygon points={pts.map(p => p.join(',')).join(' ')} className="fill-radar-area/50 stroke-radar-line" strokeWidth={2} />
        {types.map((type, i) => (
          <circle key={type} cx={pts[i][0]} cy={pts[i][1]} r={8.67} className={`${DOT_CLASS[type]} stroke-white`} strokeWidth={1.5} />
        ))}
      </svg>

      {/* 축 라벨 */}
      <p aria-hidden className="absolute left-[548.8px] top-[139.2px] w-[95.6px] text-center text-body font-bold leading-[28.2px]">{pct('overall')}</p>
      <p aria-hidden className="absolute left-[548.3px] top-[167.4px] w-[95.6px] text-center text-button font-bold leading-[28.2px]">총운</p>
      <p aria-hidden className="absolute left-[781.3px] top-[470.5px] w-[95.6px] text-center text-body font-bold leading-[28.2px]">{pct('money')}</p>
      <p aria-hidden className="absolute left-[793.9px] top-[496.3px] w-[95.6px] whitespace-nowrap text-button font-bold leading-[28.2px]">금전운</p>
      <p aria-hidden className="absolute left-[316.1px] top-[470.2px] w-[95.4px] text-center text-body font-bold leading-[28.2px]">{pct('work')}</p>
      <p aria-hidden className="absolute left-[301.5px] top-[496.3px] w-[97.6px] whitespace-nowrap text-right text-button font-bold leading-[28.2px]">업무운</p>

      {/* 범례 */}
      <div aria-hidden className="text-[13px] font-bold leading-[20.35px] text-white/90">
        <img src="/assets/fortune/r-leg1.svg" alt="" className="absolute left-[463.8px] top-[565.1px] h-[17.337px] w-[17.337px]" />
        <span className="absolute left-[488.6px] top-[565px] whitespace-nowrap">총운</span>
        <img src="/assets/fortune/r-leg2.svg" alt="" className="absolute left-[563.7px] top-[565.1px] h-[17.337px] w-[17.337px]" />
        <span className="absolute left-[588.5px] top-[565px] whitespace-nowrap">업무운</span>
        <img src="/assets/fortune/r-leg3.svg" alt="" className="absolute left-[663.6px] top-[565.1px] h-[17.337px] w-[17.337px]" />
        <span className="absolute left-[688.3px] top-[565px] whitespace-nowrap">금전운</span>
      </div>
    </div>
  )
}
