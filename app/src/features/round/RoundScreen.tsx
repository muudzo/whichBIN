import { Check } from 'lucide-react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useEffect, useEffectEvent, useRef, useState, type PointerEvent } from 'react'
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
import type { BinMark } from './BinTarget'
import { Lives } from './Lives'
import { NotQuiteCard } from './NotQuiteCard'

// A drop this close to a bin (px), including the gaps between bins, still counts for the nearest bin.
const DROP_TOLERANCE = 24
// How long the tick stays on a bin after a right answer (ms): long enough to notice, gone before the next answer.
const RIGHT_TICK_MS = 1200

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
  // The top bar's "?" button (F7); the app shows How to play over the round.
  onRequestHelp?: () => void
  // True while the app asks "Leave this round?" or shows How to play: nothing can be answered behind a sheet (H5).
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

export function RoundScreen({
  items,
  roundNumber,
  sessionId,
  store,
  onFinish,
  onRequestLeave,
  onRequestHelp,
  isPaused = false,
}: Props) {
  const [state, setState] = useState(() => startRound(items))
  const [stat, setStat] = useState<ItemStat>()
  const [hasSaveError, setHasSaveError] = useState(false)
  // True while the old item animates out. Taps wait, so an answer always belongs to the item on screen.
  const [isSwapping, setIsSwapping] = useState(false)
  // The bin the dragged item will land in, so its lid can open.
  const [hoveredBin, setHoveredBin] = useState<BinId>()
  // Where the item that's leaving flies to: the bin it was sorted into (or, after a wrong answer, the right one).
  const [flyTo, setFlyTo] = useState<FlyTo>()
  // The bin that just got a right answer, for its tick. A new object each time, so a second tick restarts the timer.
  const [tick, setTick] = useState<{ bin: BinId }>()
  const binsRef = useRef<HTMLDivElement>(null)
  // The bins' positions, measured once when the item is picked up; they don't move during a drag.
  const targetsRef = useRef<DropTarget<BinId>[]>([])

  const item = currentItem(state)
  const isAnswerable = state.phase === 'sorting' && !isSwapping && !isPaused
  const answer = lastAnswer(state)
  const answeredItem = answer ? itemFor(answer.itemId) : undefined
  const rightItem = answer?.correct ? answeredItem : undefined
  const wrongItem = answer && !answer.correct ? answeredItem : undefined
  // After a wrong answer: the explanation in the tray, a cross on the chosen bin, and the right bin ticked with its lid open.
  const explained = state.phase === 'feedback' && answer && wrongItem ? { item: wrongItem, chosen: answer.chosen } : undefined
  const marks: Partial<Record<BinId, BinMark>> = explained
    ? { [explained.chosen]: 'wrong', [explained.item.bin]: 'right' }
    : tick
      ? { [tick.bin]: 'right' }
      : {}

  useEffect(() => {
    if (!tick) return
    const timer = setTimeout(() => setTick(undefined), RIGHT_TICK_MS)
    return () => clearTimeout(timer)
  }, [tick])

  function apply(action: RoundAction) {
    const next = roundReducer(state, action)
    setState(next)
    // The sticker leaves as soon as its item is answered: into its bin when right, into the right bin when wrong
    // (the explanation then takes its place). New answers wait until it has gone.
    const itemLeaves = state.phase === 'sorting' && (next.index !== state.index || next.phase === 'feedback')
    if (itemLeaves && next.phase !== 'over') setIsSwapping(true)
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
    setTick(correct ? { bin } : undefined)
    setStat(undefined)
    store
      .submitAnswer({ sessionId, round: roundNumber, itemId: item.id, chosenBin: bin, correct })
      .then(() => (!correct && store.isShared ? store.itemStat(item.id).then(setStat) : undefined))
      .catch(() => setHasSaveError(true))
    apply({ type: 'answer', bin })
  }

  function handlePickUp() {
    targetsRef.current = binsRef.current ? measureTargets<BinId>(binsRef.current) : []
  }

  const binAt = (point: Point) => nearestTarget(point, targetsRef.current, DROP_TOLERANCE)

  // The whole tray is the handle (design review 26 Oct): pressed anywhere in it, the item jumps under the finger
  // (snapToCursor), so the target is bigger and the drop still follows the item. A tap without a drag springs it back.
  const dragControls = useDragControls()
  function startDrag(event: PointerEvent) {
    if (isAnswerable) dragControls.start(event, { snapToCursor: true })
  }

  // A drop on (or right next to) a bin counts exactly like a tap on that bin. Anywhere else, nothing is answered.
  function handleDrop(point: Point) {
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
    // The areas (hud, feedback, bins, tray) are placed by `round-layout` in global.css: upright, the bins sit in the
    // middle and the item at the bottom; side by side (phones held sideways, desktops), the item left and the bins right.
    // h-dvh, not min-h-dvh: with a fixed height the grid shares out the screen's height. With only a minimum, it works
    // the 2 : 1 split out from the content instead, and the page grows past the screen.
    <main className="round-layout mx-auto h-dvh w-full max-w-md gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] short:gap-2 short:pt-[max(0.5rem,env(safe-area-inset-top))] short:pb-[max(0.5rem,env(safe-area-inset-bottom))] md:max-w-xl md:px-8 landscape-phone:max-w-3xl landscape-phone:gap-x-6 landscape-phone:gap-y-2 landscape-phone:pt-2 lg:max-w-5xl lg:gap-x-12 lg:gap-y-6">
      <div className="[grid-area:hud]">
        <Hud
          score={state.score}
          itemNumber={Math.min(state.index + 1, state.items.length)}
          itemCount={state.items.length}
          onLeave={onRequestLeave}
          onHelp={onRequestHelp}
        />
      </div>

      {/* Feedback on the previous item names it, so "Right!" can never be read as the answer for the item now on screen. */}
      {/* Side by side, the feedback row folds away while "Not quite" shows, so the card below it gets the height.
          Upright it keeps its height, so the bins don't jump. */}
      <div
        aria-live="polite"
        className={`flex min-h-16 items-center justify-center [grid-area:feedback] landscape-phone:min-h-12 ${explained ? 'side-by-side:hidden' : ''}`}
      >
        {rightItem && state.phase === 'sorting' && (
          <motion.div
            key={rightItem.id}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticker w-full bg-meadow-tint px-4 py-2 shadow-sticker-sm"
          >
            {/* The whole explanation, never cut off: this is where the player learns why (design review 26 Oct).
                One paragraph, the verdict in bold leading into the reason, so it takes as few lines as possible. */}
            <p className="text-small leading-snug text-ink-muted">
              <Check className="mr-1 inline size-4 align-[-3px] text-meadow" aria-hidden="true" />
              <strong className="text-meadow">Right!</strong>{' '}
              <strong className="text-ink">
                {rightItem.name} → {binFor(rightItem.bin).name}
              </strong>
              . {rightItem.why}
            </p>
          </motion.div>
        )}
      </div>

      {/* In the code the item comes before the bins, which is the order a screen reader reads them in;
          on screen, the grid areas put the item at the bottom. Upright, it sits at the top of its area, right under the bins.
          The item and the "Not quite" card share one grid cell (*:col-start-1 *:row-start-1), so the card appears where
          the item was while the item flies off to the right bin. */}
      <div className="grid [grid-area:tray] *:col-start-1 *:row-start-1">
        <section
          aria-label="Item to sort"
          onPointerDown={startDrag}
          className={`flex flex-col items-center justify-start side-by-side:justify-center ${isAnswerable ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
        >
          <AnimatePresence mode="wait" custom={flyTo} onExitComplete={() => setIsSwapping(false)}>
            {item && state.phase === 'sorting' && (
              <ItemSticker
                key={item.id}
                item={item}
                shouldHint={isFirstItem}
                onPickUp={isAnswerable ? handlePickUp : undefined}
                onDragMove={isAnswerable ? (point) => setHoveredBin(binAt(point)) : undefined}
                onDrop={isAnswerable ? handleDrop : undefined}
                dragControls={dragControls}
              />
            )}
          </AnimatePresence>
          {/* First-time players: the instruction where they're looking, under the item, until their first answer */}
          {isFirstItem && state.phase === 'sorting' && (
            <p className="mt-2 text-center text-small font-bold">
              Drag it into its bin, or <span className="pointer-fine:hidden">tap</span>
              <span className="hidden pointer-fine:inline">click</span> the bin
            </p>
          )}
        </section>
        {explained && (
          <NotQuiteCard
            item={explained.item}
            chosen={explained.chosen}
            stat={stat}
            onContinue={() => apply({ type: 'continue' })}
          />
        )}
      </div>

      {/* The bins grow into the free height, up to a limit (flex-1 + max-h), a little more on tall screens.
          Upright, they keep close to the item below them (justify-end), so leftover space never lengthens the drag.
          The lives sit right on top of the bins and move with them: in view while sorting, without crowding the bottom. */}
      <div className="flex flex-col justify-end gap-2 [grid-area:bins] side-by-side:justify-center">
        <Lives lives={state.lives} streak={state.streak} />
        <BinGrid
          ref={binsRef}
          className="max-h-80 flex-1 grid-rows-[1fr_1fr] tall:max-h-96 md:tall:max-h-[30rem]"
          isDisabled={!isAnswerable}
          highlighted={explained ? explained.item.bin : hoveredBin}
          marks={marks}
          onSelect={handleSelect}
        />
      </div>

      {hasSaveError && (
        <p role="status" className="col-span-full text-center text-small text-ink-muted">
          Your answers couldn&apos;t be saved. You can keep playing.
        </p>
      )}
    </main>
  )
}
