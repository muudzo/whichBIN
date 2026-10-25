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
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader className="gap-2 px-6 text-left md:text-left">
            <DrawerTitle className="font-heading text-heading font-extrabold landscape-phone:text-title">
              Leave this round?
            </DrawerTitle>
            <DrawerDescription className="text-body text-ink">
              This round&apos;s score will be lost. You can start a new round any time.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="gap-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] landscape-phone:gap-2 landscape-phone:pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button size="lg" onClick={onStay}>
              Keep playing
            </Button>
            <Button variant="ghost" onClick={onLeave}>
              Leave
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
