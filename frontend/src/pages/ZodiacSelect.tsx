// ─────────────────────────────────────────────
// ZodiacSelect — Figma "별자리순위" (1:556)
//
// 오늘의 순위(서버 /zodiacs, 날짜 기반) 순서대로 6×2 카드 배치
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FigmaStage, { StageImage } from '../components/FigmaStage'
import ZodiacRankCard from '../components/ZodiacRankCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import { fetchZodiacs } from '../api/client'
import { ZODIAC_LIST } from '../constants/zodiacs'
import type { ZodiacMeta, ZodiacSign } from '../types'

// 카드 그리드 (Figma 카드 타원 좌상단)
const CARD_LEFT = 42.99
const CARD_GAP_X = 187.83
const ROW_TOP = [251, 508]

export default function ZodiacSelect() {
  const navigate = useNavigate()
  const { selectZodiac, prefetchFortune } = useFortuneFlow()
  const [zodiacs, setZodiacs] = useState<ZodiacMeta[]>(() =>
    ZODIAC_LIST.map((z, i) => ({ ...z, rank: i + 1 }))
  )

  useEffect(() => {
    fetchZodiacs().then(setZodiacs).catch(() => {})
  }, [])

  const handleSelect = async (id: ZodiacSign) => {
    const cached = await selectZodiac(id)
    navigate(cached ? `/fortune/${id}` : '/loading/fortune')
  }

  const ranked = [...zodiacs].sort((a, b) => a.rank - b.rank)

  return (
    <AppLayout>
      <FigmaStage>
        <div aria-hidden className="absolute left-0 top-0 h-[511px] w-[1194px] bg-gradient-to-b from-zodiac-fade to-zodiac-fade-end opacity-50" />

        <header>
          <StageImage src="/assets/zodiacs/rank/z-line-l.svg" box={[325, 112.5, 129.5, 0]} inset="-2.17px -1.67% -2.17px 0" className="rotate-180" />
          <StageImage src="/assets/zodiacs/rank/z-line-r.svg" box={[737.5, 112.5, 129.5, 0]} inset="-2.17px -1.67% -2.17px 0" />
          <h1 className="absolute left-[485.5px] right-[487.5px] top-[112.5px] -translate-y-1/2 whitespace-nowrap text-center text-[28px] font-bold">
            오늘의 별자리 순위
          </h1>
          <StageImage src="/assets/zodiacs/rank/z-subtitle-glow.svg" box={[469, 148, 257, 51]} inset="-61.76% -12.26%" />
          <p className="absolute left-[596.5px] top-[170.5px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-label text-white/85">
            당신의 별자리를 선택하세요
          </p>
        </header>

        <ul aria-label="별자리 선택">
          {ranked.map((z, i) => (
            <li key={z.id}>
              <ZodiacRankCard
                meta={z}
                left={CARD_LEFT + (i % 6) * CARD_GAP_X}
                top={ROW_TOP[Math.floor(i / 6)]}
                onClick={handleSelect}
                onHover={prefetchFortune}
              />
            </li>
          ))}
        </ul>
      </FigmaStage>
    </AppLayout>
  )
}
