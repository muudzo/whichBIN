import { describe, expect, it } from 'vitest'
import rawCatalog from '@/data/items.json'
import { parseCatalog, type Item } from './catalog'
import {
  LIVES_PER_ROUND,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
  correctCount,
  currentItem,
  lastAnswer,
  mistakes,
  roundReducer,
  startRound,
  type RoundState,
} from './game'

const { items } = parseCatalog(rawCatalog)
const fiveItems = items.slice(0, 5)

function answerRight(state: RoundState): RoundState {
  const item = currentItem(state) as Item
  return roundReducer(state, { type: 'answer', bin: item.bin })
}

function answerWrong(state: RoundState): RoundState {
  const item = currentItem(state) as Item
  const wrongBin = item.bin === 'sortibak' ? 'biobak' : 'sortibak'
  return roundReducer(state, { type: 'answer', bin: wrongBin })
}

describe('startRound', () => {
  it('starts with full lives, no score and the first item', () => {
    const state = startRound(fiveItems)

    expect(state.lives).toBe(LIVES_PER_ROUND)
    expect(state.score).toBe(0)
    expect(state.phase).toBe('sorting')
    expect(currentItem(state)).toBe(fiveItems[0])
  })

  it('is over straight away when there are no items', () => {
    expect(startRound([]).phase).toBe('over')
  })
})

describe('roundReducer: right answers', () => {
  it('adds points, builds the streak and moves to the next item', () => {
    const state = answerRight(startRound(fiveItems))

    expect(state.score).toBe(POINTS_PER_CORRECT)
    expect(state.streak).toBe(1)
    expect(currentItem(state)).toBe(fiveItems[1])
    expect(lastAnswer(state)).toMatchObject({ itemId: fiveItems[0].id, correct: true })
  })

  it('adds the streak bonus from the third right answer in a row', () => {
    const state = answerRight(answerRight(answerRight(startRound(fiveItems))))

    expect(state.score).toBe(3 * POINTS_PER_CORRECT + STREAK_BONUS)
    expect(state.bestStreak).toBe(3)
  })

  it('ends the round after the last item', () => {
    const state = fiveItems.reduce((current) => answerRight(current), startRound(fiveItems))

    expect(state.phase).toBe('over')
    expect(correctCount(state)).toBe(5)
  })
})

describe('roundReducer: wrong answers', () => {
  it('costs a life, resets the streak and shows feedback', () => {
    const state = answerWrong(answerRight(startRound(fiveItems)))

    expect(state.lives).toBe(LIVES_PER_ROUND - 1)
    expect(state.streak).toBe(0)
    expect(state.bestStreak).toBe(1)
    expect(state.phase).toBe('feedback')
    expect(mistakes(state)).toEqual([fiveItems[1]])
  })

  it('stays on feedback until the player continues', () => {
    const wrong = answerWrong(startRound(fiveItems))
    const ignored = roundReducer(wrong, { type: 'answer', bin: 'glasbak' })
    const continued = roundReducer(wrong, { type: 'continue' })

    expect(ignored).toBe(wrong)
    expect(continued.phase).toBe('sorting')
    expect(currentItem(continued)).toBe(fiveItems[1])
  })

  it('ends the round when the last life is lost', () => {
    let state = startRound(fiveItems)
    for (let i = 0; i < LIVES_PER_ROUND; i += 1) {
      state = roundReducer(answerWrong(state), { type: 'continue' })
    }

    expect(state.lives).toBe(0)
    expect(state.phase).toBe('over')
  })

  it('ends the round after feedback on the last item', () => {
    let state = startRound(fiveItems.slice(0, 1))
    state = roundReducer(answerWrong(state), { type: 'continue' })

    expect(state.phase).toBe('over')
  })
})

describe('roundReducer: ignored actions', () => {
  it('ignores "continue" while sorting', () => {
    const state = startRound(fiveItems)

    expect(roundReducer(state, { type: 'continue' })).toBe(state)
  })

  it('ignores answers after the round is over', () => {
    const over = fiveItems.reduce((current) => answerRight(current), startRound(fiveItems))

    expect(roundReducer(over, { type: 'answer', bin: 'glasbak' })).toBe(over)
    expect(currentItem(over)).toBeUndefined()
  })
})
