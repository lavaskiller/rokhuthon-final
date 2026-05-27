import { FortuneProvider } from './hooks/useFortuneFlow'
import Router from './router'

export default function App() {
  return (
    <FortuneProvider>
      <Router />
    </FortuneProvider>
  )
}
