import { describe, expect, it } from 'vitest'
import { chooseScoreStore } from './chooseScoreStore'

describe('chooseScoreStore', () => {
  it('uses the local store when a Supabase setting is missing or blank', () => {
    expect(chooseScoreStore({}).isShared).toBe(false)
    expect(chooseScoreStore({ VITE_SUPABASE_URL: 'https://test-project.supabase.co' }).isShared).toBe(false)
    expect(chooseScoreStore({ VITE_SUPABASE_URL: ' ', VITE_SUPABASE_PUBLISHABLE_KEY: ' ' }).isShared).toBe(false)
  })

  it('uses the shared Supabase store when both settings are there', () => {
    const store = chooseScoreStore({
      VITE_SUPABASE_URL: 'https://test-project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    })

    expect(store.isShared).toBe(true)
  })
})
