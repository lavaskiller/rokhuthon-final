// ─────────────────────────────────────────────
// FlowerResult — uiux 15: 꽃 추천 결과 화면
//
// 라우트: /flower/:zodiac
//
// 레이아웃 (Figma uiux 15 매칭):
//   - 좌상단: 날짜 + 큰 제목 "오늘을 위한 꽃 추천을 해드릴게요"
//   - 우상단: FortuneCircle 미니 3개 (관계 운 / 금전 운 / 업무 운)
//   - 중앙: 메인 꽃 (가로 글래스 pill — 회색 원 + 이름·부제·설명)
//   - 하단: 꽃말 / 기대되는 행운 / 함께 두면 좋은 장소 카드 3개
//   - 우하단: '꽃 출력하기 →' 링크
//
// 가드: selectedZodiac · flower 없으면 / 로 리다이렉트
// dev 모드: 가드 skip + flower/fortune mock — hot-reload 시 페이지 머무름
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import FortuneCircle from '../components/FortuneCircle'
import FlowerCard from '../components/FlowerCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import type { FlowerResult as FlowerResultData, FortuneResult } from '../types'

const MOCK_FORTUNE: FortuneResult = {
  zodiac: 'pisces',
  date: '2026. 05. 27',
  summary: '',
  scores: { relationship: 80, money: 80, work: 80 },
}

const MOCK_FLOWER: FlowerResultData = {
  main: {
    name: '프리지아',
    fortuneType: 'money',
    subtitle: '금전운을 담은 꽃',
    description:
      '은은한 향처럼 좋은 기회가 천천히 스며드는 하루예요.\n작은 행운이 예상치 못한 풍요로 이어질 수 있어요',
    meanings: ['새로운 시작', '순수한 기대', '당신의 앞날을 응원합니다'],
    luckItems: [
      '예상 밖의 작은 수입',
      '기분 좋은 연락',
      '새로운 제안과 기회',
    ],
    places: ['책상 위', '침대 옆 협탁', '햇빛이 드는 창가'],
  },
  subs: [
    {
      name: '',
      fortuneType: 'money',
      subtitle: '',
      description: '',
      meanings: [],
      luckItems: [],
      places: [],
    },
    {
      name: '',
      fortuneType: 'work',
      subtitle: '',
      description: '',
      meanings: [],
      luckItems: [],
      places: [],
    },
  ],
}

export default function FlowerResult() {
  const { zodiac } = useParams<{ zodiac: string }>()
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const isDev = import.meta.env.DEV

  // dev fallback: backend 없이도 시각 검증 가능 (prod 영향 X)
  const flower = state.flower ?? (isDev ? MOCK_FLOWER : null)
  const fortune = state.fortune ?? (isDev ? MOCK_FORTUNE : null)

  // Guard: 별자리 / 꽃 결과 없으면 처음으로 (dev 모드 skip)
  useEffect(() => {
    if (isDev) return
    if (!state.selectedZodiac || !state.flower) navigate('/', { replace: true })
  }, [isDev, state.selectedZodiac, state.flower, navigate])

  if (!flower || !fortune) return null

  const today = new Date()
  const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-8 py-10">
          {/* 헤더 */}
          <header className="flex items-start justify-between gap-8">
            {/* 좌측: 날짜 + 큰 제목 */}
            <div>
              <p className="mb-3 font-gowun text-sm text-white/85">{dateStr}</p>
              <h1 className="font-gowun text-3xl font-medium leading-tight text-white">
                오늘을 위한 꽃 추천을 해드릴게요
              </h1>
            </div>

            {/* 우측: FortuneCircle 3개 */}
            <div className="flex shrink-0 gap-4">
              <FortuneCircle
                type="relationship"
                score={fortune.scores.relationship}
                size="sm"
              />
              <FortuneCircle
                type="money"
                score={fortune.scores.money}
                size="sm"
              />
              <FortuneCircle
                type="work"
                score={fortune.scores.work}
                size="sm"
              />
            </div>
          </header>

          {/* 꽃 메인 + 3개 정보 카드 */}
          <FlowerCard flower={flower.main} />

          {/* 우하단: 꽃 출력하기 → */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/flower/${zodiac}/print`)}
              className="font-gowun text-base text-white/85 transition-opacity hover:opacity-100"
            >
              꽃 출력하기 →
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
