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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <h1 className="font-heading text-3xl font-extrabold">How to play</h1>
      </header>

      <ol className="flex flex-col gap-3 text-lg">
        <li className="sticker bg-paper px-4 py-3 shadow-sticker-sm">
          <strong>Tap the bin</strong> where each item goes in Leeuwarden.
        </li>
        <li className="sticker flex items-center gap-3 bg-paper px-4 py-3 shadow-sticker-sm">
          <span className="flex shrink-0 gap-0.5" aria-hidden="true">
            <PompebledHeart className="size-6" />
            <PompebledHeart className="size-6" />
            <PompebledHeart className="size-6" />
          </span>
          <span>
            <strong>3 lives</strong> per round. A wrong bin costs one.
          </span>
        </li>
        <li className="sticker bg-paper px-4 py-3 shadow-sticker-sm">
          Every wrong answer <strong>tells you why</strong>, with Omrin&apos;s page number.
        </li>
      </ol>

      <section aria-label="The six places things can go" className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-bold">The bins</h2>
        <BinGrid isDisabled />
      </section>

      <div className="mt-auto flex flex-col gap-3">
        <Button size="lg" onClick={onStart}>
          Start round
        </Button>
        <SourceLine />
      </div>
    </main>
  )
}
