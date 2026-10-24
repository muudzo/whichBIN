import { createLocalScoreStore, type ScoreStore } from './scoreStore'
import { createSupabaseScoreStore } from './supabaseScoreStore'

type Settings = Pick<ImportMetaEnv, 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY'>

// Supabase when app/.env.local has both settings; otherwise the local store,
// so the game still runs without a database (and the browser tests never touch the real one).
export function chooseScoreStore(settings: Settings): ScoreStore {
  const url = settings.VITE_SUPABASE_URL?.trim()
  const publishableKey = settings.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  return url && publishableKey ? createSupabaseScoreStore({ url, publishableKey }) : createLocalScoreStore()
}
