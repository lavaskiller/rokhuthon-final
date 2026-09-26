// ─────────────────────────────────────────────
// SurfaceCard — 반투명 핑크 정보 카드 (Figma 20260926 "UIUX 최종")
//
// 결과 화면 "꽃말 / 기대되는 행운 / 함께 두면 좋은 장소" 카드 등에 사용.
// Figma: bg #ad3a59 + 1.5px 흰 테두리, 레이어 전체 opacity 42%, radius 60px.
// 콘텐츠(텍스트)는 opacity 영향을 받지 않도록 배경을 별도 레이어로 분리.
//
// 크기·padding 은 화면마다 다르므로 className 으로 지정
// ─────────────────────────────────────────────

import type { ReactNode } from 'react'

interface Props {
  className?: string
  children: ReactNode
}

export default function SurfaceCard({ className = '', children }: Props) {
  return (
    <div className={`relative rounded-card ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card border-[1.5px] border-white bg-petal-card opacity-[0.42]"
      />
      <div className="relative">{children}</div>
    </div>
  )
}
