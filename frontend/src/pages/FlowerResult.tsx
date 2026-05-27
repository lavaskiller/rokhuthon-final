// ─────────────────────────────────────────────
// FlowerResult — uiux 15: 꽃 추천 결과 화면
//
// 레이아웃:
//   AppLayout
//   └─ 상단: 헤딩 + FortuneCircle 3개 (FortuneBadge sm)
//   └─ 중단: 메인 꽃 이름/부제/설명
//   └─ 하단 3열: 꽃말 / 기대되는 행운 / 함께 두면 좋은 장소
//   └─ 서브 꽃 2개 (작은 카드)
//   └─ "꽃 출력하기 →" → /flower/:zodiac/print
//
// 라우트: /flower/:zodiac
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FortuneCircle from '../components/FortuneCircle'
import GlassCard from '../components/GlassCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FlowerResult() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { flower, selectedZodiac, fortune } = state

  useEffect(() => {
    if (!selectedZodiac || !flower) navigate('/', { replace: true })
  }, [selectedZodiac, flower, navigate])

  if (!flower || !fortune) return null

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col px-8 py-8 gap-5 overflow-y-auto">
        {/* 상단: 헤딩 + 배지 */}
        <div className="flex items-start justify-between">
          <p className="font-gowun text-sm text-white/70 max-w-[180px] leading-snug">
            오늘을 위한 꽃 추천을 해드릴게요
          </p>
          <div className="flex gap-3">
            <FortuneCircle type="relationship" score={fortune.scores.relationship} size="sm" />
            <FortuneCircle type="money"        score={fortune.scores.money}        size="sm" />
            <FortuneCircle type="work"         score={fortune.scores.work}         size="sm" />
          </div>
        </div>

        {/* 메인 꽃 */}
        <div className="text-center">
          <h2 className="font-gowun text-3xl font-bold text-white mb-1">
            {flower.main.name}
          </h2>
          <p className="font-gowun text-sm text-white/55">{flower.main.subtitle}</p>
        </div>

        {/* 설명 */}
        <GlassCard variant="rounded" className="w-full p-5">
          <p className="font-gowun text-sm text-white/90 leading-7">
            {flower.main.description}
          </p>
        </GlassCard>

        {/* 3열 정보 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard variant="rounded" className="p-4">
            <p className="font-gowun text-xs text-white/50 mb-2">꽃말</p>
            {flower.main.meanings.map((m, i) => (
              <p key={i} className="font-gowun text-xs text-white leading-5">{m}</p>
            ))}
          </GlassCard>
          <GlassCard variant="rounded" className="p-4">
            <p className="font-gowun text-xs text-white/50 mb-2">기대되는 행운</p>
            {flower.main.luckItems.map((l, i) => (
              <p key={i} className="font-gowun text-xs text-white leading-5">{l}</p>
            ))}
          </GlassCard>
          <GlassCard variant="rounded" className="p-4">
            <p className="font-gowun text-xs text-white/50 mb-2">함께 두면 좋은 장소</p>
            {flower.main.places.map((p, i) => (
              <p key={i} className="font-gowun text-xs text-white leading-5">{p}</p>
            ))}
          </GlassCard>
        </div>

        {/* 서브 꽃 2개 */}
        <div className="flex gap-3">
          {flower.subs.map((sub, i) => (
            <GlassCard key={i} variant="rounded" className="flex-1 p-4 text-center">
              <p className="font-gowun text-base font-bold text-white">{sub.name}</p>
              <p className="font-gowun text-xs text-white/50 mt-1">{sub.subtitle}</p>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <GlassCard
            variant="pill"
            className="px-8 py-3"
            onClick={() => navigate(`/flower/${zodiac}/print`)}
          >
            <span className="font-gowun text-sm text-white">꽃 출력하기 →</span>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  )
}
