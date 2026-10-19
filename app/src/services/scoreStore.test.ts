import { describe, expect, it } from 'vitest'
import { createLocalScoreStore, type AnswerRecord, type ScoreRecord } from './scoreStore'

function answer(itemId: string, correct: boolean): AnswerRecord {
  return { sessionId: 's1', round: 1, itemId, chosenBin: 'sortibak', correct }
}

function score(nickname: string, points: number): ScoreRecord {
  return { nickname, score: points, correct: 5, total: 10, createdAt: '2026-10-19T20:00:00.000Z' }
}

// The Supabase version must pass these same tests later.
describe('local score store', () => {
  it('returns the top scores, highest first, up to the limit', async () => {
    const store = createLocalScoreStore()
    await store.submitScore(score('Blue Stork 12', 300))
    await store.submitScore(score('Swift Skater 40', 900))
    await store.submitScore(score('Sunny Terp 77', 600))

    const top = await store.topScores(2)

    expect(top.map((entry) => entry.nickname)).toEqual(['Swift Skater 40', 'Sunny Terp 77'])
  })

  it('counts how many players got an item wrong', async () => {
    const store = createLocalScoreStore()
    await store.submitAnswer(answer('wine-glass', false))
    await store.submitAnswer(answer('wine-glass', false))
    await store.submitAnswer(answer('wine-glass', true))

    expect(await store.itemStat('wine-glass')).toEqual({ itemId: 'wine-glass', wrong: 2, total: 3 })
    expect(await store.itemStat('jam-jar')).toEqual({ itemId: 'jam-jar', wrong: 0, total: 0 })
  })

  it('lists the most-missed items, leaving out items nobody got wrong', async () => {
    const store = createLocalScoreStore()
    await store.submitAnswer(answer('pizza-box', false))
    await store.submitAnswer(answer('wine-glass', false))
    await store.submitAnswer(answer('wine-glass', false))
    await store.submitAnswer(answer('jam-jar', true))

    const missed = await store.mostMissed(5)

    expect(missed.map((stat) => stat.itemId)).toEqual(['wine-glass', 'pizza-box'])
  })

  it('returns copies, so callers cannot change stored scores', async () => {
    const store = createLocalScoreStore()
    await store.submitScore(score('Blue Stork 12', 300))

    const [first] = await store.topScores(1)
    ;(first as { score: number }).score = 0

    expect((await store.topScores(1))[0].score).toBe(300)
  })
})
