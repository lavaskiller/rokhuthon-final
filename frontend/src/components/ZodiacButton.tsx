// ─────────────────────────────────────────────
// ZodiacButton — 별자리 선택 버튼 (uiux 2)
//
// 한 줄 구조: [순위 숫자] [pill: 아이콘 · 한글이름 · 날짜범위]
// - 순위 숫자는 pill 바깥(왼쪽)에 위치 (Figma Frame 43/44 분리 패턴)
// - pill 은 글래스모피즘: backdrop-blur + 반투명 bg + 시안 보더(아이콘)
// - selected 시 보더가 시안(#71fffd)으로 강조 + 글로우
//
// 의존: Tailwind v3+, Gowun Batang 폰트 전역 로드 가정
// ─────────────────────────────────────────────

import type { ZodiacMeta, ZodiacSign } from '../types';

interface Props {
  meta: ZodiacMeta;
  selected?: boolean;
  onClick: (id: ZodiacSign) => void;
}

export default function ZodiacButton({ meta, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(meta.id)}
      aria-label={`${meta.name} ${meta.dateRange}, 오늘의 운세 순위 ${meta.rank}위`}
      className="group flex w-full items-center gap-2.5 focus:outline-none"
    >
      {/* 순위 — pill 밖, 조금 작고 얇게 (font-normal = Gowun Batang Regular) */}
      <span className="w-7 shrink-0 text-center text-[22px] font-normal leading-none text-white/80 tabular-nums">
        {meta.rank}
      </span>

      {/* 글래스모피즘 pill — 슬라이딩 토글, h-12 → h-[50px] 로 두께 살짝 더 */}
      <div
        className={[
          'flex h-[50px] flex-1 min-w-0 items-center gap-3 rounded-full border p-0 pr-4 backdrop-blur-md',
          'transition-all duration-150',
          selected
            ? 'border-[#71fffd] bg-white/30 shadow-[0_0_14px_rgba(113,255,253,0.5)]'
            : 'border-white/15 bg-[rgba(218,249,255,0.18)] group-hover:bg-[rgba(218,249,255,0.28)] group-focus-visible:ring-2 group-focus-visible:ring-[#71fffd]',
        ].join(' ')}
      >
        {/* 원형 thumb — pill 과 같은 크기(h-[50px] = 50px), 좌측 끝 정확히 맞붙음 */}
        <span className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#71fffd] bg-[#0a205c]/60">
          <img src={meta.iconUrl} alt={meta.name} className="w-8 h-8 object-contain" />
        </span>

        {/* 한글 이름 + 괄호 안 날짜 — 한 줄, 이름과 날짜 사이 ml-2 여백 */}
        <span className="whitespace-nowrap text-lg tracking-wide text-white">
          {meta.name}
          <span className="ml-2 text-white">({meta.dateRange})</span>
        </span>
      </div>
    </button>
  );
}
