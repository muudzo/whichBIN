import { pick, type Random } from './random'

// Leaderboard names are generated, never typed: no personal data, nothing to moderate.
// The words nod to Friesland: storks, skaters, terps and Frisian horses.
const ADJECTIVES = ['Blue', 'Brave', 'Swift', 'Sunny', 'Clever', 'Lucky', 'Bold', 'Quick', 'Happy', 'Tidy'] as const
const NOUNS = ['Stork', 'Skater', 'Terp', 'Horse', 'Heron', 'Sailor', 'Tulip', 'Canal', 'Windmill', 'Otter'] as const

export function generateNickname(random: Random = Math.random): string {
  const number = 10 + Math.floor(random() * 90)
  return `${pick(ADJECTIVES, random)} ${pick(NOUNS, random)} ${number}`
}
