import { describe, expect, it } from 'vitest'
import rawCatalog from '@/data/items.json'
import { parseCatalog } from './catalog'
import { createSeededRandom } from './random'
import { ROUND_SIZE, buildRound } from './round'

const { items } = parseCatalog(rawCatalog)

describe('buildRound', () => {
  it('picks ROUND_SIZE different items', () => {
    const round = buildRound(items, { random: createSeededRandom(1) })

    expect(round).toHaveLength(ROUND_SIZE)
    expect(new Set(round.map((item) => item.id)).size).toBe(ROUND_SIZE)
  })

  it('always includes the items in mustInclude', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const round = buildRound(items, {
        random: createSeededRandom(seed),
        mustInclude: ['jam-jar', 'wine-glass'],
      })

      expect(round.map((item) => item.id)).toEqual(expect.arrayContaining(['jam-jar', 'wine-glass']))
    }
  })

  it('ignores mustInclude ids that are not in the catalogue', () => {
    const round = buildRound(items, { random: createSeededRandom(1), mustInclude: ['plastic-bottle'] })

    expect(round).toHaveLength(ROUND_SIZE)
  })

  it('returns all items when there are fewer than the round size', () => {
    const round = buildRound(items.slice(0, 4), { random: createSeededRandom(1) })

    expect(round).toHaveLength(4)
  })

  it('is repeatable with the same seed', () => {
    const first = buildRound(items, { random: createSeededRandom(5) })
    const second = buildRound(items, { random: createSeededRandom(5) })

    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id))
  })

  it('does not change the catalogue', () => {
    const before = items.map((item) => item.id)

    buildRound(items, { random: createSeededRandom(3) })

    expect(items.map((item) => item.id)).toEqual(before)
  })
})
