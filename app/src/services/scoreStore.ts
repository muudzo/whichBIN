import type { BinId } from '@/domain/catalog'

// Everything the game saves or reads about players goes through this interface.
// Today: a local, in-memory version (this phone only, gone on reload).
// After the architecture: a Supabase version with the same methods and the same tests.

export interface AnswerRecord {
  sessionId: string
  round: number
  itemId: string
  chosenBin: BinId
  correct: boolean
}

export interface ScoreRecord {
  nickname: string
  score: number
  correct: number
  total: number
  createdAt: string
}

export interface ItemStat {
  itemId: string
  wrong: number
  total: number
}

export interface ScoreStore {
  readonly isShared: boolean
  submitAnswer(answer: AnswerRecord): Promise<void>
  submitScore(score: ScoreRecord): Promise<void>
  topScores(limit: number): Promise<readonly ScoreRecord[]>
  itemStat(itemId: string): Promise<ItemStat>
  mostMissed(limit: number): Promise<readonly ItemStat[]>
}

export function createLocalScoreStore(): ScoreStore {
  let answers: readonly AnswerRecord[] = []
  let scores: readonly ScoreRecord[] = []

  const statFor = (itemId: string): ItemStat => {
    const forItem = answers.filter((a) => a.itemId === itemId)
    return { itemId, wrong: forItem.filter((a) => !a.correct).length, total: forItem.length }
  }

  return {
    isShared: false,

    async submitAnswer(answer) {
      answers = [...answers, { ...answer }]
    },

    async submitScore(score) {
      scores = [...scores, { ...score }]
    },

    async topScores(limit) {
      return [...scores]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((score) => ({ ...score }))
    },

    async itemStat(itemId) {
      return statFor(itemId)
    },

    async mostMissed(limit) {
      const itemIds = [...new Set(answers.map((a) => a.itemId))]
      return itemIds
        .map(statFor)
        .filter((stat) => stat.wrong > 0)
        .sort((a, b) => b.wrong - a.wrong)
        .slice(0, limit)
    },
  }
}
