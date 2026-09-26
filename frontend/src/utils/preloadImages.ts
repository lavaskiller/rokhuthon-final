// ─────────────────────────────────────────────
// 이미지 미리 받기 — 다음 화면 에셋을 브라우저 캐시에 올려둔다 (중복 호출은 모듈 캐시로 무시)
// ─────────────────────────────────────────────

const requested = new Set<string>()

export function preloadImages(urls: string[]) {
  for (const url of urls) {
    if (requested.has(url)) continue
    requested.add(url)
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}
