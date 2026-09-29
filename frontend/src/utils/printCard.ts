// ─────────────────────────────────────────────
// 출력 — 카드를 PNG 로 렌더해 Paperang(라즈베리파이 에이전트)으로 보냄. 설정이 없으면 window.print() 폴백
//
// 경로 (키오스크 기기에서 URL 쿼리로 한 번 넘기면 localStorage 에 저장, 빈 값이면 해제):
//   ?printKey=<키>                         — 백엔드 중계(/api/print) 경유. 아이패드 웹앱 운영용
//                                             (HTTPS 페이지에서 LAN 의 HTTP 에이전트를 직접 못 부르므로)
//   ?printAgent=http://localhost:8765      — 에이전트 직접 호출. 파이 자체 브라우저·개발용
// ─────────────────────────────────────────────

import { toBlob } from 'html-to-image'
import { API_BASE } from '../api/client'

const AGENT_KEY = 'printAgentUrl'
const KIOSK_KEY = 'printKioskKey'
// 이 시간 안에 출력 완료가 확인되지 않으면 실패로 간주
const PRINT_TIMEOUT_MS = 60_000
// Paperang P2 인쇄 폭 (도트)
const PRINT_WIDTH_PX = 576

function readStored(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}

function writeStored(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch { /* 저장 불가 환경 무시 */ }
}

/** 키오스크 실행 URL 의 ?printAgent= / ?printKey= 를 기억 — 앱 시작 시 한 번 호출 */
export function captureAgentUrlFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const agent = params.get('printAgent')
  const key = params.get('printKey')
  if (agent !== null) writeStored(AGENT_KEY, agent.trim())
  if (key !== null) writeStored(KIOSK_KEY, key.trim())
}

function getPrintAgentUrl(): string | null {
  const url = readStored(AGENT_KEY) || import.meta.env.VITE_PRINT_AGENT_URL || ''
  return url ? url.replace(/\/+$/, '') : null
}

// Safari 는 foreignObject 안 이미지·폰트를 첫 렌더에 빠뜨리는 경우가 있어 한 번 더 그림 (html-to-image 알려진 이슈)
const isWebKit = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)

/** #print-card 를 PNG 로 렌더 — 화면 축소(transform)와 무관하게, 프린터 폭(P2 576도트)에 딱 맞춰
 *  브라우저가 직접 그리게 해 에이전트 쪽 리샘플링으로 작은 글씨가 뭉개지지 않도록 */
async function renderCard(el: HTMLElement): Promise<Blob> {
  await document.fonts.ready
  const options = {
    pixelRatio: PRINT_WIDTH_PX / el.offsetWidth,
    backgroundColor: '#ffffff',
    cacheBust: false,
    style: { boxShadow: 'none', transform: 'none' },
    // <picture><source srcset webp> 는 임베드되지 않아 깨짐 → source 를 빼서 img(png) 로 렌더
    filter: (node: HTMLElement) => !(node instanceof HTMLSourceElement),
  }
  if (isWebKit) await toBlob(el, options)
  const blob = await toBlob(el, options)
  if (!blob) throw new Error('카드 이미지 생성 실패')
  return blob
}

async function errorFrom(res: Response, fallback: string): Promise<Error> {
  const err = await res.json().catch(() => ({}))
  return new Error(err.detail ?? `${fallback} (HTTP ${res.status})`)
}

/** 에이전트 직접 호출 — 출력이 끝나야 응답 */
async function printViaAgent(agent: string, png: Blob) {
  let res: Response
  try {
    res = await fetch(`${agent}/print`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/png' },
      body: png,
      signal: AbortSignal.timeout(PRINT_TIMEOUT_MS),
    })
  } catch {
    throw new Error('프린터 연결을 확인해 주세요')
  }
  if (!res.ok) throw await errorFrom(res, '프린터 오류')
}

/** 백엔드 중계 — 작업 등록 후 에이전트가 출력을 마칠 때까지 상태 확인 */
async function printViaRelay(kioskKey: string, png: Blob) {
  const headers = { 'X-Kiosk-Key': kioskKey }
  let res: Response
  try {
    res = await fetch(`${API_BASE}/print`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'image/png' },
      body: png,
      signal: AbortSignal.timeout(20_000),
    })
  } catch {
    throw new Error('인터넷 연결을 확인해 주세요')
  }
  if (!res.ok) throw await errorFrom(res, '출력 요청 실패')
  const { id } = await res.json() as { id: string }

  const deadline = Date.now() + PRINT_TIMEOUT_MS
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 1000))
    const s = await fetch(`${API_BASE}/print/${encodeURIComponent(id)}`, { headers }).catch(() => null)
    if (!s?.ok) continue
    const { status, error } = await s.json() as { status: string; error?: string }
    if (status === 'done') return
    if (status === 'error' || status === 'expired') throw new Error(error || '출력에 실패했어요')
  }
  throw new Error('프린터 응답이 늦어요 — 프린터를 확인해 주세요')
}

/** 설정된 경로로 Paperang 출력, 설정이 없으면 브라우저 인쇄 */
export async function printCard(): Promise<'paperang' | 'browser'> {
  const agent = getPrintAgentUrl()
  const kioskKey = readStored(KIOSK_KEY)
  if (!agent && !kioskKey) {
    window.print()
    return 'browser'
  }
  const el = document.getElementById('print-card')
  if (!el) throw new Error('출력할 카드가 없습니다')

  const png = await renderCard(el)
  if (agent) await printViaAgent(agent, png)
  else await printViaRelay(kioskKey!, png)
  return 'paperang'
}
