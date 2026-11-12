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
// Far enough apart that an open bin doesn't touch its neighbour (9 Nov): a bin that opens grows 6%, so 3% of its
// height at the top and bottom. Tall phones (bins up to about 320px tall) get 12px between the rows; from tablets up
// (md, was lg) 16px all round, for bins up to about 470px. With 8px, an open bin overlapped the one above or below it
// by 1px on a 430 × 932 phone and 2–4px on upright tablets.
export function BinGrid({ ref, className, isDisabled, highlighted, marks, onSelect }: Props) {
  return (
    <div ref={ref} className={cn('grid grid-cols-3 gap-2 max-md:tall:gap-y-3 md:gap-4', className)} role="group" aria-label="Bins">
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
