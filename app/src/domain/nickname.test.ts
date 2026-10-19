import { describe, expect, it } from 'vitest'
import { generateNickname } from './nickname'
import { createSeededRandom } from './random'

describe('generateNickname', () => {
  it('makes "Adjective Noun NN" names', () => {
    const random = createSeededRandom(3)

    for (let i = 0; i < 50; i += 1) {
      expect(generateNickname(random)).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+ \d{2}$/)
    }
  })

  it('is repeatable with the same seed', () => {
    expect(generateNickname(createSeededRandom(9))).toBe(generateNickname(createSeededRandom(9)))
  })
})
