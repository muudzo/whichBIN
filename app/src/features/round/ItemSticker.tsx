import { motion, useMotionValue, type PanInfo } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Item } from '@/domain/catalog'
import { stickerFor } from '@/features/game/stickers'
import type { Point } from './dropTarget'

// Where a sorted item flies when it leaves: the centre of its bin on screen. Given through AnimatePresence's `custom`.
export type FlyTo = Point | undefined

type Props = {
  item: Item
  size?: 'md' | 'lg'
  tilt?: number
  // A small wiggle once the item has settled, to show it can be picked up (first item of a visit).
  shouldHint?: boolean
  // Given during a round: the sticker can then be dragged onto a bin. Points are the sticker's centre on screen,
  // because players aim the item, not their finger.
  onPickUp?: () => void
  onDragMove?: (point: Point) => void
  onDrop?: (point: Point) => void
}

// The bins are the big targets; the item sits below them in the tray (design review 26 Oct).
// On phones the sticker follows the screen's height, so the lives bar and all six bins always fit.
// max-md: keeps the height rules to phones; otherwise they would override the md: and lg: sizes.
const SIZES = {
  md: 'size-28',
  lg: 'size-28 max-md:short:size-20 max-md:short:p-2 max-md:tall:size-32 md:size-36 landscape-phone:size-24 lg:size-48',
} as const

// While dragged, the sticker shrinks to about this size on screen (px) on every device, so the bin under it stays visible.
const DRAG_SIZE = 80

// motion reports the finger's position on the page; the bins' positions are on the screen.
const onScreen = ({ point }: PanInfo): Point => ({ x: point.x - window.scrollX, y: point.y - window.scrollY })

function centreOf(element: HTMLElement | null): Point | undefined {
  if (!element) return undefined
  const { left, top, width, height } = element.getBoundingClientRect()
  return { x: left + width / 2, y: top + height / 2 }
}

// The item rests straight (tilt 0): on the smallest phone, with the full "Right!" text above the bins, a tilted item's
// corner came within a few pixels of the bins.
export function ItemSticker({ item, size = 'lg', tilt = 0, shouldHint = false, onPickUp, onDragMove, onDrop }: Props) {
  const url = stickerFor(item.id)
  const isDraggable = Boolean(onDrop)
  const boxRef = useRef<HTMLDivElement>(null)
  // The drag moves x and y; subtracting them from the sticker's position gives where it rests.
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  // offsetWidth is the sticker's size without animations, so this works even mid-entrance.
  const [dragScale, setDragScale] = useState(0.6)
  useLayoutEffect(() => {
    const width = boxRef.current?.offsetWidth
    if (width) setDragScale(Math.min(0.7, Math.max(0.3, DRAG_SIZE / width)))
  }, [])

  // It shrinks around its own centre. (Shrinking toward the grab point misplaced it when it was grabbed
  // during its entrance animation, because the sticker was still scaled down then.)
  const aimPoint = (info: PanInfo): Point => centreOf(boxRef.current) ?? onScreen(info)
  // The drop uses the last position seen while dragging: by the time the finger lifts,
  // the spring back home has already started and would nudge the sticker toward where it came from.
  const lastAimRef = useRef<Point>(undefined)

  // Leaving the screen: into the bin it was sorted into, or straight down when there's no bin to fly to.
  const variants = {
    exit: (flyTo: FlyTo) => {
      const box = boxRef.current?.getBoundingClientRect()
      if (!flyTo || !box) return { scale: 0.4, y: 140, opacity: 0, transition: { duration: 0.25 } }
      const restX = box.left + box.width / 2 - x.get()
      const restY = box.top + box.height / 2 - y.get()
      return {
        x: flyTo.x - restX,
        y: flyTo.y - restY,
        scale: 0.2,
        rotate: 0,
        opacity: 0,
        transition: { duration: 0.35, ease: 'easeIn' as const },
      }
    },
  }

  return (
    <motion.figure
      style={{ x, y }}
      // touch-none: on a phone, dragging the sticker moves the sticker, not the page
      className={`flex flex-col items-center gap-2 ${isDraggable ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
      initial={{ scale: 0.6, rotate: shouldHint ? tilt : tilt - 8, opacity: 0 }}
      animate={{ scale: 1, rotate: shouldHint ? [tilt, tilt - 7, tilt + 6, tilt - 4, tilt] : tilt, opacity: 1 }}
      variants={variants}
      exit="exit"
      transition={{
        default: { type: 'spring', stiffness: 420, damping: 22 },
        // the hint wiggle waits until the sticker has landed
        rotate: shouldHint ? { delay: 0.9, duration: 0.9, ease: 'easeInOut' } : { type: 'spring', stiffness: 420, damping: 22 },
      }}
      whileHover={isDraggable ? { scale: 1.03 } : undefined}
      drag={isDraggable}
      dragSnapToOrigin // dropped anywhere but a bin, it springs back to where it was
      whileDrag={{ scale: dragScale, rotate: 0, zIndex: 50 }}
      onDragStart={() => {
        setIsDragging(true)
        onPickUp?.()
      }}
      onDrag={(_, info) => {
        lastAimRef.current = aimPoint(info)
        onDragMove?.(lastAimRef.current)
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false)
        onDrop?.(lastAimRef.current ?? aimPoint(info))
      }}
    >
      <div ref={boxRef} className={`sticker grid place-items-center bg-paper p-4 ${SIZES[size]}`}>
        {url && <img src={url} alt="" width={96} height={96} className="size-full" draggable={false} />}
      </div>
      {/* The name fades while dragging, so it doesn't trail over the bins' labels */}
      <motion.figcaption
        animate={{ opacity: isDragging ? 0 : 1 }}
        className="text-center font-heading text-title font-extrabold lg:text-heading"
      >
        {item.name}
      </motion.figcaption>
    </motion.figure>
  )
}
