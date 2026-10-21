import { motion, type PanInfo } from 'motion/react'
import type { Item } from '@/domain/catalog'
import { stickerFor } from '@/features/game/stickers'
import type { Point } from './dropTarget'

type Props = {
  item: Item
  size?: 'md' | 'lg'
  tilt?: number
  // Given during a round: the sticker can then be dragged onto a bin. Points are screen positions.
  onDragMove?: (point: Point) => void
  onDrop?: (point: Point) => void
}

// The sticker shrinks on short screens so the lives bar and all six bins always fit.
const SIZES = { md: 'size-28', lg: 'size-32 short:size-24 short:p-3 tall:size-40' } as const

// motion reports the finger's position on the page; the bins' positions are on the screen.
const onScreen = ({ point }: PanInfo): Point => ({ x: point.x - window.scrollX, y: point.y - window.scrollY })

export function ItemSticker({ item, size = 'lg', tilt = -3, onDragMove, onDrop }: Props) {
  const url = stickerFor(item.id)
  const isDraggable = Boolean(onDrop)

  return (
    <motion.figure
      // touch-none: on a phone, dragging the sticker moves the sticker, not the page
      className={`flex flex-col items-center gap-3 ${isDraggable ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
      initial={{ scale: 0.6, rotate: tilt - 8, opacity: 0 }}
      animate={{ scale: 1, rotate: tilt, opacity: 1 }}
      exit={{ scale: 0.4, y: 140, opacity: 0, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      drag={isDraggable}
      dragSnapToOrigin // dropped anywhere but a bin, it springs back to where it was
      whileDrag={{ scale: 1.08, rotate: 0, zIndex: 10 }}
      onDrag={(_, info) => onDragMove?.(onScreen(info))}
      onDragEnd={(_, info) => onDrop?.(onScreen(info))}
    >
      <div className={`sticker grid place-items-center bg-paper p-5 ${SIZES[size]}`}>
        {url && <img src={url} alt="" width={96} height={96} className="size-full" draggable={false} />}
      </div>
      <figcaption className="text-center font-heading text-2xl font-extrabold short:text-xl">{item.name}</figcaption>
    </motion.figure>
  )
}
