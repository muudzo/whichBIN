import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

type Props = {
  isOpen: boolean
  onStay: () => void
  onLeave: () => void
}

// A way out of a round that asks first (H3, H5). "Keep playing" is the main button, so the safe choice is the easy one;
// closing the sheet any other way also keeps playing.
export function LeaveRoundSheet({ isOpen, onStay, onLeave }: Props) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onStay()}>
      <DrawerContent className="rounded-t-[28px] border-t-[3px] border-ink bg-paper md:mx-auto md:max-w-xl md:border-x-[3px]">
        {/* The sheet is at most 80% of the screen tall. At 568 × 320, "Leave" was cut off below it, and at 200% text
            both buttons were (9 Nov). So: sideways, the two buttons sit side by side, and if the text still doesn't fit
            it scrolls while the buttons stay in sight, as in the How to play sheet (min-h-0 lets this column shrink to
            the sheet; shrink-0 keeps the buttons whole). With text that big for the sheet (under 20rem wide, a container
            query in rem; no phone at normal text) the title drops a step, so the whole question shows above the buttons. */}
        <div className="@container mx-auto flex min-h-0 w-full max-w-md flex-col landscape-phone:max-w-xl">
          <DrawerHeader className="min-h-0 gap-2 overflow-y-auto px-6 text-left md:text-left">
            <DrawerTitle className="font-heading text-heading font-extrabold landscape-phone:text-title @max-[20rem]:text-title">
              Leave this round?
            </DrawerTitle>
            <DrawerDescription className="text-body text-ink">
              This round&apos;s score will be lost. You can start a new round any time.
            </DrawerDescription>
          </DrawerHeader>
          {/* Side by side, "Keep playing" stays first (left), the order it is read and tabbed in */}
          <DrawerFooter className="shrink-0 gap-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] landscape-phone:flex-row landscape-phone:gap-2 landscape-phone:pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button size="lg" className="landscape-phone:h-12 landscape-phone:flex-1" onClick={onStay}>
              Keep playing
            </Button>
            <Button variant="ghost" className="landscape-phone:flex-1" onClick={onLeave}>
              Leave
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
