// ─────────────────────────────────────────────
// ZodiacSelect — uiux 2: 별자리 선택 화면
//
// 레이아웃:
//   AppLayout
//   └─ 헤더 세로 텍스트
//       ├─ 서브: "당신의 별자리를 선택하세요"
//       └─ 메인: "오늘의 별자리 순위" (Bold)
//   └─ 2열 6행 ZodiacButton 그리드 (순위 1~12)
//
// 데이터:
//   마운트 시 fetchZodiacs() 호출 → 순위 포함 ZodiacMeta[] 수신
//   로딩 중: 스켈레톤 or LoadingArc 표시
//
// 동작:
//   ZodiacButton 클릭 → selectZodiac(id) → navigate('/loading/fortune')
// ─────────────────────────────────────────────

// TODO: ZodiacSelect 구현
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AppLayout from '../layouts/AppLayout';
// import ZodiacButton from '../components/ZodiacButton';
// import { useFortuneFlow } from '../hooks/useFortuneFlow';
// import { fetchZodiacs } from '../api/client';
// export default function ZodiacSelect() { ... }
