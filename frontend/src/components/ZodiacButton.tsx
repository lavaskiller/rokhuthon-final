import GlassCard from './GlassCard'
import type { ZodiacMeta, ZodiacSign } from '../types'

interface Props {
  meta: ZodiacMeta
  selected?: boolean
  onClick: (id: ZodiacSign) => void
}

/**
 * 별자리 선택 버튼 (uiux 2)
 * [순위] [원형 아이콘 (#71fffd border)] [이름 + 날짜범위]
 */
export default function ZodiacButton({ meta, selected, onClick }: Props) {
  return (
    <GlassCard
      variant="pill"
      className={`flex items-center gap-3 px-4 py-3 transition-all ${
        selected ? 'ring-2 ring-[#71fffd] bg-[rgba(218,249,255,0.35)]' : ''
      }`}
      onClick={() => onClick(meta.id)}
    >
      {/* 순위 번호 */}
      <span className="w-5 shrink-0 text-center font-gowun text-sm text-white/50">
        {meta.rank}
      </span>

      {/* 별자리 아이콘 */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#71fffd]">
        <img
          src={meta.iconUrl}
          alt={meta.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // 아이콘 없을 때 첫 글자 표시
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* 별자리 이름 + 날짜 */}
      <div className="flex flex-col">
        <span className="font-gowun text-base text-white">{meta.name}</span>
        <span className="font-gowun text-xs text-white/50">{meta.dateRange}</span>
      </div>
    </GlassCard>
  )
}
