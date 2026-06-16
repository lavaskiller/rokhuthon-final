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
  const { state, selectZodiac, prefetchFortune } = useFortuneFlow()
  const [zodiacs, setZodiacs] = useState<ZodiacMeta[]>(() =>
    ZODIAC_LIST.map((z, i) => ({ ...z, rank: i + 1 }))
  )

  useEffect(() => {
    fetchZodiacs().then(setZodiacs).catch(() => {})
  }, [])

  const handleSelect = async (id: ZodiacSign) => {
    const cached = await selectZodiac(id)
    if (cached) {
      navigate(`/fortune/${id}`)
    } else {
      navigate('/loading/fortune')
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 overflow-hidden px-12 py-8">
        {/* 헤더 */}
        <header className="flex flex-col items-center gap-3">
          <p className="text-sm text-white/85">당신의 별자리를 선택하세요</p>
          <div className="flex items-center">
            <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
            <span className="h-px w-20 bg-white/70" aria-hidden />
            <h1 className="mx-4 text-xl font-bold tracking-[0.18em]">
              오늘의 별자리 순위
            </h1>
            <span className="h-px w-20 bg-white/70" aria-hidden />
            <span className="h-[3px] w-[3px] rounded-full bg-white" aria-hidden />
          </div>
        </header>

        <section className="w-full">
          <ul
            role="listbox"
            aria-label="별자리 선택"
            className="grid grid-flow-col grid-cols-2 grid-rows-6 gap-x-6 gap-y-3"
          >
            {zodiacs.map((z) => (
              <li key={z.id} role="option" aria-selected={state.selectedZodiac === z.id}>
                <ZodiacButton
                  meta={z}
                  selected={state.selectedZodiac === z.id}
                  onClick={handleSelect}
                  onHover={prefetchFortune}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  )
}
