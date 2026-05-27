// ─────────────────────────────────────────────
// Landing — uiux 1: 메인 랜딩 화면
//
// 레이아웃:
//   AppLayout (배경 + 꽃잎 파티클)
//   └─ 좌측 세로 텍스트: "별꽃노리"
//   └─ 중앙 콘텐츠 영역
//       ├─ 서브: "당신에게 맞는 꽃을 추천해 드려요"
//       ├─ 메인: "오늘의 별꽃 운세" (#76d4ff)
//       └─ CTA: "내 별꽃 운세 보러가기" → /select
// ─────────────────────────────────────────────

import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import GlassCard from '../components/GlassCard'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center gap-10">
        {/* 타이틀 */}
        <div className="text-center">
          <p className="font-gowun text-lg text-white/60 mb-3">
            당신에게 맞는 꽃을 추천해 드려요
          </p>
          <h1 className="font-gowun text-5xl font-bold text-white leading-tight">
            오늘의{' '}
            <span className="text-[#76d4ff]">별꽃 운세</span>
          </h1>
        </div>

        {/* CTA */}
        <GlassCard
          variant="pill"
          className="px-10 py-4"
          onClick={() => navigate('/select')}
        >
          <span className="font-gowun text-base text-white">
            내 별꽃 운세 보러가기
          </span>
        </GlassCard>
      </div>
    </AppLayout>
  )
}
