// ─────────────────────────────────────────────
// StarBackground — 배경 레이어 합성 컴포넌트
//
// Figma "배경(꽃잎+언덕)" (node 102:526) 원본 SVG 를 그대로 사용.
// 포함된 요소 (Figma 디자인에 정의된 그대로):
//   - 그라디언트 backdrop (#0a205c → #44257e) — uiux 2 frame fill
//   - 12개 정적 시안 꽃잎 (radial gradient #71FFFD → #55BEF7, soft-light)
//   - 하단 언덕 1겹 (linear gradient #67BDFF → #000F74)
//     · Figma 가 직접 만든 feTurbulence + feDisplacementMap 노이즈 필터 포함
//
// 별 / 떨어지는 애니메이션 / 별도 노이즈 오버레이는 Figma 에 없어서 제거.
// starOpacity prop 은 호환성 위해 유지 (현재 no-op, 추후 별 레이어 복귀 시 사용).
// ─────────────────────────────────────────────

interface Props {
  /** [현재 미사용] 별 레이어 재도입 시 사용 예정 */
  starOpacity?: number;
  /** 콘텐츠 영역 — 항상 배경 위(z-10)에 렌더 */
  children?: React.ReactNode;
}

export default function StarBackground({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a205c] to-[#44257e]">
      {/* Figma 원본 배경 (꽃잎 + 언덕) — node 102:526 PNG export
          (SVG 사용 시 feTurbulence/feDisplacementMap 필터가 헤드리스 렌더링에서
          너무 무거워 PNG 로 pre-rasterize.) */}
      <img
        src="/assets/uiux-background.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom"
      />

      {/* 콘텐츠 — 배경 위 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
