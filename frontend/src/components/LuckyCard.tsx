// ─────────────────────────────────────────────
// LuckyCard — 행운 요소 카드 (장소 / 행동 / 색상)
//
// uiux 8/9/10 LuckyElements 화면에서 3개 가로 나열
// 외형: 글래스 카드 + 카테고리 레이블 + 내용 텍스트
// ─────────────────────────────────────────────

import GlassCard from './GlassCard'

interface Props {
  category: '장소' | '행동' | '색상'
  content: string
}

export default function LuckyCard({ category, content }: Props) {
  return (
    <GlassCard
      variant="rounded"
      className="flex flex-col items-center justify-center px-5 py-6 gap-3 min-w-[96px]"
    >
      <span className="font-gowun text-xs text-white/55 whitespace-nowrap">
        ✦ {category} ✦
      </span>
      <p className="font-gowun text-sm text-white text-center leading-snug">{content}</p>
    </GlassCard>
  )
}
