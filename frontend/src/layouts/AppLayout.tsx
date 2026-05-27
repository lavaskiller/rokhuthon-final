import StarBackground from '../components/StarBackground';

interface Props {
  starOpacity?: number;
  /** 상단 중앙 "별꽃노리" 브랜드 표시 여부 (기본 false) */
  showBrand?: boolean;
  children: React.ReactNode;
}

export default function AppLayout({
  starOpacity,
  showBrand = false,
  children,
}: Props) {
  return (
    <StarBackground starOpacity={starOpacity}>
      <div className="relative min-h-screen w-full font-gowun text-white">
        {showBrand && (
          <div className="absolute left-1/2 top-10 z-20 flex -translate-x-1/2 items-center gap-4">
            <div className="h-px w-24 bg-white/40" />
            <span className="text-xl whitespace-nowrap tracking-wider">별꽃노리</span>
            <div className="h-px w-24 bg-white/40" />
          </div>
        )}
        {children}
      </div>
    </StarBackground>
  );
}
