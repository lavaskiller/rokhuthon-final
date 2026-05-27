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
      <div className="relative min-h-screen w-full">
        {/* 좌상단 — 오늘 날짜 */}
        <p className="absolute left-8 top-8 font-gowun text-sm text-white/85">
          {dateStr}
        </p>

        {/* 좌측 중앙 — 총운 확인하기 (NavArrow) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <NavArrow
            direction="left"
            label="총운 확인하기"
            to={`/fortune/${zodiac}`}
          />
        </div>

        {/* 메인 콘텐츠 — 가운데 컬럼 */}
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-8 pt-16">
          {/* 별자리 이름 */}
          <h2 className="font-gowun text-[28px] font-bold text-white">
            {meta?.name ?? '별자리'}
          </h2>

          {/* 큰 별자리 아이콘 — Figma shiny: stroke 그라디언트 + navy drop-shadow */}
          <div
            className="mt-6 flex h-32 w-32 items-center justify-center"
            style={{ filter: 'drop-shadow(0 4px 4px rgba(26,33,68,1))' }}
          >
            <ZodiacIconPlaceholder size={96} strokeWidth={1.7} shiny />
          </div>

          {/* "행운 요소" 라벨 + 가로선 (양 끝에 작은 흰색 구슬) */}
          <p className="mt-6 font-gowun text-base text-white/90">행운 요소</p>
          <div className="mt-3 flex items-center">
            <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
            <span className="h-px w-72 bg-white/60" aria-hidden />
            <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
          </div>

          {/* 카드 3개 — 데이터 로드되면 표시, 아니면 placeholder */}
          <section className="mt-8 flex flex-wrap items-start justify-center gap-x-10 gap-y-6">
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

          {/* CTA — 하단 글래스 pill */}
          <button
            type="button"
            onClick={handleFlowerCTA}
            disabled={!lucky}
            className="mt-12 mb-12 rounded-full border border-white/20 bg-[rgba(218,249,255,0.2)] px-10 py-3 font-gowun text-base text-white backdrop-blur-md transition-all hover:bg-[rgba(218,249,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            당신에게 필요한 꽃을 확인해보세요
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
