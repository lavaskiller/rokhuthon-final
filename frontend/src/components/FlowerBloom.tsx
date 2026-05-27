// ─────────────────────────────────────────────
// FlowerBloom — 꽃 개화 상태 컴포넌트
//
// uiux 11(100%), 12(75%), 13(50%), 14(25%) 로딩 화면에서 사용
// 개화율에 따라 꽃잎 레이어 수 변화로 상태 표현
//
// Props:
//   state: BloomState        — 25 | 50 | 75 | 100
//   animated?: boolean       — true면 state 자동 순환 (14→13→12→11 시퀀스)
//                              FlowerLoading 페이지에서 true로 사용
//
// 구현 방식:
//   - 각 state별 SVG 또는 이미지 에셋 스왑
//   - animated=true 시: useEffect + setInterval로 25→50→75→100 전환
//     (각 단계 800ms 간격, 100% 도달 시 onComplete 콜백)
//
// onComplete?: () => void    — 100% 완료 후 다음 화면 이동 트리거
// ─────────────────────────────────────────────

// TODO: FlowerBloom 구현
// interface Props { state: BloomState; animated?: boolean; onComplete?: () => void }
// export default function FlowerBloom({ state, animated = false, onComplete }: Props) { ... }
