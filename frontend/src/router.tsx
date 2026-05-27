// ─────────────────────────────────────────────
// 라우터 설정 — React Router v6
//
// 라우트 구조:
//   /                          Landing
//   /select                    ZodiacSelect
//   /loading/fortune           FortuneLoading
//   /fortune/:zodiac           FortuneResult   (총운)
//   /fortune/:zodiac/lucky     LuckyElements   (행운 요소)
//   /loading/flower            FlowerLoading
//   /flower/:zodiac            FlowerResult    (꽃 추천)
//   /flower/:zodiac/print      FlowerPrint     (출력 카드)
//   *                          → / 리다이렉트
//
// 가드:
//   FortuneLoading, FortuneResult 이후 화면은 selectedZodiac 없으면 /로 리다이렉트
//   (각 페이지 컴포넌트 내에서 useEffect로 처리)
// ─────────────────────────────────────────────

// TODO: 라우터 구현
// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import Landing from './pages/Landing';
// import ZodiacSelect from './pages/ZodiacSelect';
// ... (나머지 import)
//
// export const router = createBrowserRouter([...]);
// export default function Router() { return <RouterProvider router={router} />; }
