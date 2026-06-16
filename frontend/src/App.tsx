import { FortuneProvider } from './hooks/useFortuneFlow'
import Router from './router'
import FlowerDecoration from './components/FlowerDecoration'

export default function App() {
  return (
    <FortuneProvider>
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" style={{ mixBlendMode: 'soft-light' }}>
          <FlowerDecoration />
        </div>
        <Router />
      </div>
    </FortuneProvider>
  )
}
