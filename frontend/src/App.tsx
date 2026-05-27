// TODO: router.tsx 구현 완료 후 아래 플레이스홀더를 RouterProvider로 교체
// import { RouterProvider } from 'react-router-dom'
// import { router } from './router'
// export default function App() { return <RouterProvider router={router} /> }

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-gowun">
      <p className="text-[#76d4ff] text-5xl font-bold mb-4">별꽃노리</p>
      <p className="text-white/60 text-lg">오늘의 별꽃 운세</p>
      <p className="text-white/30 text-sm mt-8">개발 진행 중 🌸</p>
    </div>
  )
}
