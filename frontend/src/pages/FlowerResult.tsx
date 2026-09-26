// ─────────────────────────────────────────────
// FlowerResult — Figma "결과" (1:412 거베라 / 1:452 장미 / 1:492 수선화)
//
// 라우트: /flower/:zodiac
// 서버 추천 꽃(main) 이미지 · 부제 · 이름 + 꽃말 / 기대되는 행운 / 함께 두면 좋은 장소 카드
// 가드: selectedZodiac · flower 없으면 / 로 리다이렉트 (dev 모드는 mock)
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import FigmaStage from '../components/FigmaStage'
import PillButton from '../components/PillButton'
import SurfaceCard from '../components/SurfaceCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import type { FlowerResult as FlowerResultData } from '../types'

const MOCK_FLOWER: FlowerResultData = {
  main: {
    name: '거베라',
    englishName: 'Gerbera',
    fortuneType: 'work',
    subtitle: '업무운을 담은 꽃',
    description:
      '언제나 긍정적인 에너지가\n당신의 하루를 환하게 밝혀줄 거예요.\n앞으로 나아가는 발걸음마다\n따뜻한 응원이 함께할 거예요.',
    meanings: ['긍정적인 에너지', '앞으로 나아가는 힘', '밝은 성취'],
    luckItems: ['인정받는 성과', '팀워크 향상', '새로운 기회 포착'],
    places: ['책상 위', '사무실 창가', '회의실'],
    imageUrl: '/assets/flowers/gerbera.png',
  },
  subs: [
    { name: '', fortuneType: 'money', subtitle: '', description: '', meanings: [], luckItems: [], places: [] },
    { name: '', fortuneType: 'relationship', subtitle: '', description: '', meanings: [], luckItems: [], places: [] },
  ],
}

// 정보 카드 3개 — Figma 카드 좌표 / 내부 좌측 여백
const INFO_CARDS = [
  { title: '꽃말', key: 'meanings', left: 167, padLeft: 36 },
  { title: '기대되는 행운', key: 'luckItems', left: 460.2, padLeft: 39.4 },
  { title: '함께 두면 좋은 장소', key: 'places', left: 760.2, padLeft: 39.4 },
] as const

export default function FlowerResult() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const isDev = import.meta.env.DEV

  // dev fallback: backend 없이도 시각 검증 가능 (prod 영향 X)
  const flower = state.flower ?? (isDev ? MOCK_FLOWER : null)

  useEffect(() => {
    if (isDev) return
    if (!state.selectedZodiac || !state.flower) navigate('/', { replace: true })
  }, [isDev, state.selectedZodiac, state.flower, navigate])

  if (!flower) return null
  const { main } = flower

  return (
    <AppLayout>
      <FigmaStage>
        <h1 className="absolute left-0 right-0 top-[74.5px] text-center text-title font-bold leading-[40px]">
          오늘의 행운의 꽃
        </h1>

        {main.imageUrl && (
          <picture>
            <source srcSet={main.imageUrl.replace(/\.png$/, '.webp')} type="image/webp" />
            <img
              src={main.imageUrl}
              alt={main.name}
              className="absolute left-[467px] top-[147px] h-[256px] w-[256px] object-contain"
            />
          </picture>
        )}
        <img src="/assets/sparkle.svg" alt="" aria-hidden className="absolute left-[230.4px] top-[335.4px] h-[9px] w-[9.1px]" />

        <p className="absolute left-[597.5px] top-[442px] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center whitespace-nowrap font-bold">
          <span className="text-[15px]">{main.subtitle}</span>
          <span className="text-label">
            {main.name}
            {main.englishName && ` ${main.englishName}`}
          </span>
        </p>

        {INFO_CARDS.map(card => (
          <div key={card.key} className="absolute top-[501px]" style={{ left: card.left }}>
            <SurfaceCard className="h-[172.383px] w-[262.8px] pt-[26px]">
              <div style={{ paddingLeft: card.padLeft }}>
                <h2 className="whitespace-nowrap text-label font-bold leading-[29px]">{card.title}</h2>
                <ul className="-ml-[5px] mt-px list-disc whitespace-nowrap pl-6 text-[18px] leading-[1.6] marker:text-[12px]">
                  {main[card.key].map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </SurfaceCard>
          </div>
        ))}

        <PillButton label="출력하기" onClick={() => navigate(`/flower/${zodiac}/print`)} className="absolute left-[466px] top-[709.5px]" />
      </FigmaStage>
    </AppLayout>
  )
}
