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

export default function StarBackground({ variant = 'main', children }: Props) {
  const src = BG_SRC[variant];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-sky-fallback">
      <picture className="pointer-events-none absolute inset-0 h-full w-full">
        <source srcSet={`/assets/${src}.webp`} type="image/webp" />
        <img
          src={`/assets/${src}.png`}
          alt=""
          aria-hidden
          draggable={false}
          className="h-full w-full object-cover object-bottom"
        />
      </picture>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
