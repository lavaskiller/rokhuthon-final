import { useId } from 'react'

interface Petal { top: string; left: string; size: number; rotate: number; opacity: number }

const PETALS: Petal[] = [
  { top: '8%',  left: '38%', size: 36, rotate: 62,   opacity: 0.7 },
  { top: '12%', left: '78%', size: 32, rotate: 62,   opacity: 0.6 },
  { top: '28%', left: '12%', size: 40, rotate: 174,  opacity: 0.55 },
  { top: '32%', left: '60%', size: 50, rotate: -79,  opacity: 0.55 },
  { top: '45%', left: '32%', size: 38, rotate: 151,  opacity: 0.5 },
  { top: '52%', left: '88%', size: 34, rotate: 62,   opacity: 0.65 },
  { top: '58%', left: '14%', size: 36, rotate: 62,   opacity: 0.6 },
  { top: '64%', left: '56%', size: 42, rotate: -88,  opacity: 0.7 },
  { top: '72%', left: '72%', size: 30, rotate: -22,  opacity: 0.5 },
  { top: '78%', left: '22%', size: 54, rotate: -140, opacity: 0.6 },
  { top: '86%', left: '50%', size: 32, rotate: 62,   opacity: 0.55 },
  { top: '92%', left: '82%', size: 48, rotate: -79,  opacity: 0.55 },
]

export default function FlowerDecoration() {
  const uid = useId()
  const petalGradId = `petal-grad-${uid}`
  const petalSymbolId = `petal-sym-${uid}`

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
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
            opacity: p.opacity,
            transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
          }}
          aria-hidden
        >
          <use href={`#${petalSymbolId}`} width="100%" height="100%" />
        </svg>
      ))}
    </div>
  )
}
