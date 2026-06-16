import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FortuneCircle from '../components/FortuneCircle'
import NavArrow from '../components/NavArrow'
import GlassCard from '../components/GlassCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import { getZodiacMeta } from '../constants/zodiacs'
import type { ZodiacSign, FortuneResult as FortuneResultType } from '../types'

const MOCK_FORTUNE: FortuneResultType = {
  zodiac: 'aries',
  date: '2026. 06. 17',
  summary: '오늘은 새로운 시작에 좋은 기운이 가득해요.\n작은 용기가 큰 행운을 불러올 거예요.',
  scores: { relationship: 82, money: 67, work: 91 },
}

export default function FortuneResult() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state, loadLucky } = useFortuneFlow()
  const { fortune: fortuneFromState, selectedZodiac } = state
  const isDev = import.meta.env.DEV
  const fortune = fortuneFromState ?? (isDev ? MOCK_FORTUNE : null)
  useEffect(() => {
    if (isDev) return
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [isDev, selectedZodiac, fortune, navigate])

  useEffect(() => {
    if (fortune) loadLucky()
  }, [fortune, loadLucky])

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
      <div className="min-h-screen flex flex-col px-12 py-6">
        {/* 날짜 */}
        <p className="font-gowun text-sm text-white/40">{dateStr}</p>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-6">
          {/* 별자리 헤더 — 이름 위, 아이콘 아래 (외곽 원 없음, glow) */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-gowun text-2xl font-bold text-white">
              {meta?.name}
            </span>
            <img
              src={`/assets/zodiacs/${zodiac}.svg`}
              alt={meta?.name}
              width={160}
              height={160}
              style={{
                filter:
                  'drop-shadow(0 4px 4px #1a2144) drop-shadow(0 0 6px #71fffd55) drop-shadow(0 0 14px #71fffd22)',
              }}
            />
          </div>

          {/* 총운 — 박스 없이, 양 끝에 구슬 달린 구분선 */}
          <div className="w-full max-w-sm text-center">
            <p className="font-gowun text-sm text-white mb-3">총운</p>
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="flex-1 h-px bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <p className="font-gowun text-sm text-white leading-7">
              {fortune.summary}
            </p>
          </div>

          {/* 운세 게이지 3개 + 좌우 NavArrow (세로) */}
          <div className="flex items-center justify-center gap-10">
            <NavArrow direction="left" label="다시 선택하기" to="/select" vertical />
            <div className="flex gap-8">
              <FortuneCircle type="relationship" score={fortune.scores.relationship} />
              <FortuneCircle type="money"        score={fortune.scores.money} />
              <FortuneCircle type="work"         score={fortune.scores.work} />
            </div>
            <NavArrow direction="right" label="행운 요소 확인하기" to={`/fortune/${zodiac}/lucky`} vertical />
          </div>

          {/* CTA */}
          <GlassCard
            variant="pill"
            className="px-14 py-5"
            onClick={() => navigate(`/fortune/${zodiac}/lucky`)}
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
