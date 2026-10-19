// A random function returns a number from 0 up to (not including) 1, like Math.random.
// Passing it in, instead of calling Math.random directly, makes rounds testable.
export type Random = () => number

// mulberry32: a small, well-known seeded generator. Same seed → same sequence.
export function createSeededRandom(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Fisher–Yates shuffle on a copy, so the input is never changed.
export function shuffle<T>(items: readonly T[], random: Random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pick<T>(items: readonly T[], random: Random): T {
  return items[Math.floor(random() * items.length)]
}
