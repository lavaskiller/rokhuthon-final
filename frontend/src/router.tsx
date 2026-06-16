// ─────────────────────────────────────────────
// 라우터 설정 — React Router v6
//
// 라우트 구조:
//   /                          Landing
//   /select                    ZodiacSelect
//   /loading/fortune           FortuneLoading
//   /fortune/:zodiac           FortuneResult
//   /fortune/:zodiac/lucky     LuckyElements
//   /loading/flower            FlowerLoading
//   /flower/:zodiac            FlowerResult
//   /flower/:zodiac/print      FlowerPrint
//   *                          → / 리다이렉트
//
// 가드:
//   각 페이지 컴포넌트에서 useEffect로 selectedZodiac/fortune 없으면 / 리다이렉트
// ─────────────────────────────────────────────

import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import FlowerDecoration from './components/FlowerDecoration'
import Landing       from './pages/Landing'
import ZodiacSelect  from './pages/ZodiacSelect'
import FortuneLoading from './pages/FortuneLoading'
import FortuneResult  from './pages/FortuneResult'
import LuckyElements  from './pages/LuckyElements'
import FlowerLoading  from './pages/FlowerLoading'
import FlowerResult   from './pages/FlowerResult'
import FlowerPrint    from './pages/FlowerPrint'

function WithFlowers() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" style={{ mixBlendMode: 'soft-light' }}>
        <FlowerDecoration />
      </div>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  {
    element: <WithFlowers />,
    children: [
      { path: '/select',                element: <ZodiacSelect /> },
      { path: '/loading/fortune',       element: <FortuneLoading /> },
      { path: '/fortune/:zodiac',       element: <FortuneResult /> },
      { path: '/fortune/:zodiac/lucky', element: <LuckyElements /> },
      { path: '/loading/flower',        element: <FlowerLoading /> },
      { path: '/flower/:zodiac',        element: <FlowerResult /> },
      { path: '/flower/:zodiac/print',  element: <FlowerPrint /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function Router() {
  return <RouterProvider router={router} />
}
