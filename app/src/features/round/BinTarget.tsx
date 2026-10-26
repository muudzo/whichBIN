import { GlassWater, Leaf, Newspaper, Shirt, Signpost, Trash2, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Bin, BinId } from '@/domain/catalog'
import { BinShape } from './BinShape'

// Icon + Dutch name + English hint carry the meaning; the drawing and its colour only help.
const BIN_ICON: Record<BinId, LucideIcon> = {
  sortibak: Trash2,
  biobak: Leaf,
  papierbak: Newspaper,
  glasbak: GlassWater,
  textielbak: Shirt,
  'not-a-bin': Signpost,
}

type Props = {
  bin: Bin
  // The number key that picks this bin, shown on devices with a mouse or trackpad.
  shortcut?: number
  isDisabled?: boolean
  // True while an item is dragged over this bin: its lid opens and it grows, so the player sees where the item will land.
  isHighlighted?: boolean
  onSelect?: (id: BinId) => void
}

export function BinTarget({ bin, shortcut, isDisabled = false, isHighlighted = false, onSelect }: Props) {
  const Icon = BIN_ICON[bin.id]

  return (
    <motion.button
      type="button"
      data-bin-id={bin.id}
      data-open={isHighlighted || undefined}
      disabled={isDisabled || !onSelect}
      onClick={() => onSelect?.(bin.id)}
      animate={{ scale: isHighlighted ? 1.06 : 1 }}
      whileTap={{ scale: 0.94 }}
      aria-label={`${bin.name}: ${bin.english}`}
      // `group` lets the drawing inside react to this button's hover. Keyboard focus gets a solid ring around the whole target.
      // The padding keeps the label inside the drawn body, which narrows towards the bottom; the narrowest phones get
      // less side padding so "Textielbak" still fits.
      className="group relative flex min-h-[92px] flex-col items-center justify-center px-2 pt-4 pb-3.5 text-center min-[360px]:px-3 short:min-h-[80px] md:min-h-28 lg:min-h-32 rounded-sticker focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fries-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-default"
    >
      <BinShape bin={bin.id} isOpen={isHighlighted} />
      {/* `relative` puts the label above the drawing, which is absolutely positioned and would otherwise cover it */}
      <span className="relative flex flex-col items-center gap-1">
        <Icon className="size-5 text-ink md:size-6" aria-hidden="true" />
        {/* Labels, not running text: tight line height. The name drops a step where bins are narrow
            (the narrowest phones, and phones held sideways) so "Textielbak" fits. */}
        <span className="font-heading text-small leading-tight font-extrabold min-[360px]:text-body landscape-phone:text-small">
          {bin.name}
        </span>
        <span className="text-small leading-tight text-ink">{bin.english}</span>
      </span>
      {shortcut !== undefined && (
        <kbd aria-hidden="true" className="absolute top-4 right-3 hidden font-heading text-small leading-none font-bold text-ink/70 pointer-fine:block">
          {shortcut}
        </kbd>
      )}
    </motion.button>
  )
}
