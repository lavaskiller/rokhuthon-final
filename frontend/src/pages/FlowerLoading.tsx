// ─────────────────────────────────────────────
// FlowerLoading — Figma "로딩1~4" (1:343 ~ 1:362)
//
// 로딩 원 안에서 꽃잎 1장 → 만개 (FlowerBloom). 애니메이션 종료 + 꽃 추천 도착 시 결과로 이동
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FigmaLoading from '../components/FigmaLoading'
import FlowerBloom from '../components/FlowerBloom'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FlowerLoading() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { selectedZodiac, flower } = state
  const isDev = import.meta.env.DEV
  const effectiveZodiac = selectedZodiac ?? (isDev ? 'aries' : null)
  const [animDone, setAnimDone] = useState(false)

  // Guard: 별자리 미선택이면 처음으로 (dev 모드 skip)
  useEffect(() => {
    if (!effectiveZodiac) navigate('/', { replace: true })
  }, [effectiveZodiac, navigate])

  useEffect(() => {
    if (!effectiveZodiac || !animDone) return
    if (flower || isDev) navigate(`/flower/${effectiveZodiac}`, { replace: true })
  }, [animDone, flower, effectiveZodiac, isDev, navigate])

  return (
    <AppLayout variant="loading">
      <FigmaLoading message="오늘의 꽃을 피우는 중이에요" label="꽃을 피우는 중">
        {/* Figma 로딩 꽃 110.9×103.8 — FlowerBloom(132×124) 을 축소해 같은 자리에 */}
        <div className="absolute left-[531.5px] top-[325.4px] origin-center scale-[0.84]">
          <FlowerBloom animated onComplete={() => setAnimDone(true)} />
        </div>
      </FigmaLoading>
    </AppLayout>
  )
}
