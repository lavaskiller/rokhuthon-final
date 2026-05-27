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
        {/* 출력 카드 */}
        <div
          id="print-card"
          className="w-72 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.95)' }}
        >
          {/* 상단: 흰 영역 */}
          <div className="px-8 py-8 text-center">
            <p className="font-gowun text-xs text-[#0a205c] mb-4 tracking-widest">
              별꽃노리
            </p>
            <h2 className="font-gowun text-2xl font-bold text-[#0a205c] mb-6">
              {flower.main.name}
            </h2>
            {/* 꽃 이미지 영역 */}
            <div
              className="w-36 h-36 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{
                border: '4px solid #c8a96e',
                background: '#faf5e4',
              }}
            >
              {flower.main.imageUrl ? (
                <img
                  src={flower.main.imageUrl}
                  alt={flower.main.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span style={{ fontSize: 48 }}>🌸</span>
              )}
            </div>
          </div>

          {/* 하단 노란 띠 */}
          <div className="px-6 py-4" style={{ background: '#f5d76e' }}>
            <p className="font-gowun text-xs text-[#5c4000] leading-relaxed text-center">
              {flower.main.description}
            </p>
          </div>
        </div>

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
