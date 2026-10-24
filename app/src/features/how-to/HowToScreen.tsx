import { ArrowLeft } from 'lucide-react'
import { PompebledHeart } from '@/components/brand/PompebledHeart'
import { SourceLine } from '@/components/brand/SourceLine'
import { Button } from '@/components/ui/button'
import { BinGrid } from '@/features/round/BinGrid'

type Props = {
  onStart: () => void
  onBack: () => void
}

// One screen of instructions, then play (Nielsen #10). Shown once per visit.
export function HowToScreen({ onStart, onBack }: Props) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:max-w-xl md:px-8">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <h1 className="font-heading text-heading font-extrabold">How to play</h1>
      </header>

      <ol className="flex flex-col gap-2 text-body tall:text-lead">
        <li className="sticker bg-paper p-4 shadow-sticker-sm">
          <strong>Drag each item</strong> into the bin where it goes in Leeuwarden, or tap the bin.
        </li>
        <li className="sticker flex items-center gap-2 bg-paper p-4 shadow-sticker-sm">
          <span className="flex shrink-0 gap-1" aria-hidden="true">
            <PompebledHeart className="size-6" />
            <PompebledHeart className="size-6" />
            <PompebledHeart className="size-6" />
          </span>
          <span>
            <strong>3 lives</strong> per round. A wrong bin costs one.
          </span>
        </li>
        <li className="sticker bg-paper p-4 shadow-sticker-sm">
          Every wrong answer <strong>tells you why</strong>, with Omrin&apos;s page number.
        </li>
      </ol>

      <section aria-label="The six places things can go" className="flex flex-col gap-2">
        <h2 className="font-heading text-title font-bold">The bins</h2>
        <BinGrid isDisabled />
      </section>

      <div className="mt-auto flex flex-col gap-4">
        <Button size="lg" onClick={onStart}>
          Start round
        </Button>
        <SourceLine />
      </div>
    </main>
  )
}
