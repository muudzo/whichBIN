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

// On phones the sticker follows the screen's height, so the lives bar and all six bins always fit.
// On tablets and desktops it follows the width and is the biggest thing on screen (UI 102 hierarchy).
// max-md: keeps the height rules to phones; otherwise they would override the md: and lg: sizes.
const SIZES = {
  md: 'size-28',
  lg: 'size-32 max-md:short:size-24 max-md:short:p-2 max-md:tall:size-40 md:size-48 lg:size-56',
} as const

// motion reports the finger's position on the page; the bins' positions are on the screen.
const onScreen = ({ point }: PanInfo): Point => ({ x: point.x - window.scrollX, y: point.y - window.scrollY })

export function ItemSticker({ item, size = 'lg', tilt = -3, onDragMove, onDrop }: Props) {
  const url = stickerFor(item.id)
  const isDraggable = Boolean(onDrop)

  return (
    <motion.figure
      // touch-none: on a phone, dragging the sticker moves the sticker, not the page
      className={`flex flex-col items-center gap-2 ${isDraggable ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
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
      <div className={`sticker grid place-items-center bg-paper p-4 ${SIZES[size]}`}>
        {url && <img src={url} alt="" width={96} height={96} className="size-full" draggable={false} />}
      </div>
      <figcaption className="text-center font-heading text-title font-extrabold tall:text-heading">{item.name}</figcaption>
    </motion.figure>
  )
}
