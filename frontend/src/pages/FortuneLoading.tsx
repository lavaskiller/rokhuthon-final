// ─────────────────────────────────────────────
// FortuneLoading — uiux 3: 운세 로딩 화면
//
// 레이아웃:
//   AppLayout (starOpacity=0.40)
//   └─ 좌상단: 날짜 텍스트 "YYYY. MM. DD"
//   └─ 중앙: LoadingArc
//   └─ 하단 텍스트: "별의 흐름을 읽는 중이에요…"
//
// 동작:
//   selectedZodiac 없으면 / 리다이렉트
//   isLoadingFortune=false && fortune 있으면 /fortune/:zodiac 이동
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LoadingArc from '../components/LoadingArc'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FortuneLoading() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { selectedZodiac, isLoadingFortune, fortune } = state

  // Guard: 직접 URL 접근 방지
  useEffect(() => {
    if (!selectedZodiac) navigate('/', { replace: true })
  }, [selectedZodiac, navigate])

  // API 완료 → 결과 화면으로 이동
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

  return (
    <AppLayout starOpacity={0.4}>
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* 날짜 */}
        <p className="absolute top-8 left-16 font-gowun text-sm text-white/40">
          {dateStr}
        </p>

        <LoadingArc size={160} />

        <p className="mt-10 font-gowun text-base text-white/70">
          별의 흐름을 읽는 중이에요…
        </p>
      </div>
    </AppLayout>
  )
}
