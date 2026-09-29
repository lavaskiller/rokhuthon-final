// ─────────────────────────────────────────────
// FlowerPrint — Figma "리디자인05" 출력 화면 (1:532 / 1:540 / 1:548)
//
// PrintCard(오늘 날짜 포함)를 Figma 카드 자리(289×521)에 맞춰 축소 표시
// "출력하기" → Paperang 에이전트(라즈베리파이)로 전송, 미설정 시 window.print() — utils/printCard
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
import { printCard } from '../utils/printCard'

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
export default function FlowerPrint() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const isDev = import.meta.env.DEV

  const flower = state.flower ?? (isDev ? MOCK_FLOWER : null)
  const { selectedZodiac } = state
  const [countdown, setCountdown] = useState(15)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardScale, setCardScale] = useState(CARD_BOX.width / 392)
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'done' | 'error'>('idle')
  const [printError, setPrintError] = useState('')

  useEffect(() => {
    if (isDev) return
    if (!selectedZodiac || !state.flower) navigate('/', { replace: true })
  }, [isDev, selectedZodiac, state.flower, navigate])

  useEffect(() => {
    if (printStatus === 'printing') return // 출력 중에는 자동 복귀 보류
    if (countdown <= 0) { navigate('/'); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, navigate, printStatus])

  const handlePrint = async () => {
    if (printStatus === 'printing' || printStatus === 'done') return // 한 번 출력하면 끝 (실패 시에만 재시도)
    setPrintStatus('printing')
    setPrintError('')
    try {
      await printCard()
      setPrintStatus('done')
    } catch (e) {
      setPrintError(e instanceof Error ? e.message : String(e))
      setPrintStatus('error')
    } finally {
      setCountdown(15) // 출력 후 카드를 챙길 시간
    }
  }

  // PrintCard(392px 폭) 를 Figma 카드 자리에 맞게 축소 — 설명 길이에 따라 높이가 달라지므로 측정
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const fit = () => setCardScale(Math.min(CARD_BOX.width / el.offsetWidth, CARD_BOX.height / el.offsetHeight))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
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

        {/* 처음으로 · 출력하기 나란히 (261×2 + 간격 24, 가운데 정렬) */}
        <PillButton
          label={`처음으로 (${countdown})`}
          variant="secondary"
          icon="left"
          onClick={() => navigate('/')}
          disabled={printStatus === 'printing'}
          className="absolute left-[324px] top-[709.5px]"
        />
        <PillButton
          label={printStatus === 'printing' ? '출력 중…' : printStatus === 'done' ? '출력 완료' : '출력하기'}
          icon={printStatus === 'idle' || printStatus === 'error' ? 'right' : 'none'}
          onClick={handlePrint}
          disabled={printStatus === 'printing' || printStatus === 'done'}
          className="absolute left-[609px] top-[709.5px]"
        />

        {printStatus !== 'idle' && (
          <p role="status" className="absolute left-0 right-0 top-[794px] text-center">
            <span className={`inline-block rounded-pill bg-black/30 px-5 py-1.5 text-base backdrop-blur-sm ${printStatus === 'error' ? 'text-rose-200' : 'text-white'}`}>
              {printStatus === 'printing' && '카드를 출력하고 있어요… 잠시만 기다려 주세요'}
              {printStatus === 'done' && '카드가 출력됐어요. 프린터에서 가져가세요!'}
              {printStatus === 'error' && `출력에 실패했어요 — ${printError}`}
            </span>
          </p>
        )}
      </FigmaStage>
    </AppLayout>
  )
}
