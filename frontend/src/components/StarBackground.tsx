import { useId, useMemo } from 'react';

interface Props {
  starOpacity?: number;
  /** true 일 때 Landing 전용 꽃 장식 오버레이(bg-flowers)를 추가 렌더 */
  showFlowers?: boolean;
  children?: React.ReactNode;
}

// 시드 기반 의사난수 — 매 마운트 동일한 패턴 보장
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Petal {
  left: string;
  size: number;
  duration: number;
  delay: number;
  variant: 'drift' | 'drift-alt';
  flip: boolean;
  startRotation: number;
}
function generatePetals(count: number, seed: number): Petal[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const r = rand();
    return {
      left: `${(rand() * 100).toFixed(2)}%`,
      size: 18 + Math.floor(rand() * 14),
      duration: 22 + rand() * 12,
      delay: -rand() * 34,
      variant: r < 0.5 ? 'drift' : 'drift-alt',
      flip: rand() < 0.5,
      startRotation: Math.floor(rand() * 360),
    };
  });
}

export default function StarBackground({ showFlowers = false, children }: Props) {
  const uid = useId();
  const petalSymbolId = `petal-sym-${uid}`;
  const petals = useMemo(() => generatePetals(12, 0x5af), []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {showFlowers ? (
        /* Landing(uiux 1) 전용 배경 — CSS 그라디언트 위에 꽃 오버레이
           원래 구현(9e2f25b)과 동일한 레이어 구조. uiux-background.svg는
           uiux 2 전용이라 Landing에 덮으면 우측 색조 불일치가 발생해 제외. */
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a205c] to-[#44257e]" />
          <picture className="pointer-events-none absolute inset-0 h-full w-full">
            <source srcSet="/assets/bg-flowers.webp" type="image/webp" />
            <img src="/assets/bg-flowers.png" alt="" aria-hidden draggable={false} className="h-full w-full object-cover" />
          </picture>
        </>
      ) : (
        /* uiux 2 이후 화면 — Figma uiux 2 원본 배경 (그라디언트 + 꽃잎 + 언덕) */
        <img
          src="/assets/uiux-background.svg"
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* 낙하 꽃잎 — drift/drift-alt 애니메이션 (ae11a86 에서 유실, 복원) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute h-0 w-0" aria-hidden>
          <defs>
            <symbol id={petalSymbolId} viewBox="0 0 48.2298 47.9421">
              <path
                d="M1.73589 26.7453C7.17728 39.5533 28.5427 45.3041 38.5453 46.5785C45.427 50.0196 49.3482 46.3395 47.9478 42.2772C46.5475 38.215 40.0124 19.4173 38.5453 9.30162C36.3046 -3.31519 18.5401 -0.415869 9.93798 2.61089C4.9367 5.31904 -3.70551 13.9373 1.73589 26.7453Z"
                fill="#3A88C2"
              />
            </symbol>
          </defs>
        </svg>
        {petals.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: 0,
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `${p.variant} ${p.duration}s linear ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          >
            <svg
              viewBox="0 0 48.2298 47.9421"
              className="block h-full w-full"
              style={{ transform: `rotate(${p.startRotation}deg)${p.flip ? ' scaleX(-1)' : ''}` }}
              aria-hidden
            >
              <use href={`#${petalSymbolId}`} />
            </svg>
          </div>
        ))}
      </div>

      {/* 콘텐츠 — 배경 위 */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
