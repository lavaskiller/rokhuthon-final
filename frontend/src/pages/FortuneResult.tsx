import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FortuneCircle from '../components/FortuneCircle'
import NavArrow from '../components/NavArrow'
import GlassCard from '../components/GlassCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import { getZodiacMeta } from '../constants/zodiacs'
import type { ZodiacSign } from '../types'

export default function FortuneResult() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { fortune, selectedZodiac } = state

  useEffect(() => {
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [selectedZodiac, fortune, navigate])

  if (!fortune || !zodiac) return null

  const meta = getZodiacMeta(zodiac as ZodiacSign)
  const today = new Date()
  const dateStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('. ')

  return (
    <AppLayout>
      <div className="h-full flex flex-col px-12 py-6">
        {/* 날짜 */}
        <p className="font-gowun text-sm text-white/40">{dateStr}</p>

        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          {/* 별자리 헤더 */}
          <div className="flex flex-col items-center gap-2">
            {meta && (
              <img
                src={meta.iconUrl}
                alt={meta.name}
                className="w-16 h-16 rounded-full border-2 border-[#71fffd] object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <span className="font-gowun text-2xl font-bold text-white">{meta?.name}</span>
            <div className="flex items-center gap-3">
              <span className="h-px w-16 bg-white/30" aria-hidden />
              <span className="font-gowun text-xs text-white/60">총운</span>
              <span className="h-px w-16 bg-white/30" aria-hidden />
            </div>
          </div>

          {/* 총운 카드 */}
          <GlassCard variant="rounded" className="w-full max-w-xl p-6">
            <p className="font-gowun text-sm text-white/90 leading-7 text-center">
              {fortune.summary}
            </p>
          </GlassCard>

          {/* 운세 게이지 3개 */}
          <div className="flex gap-10 justify-center">
            <FortuneCircle type="relationship" score={fortune.scores.relationship} />
            <FortuneCircle type="money"        score={fortune.scores.money} />
            <FortuneCircle type="work"         score={fortune.scores.work} />
          </div>

          {/* CTA */}
          <GlassCard
            variant="pill"
            className="px-8 py-3"
            onClick={() => navigate(`/fortune/${zodiac}/lucky`)}
          >
            <span className="font-gowun text-sm text-white">
              당신에게 필요한 꽃을 확인해보세요
            </span>
          </GlassCard>
        </div>

        {/* 하단 네비 */}
        <div className="flex justify-between">
          <NavArrow direction="left"  label="다시 선택하기"     to="/select" />
          <NavArrow direction="right" label="행운 요소 확인하기" to={`/fortune/${zodiac}/lucky`} />
        </div>
      </div>
    </AppLayout>
  )
}
