// ─────────────────────────────────────────────
// FlowerResult — uiux 15: 꽃 추천 결과 화면
//
// 레이아웃:
//   AppLayout
//   └─ 상단 행: 헤딩 "오늘을 위한 꽃 추천을 해드릴게요" + FortuneBadge 3개
//   └─ 중단: FlowerCard (꽃 이미지 + flower.name + flower.subtitle + flower.description)
//   └─ 하단 3열 정보 카드 (GlassCard)
//       ├─ "꽃말": flower.meanings (3항목 세로 나열)
//       ├─ "기대되는 행운": flower.luckItems
//       └─ "함께 두면 좋은 장소": flower.places
//   └─ 우하단 CTA: "꽃 출력하기 →" → /flower/:zodiac/print
//
// 라우트: /flower/:zodiac
// ─────────────────────────────────────────────

// TODO: FlowerResult 구현
// import { useParams, useNavigate } from 'react-router-dom';
// import AppLayout from '../layouts/AppLayout';
// import FortuneCircle from '../components/FortuneCircle'; // FortuneBadge(size='sm')
// import GlassCard from '../components/GlassCard';
// import { useFortuneFlow } from '../hooks/useFortuneFlow';
// export default function FlowerResult() { ... }
