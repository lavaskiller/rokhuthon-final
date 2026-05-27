// ─────────────────────────────────────────────
// LuckyElements — uiux 8/9/10: 행운 요소 화면
//
// 라우트: /fortune/:zodiac/lucky
// ─────────────────────────────────────────────

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

  // Guard
  useEffect(() => {
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [selectedZodiac, fortune, navigate])

  // 행운 요소 로드
  useEffect(() => {
    loadLucky()
  }, [loadLucky])

  const handleFlowerCTA = () => {
    void loadFlower()           // 백그라운드 fetchFlower 시작
    navigate('/loading/flower') // 바로 로딩 화면으로 이동
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
      <div className="min-h-screen flex flex-col px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          {meta && (
            <img
              src={meta.iconUrl}
              alt={meta.name}
              className="w-8 h-8 rounded-full border border-[#71fffd] object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
          <div>
            <p className="font-gowun text-xs text-white/40">{dateStr}</p>
            <p className="font-gowun text-base text-white">{meta?.name}</p>
          </div>
        </div>

        <p className="font-gowun text-xs text-white/50 mb-1">✦ 행운 요소 ✦</p>
        <div className="h-px bg-white/20 mb-8" />

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* 행운 카드 3개 */}
          {lucky ? (
            <div className="flex gap-4 justify-center">
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
