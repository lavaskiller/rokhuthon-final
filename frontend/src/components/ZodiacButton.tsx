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
      {/* 순위 — pill 밖, 좌측 정렬 */}
      <span className="w-7 shrink-0 text-center text-[28px] font-bold leading-none text-white/80 tabular-nums">
        {meta.rank}
      </span>

      {/* 글래스모피즘 pill */}
      <div
        className={[
          'flex flex-1 min-w-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 backdrop-blur-md',
          'transition-all duration-150',
          selected
            ? 'border-[#71fffd] bg-white/30 shadow-[0_0_14px_rgba(113,255,253,0.5)]'
            : 'border-white/15 bg-[rgba(218,249,255,0.18)] group-hover:bg-[rgba(218,249,255,0.28)] group-focus-visible:ring-2 group-focus-visible:ring-[#71fffd]',
        ].join(' ')}
      >
        {/* 원형 아이콘 (시안 보더) */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#71fffd] bg-[#0a205c]/60">
          <img
            src={meta.iconUrl}
            alt=""
            className="h-6 w-6 object-contain"
            loading="lazy"
            draggable={false}
            // 에셋 미배치 시 깨진 이미지 아이콘이 보이지 않도록 숨김
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        </span>

        {/* 한글 이름 */}
        <span className="truncate text-sm tracking-wide text-white">
          {meta.name}
        </span>

        {/* 날짜 범위 (우측 정렬) */}
        <span className="ml-auto shrink-0 text-[11px] text-white/60">
          {meta.dateRange}
        </span>
      </div>
    </button>
  );
}
