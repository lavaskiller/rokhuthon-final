// ─────────────────────────────────────────────
// PillButton — 알약형 버튼 (Figma 20260926 "UIUX 최종")
//
// variant:
//   primary   — "출력하기", "행운의 꽃 확인"   261×77, 흰 테두리
//   secondary — "이전화면"                   261×77, 흰 테두리
//   cta       — 표지 "내 별꽃 운세 보러가기"   테두리 없음, inset 하이라이트
// icon:
//   right — 라벨 뒤 → 원형 화살표 / left — 라벨 앞 ← 원형 화살표 / none
//
// to 를 주면 react-router Link, 아니면 button 으로 렌더링
// ─────────────────────────────────────────────

import { Link } from 'react-router-dom'

interface Props {
  label: string
  variant?: 'primary' | 'secondary' | 'cta'
  icon?: 'left' | 'right' | 'none'
  to?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const VARIANT_CLASS = {
  primary: 'h-[77px] w-[261px] border border-white bg-petal-primary font-bold',
  secondary: 'h-[77px] w-[261px] border border-white bg-petal-secondary font-bold',
  cta: 'h-[113px] w-[365px] bg-petal-cta shadow-cta-inset',
} as const

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <img
      src="/assets/icon-arrow-circle.svg"
      alt=""
      aria-hidden
      width={35}
      height={35}
      draggable={false}
      className={direction === 'left' ? '-scale-x-100' : undefined}
    />
  )
}

export default function PillButton({
  label,
  variant = 'primary',
  icon = variant === 'cta' ? 'none' : 'right',
  to,
  onClick,
  disabled = false,
  className = '',
}: Props) {
  const classes = [
    'inline-flex shrink-0 items-center justify-center gap-[17px] rounded-pill font-gowun text-button text-white',
    'transition-[filter,opacity] hover:brightness-110',
    VARIANT_CLASS[variant],
    disabled ? 'pointer-events-none opacity-50' : '',
    className,
  ].join(' ')

  const content = (
    <>
      {icon === 'left' && <ArrowIcon direction="left" />}
      <span className="whitespace-nowrap">{label}</span>
      {icon === 'right' && <ArrowIcon direction="right" />}
    </>
  )

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}
