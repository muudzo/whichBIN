import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
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
import { binFor, catalog, itemFor } from '@/features/game/catalog'
import type { ItemStat, ScoreStore } from '@/services/scoreStore'
import { BinGrid } from './BinGrid'
import { measureTargets, nearestTarget, type DropTarget, type Point } from './dropTarget'
import { Hud } from './Hud'
import { ItemSticker, type FlyTo } from './ItemSticker'
import { NotQuiteSheet } from './NotQuiteSheet'

// A drop this close to a bin (px), including the gaps between bins, still counts for the nearest bin.
const DROP_TOLERANCE = 24

export interface RoundResult {
  roundNumber: number
  score: number
  correct: number
  total: number
  // How many items were answered: fewer than `total` when the lives ran out first.
  answered: number
  ranOutOfLives: boolean
  bestStreak: number
  mistakes: Item[]
}

type Props = {
  items: readonly Item[]
  roundNumber: number
  sessionId: string
  store: ScoreStore
  onFinish: (result: RoundResult) => void
  // The top bar's "Leave round" button (H3); the app asks before leaving.
  onRequestLeave?: () => void
  // True while the app asks "Leave this round?": nothing can be answered behind the question (H5).
  isPaused?: boolean
}

function toResult(state: RoundState, roundNumber: number): RoundResult {
  return {
    roundNumber,
    score: state.score,
    correct: correctCount(state),
    total: state.items.length,
    answered: state.answers.length,
    ranOutOfLives: state.lives === 0,
    bestStreak: state.bestStreak,
    mistakes: mistakes(state),
  }
}

export function RoundScreen({ items, roundNumber, sessionId, store, onFinish, onRequestLeave, isPaused = false }: Props) {
  const [state, setState] = useState(() => startRound(items))
  const [stat, setStat] = useState<ItemStat>()
  const [hasSaveError, setHasSaveError] = useState(false)
  // True while the old item animates out. Taps wait, so an answer always belongs to the item on screen.
  const [isSwapping, setIsSwapping] = useState(false)
  // The bin the dragged item will land in, so it can light up; and whether a drag is going on, so all bins wake up.
  const [hoveredBin, setHoveredBin] = useState<BinId>()
  const [isDragging, setIsDragging] = useState(false)
  // Where the item that's leaving flies to: the bin it was sorted into (or, after a wrong answer, the right one).
  const [flyTo, setFlyTo] = useState<FlyTo>()
  const binsRef = useRef<HTMLDivElement>(null)
  // The bins' positions, measured once when the item is picked up; they don't move during a drag.
  const targetsRef = useRef<DropTarget<BinId>[]>([])

  const item = currentItem(state)
  const isAnswerable = state.phase === 'sorting' && !isSwapping && !isPaused
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

  function binCentre(bin: BinId): Point | undefined {
    const target = binsRef.current ? measureTargets<BinId>(binsRef.current).find(({ id }) => id === bin) : undefined
    return target && { x: (target.box.left + target.box.right) / 2, y: (target.box.top + target.box.bottom) / 2 }
  }

  function handleSelect(bin: BinId) {
    if (!item || !isAnswerable) return
    const correct = item.bin === bin
    setFlyTo(binCentre(correct ? bin : item.bin))
    setStat(undefined)
    store
      .submitAnswer({ sessionId, round: roundNumber, itemId: item.id, chosenBin: bin, correct })
      .then(() => (!correct && store.isShared ? store.itemStat(item.id).then(setStat) : undefined))
      .catch(() => setHasSaveError(true))
    apply({ type: 'answer', bin })
  }

  function handlePickUp() {
    targetsRef.current = binsRef.current ? measureTargets<BinId>(binsRef.current) : []
    setIsDragging(true)
  }

  const binAt = (point: Point) => nearestTarget(point, targetsRef.current, DROP_TOLERANCE)

  // A drop on (or right next to) a bin counts exactly like a tap on that bin. Anywhere else, nothing is answered.
  function handleDrop(point: Point) {
    setIsDragging(false)
    setHoveredBin(undefined)
    const bin = binAt(point)
    if (!bin) return
    navigator.vibrate?.(12) // a small tick on phones that allow it (Android); iPhones ignore it
    handleSelect(bin)
  }

  // Laptops: keys 1–6 pick the bins in their on-screen order, for players who'd rather not drag on a trackpad.
  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    if (!isAnswerable || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
    const bin = catalog.bins[Number(event.key) - 1]
    if (bin) handleSelect(bin.id)
  })
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // The very first item of a visit wiggles once and says it can be dragged.
  const isFirstItem = roundNumber === 1 && state.index === 0 && state.answers.length === 0

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] short:gap-2 landscape-phone:max-w-3xl landscape-phone:gap-2 landscape-phone:pt-2 md:max-w-xl md:px-8 lg:max-w-5xl lg:gap-8">
      <Hud
        lives={state.lives}
        score={state.score}
        streak={state.streak}
        itemNumber={Math.min(state.index + 1, state.items.length)}
        itemCount={state.items.length}
        onLeave={onRequestLeave}
      />

      {/* UI 102 grid: one column on an upright phone; side by side (item left, bins right)
          on a phone held sideways (bins get 3/5 of the width, so their hints wrap less) and on a desktop. */}
      <div className="flex flex-1 flex-col gap-4 short:gap-2 landscape-phone:grid landscape-phone:grid-cols-[2fr_3fr] landscape-phone:items-center landscape-phone:gap-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="flex flex-1 flex-col gap-4 short:gap-2">
          {/* Feedback on the previous item sits above the new one and names it,
              so "Right!" can never be read as the answer for the item now on screen. */}
          <div aria-live="polite" className="flex min-h-16 items-center justify-center landscape-phone:min-h-12">
            {rightItem && state.phase === 'sorting' ? (
              <motion.div
                key={rightItem.id}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticker w-full bg-meadow-tint px-4 py-2 shadow-sticker-sm"
              >
                <p className="flex items-center gap-2 text-small font-bold text-meadow">
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                  Right!
                  <span className="truncate text-ink">
                    {rightItem.name} → {binFor(rightItem.bin).name}
                  </span>
                </p>
                <p className="line-clamp-2 text-small leading-snug text-ink-muted">{rightItem.why}</p>
              </motion.div>
            ) : (
              <p className={`text-center text-small ${isFirstItem ? 'font-bold text-ink' : 'text-ink-muted'}`}>
                Drag it to its bin in Leeuwarden, or tap the bin
              </p>
            )}
          </div>

          <section aria-label="Item to sort" className="flex flex-1 flex-col items-center justify-center">
            <AnimatePresence mode="wait" custom={flyTo} onExitComplete={() => setIsSwapping(false)}>
              {item && (
                <ItemSticker
                  key={item.id}
                  item={item}
                  shouldHint={isFirstItem}
                  onPickUp={isAnswerable ? handlePickUp : undefined}
                  onDragMove={isAnswerable ? (point) => setHoveredBin(binAt(point)) : undefined}
                  onDrop={isAnswerable ? handleDrop : undefined}
                />
              )}
            </AnimatePresence>
          </section>
        </div>

        <BinGrid
          ref={binsRef}
          isDisabled={!isAnswerable}
          isAwaitingDrop={isDragging}
          highlighted={hoveredBin}
          onSelect={handleSelect}
        />
      </div>

      {hasSaveError && (
        <p role="status" className="text-center text-small text-ink-muted">
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
