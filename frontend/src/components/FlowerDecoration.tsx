import { useId } from 'react'

// 원래 bg-petals.png와 동일한 위치 — drift 애니메이션으로 그 자리에서 흘러내림
// animation-delay 음수 = 이미 진행 중인 상태로 시작 (화면 초기부터 꽃잎 보임)
const PETALS = [
  { top: '8%',  left: '38%', size: 36, duration: 7.2, delay: -1.5, alt: false },
  { top: '12%', left: '78%', size: 32, duration: 6.5, delay: -0.8, alt: true  },
  { top: '28%', left: '12%', size: 40, duration: 8.0, delay: -2.4, alt: false },
  { top: '32%', left: '60%', size: 50, duration: 6.8, delay: -3.2, alt: true  },
  { top: '45%', left: '32%', size: 38, duration: 7.5, delay: -1.0, alt: false },
  { top: '52%', left: '88%', size: 34, duration: 6.2, delay: -4.0, alt: true  },
  { top: '58%', left: '14%', size: 36, duration: 7.8, delay: -2.0, alt: false },
  { top: '64%', left: '56%', size: 42, duration: 6.5, delay: -0.5, alt: true  },
  { top: '72%', left: '72%', size: 30, duration: 8.2, delay: -3.5, alt: false },
  { top: '78%', left: '22%', size: 54, duration: 7.0, delay: -1.8, alt: true  },
  { top: '86%', left: '50%', size: 32, duration: 6.9, delay: -4.5, alt: false },
  { top: '92%', left: '82%', size: 48, duration: 7.4, delay: -2.8, alt: true  },
]

export default function FlowerDecoration() {
  const uid = useId()
  const petalGradId = `petal-grad-${uid}`
  const petalSymbolId = `petal-sym-${uid}`

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: 'soft-light' }}
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <radialGradient id={petalGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#71FFFD" />
            <stop offset="100%" stopColor="#55BEF7" />
          </radialGradient>
          <symbol id={petalSymbolId} viewBox="0 0 100 100">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="50"
                cy="28"
                rx="14"
                ry="22"
                fill={`url(#${petalGradId})`}
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="5" fill="#FFFFE8" opacity="0.8" />
          </symbol>
        </defs>
      </svg>
      {PETALS.map((p, i) => (
        <svg
          key={i}
          className="absolute"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `${p.alt ? 'drift-alt' : 'drift'} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
          aria-hidden
        >
          <use href={`#${petalSymbolId}`} width="100%" height="100%" />
        </svg>
      ))}
    </div>
  )
}
