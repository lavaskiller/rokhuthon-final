// ─────────────────────────────────────────────
// ZodiacSelect — uiux 2: 별자리 선택 화면
//
// 레이아웃:
//   - 딥 네이비-퍼플 그라디언트 배경 (#0a205c → #44257e)
//   - 헤더: "당신의 별자리를 선택하세요" + 양쪽 가로선 사이 "오늘의 별자리 순위"
//   - 그리드: 2열 × 6행, 컬럼 우선 채움 (좌:1~6, 우:7~12)
//
// 동작:
//   - 클릭 시 selected 상태로 시각 피드백 → 180ms 후 /loading/fortune 으로 이동
//   - 중복 클릭 방지 (selected 가 있으면 무시)
//
// TODO (의존성 구현 후 교체):
//   - api/client.ts의 fetchZodiacs() 로 실제 오늘자 순위 수신
//   - useFortuneFlow().selectZodiac(id) 로 전역 상태 + Claude 호출 트리거
// ─────────────────────────────────────────────

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import ZodiacButton from '../components/ZodiacButton';
import { ZODIAC_LIST } from '../constants/zodiacs';
import type { ZodiacMeta, ZodiacSign } from '../types';

// 서버 fetchZodiacs() 미구현 폴백 — 입력 순서를 그대로 순위로 사용
function buildFallbackRanking(): ZodiacMeta[] {
  return ZODIAC_LIST.map((z, i) => ({ ...z, rank: i + 1 }));
}

export default function ZodiacSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ZodiacSign | null>(null);

  // TODO: useEffect + fetchZodiacs() 로 교체. 폴백은 그대로 유지(오프라인/실패 시).
  const zodiacs = useMemo(buildFallbackRanking, []);

  const handleSelect = (id: ZodiacSign) => {
    if (selected) return; // 이중 네비게이션 방지
    setSelected(id);
    // 가벼운 시각 피드백 후 로딩 화면으로 이동
    window.setTimeout(() => navigate('/loading/fortune'), 180);
  };

  return (
    <AppLayout>
      {/* 헤더 */}
      <header className="flex flex-col items-center gap-3 px-6 pb-10 pt-14">
        <p className="text-sm text-white/85">당신의 별자리를 선택하세요</p>
        <div className="flex items-center gap-4">
          <span className="h-px w-24 bg-white/70" aria-hidden />
          <h1 className="text-xl font-bold tracking-[0.18em]">
            오늘의 별자리 순위
          </h1>
          <span className="h-px w-24 bg-white/70" aria-hidden />
        </div>
      </header>

      {/* 12 별자리 그리드 — 컬럼 우선으로 채워 좌측이 1~6, 우측이 7~12 가 되도록 */}
      <section className="mx-auto max-w-2xl px-5 pb-12">
        <ul
          role="listbox"
          aria-label="별자리 선택"
          className="grid grid-flow-col grid-cols-2 grid-rows-6 gap-x-4 gap-y-3"
        >
          {zodiacs.map((z) => (
            <li key={z.id} role="option" aria-selected={selected === z.id}>
              <ZodiacButton
                meta={z}
                selected={selected === z.id}
                onClick={handleSelect}
              />
            </li>
          ))}
        </ul>
      </section>
    </AppLayout>
  );
}
