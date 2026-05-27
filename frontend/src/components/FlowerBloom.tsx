// ─────────────────────────────────────────────
// FlowerBloom — 꽃 개화 상태 컴포넌트
//
// 사용처: FlowerLoading (uiux 11~14) 중앙 꽃 그래픽
//
// 시퀀스:
//   Figma 자산 파일명(25/50/75/100)은 컴포넌트 variant 라벨 기준이지만,
//   시각적으로 100=한 잎(가장 닫힘) → 25=만개 흐름이라 역순으로 재생.
//
// 동작:
//   - state prop: 정적 표시 (단계 직접 지정)
//   - animated=true: stepDuration 마다 100→75→50→25 자동 전환
//     마지막 단계(25=만개) 도달 후 onComplete 콜백
//
// 전이:
//   각 단계 entrance — opacity 0→1, scale 0.55→1.0, rotate -8°→0°
//   exit            — opacity 1→0, scale 1.0→1.18, rotate 0°→6°
//   서로 다른 방향의 transform 으로 "새 꽃잎이 펼쳐지며 이전 형태를 덮는" 느낌
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import type { BloomState } from '../types'

interface Props {
  state?: BloomState
  animated?: boolean
  /** 단계당 ms — 기본 750 (총 약 3초로 만개 도달) */
  stepDuration?: number
  onComplete?: () => void
}

// 시각적 흐름: 한 잎(100) → 더 펼쳐짐 → 만개(25)
const SEQUENCE: BloomState[] = [100, 75, 50, 25]

const STAGE_SRC: Record<BloomState, string> = {
  100: '/assets/bloom-100.png',
  75: '/assets/bloom-75.png',
  50: '/assets/bloom-50.png',
  25: '/assets/bloom-25.png',
}

export default function FlowerBloom({
  state = SEQUENCE[0],
  animated = false,
  stepDuration = 750,
  onComplete,
}: Props) {
  const [current, setCurrent] = useState<BloomState>(animated ? SEQUENCE[0] : state)

  // onComplete 가 매 렌더 새 참조여도 effect 재실행되지 않게 ref 보관
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!animated) {
      setCurrent(state)
      return
    }
    let step = 0
    setCurrent(SEQUENCE[0])
    const id = setInterval(() => {
      step++
      if (step >= SEQUENCE.length) {
        clearInterval(id)
        onCompleteRef.current?.()
        return
      }
      setCurrent(SEQUENCE[step])
      if (step === SEQUENCE.length - 1) {
        clearInterval(id)
        setTimeout(() => onCompleteRef.current?.(), stepDuration)
      }
    }, stepDuration)
    return () => clearInterval(id)
  }, [animated, state, stepDuration])

  // 진행 비율: 0 (한 잎) → 1 (만개) — 단계 인덱스 기준
  const idx = SEQUENCE.indexOf(current)
  const progress = idx >= 0 ? idx / (SEQUENCE.length - 1) : 0

  return (
    <div
      role="img"
      aria-label={`꽃 개화 ${Math.round(progress * 100)}%`}
      aria-valuenow={Math.round(progress * 100)}
      className="relative"
      // LoadingArc 220px 안에 60% 정도 차지하도록 작게 — 원 안에 안정적으로 들어감
      style={{ width: 132, height: 124 }}
    >
      {SEQUENCE.map((s, i) => {
        const isActive = i === idx
        const isPast = i < idx
        const isFuture = i > idx
        // 인접 단계는 부드러운 자연스러운 변화, 멀리 있는 단계는 완전 숨김
        const distance = Math.abs(i - idx)

        let transform = 'scale(1)'
        let opacity = 1
        if (isPast) {
          // 직전 단계는 살짝만 부풀며 천천히 페이드아웃 (자연스러운 잔상)
          transform = distance === 1 ? 'scale(1.08)' : 'scale(1.15)'
          opacity = 0
        } else if (isFuture) {
          // 다음 단계는 작게 대기, 인접일수록 큰 사이즈로 미리 자리잡음
          transform = distance === 1 ? 'scale(0.85)' : 'scale(0.6)'
          opacity = 0
        }

        return (
          <img
            key={s}
            src={STAGE_SRC[s]}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.45,0.05,0.35,1)]"
            style={{
              transformOrigin: '50% 55%',
              transform,
              opacity,
              zIndex: isActive ? 2 : 1,
            }}
          />
        )
      })}
    </div>
  )
}
