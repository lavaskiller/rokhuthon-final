import GlassCard from './GlassCard'
import type { FlowerItem } from '../types'

interface Props {
  flower: FlowerItem
}

export default function FlowerCard({ flower }: Props) {
  return (
    <>
      <div className="text-center">
        <h2 className="font-gowun text-3xl font-bold text-white mb-1">
          {flower.name}
        </h2>
        <p className="font-gowun text-sm text-white/55">{flower.subtitle}</p>
      </div>

      <GlassCard variant="rounded" className="w-full p-5">
        <p className="font-gowun text-sm text-white/90 leading-7">
          {flower.description}
        </p>
      </GlassCard>

      <div className="grid grid-cols-3 gap-3">
        <GlassCard variant="rounded" className="p-4">
          <p className="font-gowun text-xs text-white/50 mb-2">꽃말</p>
          {flower.meanings.map((m, i) => (
            <p key={i} className="font-gowun text-xs text-white leading-5">{m}</p>
          ))}
        </GlassCard>
        <GlassCard variant="rounded" className="p-4">
          <p className="font-gowun text-xs text-white/50 mb-2">기대되는 행운</p>
          {flower.luckItems.map((l, i) => (
            <p key={i} className="font-gowun text-xs text-white leading-5">{l}</p>
          ))}
        </GlassCard>
        <GlassCard variant="rounded" className="p-4">
          <p className="font-gowun text-xs text-white/50 mb-2">함께 두면 좋은 장소</p>
          {flower.places.map((p, i) => (
            <p key={i} className="font-gowun text-xs text-white leading-5">{p}</p>
          ))}
        </GlassCard>
      </div>
    </>
  )
}
