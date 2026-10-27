import { PompebledHeart } from '@/components/brand/PompebledHeart'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

// The three rules, shared by the How to play screen and the sheet over a round, so the two can't drift apart.
export function HowToSteps({ className }: Props) {
  return (
    <ol className={cn('flex flex-col gap-2 text-body tall:text-lead', className)}>
      <li className="sticker bg-paper p-4 shadow-sticker-sm landscape-phone:p-3">
        <strong>Drag each item</strong> into the bin where it goes in Leeuwarden, or tap the bin.
      </li>
      <li className="sticker flex items-center gap-2 bg-paper p-4 shadow-sticker-sm landscape-phone:p-3">
        <span className="flex shrink-0 gap-1" aria-hidden="true">
          <PompebledHeart className="size-6" />
          <PompebledHeart className="size-6" />
          <PompebledHeart className="size-6" />
        </span>
        <span>
          <strong>3 lives</strong> per round. A wrong bin costs one.
        </span>
      </li>
      <li className="sticker bg-paper p-4 shadow-sticker-sm landscape-phone:p-3">
        Every wrong answer <strong>tells you why</strong>.
      </li>
    </ol>
  )
}
