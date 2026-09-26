import type { FlowerItem } from '../types'

interface Props {
  flower: FlowerItem
  date?: string
}

// Figma "리디자인05" 출력 종이 — 직사각형 흰 종이, 검정 텍스트·장식, 회색 구분선
// 크기는 인쇄 용지(104×189mm) 비율 고정 — 남는 높이는 꽃 이미지 영역이 채움
const Divider = () => <hr className="mx-4 border-t border-[#999]" />

// ✽ 장식 — 폰트마다 글리프 굵기가 달라 SVG 로 고정 (중심으로 가늘어지는 물방울 꽃잎 5장)
const Florette = ({ size }: { size: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="-12 -12 24 24" className="inline-block shrink-0">
    {[0, 72, 144, 216, 288].map(deg => (
      <path key={deg} transform={`rotate(${deg})`} d="M0 -1.5 C-4.2 -5.5 -4.4 -11.5 0 -11.5 C4.4 -11.5 4.2 -5.5 0 -1.5Z" fill="currentColor" />
    ))}
  </svg>
)

export default function PrintCard({ flower, date }: Props) {
  const today = new Date()
  const displayDate = date ?? [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('  .  ')

  return (
    <div
      id="print-card"
      className="flex h-[712px] w-[392px] flex-col overflow-hidden font-gowun text-[#1a1a1a] shadow-2xl"
      style={{ background: '#ffffff' }}
    >
      {/* 상단 브랜드 */}
      <p className="pt-2 text-center text-[12px]">papernori</p>

      {/* 타이틀 */}
      <h2 className="flex items-center justify-center gap-3 pb-6 pt-5 text-[25px] leading-none">
        <Florette size={28} />
        당신의 행운의 꽃은?
        <Florette size={28} />
      </h2>

      <Divider />

      {/* 꽃 이름 */}
      <div className="py-3 text-center">
        <p className="text-[24px] font-bold leading-tight">{flower.name}</p>
        {flower.englishName && <p className="mt-1 text-[12px] text-[#444]">{flower.englishName}</p>}
      </div>

      <Divider />

      {/* 꽃 이미지 — 투명배경 PNG, 프레임 없음 */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        {flower.imageUrl && (
          <picture>
            <source srcSet={flower.imageUrl.replace(/\.png$/, '.webp')} type="image/webp" />
            <img src={flower.imageUrl} alt={flower.name} className="h-full max-h-48 w-48 object-contain" />
          </picture>
        )}
      </div>

      <Divider />

      {/* 설명 */}
      <p className="whitespace-pre-line break-keep px-6 pt-5 text-center text-[16px] leading-[1.7] text-[#333]">
        {flower.description}
      </p>

      {/* 꽃 구분자 */}
      <div className="flex justify-center py-4"><Florette size={20} /></div>

      {/* 샵 메시지 */}
      <p className="pb-6 text-center text-[15px] font-bold">가게에서 당신의 행운의 꽃을 찾아보세요!</p>

      <Divider />

      {/* 날짜 */}
      <p className="whitespace-pre py-5 text-center text-[13px]">{displayDate}</p>

      {/* 하단 브랜드 */}
      <p className="pb-3 pt-2 text-center text-[12px]">papernori</p>
    </div>
  )
}
