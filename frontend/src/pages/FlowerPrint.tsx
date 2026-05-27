import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import GlassCard from '../components/GlassCard'
import PrintCard from '../components/PrintCard'
import { useFortuneFlow } from '../hooks/useFortuneFlow'

export default function FlowerPrint() {
  const navigate = useNavigate()
  const { state } = useFortuneFlow()
  const { flower, selectedZodiac } = state

  useEffect(() => {
    if (!selectedZodiac || !flower) navigate('/', { replace: true })
  }, [selectedZodiac, flower, navigate])

  if (!flower) return null

  return (
    <AppLayout>
      <div className="min-h-screen flex items-stretch">
        {/* 좌측: 출력 카드 */}
        <div className="flex-1 flex items-center justify-center">
          <PrintCard flower={flower.main} />
        </div>

        {/* 우측: 출력 버튼 */}
        <div className="flex-1 flex items-center justify-center">
          <GlassCard
            variant="pill"
            className="px-8 py-4"
            onClick={() => window.print()}
          >
            <span className="font-gowun text-base text-white">출력하기 →</span>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  )
}
