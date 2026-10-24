import { describe, expect, it } from 'vitest'
import { createSupabaseScoreStore } from './supabaseScoreStore'

const URL_BASE = 'https://test-project.supabase.co'
const KEY = 'sb_publishable_test'

type Sent = { method: string; url: URL; body: unknown; apikey: string | null }

// A stand-in for the network: records each request the Supabase client sends and answers with `reply`.
function fakeNetwork(reply: () => Response = () => new Response(null, { status: 201 })) {
  const sent: Sent[] = []
  const fetchFn: typeof fetch = async (input, init) => {
    sent.push({
      method: init?.method ?? 'GET',
      url: new URL(String(input)),
      body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
      apikey: new Headers(init?.headers).get('apikey'),
    })
    return reply()
  }
  return { sent, fetchFn }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

function storeWith(network: ReturnType<typeof fakeNetwork>, timeoutMs?: number) {
  return createSupabaseScoreStore({ url: URL_BASE, publishableKey: KEY, fetch: network.fetchFn, timeoutMs })
}

describe('Supabase score store', () => {
  it('is shared, so the game shows community results', () => {
    expect(storeWith(fakeNetwork()).isShared).toBe(true)
  })

  it('saves an answer in the answers table without right or wrong, which the database works out', async () => {
    const network = fakeNetwork()

    await storeWith(network).submitAnswer({
      sessionId: '00000000-0000-4000-8000-000000000001',
      round: 2,
      itemId: 'wine-glass',
      chosenBin: 'glasbak',
      correct: false,
    })

    expect(network.sent).toHaveLength(1)
    const [request] = network.sent
    expect(request.method).toBe('POST')
    expect(request.url.pathname).toBe('/rest/v1/answers')
    expect(request.apikey).toBe(KEY)
    expect(request.body).toEqual({
      session_id: '00000000-0000-4000-8000-000000000001',
      round: 2,
      item_id: 'wine-glass',
      chosen_bin: 'glasbak',
    })
  })

  it('saves a score without a time, because the database sets it', async () => {
    const network = fakeNetwork()

    await storeWith(network).submitScore({
      nickname: 'Swift Stork 42',
      score: 900,
      correct: 8,
      total: 10,
      createdAt: '2026-10-24T20:00:00.000Z',
    })

    const [request] = network.sent
    expect(request.url.pathname).toBe('/rest/v1/scores')
    expect(request.body).toEqual({ nickname: 'Swift Stork 42', score: 900, correct: 8, total: 10 })
  })

  it('asks for the top scores highest first, earliest first on a tie, up to the limit', async () => {
    const network = fakeNetwork(() =>
      json([{ nickname: 'Swift Stork 42', score: 900, correct: 8, total: 10, created_at: '2026-10-24T20:00:00+00:00' }]),
    )

    const top = await storeWith(network).topScores(10)

    const params = network.sent[0].url.searchParams
    expect(network.sent[0].url.pathname).toBe('/rest/v1/scores')
    expect(params.get('order')).toBe('score.desc,created_at.asc')
    expect(params.get('limit')).toBe('10')
    expect(top).toEqual([
      { nickname: 'Swift Stork 42', score: 900, correct: 8, total: 10, createdAt: '2026-10-24T20:00:00+00:00' },
    ])
  })

  it("reads one item's counts from item_stat, as numbers", async () => {
    // Postgres counts are bigints, which can arrive as strings
    const network = fakeNetwork(() => json([{ item_id: 'wine-glass', wrong: '3', total: 7 }]))

    const stat = await storeWith(network).itemStat('wine-glass')

    expect(network.sent[0].url.pathname).toBe('/rest/v1/rpc/item_stat')
    expect(network.sent[0].body).toEqual({ p_item_id: 'wine-glass' })
    expect(stat).toEqual({ itemId: 'wine-glass', wrong: 3, total: 7 })
  })

  it('reads the most-missed items from most_missed, up to the limit', async () => {
    const network = fakeNetwork(() =>
      json([
        { item_id: 'wine-glass', wrong: 5, total: 9 },
        { item_id: 'pizza-box', wrong: 2, total: 4 },
      ]),
    )

    const missed = await storeWith(network).mostMissed(3)

    expect(network.sent[0].url.pathname).toBe('/rest/v1/rpc/most_missed')
    expect(network.sent[0].body).toEqual({ p_limit: 3 })
    expect(missed).toEqual([
      { itemId: 'wine-glass', wrong: 5, total: 9 },
      { itemId: 'pizza-box', wrong: 2, total: 4 },
    ])
  })

  it('fails when the database refuses, so the game can say so', async () => {
    const network = fakeNetwork(() =>
      json({ code: '42501', message: 'permission denied for table answers', details: null, hint: null }, 403),
    )
    const store = storeWith(network)

    await expect(
      store.submitAnswer({ sessionId: 's', round: 1, itemId: 'jam-jar', chosenBin: 'glasbak', correct: true }),
    ).rejects.toThrow(/permission denied/)
  })

  it('fails when a reply is not in the shape the game expects', async () => {
    const network = fakeNetwork(() => json([{ item_id: 'wine-glass', wrong: 'lots' }]))

    await expect(storeWith(network).itemStat('wine-glass')).rejects.toThrow()
  })

  it('gives up on a request that takes too long, so a screen never waits forever', async () => {
    const hanging: typeof fetch = (_input, init) =>
      new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))
    const store = createSupabaseScoreStore({ url: URL_BASE, publishableKey: KEY, fetch: hanging, timeoutMs: 20 })

    await expect(store.topScores(10)).rejects.toThrow()
  })
})
