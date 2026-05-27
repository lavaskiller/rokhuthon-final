import type { ReactNode } from 'react'
import StarBackground from '../components/StarBackground'

interface Props {
  children: ReactNode
  /** 별 배경 투명도 (기본 0.23, 로딩 화면 0.40) */
  starOpacity?: number
}

/**
 * 공통 앱 레이아웃
 * - StarBackground (배경 레이어)
 * - 좌측 세로 "별꽃노리" 브랜드 텍스트
 * - children 슬롯
 */
export default function AppLayout({ children, starOpacity }: Props) {
  return (
    <StarBackground starOpacity={starOpacity}>
      {/* 좌측 세로 브랜드 텍스트 */}
      <div className="absolute left-7 top-1/2 z-20 flex -translate-y-1/2 -rotate-90 items-center gap-3">
        <div className="h-px w-10 bg-white/40" />
        <span className="font-gowun text-lg whitespace-nowrap text-white">별꽃노리</span>
        <div className="h-px w-10 bg-white/40" />
      </div>

      {/* 페이지 콘텐츠 */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </StarBackground>
  )
}
