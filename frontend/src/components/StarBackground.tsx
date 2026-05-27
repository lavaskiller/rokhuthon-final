// ─────────────────────────────────────────────
// StarBackground — 배경 레이어 합성 컴포넌트
//
// 레이어 순서 (bottom → top):
//   1. 그라디언트 배경 (#0a205c → #44257e)
//   2. 별 산포 (작은 흰색 점, opacity prop 으로 강도 조절)
//   3. 언덕 SVG 실루엣 (하단 고정, linear gradient #67BDFF → #000F74)
//   4. 하늘색 꽃 장식 (bg-flowers WebP/PNG)
//   5. 꽃잎 파티클 (SVG, mix-blend-mode: soft-light, 산발 배치)
//   6. children — 페이지 콘텐츠 (z-index 10)
//
// 결정 사항:
//   - Figma "별 배경"은 이미지 fill 이라 직접 추출 불가 → 80개 CSS 점으로 대체
//   - 별 위치는 시드 기반 결정적 산포 (매 렌더 동일, SSR-safe)
//   - 꽃잎은 5-petal SVG 한 정의를 <use> 로 재활용 → DOM/그라디언트 1회만 정의
//   - SVG ID는 useId()로 인스턴스별 고유화 → 다중 마운트 시 전역 충돌 방지
// ─────────────────────────────────────────────

import { useId, useMemo } from 'react';
import FlowerDecoration from './FlowerDecoration';

interface Props {
  /** 별 배경 투명도 (Figma: 랜딩 0.23, 로딩 화면 0.40) */
  starOpacity?: number;
  /** 콘텐츠 영역 — 항상 배경 위(z-10)에 렌더 */
  children?: React.ReactNode;
}

// 시드 기반 의사난수 — 매 마운트 동일한 별 패턴 보장 (SSR/hydration 안전)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star { top: string; left: string; size: number; opacity: number }
function generateStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    top: `${(rand() * 100).toFixed(2)}%`,
    left: `${(rand() * 100).toFixed(2)}%`,
    size: rand() < 0.85 ? 1 : 2,
    opacity: 0.4 + rand() * 0.6,
  }));
}


export default function StarBackground({ starOpacity = 0.23, children }: Props) {
  const uid = useId();
  const hillGradId = `hill-grad-${uid}`;
  const stars = useMemo(() => generateStars(80, 0xb9), []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a205c] to-[#44257e]">
      {/* 1. 별 산포 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: starOpacity }}
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
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* 2. 언덕 실루엣 — 하단 고정, 곡선형 SVG */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
        viewBox="0 0 834 320"
        preserveAspectRatio="none"
        style={{ height: '36%' }}
      >
        <defs>
          <linearGradient id={hillGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67BDFF" />
            <stop offset="100%" stopColor="#000F74" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 C160,140 320,180 460,160 C600,140 720,170 834,150 L834,320 L0,320 Z"
          fill={`url(#${hillGradId})`}
          opacity="0.55"
        />
        <path
          d="M0,260 C140,200 300,230 440,210 C580,190 720,220 834,200 L834,320 L0,320 Z"
          fill={`url(#${hillGradId})`}
        />
      </svg>

      {/* 3. 하늘색 꽃 장식 */}
      <picture className="pointer-events-none absolute inset-0 h-full w-full">
        <source srcSet="/assets/bg-flowers.webp" type="image/webp" />
        <img src="/assets/bg-flowers.png" alt="" className="h-full w-full object-cover" />
      </picture>

      {/* 4. 꽃잎 파티클 */}
      <FlowerDecoration />

      {/* 5. 콘텐츠 — 항상 배경 위 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
