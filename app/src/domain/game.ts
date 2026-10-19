import type { BinId, Item } from './catalog'

// The rules of one round, as a pure reducer: (state, action) → new state.
// React calls it through useReducer; the tests call it directly.

export const LIVES_PER_ROUND = 3
export const POINTS_PER_CORRECT = 100
export const STREAK_BONUS = 50
export const STREAK_BONUS_FROM = 3

// sorting: waiting for an answer · feedback: a wrong answer is being explained · over: round finished
export type Phase = 'sorting' | 'feedback' | 'over'

export interface Answer {
  itemId: string
  chosen: BinId
  correct: boolean
}

export interface RoundState {
  items: readonly Item[]
  index: number
  lives: number
  score: number
  streak: number
  bestStreak: number
  answers: readonly Answer[]
  phase: Phase
}

export type RoundAction = { type: 'answer'; bin: BinId } | { type: 'continue' }

export function startRound(items: readonly Item[]): RoundState {
  return {
    items,
    index: 0,
    lives: LIVES_PER_ROUND,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: [],
    phase: items.length > 0 ? 'sorting' : 'over',
  }
}

export function roundReducer(state: RoundState, action: RoundAction): RoundState {
  switch (action.type) {
    case 'answer':
      return state.phase === 'sorting' ? answer(state, action.bin) : state
    case 'continue':
      return state.phase === 'feedback' ? nextItem(state) : state
  }
}

function answer(state: RoundState, bin: BinId): RoundState {
  const item = state.items[state.index]
  const correct = item.bin === bin
  const answers = [...state.answers, { itemId: item.id, chosen: bin, correct }]

  if (!correct) {
    return { ...state, answers, lives: state.lives - 1, streak: 0, phase: 'feedback' }
  }

  const streak = state.streak + 1
  const bonus = streak >= STREAK_BONUS_FROM ? STREAK_BONUS : 0
  return nextItem({
    ...state,
    answers,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    score: state.score + POINTS_PER_CORRECT + bonus,
  })
}

function nextItem(state: RoundState): RoundState {
  const index = state.index + 1
  const isOver = state.lives === 0 || index >= state.items.length
  return { ...state, index, phase: isOver ? 'over' : 'sorting' }
}

export function currentItem(state: RoundState): Item | undefined {
  return state.phase === 'over' ? undefined : state.items[state.index]
}

export function lastAnswer(state: RoundState): Answer | undefined {
  return state.answers.at(-1)
}

export function mistakes(state: RoundState): Item[] {
  const wrongIds = new Set(state.answers.filter((a) => !a.correct).map((a) => a.itemId))
  return state.items.filter((item) => wrongIds.has(item.id))
}

export function correctCount(state: RoundState): number {
  return state.answers.filter((a) => a.correct).length
}
