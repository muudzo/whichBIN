import { motion } from 'motion/react'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import type { BinId, Item } from '@/domain/catalog'
import { binFor, sourceLabel } from '@/features/game/catalog'
import type { ItemStat } from '@/services/scoreStore'
import { communityLine } from './community'

type Props = {
  item: Item
  chosen: BinId
  stat: ItemStat | undefined
  onContinue: () => void
}

// After a wrong answer (design review 26 Oct): the explanation takes the item's place in the tray instead of a sheet
// over the bins, so the player still sees the bins: the chosen one crossed, the right one ticked with its lid open.
// Focus moves to Got it, whose description is the explanation, so a screen reader reads it out and Enter continues.
export function NotQuiteCard({ item, chosen, stat, onContinue }: Props) {
  const titleId = useId()
  const explanationId = useId()
  const destination = item.where ?? binFor(item.bin).name
  const community = stat ? communityLine(stat) : undefined

  return (
    <motion.section
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticker flex w-full flex-col gap-2 self-start bg-paper p-4 short:gap-1 short:p-3 side-by-side:self-center"
    >
      <h2 id={titleId} className="font-heading text-title font-extrabold text-pompebled">
        Not quite
      </h2>
      <div id={explanationId} className="flex flex-col gap-1">
        {/* The cross on the bin shows this to sighted players; screen readers need the words */}
        <p className="sr-only">You chose {binFor(chosen).name}.</p>
        <p className="font-heading text-body font-bold">
          {item.name} → {destination}
        </p>
        <p className="text-body leading-snug short:text-small">{item.why}</p>
        {community && <p className="text-small font-bold">{community}</p>}
        <p className="text-small text-ink-muted">Source: {sourceLabel(item)}</p>
      </div>
      <Button autoFocus aria-describedby={explanationId} onClick={onContinue} className="w-full">
        Got it
      </Button>
    </motion.section>
  )
}
