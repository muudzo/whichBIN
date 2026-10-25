import type { Ref } from 'react'
import type { BinId } from '@/domain/catalog'
import { catalog } from '@/features/game/catalog'
import { BinTarget } from './BinTarget'

type Props = {
  ref?: Ref<HTMLDivElement>
  isDisabled?: boolean
  // True while an item is being dragged: every bin lifts a little to show it's a place to drop.
  isAwaitingDrop?: boolean
  highlighted?: BinId
  onSelect?: (id: BinId) => void
}

// 3 × 2 grid: six big targets in thumb reach (Fitts's law).
export function BinGrid({ ref, isDisabled, isAwaitingDrop, highlighted, onSelect }: Props) {
  return (
    <div ref={ref} className="grid grid-cols-3 gap-2 lg:gap-4" role="group" aria-label="Bins">
      {catalog.bins.map((bin, i) => (
        <BinTarget
          key={bin.id}
          bin={bin}
          // the 1–6 key that picks this bin; only shown where bins can be picked
          shortcut={onSelect ? i + 1 : undefined}
          isDisabled={isDisabled}
          isAwaitingDrop={isAwaitingDrop}
          isHighlighted={highlighted === bin.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
