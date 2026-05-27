// ─────────────────────────────────────────────
// AppLayout — 모든 화면 공통 레이아웃
//
// 책임:
//   - StarBackground 합성 (그라디언트 + 별 + 언덕 + 꽃잎)
//   - 좌측 세로 "별꽃노리" 브랜드 텍스트 (옵션)
//   - children: 페이지 콘텐츠 슬롯
//
// Props:
//   starOpacity?     — 화면별 별 투명도 (기본 0.23, 로딩 화면 0.40)
//   showBrand?       — 좌측 브랜드 텍스트 표시 여부 (기본 false)
//                       Landing(uiux 1) 등에서만 true
//   children         — 페이지 콘텐츠
// ─────────────────────────────────────────────

import StarBackground from '../components/StarBackground';

interface Props {
  starOpacity?: number;
  showBrand?: boolean;
  showFlowers?: boolean;
  children: React.ReactNode;
}

export default function AppLayout({
  starOpacity,
  showBrand = false,
  showFlowers = false,
  children,
}: Props) {
  return (
    <StarBackground starOpacity={starOpacity} showFlowers={showFlowers}>
      <div className="relative h-full w-full font-gowun text-white page-enter">
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
