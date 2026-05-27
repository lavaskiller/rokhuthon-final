// ─────────────────────────────────────────────
// ZodiacSelect — uiux 2: 별자리 선택 화면
//
// 레이아웃:
//   AppLayout
//   └─ 헤더: "당신의 별자리를 선택하세요" + "오늘의 별자리 순위"
//   └─ 2열 그리드 ZodiacButton (순위 오름차순)
//
// 동작:
//   마운트 시 fetchZodiacs() 호출 (실패 시 정적 폴백)
//   선택 → selectZodiac(id) 비동기 호출 + navigate('/loading/fortune')
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import ZodiacButton from '../components/ZodiacButton'
import { useFortuneFlow } from '../hooks/useFortuneFlow'
import { fetchZodiacs } from '../api/client'
import { ZODIAC_LIST } from '../constants/zodiacs'
import type { ZodiacMeta, ZodiacSign } from '../types'

export default function ZodiacSelect() {
  const navigate = useNavigate()
  const { state, selectZodiac } = useFortuneFlow()
  const [zodiacs, setZodiacs] = useState<ZodiacMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchZodiacs()
      .then(setZodiacs)
      .catch(() => {
        // 서버 없을 때 정적 폴백
        setZodiacs(ZODIAC_LIST.map((z, i) => ({ ...z, rank: i + 1 })))
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (id: ZodiacSign) => {
    void selectZodiac(id)   // 백그라운드 fetchFortune 시작
    navigate('/loading/fortune')
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col px-8 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <p className="font-gowun text-sm text-white/50 mb-1">
            당신의 별자리를 선택하세요
          </p>
          <h2 className="font-gowun text-2xl font-bold text-white">
            오늘의 별자리 순위
          </h2>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-gowun text-sm text-white/50">불러오는 중…</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {zodiacs.map((meta) => (
              <ZodiacButton
                key={meta.id}
                meta={meta}
                selected={state.selectedZodiac === meta.id}
                onClick={handleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
