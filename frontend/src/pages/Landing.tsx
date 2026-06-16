import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import GlassCard from '../components/GlassCard'
import { fetchZodiacs } from '../api/client'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    fetchZodiacs().catch(() => {})
  }, [])

  return (
    <AppLayout showFlowers>
      <div className="min-h-screen flex flex-col">
        {/* 상단: 별꽃노리 브랜드 (dot-line-text-line-dot) */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <span className="h-[3px] w-[3px] rounded-full bg-white/70" aria-hidden />
          <span className="h-px w-20 bg-white/60" aria-hidden />
          <span className="mx-4 text-sm tracking-[0.5em] text-white/75 select-none">별꽃노리</span>
          <span className="h-px w-20 bg-white/60" aria-hidden />
          <span className="h-[3px] w-[3px] rounded-full bg-white/70" aria-hidden />
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <p className="font-gowun text-lg text-white/60 mb-3">
              당신에게 맞는 꽃을 추천해 드려요
            </p>
            <h1 className="font-gowun text-5xl font-bold text-white leading-tight">
              오늘의{' '}
              <span className="text-[#76d4ff]">별꽃 운세</span>
            </h1>
          </div>

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
      </div>
    </AppLayout>
  )
}
