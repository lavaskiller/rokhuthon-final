# 별꽃노리 — 협업 가이드

## 프로젝트 개요

별자리 기반 운세와 꽃 추천 웹앱입니다.  
별자리를 선택하면 오늘의 운세(관계/금전/업무)를 분석하고, 가장 약한 운을 보완해주는 꽃을 추천합니다.

**유저 플로우**
```
랜딩 → 별자리 선택 → 운세 로딩 → 운세 결과(총운) → 행운 요소 → 꽃 로딩 → 꽃 추천 → 출력 카드
```

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) |
| 데이터 | 정적 가상 테이블 (운세 3종 × 12 별자리, 꽃 3종) |
| 폰트 | Gowun Batang (Google Fonts) |

---

## 프로젝트 구조

```
rokhuthon_final/
├── frontend/
│   └── src/
│       ├── pages/        # 라우트별 화면 (Landing ~ FlowerPrint)
│       ├── components/   # 재사용 컴포넌트
│       ├── layouts/      # 공통 레이아웃
│       ├── hooks/        # 커스텀 훅 (useFortuneFlow)
│       ├── api/          # 백엔드 API 클라이언트
│       ├── types/        # TypeScript 타입 정의
│       └── constants/    # 별자리 메타 데이터
└── backend/
    ├── main.py           # FastAPI 진입점
    ├── routers/          # API 엔드포인트
    ├── services/         # 비즈니스 로직
    └── data/             # 운세·꽃 가상 테이블
```

---

## 개발 환경 세팅

### Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux
pip install fastapi uvicorn
uvicorn main:app --reload   # http://localhost:8000
```

### 환경 변수
`backend/.env` 파일 생성:
```
CORS_ORIGIN=http://localhost:5173
```

---

## 브랜치 전략

`master` 브랜치는 **보호**되어 있습니다.  
직접 push는 불가하며, 반드시 PR을 통해 머지해야 합니다.

### 브랜치 네이밍

| 유형 | 형식 | 예시 |
|------|------|------|
| 기능 개발 | `feat/기능명` | `feat/landing-page` |
| 버그 수정 | `fix/버그명` | `fix/fortune-score` |
| 리팩토링 | `refactor/대상` | `refactor/flower-table` |
| 문서 | `docs/내용` | `docs/api-spec` |

### 작업 흐름

```
1. master에서 브랜치 생성
   git checkout -b feat/my-feature

2. 작업 후 커밋
   git add .
   git commit -m "feat: 내용 설명"

3. 원격에 push
   git push origin feat/my-feature

4. GitHub에서 Pull Request 생성
   - base: master ← compare: feat/my-feature
   - 제목과 변경 내용 간략히 작성

5. 리뷰어 승인 후 머지
```

> ⚠️ `master`에 직접 push하면 거부됩니다.  
> 반드시 PR → 승인 1개 이상 → 머지 순서를 따르세요.

---

## 커밋 메시지 규칙

```
<type>: <내용>

feat     새 기능
fix      버그 수정
refactor 기능 변경 없는 코드 개선
docs     문서 수정
style    포맷·스타일만 변경
chore    빌드·설정 변경
```

**예시**
```
feat: ZodiacSelect 페이지 구현
fix: 날짜 seed 계산 오류 수정
refactor: 꽃 테이블 3개로 단순화
```

---

## API 엔드포인트 요약

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/zodiacs` | 12개 별자리 + 오늘 순위 |
| POST | `/api/fortune` | 별자리 → 총운 텍스트 + 수치 |
| POST | `/api/lucky` | 별자리 → 행운 요소 (장소/행동/색상) |
| POST | `/api/flower` | 별자리 + 수치 → 꽃 추천 (메인 1 + 서브 2) |
| GET | `/health` | 서버 상태 확인 |

**꽃 추천 로직**  
세 운 수치 중 가장 낮은 타입의 꽃을 메인으로 추천합니다.
```
scores = {relationship: 85, money: 40, work: 70}
→ main: 해바라기 (금전운 보완)
→ subs: 라벤더(업무운), 장미(관계운)
```

---

## 문의

작업 전 이슈를 먼저 생성하거나 담당자에게 확인해 주세요.
