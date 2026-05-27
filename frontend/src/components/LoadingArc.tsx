// ─────────────────────────────────────────────
// LoadingArc — 회전 호(arc) 로딩 인디케이터
//
// uiux 3 (운세 로딩), uiux 11~14 (꽃 로딩) 중앙 원형 인디케이터에 사용
// 같은 방향(시계방향)으로 도는 두 개의 호 — 안쪽이 더 빠르게 회전
// ─────────────────────────────────────────────

interface Props {
  size?: number
  color?: string
  /** false 이면 안쪽 작은 호를 숨김 (기본 true) */
  showInner?: boolean
}

export default function LoadingArc({ size = 160, color = '#76d4ff', showInner = true }: Props) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* 바깥 호 — 느리게 회전 */}
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
          animationDuration: '2.2s',
          animationTimingFunction: 'linear',
        }}
      />
      {/* 안쪽 호 — 빠르게 회전 (같은 방향) */}
      {showInner && (
        <div
          className="absolute rounded-full border-4 border-transparent animate-spin"
          style={{
            inset: size * 0.12,
            borderTopColor: color,
            borderLeftColor: `${color}40`,
            animationDuration: '1.4s',
            animationTimingFunction: 'linear',
          }}
        />
      )}
    </div>
  )
}
