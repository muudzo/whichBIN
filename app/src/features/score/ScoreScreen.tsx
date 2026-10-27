import { Shuffle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LIVES_PER_ROUND } from '@/domain/game'
import { generateNickname } from '@/domain/nickname'
import { binFor } from '@/features/game/catalog'
import type { RoundResult } from '@/features/round/RoundScreen'
import type { ScoreStore } from '@/services/scoreStore'

type Props = {
  result: RoundResult
  store: ScoreStore
  onNextRound: () => void
  onSaved: (nickname: string) => void
  // The leaderboard without saving a score first (H7)
  onLeaderboard: () => void
}

type SaveStatus = 'idle' | 'saving' | 'error'

// End on a summary, not a fail (peak-end rule). The mistakes are the learning moment.
export function ScoreScreen({ result, store, onNextRound, onSaved, onLeaderboard }: Props) {
  const [nickname, setNickname] = useState(() => generateNickname())
  const [status, setStatus] = useState<SaveStatus>('idle')
  const hasMistakes = result.mistakes.length > 0

  async function handleSave() {
    setStatus('saving')
    try {
      await store.submitScore({
        nickname,
        score: result.score,
        correct: result.correct,
        total: result.total,
        createdAt: new Date().toISOString(),
      })
      onSaved(nickname)
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 px-4 pt-12 pb-[max(1rem,env(safe-area-inset-bottom))] md:max-w-xl md:px-8">
      {/* The Frisian flag's stripes, across the full width of the screen at any size */}
      <div aria-hidden="true" className="stripes absolute inset-x-0 top-0 h-6 border-b-[3px] border-ink" />

      <header className="flex flex-col items-center gap-1 text-center">
        {/* A round that ended on lives says so, and counts only the items answered (H1, H9) */}
        <h1 className="font-heading text-title font-bold">
          {result.ranOutOfLives ? 'Out of lives' : `Round ${result.roundNumber} complete`}
        </h1>
        <p className="font-heading text-display font-extrabold tabular-nums">
          {result.correct}
          <span className="text-ink-muted"> / {result.answered}</span>
        </p>
        {result.ranOutOfLives && (
          <p className="text-ink-muted">
            Round {result.roundNumber} ended after {LIVES_PER_ROUND} wrong answers.
          </p>
        )}
        <p className="text-ink-muted">
          <strong className="text-ink">{result.score} points</strong> · best streak {result.bestStreak}
        </p>
      </header>

      {hasMistakes ? (
        <section aria-labelledby="learn-title" className="flex flex-col gap-2">
          <h2 id="learn-title" className="font-heading text-title font-bold">
            Learn from these
          </h2>
          <ul className="flex flex-col gap-2">
            {result.mistakes.map((item) => (
              <li key={item.id} className="sticker bg-paper p-4 shadow-sticker-sm">
                <p className="font-bold">
                  {item.name} → {item.where ?? binFor(item.bin).name}
                </p>
                <p className="text-small text-ink-muted">{item.why}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="sticker bg-sun p-4 text-center font-bold shadow-sticker-sm">Perfect round! No mistakes.</p>
      )}

      <section aria-labelledby="save-title" className="sticker flex flex-col gap-4 bg-sky p-4 shadow-sticker-sm">
        <h2 id="save-title" className="font-heading text-title font-bold">
          Save to the leaderboard as
        </h2>
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-title font-extrabold" data-testid="nickname">
            {nickname}
          </span>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setNickname(generateNickname())}
            aria-label="Pick another name"
          >
            <Shuffle />
          </Button>
        </div>
        <p className="text-small text-ink-muted">Names are made up, so nothing about you is saved.</p>
        <Button onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save score'}
        </Button>
        {status === 'error' && (
          <p role="alert" className="text-small font-bold text-pompebled">
            Couldn&apos;t save your score. Try again in a moment.
          </p>
        )}
      </section>

      <div className="mt-auto flex flex-col gap-2">
        <Button variant="secondary" size="lg" onClick={onNextRound}>
          Next round
        </Button>
        {hasMistakes && <p className="text-center text-small text-ink-muted">Your mistakes from this round come back.</p>}
        <Button variant="ghost" onClick={onLeaderboard}>
          See the leaderboard
        </Button>
      </div>
    </main>
  )
}
