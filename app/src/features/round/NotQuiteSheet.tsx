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
      {/* On wide screens the sheet is a centred card in the game's column, not a strip across the whole screen.
          On a phone held sideways it's more compact, and scrolls if it still doesn't fit, so Got it is always reachable. */}
      <DrawerContent className="rounded-t-[28px] border-t-[3px] border-ink bg-paper md:mx-auto md:max-w-xl md:border-x-[3px] landscape-phone:overflow-y-auto">
        {item && (
          <div className="mx-auto flex w-full max-w-md flex-col landscape-phone:max-w-xl">
            <DrawerHeader className="gap-2 px-6 text-left md:text-left landscape-phone:gap-1 landscape-phone:pt-2">
              <DrawerTitle className="font-heading text-heading font-extrabold text-pompebled landscape-phone:text-title">
                Not quite
              </DrawerTitle>
              <p className="font-heading text-title font-bold">
                {item.name} → {destination}
              </p>
              <DrawerDescription className="text-lead text-ink landscape-phone:text-body">{item.why}</DrawerDescription>
            </DrawerHeader>

            {community && (
              <p className="mx-6 rounded-xl border-2 border-ink bg-sky px-4 py-2 text-small font-bold">{community}</p>
            )}

            <DrawerFooter className="gap-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] landscape-phone:gap-2 landscape-phone:pt-2 landscape-phone:pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="text-small text-ink-muted">Source: {sourceLabel(item)}</p>
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
