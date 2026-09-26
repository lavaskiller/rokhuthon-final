// ─────────────────────────────────────────────
// FigmaLoading — Figma "로딩1~4" (1:343 ~ 1:362) 공통 레이아웃
//
// 좌상단 날짜 + 회전하는 로딩 원(179px) + 원 중앙 콘텐츠 + 하단 메시지
// children 은 원 중심(RING_CENTER) 기준으로 배치
// ─────────────────────────────────────────────

import type { ReactNode } from 'react'
import FigmaStage, { todayLabel } from './FigmaStage'

export const RING_CENTER: [number, number] = [594.5, 386]

interface Props {
  message: string
  label: string
  children: ReactNode
}

export default function FigmaLoading({ message, label, children }: Props) {
  return (
    <FigmaStage>
      <p className="absolute left-[112.5px] top-[64px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-label text-white/85">
        {todayLabel()}
      </p>

      <div role="status" aria-label={label}>
        <img
          src="/assets/loading-ring.svg"
          alt=""
          aria-hidden
          draggable={false}
          className="absolute left-[505px] top-[296.5px] h-[179px] w-[179px] animate-spin [animation-duration:1.6s]"
        />
        {children}
      </div>

      <p className="absolute inset-x-0 top-[510.5px] whitespace-nowrap text-center text-[28px] leading-[63px]">
        {message}
      </p>
    </FigmaStage>
  )
}
