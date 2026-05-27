// ─────────────────────────────────────────────
// LoadingArc — 회전 호(arc) 로딩 인디케이터
//
// uiux 3 (운세 로딩), uiux 11~14 (꽃 로딩) 중앙 원형 인디케이터에 사용
// 닫히지 않은 호 2개가 반대 방향으로 회전하는 CSS 애니메이션
// ─────────────────────────────────────────────

interface Props {
  size?: number
  color?: string
}

export default function LoadingArc({ size = 160, color = '#76d4ff' }: Props) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Outer arc — clockwise */}
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
          animationDuration: '1s',
        }}
      />
      {/* Inner arc — counter-clockwise */}
      <div
        className="absolute rounded-full border-4 border-transparent animate-spin"
        style={{
          inset: size * 0.1,
          borderBottomColor: color,
          borderLeftColor: `${color}40`,
          animationDirection: 'reverse',
          animationDuration: '1.5s',
        }}
      />
    </div>
  )
}
