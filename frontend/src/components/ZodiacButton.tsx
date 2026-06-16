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
  onHover?: (id: ZodiacSign) => void;
}

// 1·2·3등 전용 스타일 토큰
const MEDAL: Record<number, { rank: string; pill: string; glow: string }> = {
  1: {
    rank: 'text-[#FFD966] drop-shadow-[0_0_6px_rgba(255,217,102,0.8)]',
    pill: 'bg-[rgba(255,217,102,0.14)] border-[rgba(255,217,102,0.45)]',
    glow: 'shadow-[0_0_14px_rgba(255,217,102,0.35)]',
  },
  2: {
    rank: 'text-[#E8EEF4] drop-shadow-[0_0_8px_rgba(232,238,244,0.95)]',
    pill: 'bg-[rgba(220,230,240,0.18)] border-[rgba(220,230,240,0.60)]',
    glow: 'shadow-[0_0_12px_rgba(220,230,240,0.40)]',
  },
  3: {
    rank: 'text-[#E8B48A] drop-shadow-[0_0_6px_rgba(232,180,138,0.7)]',
    pill: 'bg-[rgba(232,180,138,0.13)] border-[rgba(232,180,138,0.38)]',
    glow: 'shadow-[0_0_10px_rgba(232,180,138,0.25)]',
  },
}

export default function ZodiacButton({ meta, selected, onClick, onHover }: Props) {
  const medal = MEDAL[meta.rank]

  return (
    <button
      type="button"
      onClick={() => onClick(meta.id)}
      onMouseEnter={() => onHover?.(meta.id)}
      aria-label={`${meta.name} ${meta.dateRange}, 오늘의 운세 순위 ${meta.rank}위`}
      className="group flex w-full items-center gap-2.5 focus:outline-none"
    >
      {/* 순위 숫자 — 1·2·3등은 메달 색상 */}
      <span className={[
        'w-7 shrink-0 text-center text-[22px] font-normal leading-none tabular-nums',
        medal ? medal.rank : 'text-white/80',
      ].join(' ')}>
        {meta.rank}
      </span>

      {/* 글래스모피즘 pill */}
      <div
        className={[
          'flex h-[50px] flex-1 min-w-0 items-center gap-3 rounded-full border p-0 pr-4 backdrop-blur-md',
          'transition-all duration-150',
          selected
            ? 'border-[#71fffd] bg-white/30 shadow-[0_0_14px_rgba(113,255,253,0.5)]'
            : medal
              ? `${medal.pill} ${medal.glow} group-hover:brightness-125`
              : 'border-white/15 bg-[rgba(218,249,255,0.18)] group-hover:bg-[rgba(218,249,255,0.42)] group-hover:border-white/40 group-hover:shadow-[0_0_10px_rgba(113,255,253,0.25)]',
          'group-focus-visible:ring-2 group-focus-visible:ring-[#71fffd]',
        ].join(' ')}
      >
        {/* 원형 thumb */}
        <span className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#71fffd] bg-[#0a205c]/60">
          <img src={meta.iconUrl} alt={meta.name} className="w-8 h-8 object-contain" />
        </span>

        {/* 한글 이름 + 날짜 */}
        <span className="whitespace-nowrap text-lg tracking-wide text-white">
          {meta.name}
          <span className="ml-2 text-white">({meta.dateRange})</span>
        </span>
      </div>
    </button>
  );
}
