// ─────────────────────────────────────────────
// ZodiacRankCard — 별자리순위 화면의 타원 카드 (Figma 1:567 ~ 1:721)
//
// 카드 타원 169.8×193 기준 좌표. 순위 숫자는 카드 위 23.5px 에 표시.
// ─────────────────────────────────────────────

import ZodiacFigmaIcon from './ZodiacFigmaIcon'
import { StageImage } from './FigmaStage'
import { CARD_BG_INSET, ZODIAC_FIGMA_ICONS } from '../constants/zodiacFigmaIcons'
import type { ZodiacMeta, ZodiacSign } from '../types'

interface Props {
  meta: ZodiacMeta
  left: number
  top: number
  onClick: (id: ZodiacSign) => void
  onHover?: (id: ZodiacSign) => void
}

export default function ZodiacRankCard({ meta, left, top, onClick, onHover }: Props) {
  const { card, frame } = ZODIAC_FIGMA_ICONS[meta.id]

  return (
    <button
      type="button"
      aria-label={`${meta.rank}위 ${meta.name}`}
      onClick={() => onClick(meta.id)}
      onMouseEnter={() => onHover?.(meta.id)}
      onFocus={() => onHover?.(meta.id)}
      className="absolute h-[192.969px] w-[169.826px] rounded-full transition-[transform,filter] duration-200 hover:-translate-y-1 hover:brightness-105 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      style={{ left, top }}
    >
      <StageImage src={`/assets/zodiacs/rank/z-card-${card}.svg`} box={[0, 0, 169.826, 192.969]} inset={CARD_BG_INSET[card]} />

      {/* 상하 장식 — 177×60.9 원본을 90° 회전해 세로 박스에 배치 */}
      <div aria-hidden className="absolute left-[55.1px] top-[8px] h-[177px] w-[60.86px]">
        <StageImage
          src={`/assets/zodiacs/rank/z-frame-${frame}.svg`}
          box={[-58.07, 58.07, 177, 60.86]}
          inset="-0.57% -0.2%"
          className="rotate-90"
        />
      </div>

      <ZodiacFigmaIcon zodiac={meta.id} />

      <span className="absolute left-[49.07px] top-[126.29px] flex h-[24.25px] w-[70.76px] items-center justify-center whitespace-nowrap text-[13px] font-bold text-zodiac-name">
        {meta.name}
      </span>
      <span className="absolute left-[58.5px] top-[148.52px] flex h-[15.15px] w-[54.72px] items-center justify-center whitespace-nowrap text-[9px] font-bold text-zodiac-date">
        ({meta.dateRange})
      </span>
      <span className="absolute left-[85px] top-[-23.5px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[24px] font-bold text-petal-highlight">
        {meta.rank}
      </span>
    </button>
  )
}
