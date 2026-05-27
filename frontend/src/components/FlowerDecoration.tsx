// 실제 petal-*.svg 에셋을 이용한 낙화 애니메이션
// bg-petals.png와 동일한 위치에서 drift/drift-alt로 흘러내림

const PETAL_SRCS = [
  '/assets/petal-v35.svg',
  '/assets/petal-v36.svg',
  '/assets/petal-v37.svg',
  '/assets/petal-v38.svg',
  '/assets/petal-v39.svg',
  '/assets/petal-e4.svg',
]

const PETALS = [
  { top: '8%',  left: '38%', size: 36, rotate: 62,   duration: 7.2, delay: -1.5, alt: false, src: 0 },
  { top: '12%', left: '78%', size: 32, rotate: 62,   duration: 6.5, delay: -0.8, alt: true,  src: 1 },
  { top: '28%', left: '12%', size: 40, rotate: 174,  duration: 8.0, delay: -2.4, alt: false, src: 2 },
  { top: '32%', left: '60%', size: 50, rotate: -79,  duration: 6.8, delay: -3.2, alt: true,  src: 3 },
  { top: '45%', left: '32%', size: 38, rotate: 151,  duration: 7.5, delay: -1.0, alt: false, src: 4 },
  { top: '52%', left: '88%', size: 34, rotate: 62,   duration: 6.2, delay: -4.0, alt: true,  src: 5 },
  { top: '58%', left: '14%', size: 36, rotate: 62,   duration: 7.8, delay: -2.0, alt: false, src: 0 },
  { top: '64%', left: '56%', size: 42, rotate: -88,  duration: 6.5, delay: -0.5, alt: true,  src: 1 },
  { top: '72%', left: '72%', size: 30, rotate: -22,  duration: 8.2, delay: -3.5, alt: false, src: 2 },
  { top: '78%', left: '22%', size: 54, rotate: -140, duration: 7.0, delay: -1.8, alt: true,  src: 3 },
  { top: '86%', left: '50%', size: 32, rotate: 62,   duration: 6.9, delay: -4.5, alt: false, src: 4 },
  { top: '92%', left: '82%', size: 48, rotate: -79,  duration: 7.4, delay: -2.8, alt: true,  src: 5 },
]

export default function FlowerDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: 'soft-light' }}
    >
      {PETALS.map((p, i) => (
        <img
          key={i}
          src={PETAL_SRCS[p.src]}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
            transform: `rotate(${p.rotate}deg)`,
            animation: `${p.alt ? 'drift-alt' : 'drift'} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
