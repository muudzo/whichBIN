import type { Ref } from 'react'
import type { BinId } from '@/domain/catalog'
import { catalog } from '@/features/game/catalog'
import { cn } from '@/lib/utils'
import { BinTarget, type BinMark } from './BinTarget'

type Props = {
  ref?: Ref<HTMLDivElement>
  className?: string
  isDisabled?: boolean
  highlighted?: BinId
  // Ticks and crosses on bins after an answer
  marks?: Partial<Record<BinId, BinMark>>
  onSelect?: (id: BinId) => void
}

// 3 × 2 grid: six big targets in thumb reach (Fitts's law).
export function BinGrid({ ref, className, isDisabled, highlighted, marks, onSelect }: Props) {
  return (
    <div ref={ref} className={cn('grid grid-cols-3 gap-2 lg:gap-4', className)} role="group" aria-label="Bins">
      {catalog.bins.map((bin, i) => (
        <BinTarget
          key={bin.id}
          bin={bin}
          // the 1–6 key that picks this bin; only shown where bins can be picked
          shortcut={onSelect ? i + 1 : undefined}
          isDisabled={isDisabled}
          isHighlighted={highlighted === bin.id}
          mark={marks?.[bin.id]}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
