import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import GlassCard from '../components/GlassCard'
import PrintCard from '../components/PrintCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import type { FlowerResult } from '../types'

const MOCK_FLOWER: FlowerResult = {
  main: {
    name: '프리지아',
    englishName: 'Freesia',
    fortuneType: 'money',
    subtitle: '금전운을 담은 꽃',
    imageUrl: '/assets/flowers/freesia.png',
    description: '새로운 시작을 응원하는 향기로운 기운이\n당신 곁에 오래 머물러요.\n좋은 일들이 은은하게, 그러나 분명하게\n당신의 일상에 스며들 거예요.',
    meanings: ['새로운 시작', '순수한 기대', '당신의 앞날을 응원합니다'],
    luckItems: ['예상 밖의 작은 수입', '기분 좋은 연락', '새로운 제안과 기회'],
    places: ['책상 위', '침대 옆 협탁', '햇빛이 드는 창가'],
  },
  subs: [
    { name: '장미', fortuneType: 'relationship', subtitle: '관계운을 담은 꽃', description: '사랑', meanings: [], luckItems: [], places: [] },
    { name: '라벤더', fortuneType: 'work', subtitle: '업무운을 담은 꽃', description: '집중', meanings: [], luckItems: [], places: [] },
  ],
}

export default function FlowerPrint() {
  const navigate = useNavigate()
  const { zodiac } = useParams<{ zodiac: string }>()
  const { state } = useFortuneFlow()
  const isDev = import.meta.env.DEV

  const flower = state.flower ?? (isDev ? MOCK_FLOWER : null)
  const { selectedZodiac } = state

  useEffect(() => {
    if (isDev) return
    if (!selectedZodiac || !state.flower) navigate('/', { replace: true })
  }, [isDev, selectedZodiac, state.flower, navigate])

  if (!flower) return null

  return (
    <AppLayout>
      <div className="min-h-screen flex items-stretch">
        {/* 좌측: 출력 카드 */}
        <div className="flex-1 flex items-center justify-center py-8">
          <PrintCard flower={flower.main} />
        </div>

        {/* 우측: 메시지 + 버튼들 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-[220px] px-8">
          {/* 헤딩 */}
          <div className="text-center">
            <p className="font-gowun text-base text-white/70 mb-3">
              오늘의 운세에 맞는 꽃을 추천해 드렸어요
            </p>
            <h1 className="font-gowun text-2xl font-bold text-white whitespace-nowrap">
              ✿ 당신의 하루를 응원합니다 ✿
            </h1>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <GlassCard
              variant="pill"
              className="w-full text-center"
              onClick={() => window.print()}
            >
              <div className="h-[88px] flex flex-col items-center justify-center gap-3 px-10">
                <svg viewBox="0 0 200 14" className="w-3/4 h-3.5" fill="none">
                  <line x1="4" y1="7" x2="188" y2="7" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"/>
                  <path d="M183 1L197 7L183 13" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-gowun text-[24px] leading-none text-[rgba(255,255,255,0.85)]">출력하기</span>
              </div>
            </GlassCard>

            <GlassCard
              variant="pill"
              className="w-full text-center"
              onClick={() => navigate(`/flower/${zodiac ?? ''}`)}
            >
              <div className="h-[88px] flex items-center justify-center px-10">
                <span className="font-gowun text-[24px] leading-none text-[rgba(255,255,255,0.85)]">뒤로가기</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
