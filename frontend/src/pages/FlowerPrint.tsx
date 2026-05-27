// ─────────────────────────────────────────────
// FlowerPrint — uiux 16: 꽃 출력 카드 화면
//
// 레이아웃:
//   AppLayout
//   └─ 좌측: PrintCard (흰 배경 + 꽃 이름 + 이미지 + 노란 하단 띠)
//   └─ 우측: "출력하기 →" 버튼
//
// 동작:
//   "출력하기" 클릭 → window.print()
//   @media print: #print-card만 표시
//
// 라우트: /flower/:zodiac/print
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import GlassCard from '../components/GlassCard'
import PrintCard from '../components/PrintCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FlowerPrint() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { flower, selectedZodiac } = state

  useEffect(() => {
    if (!selectedZodiac || !flower) navigate('/', { replace: true })
  }, [selectedZodiac, flower, navigate])

  if (!flower) return null

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center gap-8 px-8">
        <PrintCard flower={flower.main} />

        {/* 출력 버튼 */}
        <GlassCard
          variant="pill"
          className="px-8 py-4"
          onClick={() => window.print()}
        >
          <span className="font-gowun text-base text-white">출력하기 →</span>
        </GlassCard>
      </div>
    </AppLayout>
  )
}
