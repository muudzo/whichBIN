import { createClient, type PostgrestError } from '@supabase/supabase-js'
import { z } from 'zod'
import type { ItemStat, ScoreRecord, ScoreStore } from './scoreStore'

// The shared store: the same five methods as the local one, backed by our Supabase tables
// (supabase/migrations/001_tables_and_permissions.sql). The database decides what a browser may do;
// this file only sends requests and checks the replies.

const REQUEST_TIMEOUT_MS = 8000 // a screen waits at most this long before showing its error

export interface SupabaseConfig {
  url: string
  publishableKey: string
  fetch?: typeof fetch // replaced in tests
  timeoutMs?: number
}

// Replies are checked, not trusted. Counts are Postgres bigints, which can arrive as strings.
const scoreRows = z.array(
  z.object({ nickname: z.string(), score: z.number(), correct: z.number(), total: z.number(), created_at: z.string() }),
)
const statRows = z.array(z.object({ item_id: z.string(), wrong: z.coerce.number(), total: z.coerce.number() }))

function failIf(error: PostgrestError | null, what: string) {
  if (error) throw new Error(`Couldn't ${what}: ${error.message}`)
}

const toStat = (row: z.infer<typeof statRows>[number]): ItemStat => ({
  itemId: row.item_id,
  wrong: row.wrong,
  total: row.total,
})

export function createSupabaseScoreStore(config: SupabaseConfig): ScoreStore {
  const client = createClient(config.url, config.publishableKey, {
    // No logins in this game: nothing about the player is kept in the browser.
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: config.fetch },
  })
  // One deadline per request. The client retries a failed read a few times; the deadline covers the retries too.
  const deadline = () => AbortSignal.timeout(config.timeoutMs ?? REQUEST_TIMEOUT_MS)

  return {
    isShared: true,

    // `correct` isn't sent: the database works it out from the items table, so it can't be faked.
    async submitAnswer({ sessionId, round, itemId, chosenBin }) {
      const { error } = await client
        .from('answers')
        .insert({ session_id: sessionId, round, item_id: itemId, chosen_bin: chosenBin })
        .abortSignal(deadline())
      failIf(error, 'save the answer')
    },

    // `createdAt` isn't sent: the database sets the time.
    async submitScore({ nickname, score, correct, total }) {
      const { error } = await client.from('scores').insert({ nickname, score, correct, total }).abortSignal(deadline())
      failIf(error, 'save the score')
    },

    async topScores(limit): Promise<readonly ScoreRecord[]> {
      const { data, error } = await client
        .from('scores')
        .select('nickname, score, correct, total, created_at')
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit)
        .abortSignal(deadline())
      failIf(error, 'load the leaderboard')
      return scoreRows.parse(data).map(({ created_at, ...row }) => ({ ...row, createdAt: created_at }))
    },

    async itemStat(itemId) {
      const { data, error } = await client.rpc('item_stat', { p_item_id: itemId }).abortSignal(deadline())
      failIf(error, "load the item's counts")
      const [row] = statRows.length(1).parse(data)
      return toStat(row)
    },

    async mostMissed(limit) {
      const { data, error } = await client.rpc('most_missed', { p_limit: limit }).abortSignal(deadline())
      failIf(error, 'load the most-missed items')
      return statRows.parse(data).map(toStat)
    },
  }
}
