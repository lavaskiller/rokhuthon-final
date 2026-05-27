// ─────────────────────────────────────────────
// FortuneLoading — uiux 3: 운세 로딩 화면
//
// 레이아웃:
//   AppLayout (starOpacity=0.40)
//   └─ 좌상단: 날짜 텍스트 "YYYY. MM. DD"
//   └─ 중앙: LoadingArc + 별자리 아이콘
//   └─ 하단 텍스트: "별의 흐름을 읽는 중이에요…"
//
// 동작:
//   마운트 시 fetchFortune(selectedZodiac) 호출 (백그라운드)
//   API 응답 완료 → navigate('/fortune/:zodiac')
//   selectedZodiac 없으면 → navigate('/')로 리다이렉트 (직접 URL 접근 방지)
// ─────────────────────────────────────────────

// TODO: FortuneLoading 구현
// import { useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import AppLayout from '../layouts/AppLayout';
// import LoadingArc from '../components/LoadingArc';
// import { useFortuneFlow } from '../hooks/useFortuneFlow';
// export default function FortuneLoading() { ... }
