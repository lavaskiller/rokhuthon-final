// ─────────────────────────────────────────────
// FlowerCard — 꽃 추천 메인 카드 (uiux 15)
//
// 구조 (Figma 매칭):
//   1. 메인 꽃 영역 — 가로 글래스 pill
//      · 좌측: 회색 원 placeholder (꽃 이미지 자리)
//      · 우측: 꽃 이름 + 부제 + 설명
//   2. 하단 3개 카드 — 꽃말 / 기대되는 행운 / 함께 두면 좋은 장소
// ─────────────────────────────────────────────

import type { FlowerItem } from '../types'

interface Props {
  flower: FlowerItem
}

export default function FlowerCard({ flower }: Props) {
  return (
    <>
      {/* 메인 꽃 영역 — 덜 둥글게 (rounded-[72px]), bg 더 투명 */}
      <section
        className="flex h-[160px] items-center rounded-[72px] pl-0 pr-14 backdrop-blur-md"
        style={{
          background:
            'linear-gradient(90deg, rgba(118,171,200,0.32) 0%, rgba(50,93,141,0.32) 100%)',
        }}
      >
        {/* 좌측: 회색 oval placeholder (pill 과 동일 corner) */}
        <div className="h-full w-[224px] shrink-0 overflow-hidden rounded-[72px] bg-[#8F8F8F]/60">
          {flower.imageUrl && (
            <img
              src={flower.imageUrl}
              alt={flower.name}
              className="h-full w-full object-cover"
              draggable={false}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
        </div>

        {/* 우측: 꽃 정보 — 작은 텍스트 + 부제 인라인 */}
        <div className="flex-1 pl-10">
          {/* 꽃 이름 (노랑) + 부제 (회색, 살짝 작게, gap 넓힘) 한 줄 inline */}
          <div className="mb-2 flex items-baseline gap-5">
            <h2 className="font-gowun text-2xl font-bold leading-none text-[#FFF16E]">
              {flower.name}
            </h2>
            <p className="font-gowun text-base text-white/55">{flower.subtitle}</p>
          </div>
          {/* 설명 */}
          <p className="whitespace-pre-line font-gowun text-sm leading-snug text-white">
            {flower.description}
          </p>
        </div>
      </section>

      {/* 하단 3개 정보 카드 — 더 넓게(gap-3), 덜 둥글게(rounded-3xl) */}
      <section className="grid grid-cols-3 gap-3">
        <InfoCard title="꽃말" items={flower.meanings} />
        <InfoCard title="기대되는 행운" items={flower.luckItems} />
        <InfoCard title="함께 두면 좋은 장소" items={flower.places} />
      </section>
    </>
  )
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    // Figma 그라디언트 navy → 보라, rounded-3xl (24px) — 덜 둥글게, 더 넓게
    <div
      className="rounded-3xl px-7 py-6 backdrop-blur-md"
      style={{
        background:
          'linear-gradient(90deg, rgba(0,32,117,0.42) 0%, rgba(88,58,142,0.42) 100%)',
      }}
    >
      <p className="mb-4 font-gowun text-sm text-white/85">✦ {title} ✦</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 font-gowun text-sm text-white">
            <span
              className="h-[3px] w-[3px] shrink-0 rounded-full bg-white"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
