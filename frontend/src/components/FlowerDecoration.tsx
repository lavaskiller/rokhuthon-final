import { useId } from 'react'

// 낙화 꽃잎 설정 — left(화면 가로 위치), duration(초), delay(음수=이미 진행 중)
const PETALS = [
  { left: '8%',  size: 28, duration: 6.2, delay: -1.0, alt: false },
  { left: '18%', size: 22, duration: 5.5, delay: -3.8, alt: true  },
  { left: '30%', size: 34, duration: 7.1, delay: -0.5, alt: false },
  { left: '42%', size: 20, duration: 5.8, delay: -4.5, alt: true  },
  { left: '55%', size: 30, duration: 6.5, delay: -2.2, alt: false },
  { left: '66%', size: 26, duration: 5.2, delay: -5.0, alt: true  },
  { left: '75%', size: 36, duration: 6.9, delay: -1.5, alt: false },
  { left: '85%', size: 24, duration: 5.6, delay: -3.1, alt: true  },
  { left: '12%', size: 32, duration: 7.4, delay: -6.0, alt: false },
  { left: '92%', size: 20, duration: 6.0, delay: -2.8, alt: true  },
  { left: '48%', size: 26, duration: 5.9, delay: -5.5, alt: false },
  { left: '62%', size: 30, duration: 6.7, delay: -0.8, alt: true  },
]

export default function FlowerDecoration() {
  const uid = useId()
  const petalGradId = `petal-grad-${uid}`
  const petalSymbolId = `petal-sym-${uid}`

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
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
            top: 0,
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
