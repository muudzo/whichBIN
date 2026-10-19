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

const CHECKED_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function checkedLabel(): string {
  return CHECKED_FORMAT.format(new Date(`${catalog.checked}T12:00:00`))
}

export function sourceLabel(item: Item): string {
  const pages = item.pages.length === 1 ? `p. ${item.pages[0]}` : `pp. ${item.pages.join(', ')}`
  return `Omrin waste guide 2026, ${pages} · checked ${checkedLabel()}`
}
