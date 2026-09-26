// ─────────────────────────────────────────────
// StarBackground — 핑크 노을 하늘 배경 (Figma 20260926 "UIUX 최종")
//
// 배경 이미지에 구름 + 매달린 별 장식이 포함되어 있음.
//   landing — 표지 "핑크하늘"   (bg-sky-landing)
//   main    — 그 외 전 화면 "대롱3" (bg-sky)
//   loading — main 과 동일 배경 (Figma 로딩1~4)
// ─────────────────────────────────────────────

interface Props {
  variant?: 'main' | 'loading' | 'landing';
  /** @deprecated 핑크 배경은 별이 이미지에 포함되어 사용하지 않음. 기존 호출부 호환용 */
  starOpacity?: number;
  children?: React.ReactNode;
}

const BG_SRC = {
  main: 'bg-sky',
  loading: 'bg-sky',
  landing: 'bg-sky-landing',
} as const;

// bg-sky(1024×768) 에 그려진 별 중심 좌표·크기(px) + 별 주변 하늘색(샘플링) — 깜빡임 오버레이
// 별이 이미지에 박혀 있어 직접 어둡게 할 수 없으므로, 주변 하늘색 원을 잠깐 덮어 표지(star-blink)처럼 밝기가 내려가 보이게 한다.
// landing 은 표지에서 별 스프라이트를 따로 올리므로 제외
const GLINTS: { x: number; y: number; size: number; sky: string; delay: number; dur: number }[] = [
  { x: 93, y: 158, size: 56, sky: '183,95,119', delay: 0, dur: 3.5 },
  { x: 153, y: 50, size: 28, sky: '171,86,112', delay: 1.5, dur: 2.6 },
  { x: 829, y: 50, size: 30, sky: '170,88,111', delay: 0.7, dur: 3.05 },
  { x: 865, y: 112, size: 76, sky: '174,87,113', delay: 2.2, dur: 3.95 },
  { x: 939, y: 166, size: 34, sky: '181,92,116', delay: 1.1, dur: 3.05 },
  { x: 858, y: 263, size: 32, sky: '183,89,115', delay: 2.8, dur: 2.6 },
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function StarBackground({ variant = 'main', children }: Props) {
  const src = BG_SRC[variant];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-sky-fallback">
      {/* object-cover + object-bottom 과 같은 배치를 직접 계산 — 반짝임을 이미지 속 별 위치에 고정하기 위함 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [container-type:size]">
        <div className="absolute bottom-0 left-1/2 aspect-[4/3] -translate-x-1/2" style={{ width: 'max(100cqw, 133.334cqh)' }}>
          <picture>
            <source srcSet={`/assets/${src}.webp`} type="image/webp" />
            <img src={`/assets/${src}.png`} alt="" draggable={false} className="h-full w-full" />
          </picture>
          {variant !== 'landing' &&
            GLINTS.map(g => (
              <span
                key={`${g.x}-${g.y}`}
                className="star-dim"
                style={{
                  left: pct(g.x, 1024),
                  top: pct(g.y, 768),
                  width: pct(g.size, 1024),
                  background: `radial-gradient(circle, rgb(${g.sky}) 0%, rgb(${g.sky}) 30%, rgba(${g.sky}, 0) 62%)`,
                  animationDelay: `${g.delay}s`,
                  animationDuration: `${g.dur}s`,
                }}
              />
            ))}
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
