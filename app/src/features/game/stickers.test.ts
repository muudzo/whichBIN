import { describe, expect, it } from 'vitest'
import { catalog } from './catalog'
import { stickerFor } from './stickers'

describe('stickerFor', () => {
  // Catches a new item from the check-rule-sources skill that has no sticker yet.
  it('has a sticker for every item in the catalogue', () => {
    const missing = catalog.items.filter((item) => stickerFor(item.id) === undefined).map((item) => item.id)

    expect(missing).toEqual([])
  })

  it('returns undefined for an unknown item', () => {
    expect(stickerFor('plastic-bottle')).toBeUndefined()
  })
})
