import type { ReactNode } from 'react'

interface Props {
  /** 별 배경 이미지 투명도 (기본 0.23, 로딩 화면 0.40) */
  starOpacity?: number
  children?: ReactNode
}

/**
 * 레이어 순서 (bottom → top)
 * 1. 그라디언트 배경 (#0a205c → #44257e)
 * 2. 별 이미지 (opacity 제어)
 * 3. 언덕 실루엣 (하단 고정)
 * 4. 꽃잎 파티클 (mix-blend-mode: soft-light)
 * 5. children
 */
export default function StarBackground({ starOpacity = 0.23, children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-[#0a205c] to-[#44257e]">
      {/* 별 배경 */}
      <img
        src="/assets/bg-stars.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: starOpacity }}
      />

      {/* 물결 언덕 실루엣 */}
      <img
        src="/assets/bg-hills.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 w-full"
      />

      {/* 하늘색 꽃 장식 (꽃들) */}
      <img
        src="/assets/bg-flowers.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* 꽃잎 파티클 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ mixBlendMode: 'soft-light' }}
      >
        <img
          src="/assets/bg-petals.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
