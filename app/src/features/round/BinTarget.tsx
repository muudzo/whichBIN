import { GlassWater, Leaf, Newspaper, Shirt, Signpost, Trash2, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Bin, BinId } from '@/domain/catalog'

// Icon + Dutch name + English hint carry the meaning; the tint only helps.
// Tints are game colours, not Omrin's lid colours (only the Sortibak's grey is confirmed).
const BIN_STYLE: Record<BinId, { tint: string; Icon: LucideIcon }> = {
  sortibak: { tint: 'bg-bin-sortibak', Icon: Trash2 },
  biobak: { tint: 'bg-bin-biobak', Icon: Leaf },
  papierbak: { tint: 'bg-bin-papierbak', Icon: Newspaper },
  glasbak: { tint: 'bg-bin-glasbak', Icon: GlassWater },
  textielbak: { tint: 'bg-bin-textielbak', Icon: Shirt },
  'not-a-bin': { tint: 'bg-bin-not-a-bin', Icon: Signpost },
}

type Props = {
  bin: Bin
  isDisabled?: boolean
  onSelect?: (id: BinId) => void
}

export function BinTarget({ bin, isDisabled = false, onSelect }: Props) {
  const { tint, Icon } = BIN_STYLE[bin.id]

  return (
    <motion.button
      type="button"
      disabled={isDisabled || !onSelect}
      onClick={() => onSelect?.(bin.id)}
      whileTap={{ scale: 0.94 }}
      aria-label={`${bin.name}: ${bin.english}`}
      className={`sticker flex min-h-[84px] short:min-h-[72px] short:py-1.5 flex-col items-center justify-center gap-0.5 px-1 py-2 text-center shadow-sticker-sm ${tint} focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-default`}
    >
      <Icon className="size-5 text-ink" aria-hidden="true" />
      <span className="font-heading text-[15px] leading-tight font-extrabold">{bin.name}</span>
      <span className="text-[13px] leading-tight text-ink-muted">{bin.english}</span>
    </motion.button>
  )
}
