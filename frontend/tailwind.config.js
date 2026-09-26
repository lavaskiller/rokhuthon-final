/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gowun: ['"Gowun Batang"', 'serif'],
        sejong: ['"SejongGeulggot"', 'serif'],
      },
      colors: {
        // ── Figma 20260926 "UIUX 최종" 디자인 토큰 ──────────────
        // 화면 작업 시 hex/rgba 를 직접 쓰지 말고 아래 토큰을 사용할 것
        petal: {
          card: '#ad3a59',                     // 정보 카드 배경 (SurfaceCard, opacity 42%)
          primary: 'rgba(255,193,198,0.46)',   // 주요 버튼 — "출력하기", "행운의 꽃 확인"
          secondary: 'rgba(255,255,255,0.19)', // 보조 버튼 — "이전화면"
          cta: 'rgba(255,171,194,0.8)',        // 표지 CTA — "내 별꽃 운세 보러가기"
          cream: '#fff6ef',                    // 원형 화살표 아이콘, 버튼 inset 하이라이트
          highlight: '#ffdbdb',                // 강조 텍스트/라인
        },
        'sky-fallback': '#b0506e',             // 배경 이미지 로드 전 바탕색
        zodiac: {
          name: '#a21f53',                     // 별자리순위 카드 — 별자리 이름
          date: '#db427f',                     // 별자리순위 카드 — 날짜 범위
          fade: '#e96680',                     // 별자리순위 상단 그라디언트 시작색
          'fade-end': 'rgba(255,170,179,0)',   // 별자리순위 상단 그라디언트 끝색
        },
        radar: {
          area: '#ef759a',                     // 오늘의운세 레이더 — 데이터 영역 (opacity 50%)
          line: '#ffc2c2',                     // 오늘의운세 레이더 — 데이터 외곽선
          overall: '#fb729b',                  // 총운 점 / 범례
          money: '#ffbbb2',                    // 금전 운 점 / 범례
          work: '#ffc9d9',                     // 업무 운 점 / 범례
        },

        // ── 이전 디자인(남색 우주) 토큰 — 화면 이전 완료 후 제거 예정 ──
        accent: '#76d4ff',
        fortune: {
          relationship: '#aff3ff',
          money: '#afceff',
          work: '#bfafff',
        },
      },
      fontSize: {
        display: ['48px', { lineHeight: 'normal' }], // 표지 제목
        title: ['32px', { lineHeight: 'normal' }],   // 화면 제목 — "오늘의 행운의 꽃"
        button: ['24px', { lineHeight: 'normal' }],  // 버튼 라벨
        label: ['20px', { lineHeight: 'normal' }],   // 카드 제목, 부제
        body: ['16px', { lineHeight: '1.8' }],       // 카드 본문 리스트
      },
      borderRadius: {
        card: '60px',  // SurfaceCard
        pill: '100px', // PillButton
      },
      boxShadow: {
        'cta-inset': 'inset 0 2px 2px 0 rgba(255,246,239,0.52)',
      },
      dropShadow: {
        title: '0 3px 2.5px rgba(0,0,0,0.13)', // 표지 제목 text-shadow
      },
    },
  },
  plugins: [],
}
