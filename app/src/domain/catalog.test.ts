import { describe, expect, it } from 'vitest'
import rawCatalog from '@/data/items.json'
import { parseCatalog } from './catalog'

function withItems(items: unknown[]) {
  return { ...rawCatalog, items }
}

const validItem = rawCatalog.items[0]

describe('parseCatalog', () => {
  it('accepts the real verified items file', () => {
    const catalog = parseCatalog(rawCatalog)

    expect(catalog.items).toHaveLength(15)
    expect(catalog.bins.map((bin) => bin.id)).toEqual([
      'sortibak',
      'biobak',
      'papierbak',
      'glasbak',
      'textielbak',
      'not-a-bin',
    ])
  })

  it('rejects an item with a bin that does not exist', () => {
    const items = [...rawCatalog.items.slice(1), { ...validItem, bin: 'pmd' }]

    expect(() => parseCatalog(withItems(items))).toThrow(/Invalid item catalogue/)
  })

  it('rejects a not-a-bin item without "where"', () => {
    const items = [...rawCatalog.items.slice(1), { ...validItem, bin: 'not-a-bin' }]

    expect(() => parseCatalog(withItems(items))).toThrow(/where/)
  })

  it('rejects "where" on an item that goes in a bin', () => {
    const items = [...rawCatalog.items.slice(1), { ...validItem, where: 'Somewhere' }]

    expect(() => parseCatalog(withItems(items))).toThrow(/where/)
  })

  it('rejects an item without a source page', () => {
    const items = [...rawCatalog.items.slice(1), { ...validItem, pages: [] }]

    expect(() => parseCatalog(withItems(items))).toThrow(/Invalid item catalogue/)
  })

  it('rejects an item that is not confirmed by the sources', () => {
    const items = [...rawCatalog.items.slice(1), { ...validItem, status: 'not found' }]

    expect(() => parseCatalog(withItems(items))).toThrow(/Invalid item catalogue/)
  })

  it('rejects duplicate item ids', () => {
    const items = [...rawCatalog.items.slice(1), rawCatalog.items[1]]

    expect(() => parseCatalog(withItems(items))).toThrow(/unique/)
  })

  it('rejects fewer than 10 items', () => {
    expect(() => parseCatalog(withItems(rawCatalog.items.slice(0, 9)))).toThrow(/Invalid item catalogue/)
  })

  it('rejects a check date that is not a date', () => {
    expect(() => parseCatalog({ ...rawCatalog, checked: '19 Oct' })).toThrow(/Invalid item catalogue/)
  })
})
