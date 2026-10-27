import { Flame } from 'lucide-react'
import { PompebledHeart } from '@/components/brand/PompebledHeart'
import { LIVES_PER_ROUND } from '@/domain/game'

const SHOW_STREAK_FROM = 2

type Props = {
  lives: number
  streak: number
}

// The lives, with the streak beside them. The round screen puts them right on top of the bins, where the eyes are
// while sorting, so a lost life is seen out of the corner of the eye without looking away from the bins.
export function Lives({ lives, streak }: Props) {
  const hearts = Array.from({ length: LIVES_PER_ROUND }, (_, i) => i < lives)

  return (
    // relative z-10: drawn above the bins, so an opening lid tucks behind the hearts instead of hiding a life
    <div className="relative z-10 flex min-h-7 items-center justify-between gap-2">
      <div className="flex gap-1" role="img" aria-label={`${lives} of ${LIVES_PER_ROUND} lives left`}>
        {hearts.map((isAlive, i) => (
          <PompebledHeart key={i} isLost={!isAlive} className="size-6" />
        ))}
      </div>
      {streak >= SHOW_STREAK_FROM && (
        <span className="flex items-center gap-1 text-small font-bold">
          <Flame className="size-4 text-pompebled" aria-hidden="true" />×{streak} streak
        </span>
      )}
    </div>
  )
}
