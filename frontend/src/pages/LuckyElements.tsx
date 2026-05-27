import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LuckyCard from '../components/LuckyCard'
import NavArrow from '../components/NavArrow'
import GlassCard from '../components/GlassCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import { getZodiacMeta } from '../constants/zodiacs'
import type { ZodiacSign } from '../types'

export default function LuckyElements() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state, loadLucky, loadFlower } = useFortuneFlow()
  const { selectedZodiac, lucky, fortune } = state

  useEffect(() => {
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [selectedZodiac, fortune, navigate])

  useEffect(() => {
    loadLucky()
  }, [loadLucky])

  const handleFlowerCTA = () => {
    void loadFlower()
    navigate('/loading/flower')
  }

  const meta = zodiac ? getZodiacMeta(zodiac as ZodiacSign) : undefined
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

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* 별자리 헤더 */}
          <div className="flex flex-col items-center gap-2">
            {meta && (
              <img
                src={meta.iconUrl}
                alt={meta.name}
                className="w-14 h-14 rounded-full border-2 border-[#71fffd] object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <span className="font-gowun text-2xl font-bold text-white">{meta?.name}</span>
            <div className="flex items-center gap-3">
              <span className="h-px w-16 bg-white/30" aria-hidden />
              <span className="font-gowun text-xs text-white/60">행운 요소</span>
              <span className="h-px w-16 bg-white/30" aria-hidden />
            </div>
          </div>

          {/* 행운 카드 3개 */}
          {lucky ? (
            <div className="grid grid-cols-3 gap-5 w-full max-w-2xl">
              <LuckyCard category="장소" content={lucky.place} />
              <LuckyCard category="행동" content={lucky.action} />
              <LuckyCard category="색상" content={lucky.color} />
            </div>
          ) : (
            <p className="font-gowun text-sm text-white/50">로딩 중…</p>
          )}

          {/* CTA */}
          <GlassCard variant="pill" className="px-8 py-3" onClick={handleFlowerCTA}>
            <span className="font-gowun text-sm text-white">
              당신에게 필요한 꽃을 확인해보세요
            </span>
          </GlassCard>
        </div>

        {/* 하단 네비 */}
        <div className="flex justify-start">
          <NavArrow
            direction="left"
            label="총운 확인하기"
            to={`/fortune/${zodiac}`}
          />
        </div>
      </div>
    </AppLayout>
  )
}
