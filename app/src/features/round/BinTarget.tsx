import { Check, GlassWater, Leaf, Newspaper, Shirt, Signpost, Trash2, X, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Bin, BinId } from '@/domain/catalog'
import { BinShape } from './BinShape'

// Feedback on the bin itself, where the item just went: a tick for the right bin, a cross for a wrong choice.
export type BinMark = 'right' | 'wrong'

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
  mark?: BinMark
  onSelect?: (id: BinId) => void
}

export function BinTarget({ bin, shortcut, isDisabled = false, isHighlighted = false, mark, onSelect }: Props) {
  const Icon = BIN_ICON[bin.id]

  return (
    <motion.button
      type="button"
      data-bin-id={bin.id}
      data-open={isHighlighted || undefined}
      data-mark={mark}
      disabled={isDisabled || !onSelect}
      onClick={() => onSelect?.(bin.id)}
      animate={{ scale: isHighlighted ? 1.06 : 1 }}
      whileTap={{ scale: 0.94 }}
      aria-label={`${bin.name}: ${bin.english}`}
      // `group` lets the drawing inside react to this button's hover. Keyboard focus gets a solid ring around the whole target.
      // The padding keeps the label inside the drawn body, which narrows towards the bottom; the narrowest phones get
      // less side padding so "Textielbak" still fits. The label sits near the top, like the sticker on a real bin: since the
      // bins fill tall screens (27 Oct), a centred label floated in a lot of colour, and a dragged item covered it.
      className="group relative flex min-h-[92px] flex-col items-center justify-start px-2 pt-4 pb-3.5 text-center tall:pt-7 min-[360px]:px-3 short:min-h-[80px] md:min-h-28 lg:min-h-32 rounded-sticker focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fries-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-default"
    >
      <BinShape bin={bin.id} isOpen={isHighlighted} />
      {/* `relative` puts the label above the drawing, which is absolutely positioned and would otherwise cover it.
          Phones held sideways are short: at 800 × 304 (an Android phone with Chrome's bar showing) two rows of bins with
          the icon above the name didn't fit under the status bar (9 Nov). So there, where the bins' area is at least
          24rem wide (@sm, a container query on the area in RoundScreen.tsx), the icon sits beside the name and the hint
          wraps onto its own line (basis-full). Narrower bins (568 × 320) keep the icon on top: the name wouldn't fit beside it.
          wrap-anywhere: with text at 200%, a name wider than its bin breaks inside the word instead of running into the
          next bin ("Glasbak" ran over "Textielbak", 9 Nov). At normal sizes every name fits, so nothing changes there. */}
      <span className="relative flex flex-col items-center gap-1 wrap-anywhere landscape-phone:@sm:flex-row landscape-phone:@sm:flex-wrap landscape-phone:@sm:justify-center landscape-phone:@sm:gap-x-1.5">
        <Icon className="size-5 text-ink md:size-6 landscape-phone:size-5" aria-hidden="true" />
        {/* Labels, not running text: tight line height. The name drops a step where bins are narrow
            (the narrowest phones, and phones held sideways) so "Textielbak" fits. */}
        <span className="font-heading text-small leading-tight font-extrabold min-[360px]:text-body landscape-phone:text-small">
          {bin.name}
        </span>
        <span className="text-small leading-tight text-ink landscape-phone:@sm:basis-full">{bin.english}</span>
      </span>
      {mark && (
        // A badge on the lid's corner; it pops in so the eye catches it. Screen readers get the same news from the text feedback.
        <motion.span
          key={mark}
          aria-hidden="true"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute -top-2 -right-1 z-10 grid size-8 place-items-center rounded-full border-[3px] border-ink text-paper shadow-sticker-sm ${mark === 'right' ? 'bg-meadow' : 'bg-pompebled'}`}
        >
          {mark === 'right' ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
        </motion.span>
      )}
      {shortcut !== undefined && (
        // Hidden where the icon sits beside the name (see the label above): the number would cover the name's end.
        // That layout is for phones held sideways, which have no mouse; a laptop window that short is rare.
        <kbd aria-hidden="true" className="absolute top-4 right-3 hidden font-heading text-small leading-none font-bold text-ink/70 pointer-fine:block landscape-phone:@sm:hidden">
          {shortcut}
        </kbd>
      )}
    </motion.button>
  )
}
