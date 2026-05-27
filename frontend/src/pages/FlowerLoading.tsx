// ─────────────────────────────────────────────
// FlowerLoading — uiux 11~14: 꽃 로딩 화면
//
// 레이아웃:
//   AppLayout (starOpacity=0.40)
//   └─ 좌상단: 날짜
//   └─ 중앙: FlowerBloom(animated=true, onComplete=handleComplete)
//            개화 시퀀스: 25→50→75→100% (각 800ms)
//   └─ 하단 텍스트: "오늘의 꽃을 피우는 중이에요"
//
// 동작:
//   FlowerBloom onComplete → navigate('/flower/:zodiac')
//   flower 데이터가 API 응답 전 onComplete 도달 시:
//     navigate를 지연 (flower 수신 대기 후 이동)
//
// 라우트: /loading/flower
// ─────────────────────────────────────────────

// TODO: FlowerLoading 구현
// import AppLayout from '../layouts/AppLayout';
// import FlowerBloom from '../components/FlowerBloom';
// import { useFortuneFlow } from '../hooks/useFortuneFlow';
// import { useNavigate } from 'react-router-dom';
// export default function FlowerLoading() { ... }
