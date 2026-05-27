# 별꽃노리 (Byeolkkot-nori)

> 오늘의 별꽃 운세 — 별자리 기반 운세 & 꽃 추천 웹앱

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) |
| 데이터 | 정적 가상 테이블 (운세 3종 × 12 별자리, 꽃 3종) |
| Font | Gowun Batang (Google Fonts) |

## 유저 플로우

```
[uiux 1] 랜딩
    ↓ "내 별꽃 운세 보러가기"
[uiux 2] 별자리 선택 (12종)
    ↓
[uiux 3] 운세 로딩 ("별의 흐름을 읽는 중이에요…")
    ↓
[uiux 6/7] 운세 결과 — 총운 텍스트 + 관계/금전/업무 게이지
    ↓ "행운 요소 확인하기 →"
[uiux 8/9/10] 행운 요소 — 장소 / 행동 / 색상
    ↓ "당신에게 필요한 꽃을 확인해보세요"
[uiux 11~14] 꽃 로딩 (개화 애니메이션 25→50→75→100%)
    ↓
[uiux 15] 꽃 추천 결과 — 꽃 이름/꽃말/기대 행운/추천 장소
    ↓ "꽃 출력하기"
[uiux 16] 출력 카드 (인쇄용)
```

## 프로젝트 구조

```
rokhuthon_final/
├── frontend/
│   ├── src/
│   │   ├── pages/          # 라우트별 화면
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── layouts/        # 공통 레이아웃
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── api/            # 백엔드 API 클라이언트
│   │   ├── types/          # TypeScript 타입 정의
│   │   └── constants/      # 별자리 데이터 등 상수
│   └── public/
│       └── assets/         # 배경, 꽃 이미지
└── backend/
    ├── main.py
    ├── routers/
    ├── services/
    └── prompts/            # Claude API 프롬프트 템플릿
```

---

## TODO

### 🔧 환경 세팅
- [x] `frontend/` — Vite + React + TypeScript 프로젝트 초기화
- [x] Tailwind CSS 설정 (`tailwind.config.js`, `postcss.config.cjs`)
- [x] Gowun Batang 폰트 import (Google Fonts)
- [x] `backend/` — FastAPI 프로젝트 초기화 (`requirements.txt`)
- [x] `.env.example` — CORS origin 설정
- [ ] React Router v6 설정 (`src/router.tsx`)

### 🎨 공통 컴포넌트
- [x] `StarBackground` — 딥 네이비-퍼플 그라디언트 + 별 이미지 + 언덕 실루엣 배경
- [ ] `FlowerDecoration` — 꽃잎 파티클 scatter (mix-blend-mode: soft-light)
- [x] `GlassCard` — 글래스모피즘 카드 (`backdrop-blur`, `rgba(218,249,255,0.2)`)
- [x] `AppLayout` — 공통 배경 + "별꽃노리" 브랜드 텍스트 레이아웃

### 📱 페이지 구현
- [ ] `pages/Landing` — uiux 1: 메인 타이틀 + CTA 버튼
- [ ] `pages/ZodiacSelect` — uiux 2: 12개 별자리 선택 그리드
- [ ] `pages/FortuneLoading` — uiux 3: 로딩 스피너 + 텍스트
- [ ] `pages/FortuneResult` — uiux 6/7: 총운 결과 + FortuneCircle 3개
- [ ] `pages/LuckyElements` — uiux 8/9/10: 장소/행동/색상 카드
- [ ] `pages/FlowerLoading` — uiux 11~14: 꽃 개화 애니메이션 로딩
- [ ] `pages/FlowerResult` — uiux 15: 꽃 추천 결과 + 꽃말/행운/장소
- [ ] `pages/FlowerPrint` — uiux 16: 인쇄용 출력 카드

### 🧩 도메인 컴포넌트
- [ ] `components/FortuneCircle` — 원형 게이지 (타입: 관계운/금전운/업무운, 수치: 0~100)
- [x] `components/ZodiacButton` — 별자리 선택 버튼 (아이콘 + 이름 + 날짜범위 + 순위)
- [ ] `components/FlowerBloom` — 꽃 개화 상태 SVG (prop: 25 | 50 | 75 | 100)
- [ ] `components/LoadingArc` — 회전 호(arc) 로딩 인디케이터
- [ ] `components/LuckyCard` — 행운 요소 카드 (타입: 장소/행동/색상)
- [ ] `components/FlowerCard` — 꽃 추천 메인 카드 (이미지 + 이름 + 설명)
- [ ] `components/PrintCard` — 인쇄용 카드 (흰 배경 + 노란 하단 띠)
- [ ] `components/FortuneBadge` — 미니 운세 뱃지 (소형 원형, uiux 15에서 사용)
- [ ] `components/NavArrow` — "← 이전 / 다음 →" 네비게이션 링크

### 🔌 백엔드 API
- [x] `POST /api/fortune` — 별자리 → 총운 텍스트 + 관계/금전/업무 수치 (테이블 조회)
- [x] `POST /api/lucky` — 별자리 → 장소/행동/색상 행운 요소 (테이블 조회)
- [x] `POST /api/flower` — 별자리 + 수치 → 꽃 추천 (main 1 + subs 2, 최저 운 보완)
- [x] `GET /api/zodiacs` — 12개 별자리 + 오늘의 순위 반환
- [x] CORS 미들웨어 설정

### 📦 데이터 테이블 (`backend/data/`)
- [x] `fortune_table.py` — 별자리 12종 × 운세 변형 3종 (총운/행운요소/수치)
- [x] `flower_table.py` — 운 타입별 꽃 3종 (장미/해바라기/라벤더)

### 🎬 애니메이션
- [ ] FortuneLoading: 로딩 arc 회전 애니메이션 (CSS `@keyframes rotate`)
- [ ] FlowerLoading: 25→50→75→100% 개화 시퀀스 전환 (타이머 기반)
- [ ] 페이지 전환: fade-in/out 트랜지션

### 🖨️ 출력 기능
- [ ] `FlowerPrint` 페이지에서 `window.print()` 트리거
- [ ] 인쇄용 CSS 미디어쿼리 (`@media print`) — 카드 영역만 출력

### 🧪 QA
- [ ] 전체 유저 플로우 E2E 동선 확인
- [ ] 별자리 12종 전체 케이스 테스트
- [ ] 모바일/가로모드 레이아웃 확인
- [ ] 인쇄 출력 결과 확인
