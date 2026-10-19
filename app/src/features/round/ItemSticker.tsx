import { motion } from 'motion/react'
import type { Item } from '@/domain/catalog'
import { stickerFor } from '@/features/game/stickers'

type Props = {
  item: Item
  size?: 'md' | 'lg'
  tilt?: number
}

const SIZES = { md: 'size-28', lg: 'size-40' } as const

export function ItemSticker({ item, size = 'lg', tilt = -3 }: Props) {
  const url = stickerFor(item.id)

  return (
    <motion.figure
      className="flex flex-col items-center gap-3"
      initial={{ scale: 0.6, rotate: tilt - 8, opacity: 0 }}
      animate={{ scale: 1, rotate: tilt, opacity: 1 }}
      exit={{ scale: 0.4, y: 140, opacity: 0, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      <div className={`sticker grid place-items-center bg-paper p-5 ${SIZES[size]}`}>
        {url && <img src={url} alt="" width={96} height={96} className="size-full" draggable={false} />}
      </div>
      <figcaption className="font-heading text-2xl font-extrabold">{item.name}</figcaption>
    </motion.figure>
  )
}
