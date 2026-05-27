import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FlowerBloom from '../components/FlowerBloom'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FlowerLoading() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { selectedZodiac, flower } = state
  const [animDone, setAnimDone] = useState(false)

  useEffect(() => {
    if (!selectedZodiac) navigate('/', { replace: true })
  }, [selectedZodiac, navigate])

  useEffect(() => {
    if (animDone && flower && selectedZodiac) {
      navigate(`/flower/${selectedZodiac}`, { replace: true })
    }
  }, [animDone, flower, selectedZodiac, navigate])

  const today = new Date()
  const dateStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('. ')

  return (
    <AppLayout starOpacity={0.4}>
      <div className="h-full flex flex-col items-center justify-center">
        {/* 날짜 */}
        <p className="absolute top-8 left-10 font-gowun text-sm text-white/40">
          {dateStr}
        </p>

        <FlowerBloom animated onComplete={() => setAnimDone(true)} />

        <p className="mt-6 font-gowun text-base text-white/70">
          오늘의 꽃을 피우는 중이에요
        </p>
      </div>
    </AppLayout>
  )
}
