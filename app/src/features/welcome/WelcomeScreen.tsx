import { Button } from '@/components/ui/button'
import { stickerFor } from '@/features/game/stickers'

type Props = {
  onPlay: () => void
  onHowTo: () => void
  // The leaderboard and most-missed items, without having to play and save first (H7)
  onLeaderboard: () => void
}

// Test 1: testers didn't know what the product was. This screen says it in one line,
// and shows the game (stickers going into bins) before anything else.
// The stickers are small on mid-height phones (375 × 667), so Play and the links fit.
const HERO_STICKERS = [
  { id: 'jam-jar', className: 'left-[6%] top-[14%] -rotate-12 size-16 max-md:tall:size-24 md:size-28' },
  { id: 'pizza-box', className: 'right-[4%] top-[2%] rotate-6 size-20 max-md:tall:size-28 md:size-32' },
  { id: 'torn-tshirt', className: 'left-[34%] top-[40%] -rotate-3 size-16 max-md:tall:size-24 md:size-28' },
] as const

const LINK = 'h-11 px-3 underline decoration-2'

export function WelcomeScreen({ onPlay, onHowTo, onLeaderboard }: Props) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] md:max-w-xl md:px-8">
      {/* The Frisian flag's stripes, across the full width of the screen at any size */}
      <div aria-hidden="true" className="stripes absolute inset-x-0 top-0 h-6 border-b-[3px] border-ink" />

      <section aria-labelledby="welcome-title" className="flex flex-1 flex-col items-center justify-center gap-4 py-4 text-center short:gap-2 short:py-2">
        <p className="rounded-full border-2 border-ink bg-sun px-4 py-1 text-small font-bold">A 2-minute game · Leeuwarden</p>
        {/* Two stacked words that read as one logo: tighter than the display step's own line height */}
        <h1 id="welcome-title" className="font-heading text-display leading-[0.9] font-extrabold">
          Which
          <br />
          Bin?
        </h1>
        <p className="max-w-[18rem] text-lead md:max-w-sm">
          Sort everyday stuff into Leeuwarden&apos;s real bins. Every mistake tells you why.
        </p>

        <div aria-hidden="true" className="relative h-24 w-full max-w-xs short:hidden max-md:tall:h-44 md:h-56 md:max-w-sm">
          {HERO_STICKERS.map(({ id, className }) => (
            <div key={id} className={`sticker absolute grid place-items-center bg-paper p-2 ${className}`}>
              <img src={stickerFor(id)} alt="" width={80} height={80} className="size-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Play, the two links and one small line, 16px apart */}
      <div className="flex flex-col gap-4 short:gap-2">
        <Button size="lg" onClick={onPlay}>
          Play
        </Button>
        {/* Two quiet links in one row, so the screen gets no taller: a 375 × 667 phone has about 7px to spare.
            Underlined text rather than icons, so both fit; on a 320px phone, which has room, they wrap.
            44px to tap; the negative margins keep them from pushing Play off small screens. */}
        <div className="-my-2 flex flex-wrap justify-center gap-x-2">
          {/* Play shows How to play only before the first round of a visit; this opens it any time (F7) */}
          <Button variant="ghost" className={LINK} onClick={onHowTo}>
            How to play
          </Button>
          <Button variant="ghost" className={LINK} onClick={onLeaderboard}>
            See the leaderboard
          </Button>
        </div>
        {/* My decision (27 Oct): nothing after this. The pill already says "2-minute" */}
        <p className="text-center text-small text-ink-muted">No account.</p>
      </div>
    </main>
  )
}
