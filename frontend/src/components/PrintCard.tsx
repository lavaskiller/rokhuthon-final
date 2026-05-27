import type { FlowerItem } from '../types'

interface Props {
  flower: FlowerItem
}

export default function PrintCard({ flower }: Props) {
  return (
    <div
      id="print-card"
      className="w-72 rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: 'rgba(255,255,255,0.95)' }}
    >
      <div className="px-8 py-8 text-center">
        <p className="font-gowun text-xs text-[#0a205c] mb-4 tracking-widest">
          별꽃노리
        </p>
        <h2 className="font-gowun text-2xl font-bold text-[#0a205c] mb-6">
          {flower.name}
        </h2>
        <div
          className="w-36 h-36 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{ border: '4px solid #c8a96e', background: '#faf5e4' }}
        >
          {flower.imageUrl ? (
            <img
              src={flower.imageUrl}
              alt={flower.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span style={{ fontSize: 48 }}>🌸</span>
          )}
        </div>
      </div>
      <div className="px-6 py-4" style={{ background: '#f5d76e' }}>
        <p className="font-gowun text-xs text-[#5c4000] leading-relaxed text-center">
          {flower.description}
        </p>
      </div>
    </div>
  )
}
