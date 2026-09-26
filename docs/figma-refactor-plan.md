# Figma 리디자인 리팩토링 — 협업 계획

- 디자인: [Figma `20260926` / UIUX 최종](https://www.figma.com/design/vSdl8kWAIUixT0bGXozLjl/20260926?node-id=1-342)
- 인원: 프론트 작업자 2명 + 병합 담당 1명
- 목표: 화면별로 나눠 병렬 작업하되, 공통 파일 충돌을 0에 가깝게

---

## 1. 진행 순서

1. **기반 PR** (`refactor/figma-foundation`) — 공통 파일 정리 후 master 머지 ← *이 PR*
2. 두 작업자가 **머지된 master에서** 각자 브랜치 생성
3. 화면 단위로 작은 PR → 병합 담당이 리뷰·머지
4. 전 화면 이전 완료 후 정리 PR (이전 디자인 토큰·미사용 컴포넌트 제거)

## 2. 공통 파일 — 동결 🔒

기반 PR 머지 후 아래 파일은 **화면 작업 PR에서 수정하지 않습니다.**

| 영역 | 파일 |
|---|---|
| 디자인 토큰 / 전역 스타일 | `frontend/tailwind.config.js`, `frontend/src/index.css`, `frontend/index.html` |
| 레이아웃 / 배경 | `layouts/AppLayout.tsx`, `components/StarBackground.tsx`, `components/FlowerDecoration.tsx` |
| 공통 부품 | `components/PillButton.tsx`, `components/SurfaceCard.tsx`, `components/GlassCard.tsx` |
| 흐름 / 데이터 | `router.tsx`, `hooks/useFortuneFlow.ts`, `types/index.ts`, `api/client.ts`, `constants/zodiacs.ts`, `App.tsx`, `main.tsx` |
| 의존성 | `frontend/package.json`, `frontend/package-lock.json` |
| 백엔드 | `backend/**` |

**공통 파일 수정이 꼭 필요하면**
1. 작업을 멈추지 말고 병합 담당에게 요청
2. 병합 담당이 공통 파일만 담은 작은 PR(`chore/...`)을 먼저 머지
3. 두 작업자는 `git pull --rebase origin master`로 반영

**공통 컴포넌트 모양을 바꾸고 싶으면** 수정하지 말고 내 화면 전용 파일을 새로 만듭니다.
(예: `FortuneCircle` 대신 `RadarChart.tsx` 신규 생성)

## 3. 담당 분배

| | 작업자 1 | 작업자 2 |
|---|---|---|
| Figma 프레임 | 표지, 별자리순위, 오늘의운세 (+ 행운 요소 유지 시) | 로딩1~4, 결과(거베라·장미·수선화), 리디자인05 / 출력 |
| pages | `Landing`, `ZodiacSelect`, `FortuneResult`, `LuckyElements` | `FortuneLoading`, `FlowerLoading`, `FlowerResult`, `FlowerPrint` |
| components | `ZodiacButton`, `ZodiacIcon`, `ZodiacIconPlaceholder`, `FortuneCircle`, `NavArrow`, `LuckyCard` | `LoadingArc`, `FlowerBloom`, `FlowerCard`, `PrintCard` |
| 에셋 | `public/assets/zodiacs/`, 표지 별 장식 | `public/assets/flowers/`, `bloom-*`, 결과 카드 이미지 |

- 새 파일은 자유롭게 추가 가능 (파일명이 겹치지 않도록 화면 이름을 접두어로)
- `FlowerResult`는 새 디자인에서 `FortuneCircle`을 쓰지 않으므로, 작업자 2는 import만 제거하면 됨

## 4. 병합 담당 역할

- PR 리뷰·승인 후 머지 (master 직접 push 금지)
- 머지 순서 관리: 공통 파일 PR → 화면 PR
- 공통 파일 변경 요청 처리
- 머지 후 두 작업자에게 rebase 알림

## 5. 작업 규칙

- **브랜치**: `refactor/figma-<화면>` (예: `refactor/figma-zodiac-select`, `refactor/figma-flower-result`)
- **PR 단위**: 화면 1개 = PR 1개. 작업 중 하루 1회 `git pull --rebase origin master`
- **PR 본문**: 해당 Figma 프레임 링크 + 구현 화면 스크린샷(1194×834) 첨부
- **스타일**: hex/rgba 직접 사용 금지 → `tailwind.config.js` 토큰 사용
- **커밋 메시지**: `CONTRIBUTING.md` 규칙 (`refactor: ...`, `feat: ...`)

## 6. 공통 부품 사용법

### 배경
`AppLayout`이 자동 적용. 표지만 `variant="landing"`, 로딩은 `variant="loading"`(현재 main과 동일 배경).
`starOpacity`, `showFlowers` prop은 호환용으로 남겨둔 것이므로 새 코드에서는 쓰지 않습니다.

### 디자인 토큰 (`tailwind.config.js`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `bg-petal-card` | `#ad3a59` | 정보 카드 (SurfaceCard 내부) |
| `bg-petal-primary` | `rgba(255,193,198,0.46)` | 주요 버튼 |
| `bg-petal-secondary` | `rgba(255,255,255,0.19)` | 보조 버튼 |
| `bg-petal-cta` | `rgba(255,171,194,0.8)` | 표지 CTA |
| `text-petal-cream` / `text-petal-highlight` | `#fff6ef` / `#ffdbdb` | 아이콘·강조 |
| `text-display` / `text-title` / `text-button` / `text-label` / `text-body` | 48 / 32 / 24 / 20 / 16px | 표지 제목 / 화면 제목 / 버튼 / 카드 제목 / 본문(행간 1.8) |
| `rounded-card` / `rounded-pill` | 60px / 100px | 카드 / 버튼 |
| `shadow-cta-inset`, `drop-shadow-title` | | 표지 CTA 하이라이트, 표지 제목 그림자 |

### PillButton
```tsx
<PillButton label="출력하기" onClick={print} />                          // primary, → 아이콘
<PillButton label="행운의 꽃 확인" to="/loading/flower" />                // Link 로 렌더링
<PillButton label="이전화면" variant="secondary" icon="left" to="/select" />
<PillButton label="내 별꽃 운세 보러가기" variant="cta" to="/select" />    // 표지
```

### SurfaceCard
```tsx
<SurfaceCard className="h-[172px] w-[263px] px-7 py-6">
  <p className="text-label font-bold">꽃말</p>
  <ul className="list-disc pl-6 text-body">…</ul>
</SurfaceCard>
```

## 7. 아직 결정되지 않은 사항 (기반 PR 범위 밖)

아래는 흐름/데이터(동결 파일) 변경이 필요하므로 **결정 후 병합 담당이 별도 PR**로 반영합니다.
결정 전까지 화면 작업자는 현재 데이터 구조 그대로 UI만 작업합니다.

- [ ] 행운 요소 페이지 — Figma에 없음. 제거 / 유지
- [ ] 운세 3종 — 관계·금전·업무 → 전체·금전·업무 변경 여부 (백엔드·`types` 영향)
- [ ] 꽃 결과 화면 — 카드 3장 버전 / 세로 결과 카드(리디자인05) 버전
- [ ] 운세 로딩 화면 — 유지 / 꽃 로딩으로 통합
- [ ] Figma 수정 요청 — 천칭자리 중복·궁수자리 누락, 별자리 기간 `(2.19-3.20)` 일괄 플레이스홀더, 수선화 화면 텍스트가 "거베라", 꽃별 문구 동일
