import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { HowToSteps } from './HowToSteps'

type Props = {
  isOpen: boolean
  onClose: () => void
}

// The rules over a round, from the "?" in the top bar (F7). The round waits while it's open;
// closing it any way goes back to the same item.
export function HowToSheet({ isOpen, onClose }: Props) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="rounded-t-[28px] border-t-[3px] border-ink bg-cream md:mx-auto md:max-w-xl md:border-x-[3px]">
        {/* The sheet is at most 80% of the screen tall. When the rules don't fit (small or sideways phones),
            they scroll and "Back to the round" stays in sight: min-h-0 lets this column shrink to the sheet. */}
        {/* On a sideways phone the sheet is wider and its text smaller, so all three rules fit in the low height. */}
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-col landscape-phone:max-w-xl">
          <DrawerHeader className="gap-1 px-6 text-left md:text-left short:py-2 landscape-phone:py-1">
            <DrawerTitle className="font-heading text-heading font-extrabold short:text-title">
              How to play
            </DrawerTitle>
            <DrawerDescription className="sr-only">The rules of a round. The round waits while this is open.</DrawerDescription>
          </DrawerHeader>
          {/* py-1 leaves room for the stickers' shadows, which a scrolling box would otherwise cut off */}
          <div className="min-h-0 overflow-y-auto px-6 py-1">
            <HowToSteps className="landscape-phone:text-small" />
          </div>
          <DrawerFooter className="shrink-0 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] short:pt-2 short:pb-[max(1rem,env(safe-area-inset-bottom))] landscape-phone:pt-2 landscape-phone:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button size="lg" className="landscape-phone:h-12" onClick={onClose}>
              Back to the round
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
