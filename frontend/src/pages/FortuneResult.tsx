// ─────────────────────────────────────────────
// FortuneResult — uiux 6/7: 운세 결과 화면 (총운)
//
// 레이아웃:
//   AppLayout
//   └─ 좌상단: 날짜
//   └─ 중앙 콘텐츠 (세로 스택)
//       ├─ 별자리 이름 + 아이콘
//       ├─ "총운" 레이블 + 구분선 + fortune.summary 텍스트
//       ├─ FortuneCircle 3개 가로 나열
//       │   (relationship/money/work + 각 score)
//       └─ GlassCard(pill) CTA: "당신에게 필요한 꽃을 확인해보세요"
//   └─ 하단 NavArrow
//       ├─ left: "다시 선택하기" → /select
//       └─ right: "행운 요소 확인하기" → /fortune/:zodiac/lucky
//
// 라우트: /fortune/:zodiac
// ─────────────────────────────────────────────

// TODO: FortuneResult 구현
// import { useParams, useNavigate } from 'react-router-dom';
// import AppLayout from '../layouts/AppLayout';
// import FortuneCircle from '../components/FortuneCircle';
// import NavArrow from '../components/NavArrow';
// import GlassCard from '../components/GlassCard';
// import { useFortuneFlow } from '../hooks/useFortuneFlow';
// export default function FortuneResult() { ... }
