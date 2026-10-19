import type { Item } from './catalog'
import { shuffle, type Random } from './random'

export const ROUND_SIZE = 10

// Test 1: testers didn't know where glass goes. Round 1 always has a glass jar
// (glass container) and a wine glass (not glass waste), so every player meets both.
export const FIRST_ROUND_MUST_INCLUDE = ['jam-jar', 'wine-glass'] as const

interface BuildRoundOptions {
  size?: number
  mustInclude?: readonly string[]
  random?: Random
}

export function buildRound(items: readonly Item[], options: BuildRoundOptions = {}): Item[] {
  const { size = ROUND_SIZE, mustInclude = [], random = Math.random } = options

  const required = items.filter((item) => mustInclude.includes(item.id))
  const others = shuffle(
    items.filter((item) => !mustInclude.includes(item.id)),
    random,
  )

  // Shuffle again so the required items don't always come first.
  return shuffle([...required, ...others].slice(0, size), random)
}
