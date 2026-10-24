import { GlassWater, Leaf, Newspaper, Shirt, Signpost, Trash2, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Bin, BinId } from '@/domain/catalog'

// Icon + Dutch name + English hint carry the meaning; the tint only helps.
// Tints are game colours, not Omrin's lid colours (only the Sortibak's grey is confirmed).
const BIN_STYLE: Record<BinId, { body: string; lid: string; Icon: LucideIcon }> = {
  sortibak: { body: 'bg-bin-sortibak', lid: 'bg-bin-sortibak-lid', Icon: Trash2 },
  biobak: { body: 'bg-bin-biobak', lid: 'bg-bin-biobak-lid', Icon: Leaf },
  papierbak: { body: 'bg-bin-papierbak', lid: 'bg-bin-papierbak-lid', Icon: Newspaper },
  glasbak: { body: 'bg-bin-glasbak', lid: 'bg-bin-glasbak-lid', Icon: GlassWater },
  textielbak: { body: 'bg-bin-textielbak', lid: 'bg-bin-textielbak-lid', Icon: Shirt },
  'not-a-bin': { body: 'bg-bin-not-a-bin', lid: 'bg-bin-not-a-bin-lid', Icon: Signpost },
}

type Props = {
  bin: Bin
  isDisabled?: boolean
  // True while an item is dragged over this bin: it grows and gets a thick outline, so the player sees where it will land.
  isHighlighted?: boolean
  onSelect?: (id: BinId) => void
}

export function BinTarget({ bin, isDisabled = false, isHighlighted = false, onSelect }: Props) {
  const { body, lid, Icon } = BIN_STYLE[bin.id]

  return (
    <motion.button
      type="button"
      data-bin-id={bin.id}
      disabled={isDisabled || !onSelect}
      onClick={() => onSelect?.(bin.id)}
      animate={{ scale: isHighlighted ? 1.08 : 1 }}
      whileTap={{ scale: 0.94 }}
      aria-label={`${bin.name}: ${bin.english}`}
      // Hover lifts the bin like a sticker being picked up (mouse only); keyboard focus gets a solid ring.
      className={`sticker relative flex min-h-[84px] short:min-h-[72px] md:min-h-28 lg:min-h-32 flex-col items-center justify-center gap-1 overflow-hidden px-1 pt-4 pb-2 short:pb-1 text-center shadow-sticker-sm transition-[translate,box-shadow] duration-150 ease-out enabled:hover:-translate-y-1 enabled:hover:shadow-sticker ${body} ${isHighlighted ? 'ring-4 ring-ink' : ''} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fries-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-default`}
    >
      {/* The lid: a darker band across the top, so the card reads as a bin */}
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-2.5 border-b-[3px] border-ink ${lid}`} />
      <Icon className="size-5 text-ink md:size-6" aria-hidden="true" />
      {/* Labels, not running text: tight line height. The name drops a step where bins are narrow
          (the narrowest phones, and phones held sideways) so "Textielbak" fits. */}
      <span className="font-heading text-small leading-tight font-extrabold min-[360px]:text-body landscape-phone:text-small">
        {bin.name}
      </span>
      <span className="text-small leading-tight text-ink">{bin.english}</span>
    </motion.button>
  )
}
