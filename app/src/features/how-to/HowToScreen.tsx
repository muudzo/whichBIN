import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BinGrid } from '@/features/round/BinGrid'
import { HowToSteps } from './HowToSteps'

type Props = {
  onStart: () => void
  onBack: () => void
}

// One screen of instructions, then play (Nielsen #10). Play shows it before the first round of a visit;
// the start screen's "How to play" link opens it any time, and the "?" in a round opens the same rules as a sheet.
export function HowToScreen({ onStart, onBack }: Props) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:max-w-xl md:px-8">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <h1 className="font-heading text-heading font-extrabold">How to play</h1>
      </header>

      <HowToSteps />

      <section aria-label="The six places things can go" className="flex flex-col gap-2">
        <h2 className="font-heading text-title font-bold">The bins</h2>
        <BinGrid isDisabled />
      </section>

      <Button size="lg" className="mt-auto" onClick={onStart}>
        Start round
      </Button>
    </main>
  )
}
