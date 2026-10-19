// The pompeblêd: the red heart-shaped leaf on the Frisian flag. In the game it's a life.
type Props = {
  isLost?: boolean
  className?: string
}

export function PompebledHeart({ isLost = false, className }: Props) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M32 56 C14 44 6 34 8 22 C10 12 22 8 32 18 C42 8 54 12 56 22 C58 34 50 44 32 56 Z"
        fill={isLost ? 'var(--color-paper)' : 'var(--color-pompebled)'}
        stroke="var(--color-ink)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
