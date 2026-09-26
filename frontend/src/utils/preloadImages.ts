// ─────────────────────────────────────────────
// 이미지 미리 받기 — 다음 화면 에셋을 브라우저 캐시에 올려두고 디코딩까지 끝내 둔다
// (중복 호출은 모듈 캐시로 무시)
// ─────────────────────────────────────────────

const requested = new Set<string>()
// 디코딩된 이미지를 붙잡아 둬야 GC 로 디코드 캐시가 버려지지 않음
const decoded: HTMLImageElement[] = []

export function preloadImages(urls: string[]) {
  for (const url of urls) {
    if (requested.has(url)) continue
    requested.add(url)
    const img = new Image()
    img.src = url
    img.decode().then(() => decoded.push(img), () => {})
  }
}
