import rawCatalog from '@/data/items.json'
import { parseCatalog, type Bin, type BinId, type Item } from '@/domain/catalog'

// Parsed once when the app starts. If the file is wrong, the app fails loudly here
// instead of showing a rule without a source.
export const catalog = parseCatalog(rawCatalog)

const binsById = new Map<BinId, Bin>(catalog.bins.map((bin) => [bin.id, bin]))
const itemsById = new Map<string, Item>(catalog.items.map((item) => [item.id, item]))

export function binFor(id: BinId): Bin {
  return binsById.get(id) as Bin
}

export function itemFor(id: string): Item | undefined {
  return itemsById.get(id)
}
