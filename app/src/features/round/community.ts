import type { ItemStat } from '@/services/scoreStore'

// "x of y other players got this wrong too": makes shared confusion visible and the mistake feel normal.
// The stat already includes this player's wrong answer, so it's taken out of both counts.
export function communityLine(stat: ItemStat): string | undefined {
  const others = stat.total - 1
  if (others < 1) return undefined
  const wrongOthers = Math.max(0, stat.wrong - 1)
  return `${wrongOthers} of ${others} other ${others === 1 ? 'player' : 'players'} got this wrong too`
}
