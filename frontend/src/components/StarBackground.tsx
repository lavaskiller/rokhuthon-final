// ─────────────────────────────────────────────
// StarBackground — 배경 레이어 합성 컴포넌트
//
// 레이어 순서 (bottom → top):
//   1. 그라디언트 배경 div (#0a205c → #44257e)
//   2. 별 이미지 (position: absolute, opacity prop으로 제어, 기본 23%)
//   3. 물결 언덕 SVG 실루엣 (하단 고정, 반투명)
//   4. 꽃잎 파티클 (mix-blend-mode: soft-light, 산발 배치)
//
// Props:
//   starOpacity?: number  — 화면별 별 배경 투명도 (기본 0.23, 로딩 화면 0.40)
// ─────────────────────────────────────────────

// TODO: StarBackground 구현
// interface Props { starOpacity?: number; children?: React.ReactNode }
// export default function StarBackground({ starOpacity = 0.23, children }: Props) { ... }
