// ─────────────────────────────────────────────
// Figma "별자리아이콘 2" 인스턴스 — 조각 SVG 배치 데이터 (별자리순위 화면)
//
// box   : 카드 타원(169.8×193) 좌상단 기준 아이콘 박스 [left, top, width, height] px
// parts : [박스 기준 inset, 파일명, 이미지 inset, transform?]
//         이미지 inset 은 Figma 벡터의 stroke 여백만큼 음수로 넓힌 영역
// card / frame : 카드 배경 타원, 상하 장식 프레임 변형 (Figma 원본 그대로)
// 에셋 위치: /assets/zodiacs/rank/
// ─────────────────────────────────────────────

import type { ZodiacSign } from '../types'

export type IconPart = [inset: string, file: string, imgInset: string, transform?: string]

export interface ZodiacFigmaIcon {
  box: [number, number, number, number]
  parts: IconPart[]
  card: '85' | '87' | '88'
  frame: 'a' | 'b'
  /** 조각이 박스 위로 삐져나온 만큼(px) — 원 중앙 정렬 등 단독 배치 시 보정 */
  shiftY?: number
}

export const ZODIAC_FIGMA_ICONS: Record<ZodiacSign, ZodiacFigmaIcon> = {
  pisces: {
    box: [48.12, 66.68, 78.31, 78.8], card: '85', frame: 'a', shiftY: 25.17,
    parts: [
      ['-31.94% 0 31.95% 50%', 'pisces-a.svg', '-1.27% -2.56% -0.96% -2.43%', 'rotate(180deg)'],
      ['-31.94% 50.01% 31.95% 0', 'pisces-b.svg', '-1.27% -2.56% -0.96% -2.43%'],
    ],
  },
  aquarius: {
    box: [27.17, 29, 104, 91], card: '87', frame: 'b',
    parts: [['0', 'aquarius.svg', '0']],
  },
  leo: {
    box: [47.35, 42, 76, 78], card: '88', frame: 'b',
    parts: [
      ['83.33% 44.7% 14.82% 45.76%', 'leo-a.svg', '-69.25% -13.8% -69.26% -13.81%'],
      ['0', 'leo-b.svg', '-1.28% -1.32%'],
    ],
  },
  gemini: {
    // 81×87 원본을 87×81 박스 중앙에서 90° 회전
    box: [41.51, 43, 87, 81], card: '88', frame: 'b',
    parts: [['-3px 3px', 'gemini.svg', '-1.15% -1.23%', 'rotate(90deg)']],
  },
  libra: {
    box: [41.73, 46, 86.9, 74], card: '88', frame: 'b',
    parts: [['0 0.01% 0 0', 'libra.svg', '-1.35% -1.15%']],
  },
  aries: {
    box: [40.86, 51, 89, 74], card: '88', frame: 'b',
    parts: [
      ['20.59% 37.31% 45% 37.3%', 'aries-star.svg', '0'],
      ['0 54.68% 30.93% 0', 'aries-horn-l.svg', '-1.96% -2.48%'],
      ['0 0 30.93% 54.69%', 'aries-horn-r.svg', '-1.96% -2.48%', 'scaleX(-1)'],
      ['13.18% 22.41% 0 22.39%', 'aries-face.svg', '-1.56% -2.04%'],
    ],
  },
  virgo: {
    box: [47, 45, 75, 78], card: '85', frame: 'b',
    parts: [['0', 'virgo.svg', '-1.28% -1.34%']],
  },
  taurus: {
    box: [44.18, 41, 84, 86], card: '85', frame: 'b',
    parts: [
      ['66.01% 59.47% 24.27% 24.96%', 'taurus-v67.svg', '-11.96% -7.65%'],
      ['65.87% 25.18% 24.41% 59.25%', 'taurus-v68.svg', '-11.96% -7.65%', 'scaleX(-1)'],
      ['87.08% 45.15% 11.13% 45.3%', 'taurus-g71.svg', '0'],
      ['25.32% 0.28% 0.28% 0.28%', 'taurus-union.svg', '-0.78% -0.6%'],
      ['0 66.91% 59.53% 10.73%', 'taurus-horn-l.svg', '-2.87% -5.33%'],
      ['28.16% 15.86% 63.21% 68.28%', 'taurus-v72.svg', '-13.48% -0.75% -3.21% -7.29%', 'scaleX(-1)'],
      ['22.78% 11.46% 70.36% 76.18%', 'taurus-v73.svg', '-16.96% -9.63% -16.94% -9.63%', 'scaleX(-1)'],
      ['17.41% 12.8% 79.62% 76.3%', 'taurus-v74.svg', '-39.14% -10.93% -39.16% -10.93%', 'scaleX(-1)'],
      ['13.33% 18.68% 82.75% 74.82%', 'taurus-v75.svg', '-29.67% -18.31% -2.02% -4.16%', 'scaleX(-1)'],
      ['10.12% 24.07% 85.87% 70.99%', 'taurus-v76.svg', '-29.01% -24.09% -3.5% -4.42%', 'scaleX(-1)'],
      ['7% 27.12% 89.67% 67.12%', 'taurus-v77.svg', '-34.89% -20.7% -34.9% -20.7%', 'scaleX(-1)'],
      ['3.97% 27.49% 94.92% 67.61%', 'taurus-v78.svg', '-104.08% -24.32% -104.16% -24.32%', 'scaleX(-1)'],
      ['0.09% 10.93% 59.53% 66.72%', 'taurus-v71.svg', '-2.88% -5.33%', 'scaleX(-1)'],
      ['32.6% 34.14% 38.37% 34.04%', 'taurus-star.svg', '0'],
    ],
  },
  scorpio: {
    box: [50.35, 42, 72, 84], card: '88', frame: 'b',
    parts: [['0', 'scorpio.svg', '-0.89% -1.04% 0 -1.04%']],
  },
  sagittarius: {
    box: [43.51, 42, 80.95, 83.98], card: '88', frame: 'b',
    parts: [['0', 'sagittarius.svg', '-1.19% -1.23%']],
  },
  capricorn: {
    box: [43.69, 49, 84, 73], card: '88', frame: 'b',
    parts: [
      ['29.27% 37.77% 41.91% 37.68%', 'capri-star.svg', '0'],
      ['0 53.64% 60.51% 0', 'capri-horn.svg', '-3.47% -2.57%'],
      ['0.11% 0 0 23.13%', 'capri-head.svg', '-1.37% -1.55%'],
      ['35.98% 13.03% 50.38% 12.74%', 'capri-ear.svg', '-10.04% -1.6% -10.02% -1.6%'],
      ['58.09% 29.27% 31.05% 58.45%', 'capri-g75.svg', '-12.62% -9.7% -12.61% -9.7%'],
      ['58.15% 58.55% 30.99% 29.18%', 'capri-g76.svg', '-12.62% -9.7% -12.61% -9.7%', 'scaleX(-1)'],
      ['83.59% 51.94% 14.63% 46.55%', 'capri-nose.svg', '0'],
      ['83.59% 46.46% 14.63% 52.03%', 'capri-nose.svg', '0'],
    ],
  },
  cancer: {
    box: [38.86, 42, 94, 77], card: '88', frame: 'b',
    parts: [
      ['44.45% 38.05% 24.82% 39.27%', 'cancer-star.svg', '0'],
      ['37.82% 57.94% 56.97% 38.74%', 'cancer-eye-l.svg', '-24.98% -32.08% -24.97% -32.08%'],
      ['0', 'cancer-body.svg', '-1.3% -1.06%'],
      ['37.82% 38.74% 56.97% 57.94%', 'cancer-eye-r.svg', '-24.98% -32.08% -24.97% -32.08%'],
    ],
  },
}

export const CARD_BG_INSET: Record<ZodiacFigmaIcon['card'], string> = {
  '85': '-1.04% -3.53% -5.18% -3.53%',
  '87': '-0.88% -3.36% -5.03% -3.36%',
  '88': '-1.04% -3.53% -5.18% -3.53%',
}
