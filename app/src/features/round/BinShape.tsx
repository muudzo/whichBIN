import type { BinId } from '@/domain/catalog'

// Game colours, NOT Omrin's lid colours (only the Sortibak's grey is confirmed).
// Written out in full so Tailwind finds the class names.
const COLOURS: Record<Exclude<BinId, 'not-a-bin'>, { body: string; lid: string }> = {
  sortibak: { body: 'fill-bin-sortibak', lid: 'bg-bin-sortibak-lid' },
  biobak: { body: 'fill-bin-biobak', lid: 'bg-bin-biobak-lid' },
  papierbak: { body: 'fill-bin-papierbak', lid: 'bg-bin-papierbak-lid' },
  glasbak: { body: 'fill-bin-glasbak', lid: 'bg-bin-glasbak-lid' },
  textielbak: { body: 'fill-bin-textielbak', lid: 'bg-bin-textielbak-lid' },
}

// The body narrows towards the bottom, with rounded bottom corners. Drawn in a 100 × 100 box that
// stretches to the bin's size; non-scaling-stroke keeps the outline 3px however much it stretches.
const BODY = 'M0 0 H100 L95 93 Q94.5 100 88 100 H12 Q5.5 100 5 93 Z'

type Props = {
  bin: BinId
  // True while an item is over the bin: the lid tilts open.
  isOpen?: boolean
}

// The drawing behind a bin's label: a wheelie bin seen from the front. Decoration only (aria-hidden):
// the button around it is what the player taps or drops on, and it stays a full rectangle (Fitts's law).
export function BinShape({ bin, isOpen = false }: Props) {
  if (bin === 'not-a-bin') {
    // Not a container, so no lid or wheels: a dashed outline, "somewhere else".
    return (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-1 top-3 bottom-2 rounded-sticker border-[3px] border-ink bg-bin-not-a-bin ${isOpen ? 'border-solid shadow-sticker' : 'border-dashed shadow-sticker-sm'}`}
      />
    )
  }

  const { body, lid } = COLOURS[bin]
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Wheels first, so the body covers their top half */}
      <span className="absolute bottom-0 left-[16%] size-4 rounded-full bg-ink" />
      <span className="absolute right-[16%] bottom-0 size-4 rounded-full bg-ink" />
      <span className="absolute inset-x-1 top-3 bottom-2">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`size-full overflow-visible ${isOpen ? 'drop-shadow-sticker' : 'drop-shadow-sticker-sm'}`}
        >
          <path d={BODY} className={`${body} stroke-ink`} strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
      {/* The lid: wider than the body, hinged at its left end. It peeks open under a mouse, and opens while an item is over the bin.
          `rotate` is a transform, so the browser animates it without redrawing the page. */}
      <span
        className={`absolute inset-x-0 top-0 h-3.5 origin-bottom-left rounded-t-[10px] rounded-b-[4px] border-[3px] border-ink transition-[rotate] duration-150 ease-out ${lid} ${isOpen ? '-rotate-[16deg]' : 'group-enabled:group-hover:-rotate-6'}`}
      />
    </span>
  )
}
