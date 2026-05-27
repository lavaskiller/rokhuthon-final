// ─────────────────────────────────────────────
// FlowerLoading — uiux 11~14: 꽃 로딩 화면
//
// 레이아웃:
//   AppLayout (starOpacity=0.40)
//   └─ 중앙: FlowerBloom (animated=true, 25→50→75→100%, 각 800ms)
//   └─ 하단: "오늘의 꽃을 피우는 중이에요"
//
// 동작:
//   애니메이션 완료 + flower 데이터 수신 시 /flower/:zodiac 이동
//   데이터가 먼저 도착하면 애니메이션 완료 대기, 반대도 마찬가지
//
// 라우트: /loading/flower
// ─────────────────────────────────────────────

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

  // Guard
  useEffect(() => {
    if (!selectedZodiac) navigate('/', { replace: true })
  }, [selectedZodiac, navigate])

  // 애니메이션 완료 AND 데이터 수신 → 결과 화면
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
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* 날짜 */}
        <p className="absolute top-8 left-16 font-gowun text-sm text-white/40">
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
