// ─────────────────────────────────────────────
// FortuneResult — Figma "오늘의운세" (1:369)
//
// 레이더(관계/금전/업무) + 총운. "행운의 꽃 확인" → 꽃 추천 로드 후 꽃 로딩 화면
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FigmaStage, { StageImage } from '../components/FigmaStage'
import PillButton from '../components/PillButton'
import RadarChart from '../components/RadarChart'
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
  const { state, loadFlower } = useFortuneFlow()
  const { fortune: fortuneFromState, selectedZodiac } = state
  const isDev = import.meta.env.DEV
  const fortune = fortuneFromState ?? (isDev ? MOCK_FORTUNE : null)

  useEffect(() => {
    if (isDev) return
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [isDev, selectedZodiac, fortune, navigate])

  if (!fortune || !zodiac) return null

  const meta = getZodiacMeta(zodiac as ZodiacSign)

  const handleFlowerCTA = () => {
    void loadFlower()
    navigate('/loading/flower')
  }

  return (
    <AppLayout>
      <FigmaStage>
        <h1 className="absolute left-0 right-0 top-[74.5px] text-center text-title font-bold leading-[40px]">
          {meta?.name} 오늘의 운세
        </h1>

        <RadarChart scores={fortune.scores} />

        {/* 총운 */}
        <StageImage src="/assets/fortune/f-glow.svg" box={[374, 659, 446, 99]} inset="-36.57% -8.12%" />
        <p className="absolute left-[573.5px] top-[610.5px] w-[48px] text-center text-button font-bold leading-[48px] text-white/90">총운</p>
        <StageImage src="/assets/fortune/f-line.svg" box={[390, 665.5, 415, 0]} inset="-2.17px -0.52%" />
        <p className="absolute left-[297px] top-[711.5px] w-[600px] -translate-y-1/2 whitespace-pre-line break-keep text-center text-[16px] font-bold leading-[2]">
          {fortune.summary.replace(/\.(?!\n)/g, '.\n').trim()}
        </p>

        <PillButton label="이전화면" variant="secondary" icon="left" to="/select" className="absolute left-[56px] top-[709.5px]" />
        <PillButton label="행운의 꽃 확인" onClick={handleFlowerCTA} className="absolute left-[876px] top-[709.5px]" />
      </FigmaStage>
    </AppLayout>
  )
}
