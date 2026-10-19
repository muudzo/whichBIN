import { describe, expect, it } from 'vitest'
import { createSeededRandom, shuffle } from './random'

describe('createSeededRandom', () => {
  it('gives the same numbers for the same seed', () => {
    const first = createSeededRandom(42)
    const second = createSeededRandom(42)

    expect([first(), first(), first()]).toEqual([second(), second(), second()])
  })

  it('gives numbers from 0 up to (not including) 1', () => {
    const random = createSeededRandom(7)
    const numbers = Array.from({ length: 1000 }, () => random())

    expect(numbers.every((n) => n >= 0 && n < 1)).toBe(true)
  })
})

describe('shuffle', () => {
  it('keeps every element exactly once', () => {
    const input = [1, 2, 3, 4, 5, 6]

    const result = shuffle(input, createSeededRandom(1))

    expect([...result].sort()).toEqual(input)
  })

  it('does not change the original array', () => {
    const input = [1, 2, 3, 4, 5, 6]

    shuffle(input, createSeededRandom(1))

    expect(input).toEqual([1, 2, 3, 4, 5, 6])
  })
})
