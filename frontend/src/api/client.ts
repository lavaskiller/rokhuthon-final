// ─────────────────────────────────────────────
// API 클라이언트 — 백엔드 FastAPI 연결
//
// baseURL: import.meta.env.VITE_API_BASE_URL (기본: http://localhost:8000)
// ─────────────────────────────────────────────

import type { ZodiacSign, FortuneResult, LuckyElements, FlowerResult, ZodiacMeta } from '../types';

// TODO: axios 또는 fetch wrapper 구현
// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// GET /api/zodiacs
// 오늘 날짜 기준 12개 별자리 순위 포함 메타 반환
// export async function fetchZodiacs(): Promise<ZodiacMeta[]>

// POST /api/fortune  { zodiac: ZodiacSign }
// Claude API로 생성한 총운 텍스트 + 관계/금전/업무 수치 반환
// export async function fetchFortune(zodiac: ZodiacSign): Promise<FortuneResult>

// POST /api/lucky  { zodiac: ZodiacSign }
// Claude API로 생성한 행운 요소(장소/행동/색상) 반환
// export async function fetchLucky(zodiac: ZodiacSign): Promise<LuckyElements>

// POST /api/flower  { zodiac: ZodiacSign, scores: FortuneScores }
// Claude API로 생성한 꽃 추천 결과 반환
// export async function fetchFlower(zodiac: ZodiacSign, scores: FortuneScores): Promise<FlowerResult>
