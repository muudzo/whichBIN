import { Shuffle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateNickname } from '@/domain/nickname'
import { binFor } from '@/features/game/catalog'
import type { RoundResult } from '@/features/round/RoundScreen'
import type { ScoreStore } from '@/services/scoreStore'

type Props = {
  result: RoundResult
  store: ScoreStore
  onNextRound: () => void
  onSaved: (nickname: string) => void
}

type SaveStatus = 'idle' | 'saving' | 'error'

// End on a summary, not a fail (peak-end rule). The mistakes are the learning moment.
export function ScoreScreen({ result, store, onNextRound, onSaved }: Props) {
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div aria-hidden="true" className="stripes -mx-4 h-5 border-b-[3px] border-ink" />

      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-heading text-2xl font-bold">Round {result.roundNumber} complete</h1>
        <p className="font-heading text-7xl font-extrabold tabular-nums">
          {result.correct}
          <span className="text-ink-muted"> / {result.total}</span>
        </p>
        <p className="text-ink-muted">
          <strong className="text-ink">{result.score} points</strong> · best streak {result.bestStreak}
        </p>
      </header>

      {hasMistakes ? (
        <section aria-labelledby="learn-title" className="flex flex-col gap-2">
          <h2 id="learn-title" className="font-heading text-lg font-bold">
            Learn from these
          </h2>
          <ul className="flex flex-col gap-2">
            {result.mistakes.map((item) => (
              <li key={item.id} className="sticker bg-paper px-4 py-3 shadow-sticker-sm">
                <p className="font-bold">
                  {item.name} → {item.where ?? binFor(item.bin).name}
                </p>
                <p className="text-sm text-ink-muted">{item.why}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="sticker bg-sun px-4 py-3 text-center font-bold shadow-sticker-sm">Perfect round! No mistakes.</p>
      )}

      <section aria-labelledby="save-title" className="sticker flex flex-col gap-3 bg-sky px-4 py-4 shadow-sticker-sm">
        <h2 id="save-title" className="font-heading text-lg font-bold">
          Save to the leaderboard as
        </h2>
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-xl font-extrabold" data-testid="nickname">
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
        <p className="text-sm text-ink-muted">Names are made up, so nothing about you is saved.</p>
        <Button onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save score'}
        </Button>
        {status === 'error' && (
          <p role="alert" className="text-sm font-bold text-pompebled">
            Couldn&apos;t save your score. Try again in a moment.
          </p>
        )}
      </section>

      <Button variant="secondary" size="lg" onClick={onNextRound} className="mt-auto">
        {hasMistakes ? 'Next round: your mistakes come back' : 'Next round'}
      </Button>
    </main>
  )
}
