// ─────────────────────────────────────────────
// Landing — Figma "표지" (1:735)
//
// 별 장식은 cover-star-sprite.webp 한 장을 크롭해 배치 (Figma 원본 크롭 비율 그대로)
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FigmaStage from '../components/FigmaStage'
import PillButton from '../components/PillButton'
import { fetchZodiacs } from '../api/client'
import { ZODIAC_RANK_ASSETS } from '../constants/zodiacFigmaIcons'
import { preloadImages } from '../utils/preloadImages'

// index.html 에서 preload — PNG 728KB → WebP 323KB
const SPRITE = '/assets/cover-star-sprite.webp'

// 매달린 별: [left, top, w, h, 이미지 w%, h%, left%, top%, 좌우반전]
const HANGING: [number, number, number, number, number, number, number, number, boolean][] = [
  [1116, -126, 53, 417, 2039.44, 195.32, -1819.86, -0.03, true],
  [279, -121, 53, 282, 2039.44, 288.83, -1387.69, -0.09, true],
  [27, -135, 53, 417, 2039.44, 195.32, -1819.86, -0.03, true],
  [799, -34, 108, 166, 1340.74, 654.22, -504.63, 0, false],
]

// 반짝이는 별: [left, top, w, h] — 뒤 6개는 작고 흐린 별 (opacity 50%)
const SPARKLES: [number, number, number, number][] = [
  [252, 156, 24, 33], [343, 370, 24, 33], [799, 144, 24, 33], [657, 197, 18, 25], [596, 41, 18, 25],
  [337, 7, 18, 25], [737, 606, 18, 25], [1113, 387, 18, 25], [940, 526, 18, 25], [131, 75, 18, 25],
  [122, 323, 18, 25], [439, 650, 18, 25], [415, 205, 24, 33],
]
const DIM_SPARKLES: [number, number, number, number][] = [
  [236, 200, 16, 22], [829, 222, 24, 33], [488, 257, 18, 25], [889, 473, 18, 25], [306, 417, 18, 25], [623, 66, 12, 17],
]

// 깜빡임 주기·지연 — 별마다 달라 동시에 깜빡이지 않도록 인덱스로 분산
const blinkTiming = (i: number) => ({ animationDuration: `${2.6 + (i % 4) * 0.45}s`, animationDelay: `${(i * 0.73) % 3}s` })

function Sparkle({ box: [left, top, width, height], dim = false, index }: { box: [number, number, number, number]; dim?: boolean; index: number }) {
  return (
    <div className={`absolute overflow-hidden mix-blend-lighten ${dim ? 'opacity-50' : ''}`} style={{ left, top, width, height }}>
      <img
        src={SPRITE}
        alt=""
        draggable={false}
        className="star-blink absolute max-w-none"
        style={{ width: '6033.33%', height: '3290.91%', left: '-2950%', top: '-406.06%', ...blinkTiming(index) }}
      />
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    fetchZodiacs().catch(() => {})
    preloadImages(ZODIAC_RANK_ASSETS)
  }, [])

  return (
    <AppLayout variant="landing">
      <FigmaStage>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {HANGING.map(([left, top, width, height, iw, ih, il, it, flip], i) => (
            <div key={i} className={`absolute overflow-hidden ${flip ? '-scale-x-100' : ''}`} style={{ left, top, width, height }}>
              <img
                src={SPRITE}
                alt=""
                draggable={false}
                className="absolute max-w-none"
                style={{ width: `${iw}%`, height: `${ih}%`, left: `${il}%`, top: `${it}%` }}
              />
            </div>
          ))}
          {SPARKLES.map((box, i) => <Sparkle key={i} box={box} index={i} />)}
          {DIM_SPARKLES.map((box, i) => <Sparkle key={i} box={box} dim index={SPARKLES.length + i} />)}
        </div>

        <div className="absolute left-[595.5px] top-1/2 flex w-[365px] -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <p className="whitespace-nowrap text-label leading-[29px]">당신에게 맞는 꽃을 추천해 드려요</p>
          <h1 className="mt-[14px] whitespace-nowrap text-display font-bold leading-[70px] drop-shadow-title">
            오늘의 별꽃 운세
          </h1>
          <PillButton label="내 별꽃 운세 보러가기" variant="cta" onClick={() => navigate('/select')} className="mt-[54px]" />
        </div>
      </FigmaStage>
    </AppLayout>
  )
}
