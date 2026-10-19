import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { itemFor } from '@/features/game/catalog'
import type { ItemStat, ScoreRecord, ScoreStore } from '@/services/scoreStore'

type Props = {
  store: ScoreStore
  highlight?: string
  onPlay: () => void
  onHome: () => void
}

type Board = { top: readonly ScoreRecord[]; missed: readonly ItemStat[] }

const TOP_COUNT = 10
const MISSED_COUNT = 3

export function LeaderboardScreen({ store, highlight, onPlay, onHome }: Props) {
  const [board, setBoard] = useState<Board>()
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCancelled = false
    Promise.all([store.topScores(TOP_COUNT), store.mostMissed(MISSED_COUNT)])
      .then(([top, missed]) => !isCancelled && setBoard({ top, missed }))
      .catch(() => !isCancelled && setHasError(true))
    return () => {
      isCancelled = true
    }
  }, [store])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <h1 className="flex items-center gap-2 font-heading text-4xl font-extrabold">
        <Trophy className="size-8 text-fries-blue" aria-hidden="true" /> Leaderboard
      </h1>

      {!store.isShared && (
        <p className="sticker bg-sky px-4 py-3 text-sm shadow-sticker-sm">
          For now these scores live on this phone only. The shared leaderboard arrives with the database.
        </p>
      )}

      {hasError && (
        <p role="alert" className="font-bold text-pompebled">
          Couldn&apos;t load the leaderboard. Try again in a moment.
        </p>
      )}
      {!board && !hasError && <p className="text-ink-muted">Loading…</p>}

      {board && (
        <>
          <section aria-labelledby="top-title" className="flex flex-col gap-2">
            <h2 id="top-title" className="font-heading text-lg font-bold">
              Top scores
            </h2>
            {board.top.length === 0 ? (
              <p className="text-ink-muted">No scores yet. Play a round and be the first!</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {board.top.map((entry, i) => (
                  <li
                    key={`${entry.nickname}-${entry.createdAt}`}
                    className={`sticker flex items-center gap-3 px-4 py-2.5 shadow-sticker-sm ${entry.nickname === highlight ? 'bg-sun' : 'bg-paper'}`}
                  >
                    <span className="w-6 font-heading text-lg font-extrabold tabular-nums">{i + 1}</span>
                    <span className="flex-1 font-bold">
                      {entry.nickname}
                      {entry.nickname === highlight && <span className="sr-only"> (you)</span>}
                    </span>
                    <span className="font-heading font-extrabold tabular-nums">{entry.score}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {board.missed.length > 0 && (
            <section aria-labelledby="missed-title" className="flex flex-col gap-2">
              <h2 id="missed-title" className="font-heading text-lg font-bold">
                Most missed items
              </h2>
              <ul className="flex flex-col gap-1.5">
                {board.missed.map((stat) => (
                  <li key={stat.itemId} className="flex justify-between border-b-2 border-ink/15 pb-1.5">
                    <span>{itemFor(stat.itemId)?.name ?? stat.itemId}</span>
                    <span className="text-ink-muted tabular-nums">
                      {stat.wrong} of {stat.total} wrong
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <Button size="lg" onClick={onPlay}>
          Play again
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Back to the start
        </Button>
      </div>
    </main>
  )
}
