import type { BinId } from '@/domain/catalog'
import { catalog } from '@/features/game/catalog'
import { BinTarget } from './BinTarget'

type Props = {
  isDisabled?: boolean
  onSelect?: (id: BinId) => void
}

// 3 × 2 grid: six big targets in thumb reach (Fitts's law).
export function BinGrid({ isDisabled, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Bins">
      {catalog.bins.map((bin) => (
        <BinTarget key={bin.id} bin={bin} isDisabled={isDisabled} onSelect={onSelect} />
      ))}
    </div>
  )
}
