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
      <div className="h-full flex flex-col px-12 py-6 gap-4">
        {/* 상단: 헤딩 + 운세 배지 */}
        <div className="flex items-center justify-between">
          <p className="font-gowun text-sm text-white/70">
            오늘을 위한 꽃 추천을 해드릴게요
          </p>
          <div className="flex gap-4">
            <FortuneCircle type="relationship" score={fortune.scores.relationship} size="sm" />
            <FortuneCircle type="money"        score={fortune.scores.money}        size="sm" />
            <FortuneCircle type="work"         score={fortune.scores.work}         size="sm" />
          </div>
        </div>

        {/* 메인 꽃 카드 — 가로 분할 */}
        <GlassCard variant="rounded" className="flex-1 flex flex-row min-h-0 overflow-hidden">
          {/* 이미지 영역 */}
          <div className="w-56 shrink-0 flex items-center justify-center p-6 border-r border-white/10">
            {flower.main.imageUrl ? (
              <img
                src={flower.main.imageUrl}
                alt={flower.main.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-6xl">🌸</span>
            )}
          </div>

          {/* 텍스트 영역 */}
          <div className="flex-1 flex flex-col gap-3 p-6 overflow-auto">
            <div>
              <h2 className="font-gowun text-2xl font-bold text-white">{flower.main.name}</h2>
              <p className="font-gowun text-sm text-white/55 mt-1">{flower.main.subtitle}</p>
            </div>
            <p className="font-gowun text-sm text-white/90 leading-7">{flower.main.description}</p>
            <div className="grid grid-cols-3 gap-3 mt-auto">
              <div>
                <p className="font-gowun text-xs text-white/50 mb-1">꽃말</p>
                {flower.main.meanings.map((m, i) => (
                  <p key={i} className="font-gowun text-xs text-white leading-5">{m}</p>
                ))}
              </div>
              <div>
                <p className="font-gowun text-xs text-white/50 mb-1">기대되는 행운</p>
                {flower.main.luckItems.map((l, i) => (
                  <p key={i} className="font-gowun text-xs text-white leading-5">{l}</p>
                ))}
              </div>
              <div>
                <p className="font-gowun text-xs text-white/50 mb-1">함께 두면 좋은 장소</p>
                {flower.main.places.map((p, i) => (
                  <p key={i} className="font-gowun text-xs text-white leading-5">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 하단: 서브 꽃 + CTA */}
        <div className="flex items-center gap-3">
          {flower.subs.map((sub, i) => (
            <GlassCard key={i} variant="rounded" className="flex-1 py-3 px-4 text-center">
              <p className="font-gowun text-base font-bold text-white">{sub.name}</p>
              <p className="font-gowun text-xs text-white/50 mt-1">{sub.subtitle}</p>
            </GlassCard>
          ))}
          <GlassCard
            variant="pill"
            className="px-8 py-3 shrink-0"
            onClick={() => navigate(`/flower/${zodiac}/print`)}
          >
            <span className="font-gowun text-sm text-white">꽃 출력하기 →</span>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  )
}
