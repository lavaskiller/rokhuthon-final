// ─────────────────────────────────────────────
// FlowerPrint — Figma "리디자인05" 출력 화면 (1:532 / 1:540 / 1:548)
//
// PrintCard(오늘 날짜 포함)를 Figma 카드 자리(289×521)에 맞춰 축소 표시, "출력하기" → window.print()
// 15초 후 자동으로 처음 화면 복귀 (키오스크)
// ─────────────────────────────────────────────

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import FigmaStage from '../components/FigmaStage'
import PillButton from '../components/PillButton'
import PrintCard from '../components/PrintCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import type { FlowerResult } from '../types'

const MOCK_FLOWER: FlowerResult = {
  main: {
    name: '거베라',
    englishName: 'Gerbera',
    fortuneType: 'work',
    subtitle: '업무운을 담은 꽃',
    imageUrl: '/assets/flowers/gerbera.png',
    description: '언제나 긍정적인 에너지가\n당신의 하루를 환하게 밝혀줄 거예요.\n앞으로 나아가는 발걸음마다\n따뜻한 응원이 함께할 거예요.',
    meanings: ['긍정적인 에너지', '앞으로 나아가는 힘', '밝은 성취'],
    luckItems: ['인정받는 성과', '팀워크 향상', '새로운 기회 포착'],
    places: ['책상 위', '사무실 창가', '회의실'],
  },
  subs: [
    { name: '', fortuneType: 'money', subtitle: '', description: '', meanings: [], luckItems: [], places: [] },
    { name: '', fortuneType: 'relationship', subtitle: '', description: '', meanings: [], luckItems: [], places: [] },
  ],
}

// Figma 카드 자리
const CARD_BOX = { left: 452, top: 151.5, width: 289, height: 521 }

// 인쇄 용지 104×189mm (index.css @page) 를 CSS px(96dpi) 로 환산
const MM = 96 / 25.4
const PRINT_PAGE = { width: 104 * MM, height: 189 * MM }

export default function FlowerPrint() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const isDev = import.meta.env.DEV

  const flower = state.flower ?? (isDev ? MOCK_FLOWER : null)
  const { selectedZodiac } = state
  const [countdown, setCountdown] = useState(15)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardScale, setCardScale] = useState(CARD_BOX.width / 392)

  useEffect(() => {
    if (isDev) return
    if (!selectedZodiac || !state.flower) navigate('/', { replace: true })
  }, [isDev, selectedZodiac, state.flower, navigate])

  useEffect(() => {
    if (countdown <= 0) { navigate('/'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, navigate])

  // PrintCard(392px 폭) 를 Figma 카드 자리에 맞게 축소 — 설명 길이에 따라 높이가 달라지므로 측정
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const fit = () => {
      setCardScale(Math.min(CARD_BOX.width / el.offsetWidth, CARD_BOX.height / el.offsetHeight))
      // 인쇄용 축소 비율 — index.css @media print 의 #print-card 가 사용
      const printScale = Math.min(1, PRINT_PAGE.width / el.offsetWidth, PRINT_PAGE.height / el.offsetHeight)
      document.documentElement.style.setProperty('--print-scale', String(printScale))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--print-scale')
    }
  }, [flower])

  if (!flower) return null

  return (
    <AppLayout>
      <FigmaStage>
        <h1 className="absolute left-0 right-0 top-[74.5px] text-center text-title font-bold leading-[40px]">
          오늘의 행운의 꽃
        </h1>

        <div className="absolute flex items-center justify-center" style={CARD_BOX}>
          <div ref={cardRef} className="shrink-0 print:![transform:none]" style={{ transform: `scale(${cardScale})` }}>
            <PrintCard flower={flower.main} />
          </div>
        </div>

        <PillButton label="출력하기" onClick={() => window.print()} className="absolute left-[466px] top-[709.5px]" />

        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute bottom-[28px] right-[40px] flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <span>처음으로</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-xs tabular-nums">
            {countdown}
          </span>
        </button>
      </FigmaStage>
    </AppLayout>
  )
}
