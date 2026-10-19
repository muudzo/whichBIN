import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { Item } from '@/domain/catalog'
import { binFor, sourceLabel } from '@/features/game/catalog'
import type { ItemStat } from '@/services/scoreStore'
import { communityLine } from './community'

type Props = {
  item: Item | undefined
  stat: ItemStat | undefined
  isOpen: boolean
  onContinue: () => void
}

export function NotQuiteSheet({ item, stat, isOpen, onContinue }: Props) {
  const destination = item ? (item.where ?? binFor(item.bin).name) : ''
  const community = stat ? communityLine(stat) : undefined

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onContinue()}>
      <DrawerContent className="rounded-t-[28px] border-t-[3px] border-ink bg-paper">
        {item && (
          <div className="mx-auto flex w-full max-w-md flex-col">
            <DrawerHeader className="gap-2 px-5 text-left md:text-left">
              <DrawerTitle className="font-heading text-3xl font-extrabold text-pompebled">Not quite</DrawerTitle>
              <p className="font-heading text-xl font-bold">
                {item.name} → {destination}
              </p>
              <DrawerDescription className="text-base text-ink">{item.why}</DrawerDescription>
            </DrawerHeader>

            {community && (
              <p className="mx-5 rounded-xl border-2 border-ink bg-sky px-3 py-2 text-sm font-bold">{community}</p>
            )}

            <DrawerFooter className="gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <p className="text-sm text-ink-muted">Source: {sourceLabel(item)}</p>
              <Button size="lg" onClick={onContinue}>
                Got it
              </Button>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
