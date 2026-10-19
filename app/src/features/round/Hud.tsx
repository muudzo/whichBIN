import { Flame } from 'lucide-react'
import { PompebledHeart } from '@/components/brand/PompebledHeart'
import { LIVES_PER_ROUND } from '@/domain/game'

type Props = {
  lives: number
  score: number
  streak: number
  itemNumber: number
  itemCount: number
}

const SHOW_STREAK_FROM = 2

export function Hud({ lives, score, streak, itemNumber, itemCount }: Props) {
  const hearts = Array.from({ length: LIVES_PER_ROUND }, (_, i) => i < lives)
  const progress = Math.min(100, ((itemNumber - 1) / itemCount) * 100)

  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-1" role="img" aria-label={`${lives} of ${LIVES_PER_ROUND} lives left`}>
          {hearts.map((isAlive, i) => (
            <PompebledHeart key={i} isLost={!isAlive} className="size-7" />
          ))}
        </div>

        {streak >= SHOW_STREAK_FROM && (
          <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-sm font-bold">
            <Flame className="size-4 text-pompebled" aria-hidden="true" />
            ×{streak} streak
          </span>
        )}

        <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-heading text-lg font-extrabold tabular-nums">
          {score}
          <span className="sr-only"> points</span>
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full border-2 border-ink bg-paper"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={itemCount}
        aria-valuenow={itemNumber - 1}
        aria-label="Round progress"
      >
        <div
          className="h-full origin-left bg-meadow transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <p className="text-sm text-ink-muted">
        Item {itemNumber} of {itemCount}
      </p>
    </header>
  )
}
