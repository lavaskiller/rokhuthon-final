// ─────────────────────────────────────────────
// StarBackground — 배경 레이어 합성 컴포넌트
//
// Figma uiux 2 frame (node 102:409) SVG export 를 그대로 사용.
// SVG 한 장에 모든 요소가 포함됨:
//   - 그라디언트 backdrop (#0A205C → #44257E) — uiux 2 frame fill
//   - 12개 시안 꽃잎 (radial gradient #71FFFD → #55BEF7)
//   - 하단 언덕 (linear gradient #67BDFF → #000F74)
//     · Figma 가 직접 만든 feTurbulence + feDisplacementMap 노이즈 필터 포함
// portrait 보정은 SVG 파일 내부의 outer wrapping group transform 으로 처리.
//
// 별 / 떨어지는 애니메이션 / 별도 노이즈 오버레이는 Figma 에 없어 제거.
// starOpacity prop 은 호환성 위해 유지 (no-op, 추후 별 레이어 복귀 시 사용).
// ─────────────────────────────────────────────

interface Props {
  /** [현재 미사용] 별 레이어 재도입 시 사용 예정 */
  starOpacity?: number;
  /** 콘텐츠 영역 — 항상 배경 위(z-10)에 렌더 */
  children?: React.ReactNode;
}

export default function StarBackground({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Figma uiux 2 원본 배경 (그라디언트 + 꽃잎 + 언덕) — portrait 종횡비 그대로 */}
      <img
        src="/assets/uiux-background.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* 콘텐츠 — 배경 위 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
