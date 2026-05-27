// TODO: router.tsx 구현 완료 후 아래 플레이스홀더를 RouterProvider로 교체
// import { RouterProvider } from 'react-router-dom'
// import { router } from './router'
// export default function App() { return <RouterProvider router={router} /> }

import AppLayout from './layouts/AppLayout'
import GlassCard from './components/GlassCard'

export default function App() {
  return (
    <AppLayout>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-gowun gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-white/85 text-[20px]">당신에게 맞는 꽃을 추천해 드려요</p>
          <h1 className="text-white text-[48px] font-bold leading-tight">
            오늘의 <span className="text-accent">별꽃 운세</span>
          </h1>
        </div>

        <GlassCard
          variant="pill"
          className="px-12 py-5"
          onClick={() => alert('내 별꽃 운세 보러가기')}
        >
          <span className="text-white text-[22px]">내 별꽃 운세 보러가기</span>
        </GlassCard>
      </div>
    </AppLayout>
  )
}
