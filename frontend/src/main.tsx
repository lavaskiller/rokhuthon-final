import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/gowun-batang/400.css'
import '@fontsource/gowun-batang/700.css'
import './index.css'
import App from './App'
import { captureAgentUrlFromQuery } from './utils/printCard'

captureAgentUrlFromQuery()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
