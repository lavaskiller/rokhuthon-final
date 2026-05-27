import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LoadingArc from '../components/LoadingArc'
import ZodiacIconPlaceholder from '../components/ZodiacIconPlaceholder'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FortuneLoading() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { selectedZodiac, isLoadingFortune, fortune } = state

  useEffect(() => {
    if (!selectedZodiac) navigate('/', { replace: true })
  }, [selectedZodiac, navigate])

  useEffect(() => {
    if (selectedZodiac && !isLoadingFortune && fortune) {
      navigate(`/fortune/${selectedZodiac}`, { replace: true })
    }
  }, [selectedZodiac, isLoadingFortune, fortune, navigate])

  const today = new Date()
  const dateStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('. ')

  const ARC_SIZE = 180

  return (
    <AppLayout starOpacity={0.4}>
      <div className="h-full flex flex-col items-center justify-center">
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
          별의 흐름을 읽는 중이에요…
        </p>
      </div>
    </AppLayout>
  )
}
