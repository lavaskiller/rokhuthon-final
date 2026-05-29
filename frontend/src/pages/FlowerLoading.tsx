import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FlowerBloom from '../components/FlowerBloom'
import LoadingArc from '../components/LoadingArc'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FlowerLoading() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { selectedZodiac, flower, fortune } = state
  const [animDone, setAnimDone] = useState(false)

  // Guard: 별자리 미선택 또는 운세 결과 없으면 처음으로
  useEffect(() => {
    if (!selectedZodiac || !fortune) navigate('/', { replace: true })
  }, [selectedZodiac, fortune, navigate])

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

  const ARC_SIZE = 220

  return (
    <AppLayout variant="loading" starOpacity={0.4}>
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* 날짜 — 좌상단 (Figma: 20px, white/85) */}
        <p className="absolute top-8 left-10 font-gowun text-xl text-white/85">
          {dateStr}
        </p>

        {/* 중앙: 회전 arc + 꽃 개화 그래픽 */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: ARC_SIZE, height: ARC_SIZE }}
          role="status"
          aria-label="꽃을 피우는 중"
        >
          <LoadingArc size={ARC_SIZE} showInner={false} />
          <div className="absolute inset-0 flex items-center justify-center">
            <FlowerBloom animated onComplete={() => setAnimDone(true)} />
          </div>
        </div>

        {/* 메시지 (Figma: 28px white) */}
        <p className="mt-12 font-gowun text-2xl text-white">
          오늘의 꽃을 피우는 중이에요
        </p>
      </div>
    </AppLayout>
  )
}
