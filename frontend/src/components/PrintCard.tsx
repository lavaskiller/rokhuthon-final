import type { FlowerItem } from '../types'

interface Props {
  flower: FlowerItem
  date?: string
}

export default function PrintCard({ flower, date }: Props) {
  const today = new Date()
  const displayDate = date ?? [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join(' . ')

  return (
    <div
      id="print-card"
      className="w-[300px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      style={{ background: '#ffffff' }}
    >
      {/* 상단 브랜드 */}
      <div className="pt-5 pb-2 text-center">
        <p className="font-gowun text-[11px] tracking-[0.3em] text-[#999]">papernori</p>
      </div>

      {/* 타이틀 */}
      <div className="px-6 pb-3 text-center">
        <h2 className="font-gowun text-lg font-bold text-[#1a1a1a]">
          ✿ 당신의 행운의 꽃은? ✿
        </h2>
      </div>

      {/* 구분선 */}
      <hr className="mx-6 border-t border-[#ddd]" />

      {/* 꽃 이름 */}
      <div className="px-6 py-4 text-center">
        <p className="font-gowun text-2xl font-bold text-[#1a1a1a] mb-1">{flower.name}</p>
        {flower.englishName && (
          <p className="font-gowun text-xs text-[#888]">{flower.englishName}</p>
        )}
      </div>

      {/* 구분선 */}
      <hr className="mx-6 border-t border-[#ddd]" />

      {/* 꽃 이미지 — 투명배경 PNG, 프레임 없음 */}
      <div className="flex items-center justify-center py-6 px-6">
        {flower.imageUrl && (
          <img
            src={flower.imageUrl}
            alt={flower.name}
            className="w-36 h-36 object-contain"
          />
        )}
      </div>

      {/* 구분선 */}
      <hr className="mx-6 border-t border-[#ddd]" />

      {/* 설명 */}
      <div className="px-6 py-5 text-center">
        <p className="font-gowun text-xs text-[#444] leading-relaxed whitespace-pre-line">
          {flower.description}
        </p>
      </div>

      {/* 꽃 구분자 */}
      <div className="text-center text-[#bbb] text-lg pb-2">✿</div>

      {/* 샵 메시지 */}
      <div className="px-6 pb-4 text-center">
        <p className="font-gowun text-xs font-bold text-[#555]">
          가게에서 당신의 행운의 꽃을 찾아보세요!
        </p>
      </div>

      {/* 날짜 */}
      <div className="text-center pb-3">
        <p className="font-gowun text-[11px] text-[#aaa]">{displayDate}</p>
      </div>

      {/* 하단 브랜드 */}
      <div className="pb-5 text-center">
        <p className="font-gowun text-[11px] tracking-[0.3em] text-[#999]">papernori</p>
      </div>
    </div>
  )
}
