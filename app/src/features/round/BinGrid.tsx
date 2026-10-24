import type { Ref } from 'react'
import type { BinId } from '@/domain/catalog'
import { catalog } from '@/features/game/catalog'
import { BinTarget } from './BinTarget'

type Props = {
  ref?: Ref<HTMLDivElement>
  isDisabled?: boolean
  highlighted?: BinId
  onSelect?: (id: BinId) => void
}

// 3 × 2 grid: six big targets in thumb reach (Fitts's law).
export function BinGrid({ ref, isDisabled, highlighted, onSelect }: Props) {
  return (
    <div ref={ref} className="grid grid-cols-3 gap-2 lg:gap-4" role="group" aria-label="Bins">
      {catalog.bins.map((bin) => (
        <BinTarget
          key={bin.id}
          bin={bin}
          isDisabled={isDisabled}
          isHighlighted={highlighted === bin.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
