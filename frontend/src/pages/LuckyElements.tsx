import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import GlassCard from '../components/GlassCard'
import LuckyCard from '../components/LuckyCard'
import NavArrow from '../components/NavArrow'
import ZodiacIconPlaceholder from '../components/ZodiacIconPlaceholder'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import { getZodiacMeta } from '../constants/zodiacs'
import type { ZodiacSign } from '../types'

export default function LuckyElements() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state, loadLucky, loadFlower } = useFortuneFlow()
  const { selectedZodiac, fortune } = state
  const isDev = import.meta.env.DEV

  // dev 모드 mock fallback — backend 없이도 실제 데이터처럼 카드 채움 (prod 영향 X)
  const lucky =
    state.lucky ??
    (isDev
      ? {
          place: '조용한 카페 - 창가 자리',
          action: '산책하기 - 차분한 음악 듣기',
          color: '라벤더 퍼플',
        }
      : null)

  // Guard: 별자리 / 운세 결과 없으면 처음으로 (dev 모드에선 skip 해 hot-reload 시 머무름)
  useEffect(() => {
    if (isDev) return
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [isDev, selectedZodiac, fortune, navigate])

  useEffect(() => {
    loadLucky()
  }, [loadLucky])

  const handleFlowerCTA = () => {
    void loadFlower()           // 백그라운드 fetchFlower 시작
    navigate('/loading/flower') // 로딩 화면으로 이동
  }

  const meta = zodiac ? getZodiacMeta(zodiac as ZodiacSign) : undefined
  const today = new Date()
  const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col px-12 py-6">
        {/* 날짜 */}
        <p className="font-gowun text-sm text-white/40">{dateStr}</p>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-6">
          {/* 별자리 헤더 */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-gowun text-2xl font-bold text-white">
              {meta?.name ?? '별자리'}
            </span>
            <ZodiacIconPlaceholder
              size={160}
              className="text-[#71fffd]"
              style={{
                filter:
                  'drop-shadow(0 4px 4px #1a2144) drop-shadow(0 0 6px #71fffd55) drop-shadow(0 0 14px #71fffd22)',
              }}
            />
          </div>

          {/* 행운 요소 라벨 + 구분선 */}
          <div className="w-full max-w-sm text-center">
            <p className="font-gowun text-sm text-white mb-3">행운 요소</p>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="flex-1 h-px bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          {/* 카드 3개 + 좌측 NavArrow */}
          <div className="flex items-center justify-center gap-10">
            <NavArrow
              direction="left"
              label="총운 확인하기"
              to={`/fortune/${zodiac}`}
              vertical
            />
            <section className="flex gap-8">
              {lucky ? (
                <>
                  <LuckyCard category="장소" content={lucky.place} />
                  <LuckyCard category="행동" content={lucky.action} />
                  <LuckyCard category="색상" content={lucky.color} />
                </>
              ) : (
                <>
                  <LuckyCard category="장소" content="…" />
                  <LuckyCard category="행동" content="…" />
                  <LuckyCard category="색상" content="…" />
                </>
              )}
            </section>
            {/* 우측 균형용 빈 공간 */}
            <div className="w-10" />
          </div>

          {/* CTA — lucky 데이터 로드 전 비활성 (QA 5-9) */}
          <GlassCard
            variant="pill"
            className="px-14 py-5"
            onClick={handleFlowerCTA}
            disabled={!lucky}
          >
            <span className="font-gowun text-lg text-white">
              당신에게 필요한 꽃을 확인해보세요
            </span>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  )
}
