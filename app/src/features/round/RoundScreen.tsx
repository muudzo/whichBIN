import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import type { BinId, Item } from '@/domain/catalog'
import {
  correctCount,
  currentItem,
  lastAnswer,
  mistakes,
  roundReducer,
  startRound,
  type RoundAction,
  type RoundState,
} from '@/domain/game'
import { binFor, itemFor } from '@/features/game/catalog'
import type { ItemStat, ScoreStore } from '@/services/scoreStore'
import { BinGrid } from './BinGrid'
import { measureTargets, targetAt, type Point } from './dropTarget'
import { Hud } from './Hud'
import { ItemSticker } from './ItemSticker'
import { NotQuiteSheet } from './NotQuiteSheet'

export interface RoundResult {
  roundNumber: number
  score: number
  correct: number
  total: number
  bestStreak: number
  mistakes: Item[]
}

type Props = {
  items: readonly Item[]
  roundNumber: number
  sessionId: string
  store: ScoreStore
  onFinish: (result: RoundResult) => void
}

function toResult(state: RoundState, roundNumber: number): RoundResult {
  return {
    roundNumber,
    score: state.score,
    correct: correctCount(state),
    total: state.items.length,
    bestStreak: state.bestStreak,
    mistakes: mistakes(state),
  }
}

export function RoundScreen({ items, roundNumber, sessionId, store, onFinish }: Props) {
  const [state, setState] = useState(() => startRound(items))
  const [stat, setStat] = useState<ItemStat>()
  const [hasSaveError, setHasSaveError] = useState(false)
  // True while the old item animates out. Taps wait, so an answer always belongs to the item on screen.
  const [isSwapping, setIsSwapping] = useState(false)
  // The bin under the finger while an item is dragged, so it can light up.
  const [hoveredBin, setHoveredBin] = useState<BinId>()
  const binsRef = useRef<HTMLDivElement>(null)

  const item = currentItem(state)
  const isAnswerable = state.phase === 'sorting' && !isSwapping
  const answer = lastAnswer(state)
  const answeredItem = answer ? itemFor(answer.itemId) : undefined
  const rightItem = answer?.correct ? answeredItem : undefined
  const wrongItem = answer && !answer.correct ? answeredItem : undefined

  function apply(action: RoundAction) {
    const next = roundReducer(state, action)
    setState(next)
    if (next.phase === 'sorting' && next.index !== state.index) setIsSwapping(true)
    if (next.phase === 'over') onFinish(toResult(next, roundNumber))
  }

  function handleSelect(bin: BinId) {
    if (!item || state.phase !== 'sorting' || isSwapping) return
    const correct = item.bin === bin
    setStat(undefined)
    store
      .submitAnswer({ sessionId, round: roundNumber, itemId: item.id, chosenBin: bin, correct })
      .then(() => (!correct && store.isShared ? store.itemStat(item.id).then(setStat) : undefined))
      .catch(() => setHasSaveError(true))
    apply({ type: 'answer', bin })
  }

  // Bins are measured at the moment of the drag, so the check stays right after a resize or rotation.
  function binAt(point: Point) {
    return binsRef.current ? targetAt(point, measureTargets<BinId>(binsRef.current)) : undefined
  }

  // A drop on a bin counts exactly like a tap on that bin. Dropped anywhere else, nothing is answered.
  function handleDrop(point: Point) {
    setHoveredBin(undefined)
    const bin = binAt(point)
    if (bin) handleSelect(bin)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] short:gap-2">
      <Hud
        lives={state.lives}
        score={state.score}
        streak={state.streak}
        itemNumber={Math.min(state.index + 1, state.items.length)}
        itemCount={state.items.length}
      />

      {/* Feedback on the previous item sits above the new one and names it,
          so "Right!" can never be read as the answer for the item now on screen. */}
      <div aria-live="polite" className="flex min-h-16 items-center justify-center">
        {rightItem && state.phase === 'sorting' ? (
          <motion.div
            key={rightItem.id}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticker w-full bg-meadow-tint px-3 py-2 shadow-sticker-sm"
          >
            <p className="flex items-center gap-1.5 text-sm font-bold text-meadow">
              <Check className="size-4 shrink-0" aria-hidden="true" />
              Right!
              <span className="truncate text-ink">
                {rightItem.name} → {binFor(rightItem.bin).name}
              </span>
            </p>
            <p className="line-clamp-2 text-[13px] leading-snug text-ink-muted">{rightItem.why}</p>
          </motion.div>
        ) : (
          <p className="text-center text-ink-muted">Drag it to its bin in Leeuwarden, or tap the bin</p>
        )}
      </div>

      <section aria-label="Item to sort" className="flex flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait" onExitComplete={() => setIsSwapping(false)}>
          {item && (
            <ItemSticker
              key={item.id}
              item={item}
              onDragMove={isAnswerable ? (point) => setHoveredBin(binAt(point)) : undefined}
              onDrop={isAnswerable ? handleDrop : undefined}
            />
          )}
        </AnimatePresence>
      </section>

      <BinGrid ref={binsRef} isDisabled={!isAnswerable} highlighted={hoveredBin} onSelect={handleSelect} />

      {hasSaveError && (
        <p role="status" className="text-center text-sm text-ink-muted">
          Your answers couldn&apos;t be saved. You can keep playing.
        </p>
      )}

      <NotQuiteSheet
        item={wrongItem}
        stat={stat}
        isOpen={state.phase === 'feedback'}
        onContinue={() => apply({ type: 'continue' })}
      />
    </main>
  )
}
