// ─────────────────────────────────────────────
// ZodiacFigmaIcon — Figma "별자리아이콘 2" (핑크 그라디언트) 조각 조합 렌더러
//
// ZODIAC_FIGMA_ICONS 의 박스 크기 그대로 그린다. 다른 크기가 필요하면 scale 로 확대/축소.
// ─────────────────────────────────────────────

import { ZODIAC_FIGMA_ICONS } from '../constants/zodiacFigmaIcons'
import type { ZodiacSign } from '../types'

interface Props {
  zodiac: ZodiacSign
  /** 박스 위치 지정 — 생략 시 카드 기준 좌표(box) 사용 */
  style?: React.CSSProperties
  className?: string
}

export default function ZodiacFigmaIcon({ zodiac, style, className = '' }: Props) {
  const { box, parts } = ZODIAC_FIGMA_ICONS[zodiac]
  const [left, top, width, height] = box

  return (
    <div aria-hidden className={`absolute ${className}`} style={{ left, top, width, height, ...style }}>
      {parts.map(([inset, file, imgInset, transform], i) => (
        <div key={i} className="absolute" style={{ inset, transform }}>
          <div className="absolute" style={{ inset: imgInset }}>
            <img src={`/assets/zodiacs/rank/${file}`} alt="" draggable={false} className="block h-full w-full max-w-none" />
          </div>
        </div>
      ))}
    </div>
  )
}
