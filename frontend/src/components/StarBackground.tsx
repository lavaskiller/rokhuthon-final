import { useMemo } from 'react';

interface Props {
  /** 'main' (default) | 'loading' */
  variant?: 'main' | 'loading';
  /** loading variant 의 별 사진 투명도 (Figma 기본 0.40) */
  starOpacity?: number;
  children?: React.ReactNode;
}

// 시드 기반 의사난수 — 매 마운트 동일 패턴 (SSR-safe)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ProcStar {
  top: string;
  left: string;
  size: number;
  bright: boolean;
  twinkleDuration: number;
  twinkleDelay: number;
}
function generateStars(count: number, seed: number): ProcStar[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const r = rand();
    let size = 1;
    let bright = false;
    if (r < 0.55) size = 1;
    else if (r < 0.82) { size = 2; bright = true; }
    else if (r < 0.95) { size = 3; bright = true; }
    else { size = 4; bright = true; }
    return {
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      size,
      bright,
      twinkleDuration: 1.8 + rand() * 2.6,
      twinkleDelay: -rand() * 4,
    };
  });
}

export default function StarBackground({
  variant = 'main',
  starOpacity = 0.4,
  children,
}: Props) {
  const stars = useMemo(() => generateStars(60, 0x4a5b), []);

  if (variant === 'loading') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#002075] to-[#44257e]">
        {/* 1. 별 배경 사진 — Figma uiux 11 "별 배경사진" */}
        <picture className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: starOpacity }}>
          <source srcSet="/assets/loading-stars.webp" type="image/webp" />
          <img
            src="/assets/loading-stars.png"
            alt=""
            aria-hidden
            draggable={false}
            className="h-full w-full object-cover"
          />
        </picture>

        {/* 2. 반짝이는 별 procedural 레이어 — twinkle 애니메이션 */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: s.bright
                  ? `0 0 ${s.size * 2.5}px ${s.size * 0.5}px rgba(255,255,255,0.9), 0 0 ${s.size * 5}px ${s.size * 0.8}px rgba(118,212,255,0.5)`
                  : 'none',
                filter: s.bright ? 'none' : 'opacity(0.55)',
                animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
                willChange: 'opacity, transform',
              }}
            />
          ))}
        </div>

        {/* 3. 하단 언덕 */}
        <picture className="pointer-events-none absolute bottom-0 left-0 w-full">
          <source srcSet="/assets/bg-hills.webp" type="image/webp" />
          <img
            src="/assets/bg-hills.png"
            alt=""
            aria-hidden
            draggable={false}
            className="w-full"
          />
        </picture>

        {/* 5. 콘텐츠 */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // main variant — 그라디언트 + 별 사진 + 언덕 레이어
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#002075] to-[#44257e]">
      {/* 1. 별 배경 사진 */}
      <picture className="pointer-events-none absolute inset-0 h-full w-full">
        <source srcSet="/assets/bg-stars.webp" type="image/webp" />
        <img
          src="/assets/bg-stars.png"
          alt=""
          aria-hidden
          draggable={false}
          className="h-full w-full object-cover"
          style={{ opacity: starOpacity }}
        />
      </picture>

      {/* 2. 반짝이는 별 procedural 레이어 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              boxShadow: s.bright
                ? `0 0 ${s.size * 2.5}px ${s.size * 0.5}px rgba(255,255,255,0.9), 0 0 ${s.size * 5}px ${s.size * 0.8}px rgba(118,212,255,0.5)`
                : 'none',
              filter: s.bright ? 'none' : 'opacity(0.55)',
              animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      {/* 3. 하단 언덕 데코 */}
      <picture className="pointer-events-none absolute bottom-0 left-0 w-full">
        <source srcSet="/assets/bg-hills.webp" type="image/webp" />
        <img src="/assets/bg-hills.png" alt="" aria-hidden draggable={false} className="w-full" />
      </picture>

      {/* 4. 콘텐츠 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
