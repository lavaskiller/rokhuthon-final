// ─────────────────────────────────────────────
// FortuneLoading — 운세 로딩 (Figma 로딩 레이아웃 + 선택한 별자리 아이콘)
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FigmaLoading, { RING_CENTER } from '../components/FigmaLoading'
import ZodiacFigmaIcon from '../components/ZodiacFigmaIcon'
import { ZODIAC_FIGMA_ICONS } from '../constants/zodiacFigmaIcons'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

const LOADING_MESSAGES = [
  '별의 흐름을 읽는 중이에요…',
  '당신에게 닿을 운세를 찾고 있어요.',
  '밤하늘에서 행운을 수집하는 중…',
  '별과 행성이 정렬되는 중…',
  '오늘을 우주에서 불러오는 중…',
  '오늘의 행운 좌표를 계산 중이에요.',
  '당신의 별자리를 따라가는 중…',
]

export default function FortuneLoading() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { selectedZodiac, isLoadingFortune, fortune } = state
  const isDev = import.meta.env.DEV
  const effectiveZodiac = selectedZodiac ?? (isDev ? 'aries' : null)
  const [minTimePassed, setMinTimePassed] = useState(false)
  const [msgIndex] = useState(() => Math.floor(Math.random() * LOADING_MESSAGES.length))

  useEffect(() => {
    if (!effectiveZodiac) navigate('/', { replace: true })
  }, [effectiveZodiac, navigate])

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!effectiveZodiac || !minTimePassed) return
    if (fortune && !isLoadingFortune) {
      navigate(`/fortune/${effectiveZodiac}`, { replace: true })
    } else if (isDev && !isLoadingFortune) {
      // dev: API 없어도 mock 데이터로 다음 화면 진행
      navigate(`/fortune/${effectiveZodiac}`, { replace: true })
    }
  }, [effectiveZodiac, isLoadingFortune, fortune, minTimePassed, isDev, navigate])

  if (!effectiveZodiac) return null
  const { box: [, , w, h], shiftY = 0 } = ZODIAC_FIGMA_ICONS[effectiveZodiac]

  return (
    <AppLayout variant="loading">
      <FigmaLoading message={LOADING_MESSAGES[msgIndex]} label="운세를 불러오는 중">
        <ZodiacFigmaIcon zodiac={effectiveZodiac} style={{ left: RING_CENTER[0] - w / 2, top: RING_CENTER[1] - h / 2 + shiftY }} />
      </FigmaLoading>
    </AppLayout>
  )
}
