// ─────────────────────────────────────────────
// ZodiacSelect — uiux 2: 별자리 선택 화면
//
// 레이아웃:
//   - 헤더: "당신의 별자리를 선택하세요" + 양쪽 가로선 사이 "오늘의 별자리 순위"
//   - 그리드: 2열 × 6행, 컬럼 우선 채움 (좌:1~6, 우:7~12)
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
        setZodiacs(ZODIAC_LIST.map((z, i) => ({ ...z, rank: i + 1 })))
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (id: ZodiacSign) => {
    void selectZodiac(id)
    navigate('/loading/fortune')
  }

  return (
    <AppLayout>
      {/* 헤더 */}
      <header className="flex flex-col items-center gap-3 px-6 pb-10 pt-14">
        <p className="text-sm text-white/85">당신의 별자리를 선택하세요</p>
        <div className="flex items-center">
          {/* 왼쪽 구슬 — 바와 맞붙음 (gap 0) */}
          <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
          <span className="h-px w-20 bg-white/70" aria-hidden />

          <h1 className="mx-4 text-xl font-bold tracking-[0.18em]">
            오늘의 별자리 순위
          </h1>

          {/* 오른쪽 구슬 — 바와 맞붙음 (gap 0) */}
          <span className="h-px w-20 bg-white/70" aria-hidden />
          <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-white/50">불러오는 중…</p>
          </div>
        ) : (
          <ul
            role="listbox"
            aria-label="별자리 선택"
            className="grid grid-flow-col grid-cols-2 grid-rows-6 gap-x-4 gap-y-5"
          >
            {zodiacs.map((z) => (
              <li key={z.id} role="option" aria-selected={state.selectedZodiac === z.id}>
                <ZodiacButton
                  meta={z}
                  selected={state.selectedZodiac === z.id}
                  onClick={handleSelect}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppLayout>
  )
}
