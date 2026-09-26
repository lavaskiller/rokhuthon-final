// ─────────────────────────────────────────────
// FigmaStage — Figma 프레임(1194×834) 좌표를 그대로 쓰는 고정 캔버스
//
// Figma "UIUX 최종" 은 가로 1194×834 키오스크 화면 기준이라,
// 자식 요소는 프레임 좌표(px)로 absolute 배치하고 캔버스 전체를 창 크기에 맞춰 확대/축소한다.
// 배경은 AppLayout(StarBackground) 이 화면 전체를 채우므로 여백도 자연스럽게 이어진다.
//
// 인쇄 시에는 transform 을 제거 — #print-card 의 position: fixed 가 뷰포트 기준으로 동작하도록
// ─────────────────────────────────────────────

import { useEffect, useState, type ReactNode } from 'react'

export const STAGE_WIDTH = 1194
export const STAGE_HEIGHT = 834

const fitScale = () => Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT)

interface Props {
  children: ReactNode
}

export default function FigmaStage({ children }: Props) {
  const [scale, setScale] = useState(fitScale)

  useEffect(() => {
    const onResize = () => setScale(fitScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden print:static print:overflow-visible">
      <div
        className="absolute left-1/2 top-1/2 h-[834px] w-[1194px] font-gowun text-white print:static print:![transform:none]"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

interface StageImageProps {
  src: string
  /** 프레임 좌표 [left, top, width, height] px */
  box: [number, number, number, number]
  /** Figma 벡터 stroke 여백 — 박스 기준 음수 inset (예: '-0.72% -0.54%') */
  inset?: string
  className?: string
  style?: React.CSSProperties
}

/** Figma 벡터/이미지를 프레임 좌표에 원본 비율 그대로 배치 */
export function StageImage({ src, box, inset = '0', className = '', style }: StageImageProps) {
  const [left, top, width, height] = box
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ left, top, width, height, ...style }}>
      <div className="absolute" style={{ inset }}>
        <img src={src} alt="" draggable={false} className="block h-full w-full max-w-none" />
      </div>
    </div>
  )
}

/** 오늘 날짜 — "2026. 09. 26" (sep 로 구분자 변경) */
export function todayLabel(sep = '. ') {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join(sep)
}
