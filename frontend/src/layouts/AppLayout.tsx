// ─────────────────────────────────────────────
// AppLayout — 모든 화면 공통 레이아웃
//
// 책임:
//   - StarBackground 합성 (핑크 하늘 + 구름 + 매달린 별)
//   - 좌측 세로 "별꽃노리" 브랜드 텍스트 (옵션)
//   - children: 페이지 콘텐츠 슬롯
//
// Props:
//   variant          — 'main' | 'loading' | 'landing' (표지는 'landing')
//   showBrand?       — 좌측 브랜드 텍스트 표시 여부 (기본 false)
//   showFlowers?     — @deprecated 'landing' variant 와 동일. 기존 Landing 호환용
//   children         — 페이지 콘텐츠
// ─────────────────────────────────────────────

import StarBackground from '../components/StarBackground';

interface Props {
  variant?: 'main' | 'loading' | 'landing';
  /** @deprecated StarBackground 참고 */
  starOpacity?: number;
  showBrand?: boolean;
  /** @deprecated variant="landing" 사용 */
  showFlowers?: boolean;
  children: React.ReactNode;
}

export default function AppLayout({
  variant = 'main',
  showBrand = false,
  showFlowers = false,
  children,
}: Props) {
  return (
    <StarBackground variant={showFlowers ? 'landing' : variant}>
      <div className="relative min-h-screen w-full font-gowun text-white page-enter">
        {showBrand && (
          <span
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 select-none text-2xl tracking-[0.35em] text-white"
            style={{ writingMode: 'vertical-rl' }}
            aria-label="별꽃노리"
          >
            별꽃노리
          </span>
        )}
        {children}
      </div>
    </StarBackground>
  );
}
