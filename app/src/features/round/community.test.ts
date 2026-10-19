import { describe, expect, it } from 'vitest'
import { communityLine } from './community'

describe('communityLine', () => {
  it('counts the other players, not the one who just answered', () => {
    expect(communityLine({ itemId: 'wine-glass', wrong: 6, total: 9 })).toBe('5 of 8 other players got this wrong too')
  })

  it('says nothing when nobody else has played this item yet', () => {
    expect(communityLine({ itemId: 'wine-glass', wrong: 1, total: 1 })).toBeUndefined()
  })

  it('uses "player" for one other player', () => {
    expect(communityLine({ itemId: 'wine-glass', wrong: 2, total: 2 })).toBe('1 of 1 other player got this wrong too')
  })
})
