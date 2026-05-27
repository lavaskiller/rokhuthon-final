import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LoadingArc from '../components/LoadingArc'
import ZodiacIconPlaceholder from '../components/ZodiacIconPlaceholder'
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
  const [minTimePassed, setMinTimePassed] = useState(false)
  const [msgIndex] = useState(() => Math.floor(Math.random() * LOADING_MESSAGES.length))

  useEffect(() => {
    if (!selectedZodiac) navigate('/', { replace: true })
  }, [selectedZodiac, navigate])

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (selectedZodiac && !isLoadingFortune && fortune && minTimePassed) {
      navigate(`/fortune/${selectedZodiac}`, { replace: true })
    }
  }, [selectedZodiac, isLoadingFortune, fortune, minTimePassed, navigate])

  const today = new Date()
  const dateStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('. ')

  const ARC_SIZE = 180

  return (
    <AppLayout variant="loading" starOpacity={0.4}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        {/* 날짜 — 좌상단 */}
        <p className="absolute top-8 left-10 font-gowun text-xl text-white/85">
          {dateStr}
        </p>

        {/* 회전 arc + 별자리 아이콘 */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: ARC_SIZE, height: ARC_SIZE }}
          role="status"
          aria-label="운세를 불러오는 중"
        >
          <LoadingArc size={ARC_SIZE} />
          <ZodiacIconPlaceholder
            size={Math.round(ARC_SIZE * 0.42)}
            className="absolute text-[#71FFFD]"
          />
        </div>

        {/* 로딩 메시지 */}
        <p className="mt-12 font-gowun text-2xl text-white">
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>
    </AppLayout>
  )
}
