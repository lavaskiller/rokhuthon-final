import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
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
      <div className="relative min-h-screen flex flex-col px-8 py-6">
        {/* 좌상단 — 오늘 날짜 */}
        <p className="font-gowun text-sm text-white/85">{dateStr}</p>

        {/* 좌측 중앙 — 총운 확인하기 (NavArrow) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <NavArrow
            direction="left"
            label="총운 확인하기"
            to={`/fortune/${zodiac}`}
          />
        </div>

        {/* 메인 콘텐츠 — 세로 중앙 정렬 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 mx-auto w-full max-w-3xl">
          {/* 별자리 이름 */}
          <h2 className="font-gowun text-[28px] font-bold text-white">
            {meta?.name ?? '별자리'}
          </h2>

          {/* 큰 별자리 아이콘 */}
          <div
            className="flex h-32 w-32 items-center justify-center"
            style={{ filter: 'drop-shadow(0 4px 4px rgba(26,33,68,1))' }}
          >
            <ZodiacIconPlaceholder size={96} strokeWidth={1.7} shiny />
          </div>

          {/* "행운 요소" 라벨 + 가로선 */}
          <div className="flex flex-col items-center gap-3">
            <p className="font-gowun text-base text-white/90">행운 요소</p>
            <div className="flex items-center">
              <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
              <span className="h-px w-72 bg-white/60" aria-hidden />
              <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
            </div>
          </div>

          {/* 카드 3개 */}
          <section className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6">
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

          {/* CTA */}
          <button
            type="button"
            onClick={handleFlowerCTA}
            disabled={!lucky}
            className="rounded-full border border-white/20 bg-[rgba(218,249,255,0.2)] px-10 py-3 font-gowun text-base text-white backdrop-blur-md transition-all hover:bg-[rgba(218,249,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            당신에게 필요한 꽃을 확인해보세요
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
