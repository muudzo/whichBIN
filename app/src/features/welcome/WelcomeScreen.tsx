import { SourceLine } from '@/components/brand/SourceLine'
import { Button } from '@/components/ui/button'
import { stickerFor } from '@/features/game/stickers'

type Props = {
  onPlay: () => void
}

// Test 1: testers didn't know what the product was. This screen says it in one line,
// and shows the game (stickers going into bins) before anything else.
const HERO_STICKERS = [
  { id: 'jam-jar', className: 'left-[6%] top-[14%] -rotate-12 size-24' },
  { id: 'pizza-box', className: 'right-[4%] top-[2%] rotate-6 size-28' },
  { id: 'torn-tshirt', className: 'left-[34%] top-[42%] -rotate-3 size-24' },
] as const

export function WelcomeScreen({ onPlay }: Props) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div aria-hidden="true" className="stripes -mx-4 h-5 border-b-[3px] border-ink" />

      <section aria-labelledby="welcome-title" className="flex flex-1 flex-col items-center justify-center gap-5 py-6 text-center">
        <p className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-sm font-bold">A 2-minute game · Leeuwarden</p>
        <h1 id="welcome-title" className="font-heading text-7xl leading-[0.9] font-extrabold">
          Which
          <br />
          Bin?
        </h1>
        <p className="max-w-[18rem] text-lg">
          Sort everyday stuff into Leeuwarden&apos;s real bins. Every mistake tells you why.
        </p>

        <div aria-hidden="true" className="relative h-44 w-full max-w-xs">
          {HERO_STICKERS.map(({ id, className }) => (
            <div key={id} className={`sticker absolute grid place-items-center bg-paper p-3 ${className}`}>
              <img src={stickerFor(id)} alt="" width={80} height={80} className="size-full" />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={onPlay}>
          Play
        </Button>
        <p className="text-center text-sm text-ink-muted">No account. About 2 minutes.</p>
        <SourceLine />
      </div>
    </main>
  )
}
