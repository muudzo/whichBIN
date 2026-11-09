import { CircleHelp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  score: number
  itemNumber: number
  itemCount: number
  // A clearly marked way out of the round (H3). Without it, the button isn't shown.
  onLeave?: () => void
  // The rules again, as a sheet over the round (F7). Without it, the button isn't shown.
  onHelp?: () => void
}

// One quiet row at the top (design review 26 Oct): leave, progress, score and help, so they don't compete with the bins.
// The lives sit lower, next to the bins (Lives.tsx).
export function Hud({ score, itemNumber, itemCount, onLeave, onHelp }: Props) {
  const progress = Math.min(100, ((itemNumber - 1) / itemCount) * 100)

  return (
    // flex-wrap: with text at 200% the row is wider than the phone, and the phone zoomed the whole page out to show it
    // (9 Nov). Now the end of the row wraps onto a second line instead. The progress bar keeps at least 16px (min-w-4),
    // so at normal text sizes it all still fits on one line, down to 320px wide with a 4-digit score (the bar is then 27px).
    <header className="flex flex-wrap items-center gap-2">
      {onLeave && (
        // 44px to tap, but the negative margins keep the row as low as the score
        <Button variant="ghost" size="icon" className="-my-2 -ml-2 shrink-0" onClick={onLeave} aria-label="Leave round">
          <X />
        </Button>
      )}

      <div
        className="h-3 min-w-4 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper"
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
      {/* "Item" in full, so the count can't be mistaken for a score */}
      <p className="shrink-0 text-small text-ink-muted tabular-nums">
        Item {itemNumber} of {itemCount}
      </p>

      <span className="shrink-0 rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-heading text-body font-extrabold tabular-nums">
        {score}
        <span className="sr-only"> points</span>
      </span>

      {onHelp && (
        // At the other end from ×, with the same size and the same negative margins
        <Button variant="ghost" size="icon" className="-my-2 -mr-2 shrink-0" onClick={onHelp} aria-label="How to play">
          <CircleHelp />
        </Button>
      )}
    </header>
  )
}
