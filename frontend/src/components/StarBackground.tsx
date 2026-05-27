// ─────────────────────────────────────────────
// StarBackground — 배경 레이어 합성 컴포넌트
//
// 레이어 순서 (bottom → top):
//   1. 그라디언트 배경 (#0a205c → #44257e)
//   2. 별 산포 (반짝임 애니메이션, opacity prop 으로 베이스 강도 조절)
//   3. Figma 언덕 실루엣 (bg-hills WebP/PNG, 하단 고정)
//   4. 흩날리는 꽃잎 (SVG <use>, drift/drift-alt 키프레임)
//   5. children — 페이지 콘텐츠 (z-index 10)
//
// 결정 사항:
//   - 별/꽃잎 위치는 시드 기반 결정적 산포 (매 마운트 동일, SSR-safe)
//   - 별: twinkle 키프레임 + 별별 delay 로 비동기 반짝임
//   - 꽃잎: drift / drift-alt 두 가지 변형 + 무작위 duration/delay
//   - SVG ID 는 useId() 로 인스턴스별 고유화 (다중 마운트 충돌 방지)
// ─────────────────────────────────────────────

import { useId, useMemo } from 'react';
import FlowerDecoration from './FlowerDecoration';

interface Props {
  /** 별 베이스 투명도 (Figma: 랜딩 0.23, 로딩 화면 0.40) */
  starOpacity?: number;
  /** 콘텐츠 영역 — 항상 배경 위(z-10)에 렌더 */
  children?: React.ReactNode;
}

// 시드 기반 의사난수 — 매 마운트 동일한 패턴 보장 (SSR/hydration 안전)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  top: string;
  left: string;
  size: number;
  bright: boolean; // 큰 별엔 글로우 추가
  twinkleDuration: number;
  twinkleDelay: number;
}
function generateStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const r = rand();
    // 크기 분포: 작은 별 위주, 1/3 정도는 글로우 있는 또렷한 별
    let size = 1;
    let bright = false;
    if (r < 0.55) size = 1;
    else if (r < 0.78) { size = 2; bright = true; }
    else if (r < 0.94) { size = 3; bright = true; }
    else { size = 4; bright = true; }
    return {
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      size,
      bright,
      // 1.8 ~ 4.2초 — 잘 보이는 반짝임
      twinkleDuration: 1.8 + rand() * 2.4,
      twinkleDelay: -rand() * 4,
    };
  });
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

export default function StarBackground({ starOpacity = 0.23, children }: Props) {
  const uid = useId();
  const petalSymbolId = `petal-sym-${uid}`;
  const stars = useMemo(() => generateStars(90, 0xb9), []);
  const dimOpacity = Math.max(0.35, starOpacity + 0.15);
  const petals = useMemo(() => generatePetals(12, 0x5af), []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a205c] to-[#44257e]">
      {/* 1. 별 산포 — 반짝임 애니메이션 (개별 opacity, parent 합성 없음) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              // 큰 별엔 글로우, 작은 별엔 starOpacity 로 dim
              boxShadow: s.bright
                ? `0 0 ${s.size * 2.5}px ${s.size * 0.5}px rgba(255,255,255,0.9), 0 0 ${s.size * 5}px ${s.size * 0.8}px rgba(118,212,255,0.55)`
                : 'none',
              filter: s.bright ? 'none' : `opacity(${dimOpacity})`,
              animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      {/* 2. Figma 언덕 실루엣 — 하단 고정 */}
      <picture className="pointer-events-none absolute bottom-0 left-0 w-full">
        <source srcSet="/assets/bg-hills.webp" type="image/webp" />
        <img
          src="/assets/bg-hills.png"
          alt=""
          aria-hidden
          className="block w-full"
        />
      </picture>

      {/* 3. 흩날리는 꽃잎 — 개별 drift 애니메이션 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
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
            aria-hidden
          >
            <svg
              viewBox="0 0 48.2298 47.9421"
              className="block h-full w-full"
              preserveAspectRatio="none"
              style={{
                transform: `rotate(${p.startRotation}deg)${p.flip ? ' scaleX(-1)' : ''}`,
              }}
              aria-hidden
            >
              <use href={`#${petalSymbolId}`} />
            </svg>
          </div>
        ))}
      </div>

      {/* 4. 콘텐츠 — 항상 배경 위 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
