import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Item } from '@/domain/catalog'
import { binFor, catalog } from '@/features/game/catalog'
import { createLocalScoreStore, type ScoreStore } from '@/services/scoreStore'
import { App } from './App'

function currentItem(): Item {
  const name = within(screen.getByRole('region', { name: 'Item to sort' })).getByRole('figure').textContent
  const item = catalog.items.find((candidate) => candidate.name === name)
  if (!item) throw new Error(`No item on screen (saw "${name}")`)
  return item
}

function binButton(item: Item, wantRight: boolean) {
  const bins = within(screen.getByRole('group', { name: 'Bins' }))
  const binId = wantRight ? item.bin : item.bin === 'sortibak' ? 'biobak' : 'sortibak'
  return bins.getByRole('button', { name: new RegExp(`^${binFor(binId).name}:`) })
}

// Answers right, then waits until the next item is really on screen and the bins work again.
async function answerRight(user: ReturnType<typeof userEvent.setup>, isLast: boolean) {
  const item = currentItem()
  await user.click(binButton(item, true))
  if (isLast) return item
  await waitFor(() => {
    expect(currentItem().id).not.toBe(item.id)
    expect(binButton(currentItem(), true)).toBeEnabled()
  })
  return item
}

async function startFirstRound(store: ScoreStore = createLocalScoreStore()) {
  const user = userEvent.setup()
  render(<App store={store} />)
  await user.click(screen.getByRole('button', { name: 'Play' }))
  await user.click(screen.getByRole('button', { name: 'Start round' }))
  return user
}

// Counts every call the game makes to the store, as the shared database store would receive them.
function countingSharedStore() {
  const local = createLocalScoreStore()
  const calls = { submitAnswer: 0, itemStat: 0, submitScore: 0, topScores: 0, mostMissed: 0 }
  const store: ScoreStore = {
    isShared: true,
    submitAnswer: (answer) => (calls.submitAnswer++, local.submitAnswer(answer)),
    itemStat: (itemId) => (calls.itemStat++, local.itemStat(itemId)),
    submitScore: (score) => (calls.submitScore++, local.submitScore(score)),
    topScores: (limit) => (calls.topScores++, local.topScores(limit)),
    mostMissed: (limit) => (calls.mostMissed++, local.mostMissed(limit)),
  }
  return { store, calls }
}

describe('App', () => {
  it('opens on a screen that says what the game is', () => {
    render(<App store={createLocalScoreStore()} />)

    expect(screen.getByRole('heading', { name: /Which\s*Bin\?/ })).toBeInTheDocument()
    expect(screen.getByText(/Sort everyday stuff into Leeuwarden/)).toBeInTheDocument()
  })

  it('says answers are saved anonymously when they go to the shared database (SCRUM-54)', () => {
    render(<App store={{ ...createLocalScoreStore(), isShared: true }} />)

    expect(screen.getByText(/answers are saved anonymously/i)).toBeInTheDocument()
  })

  it('makes no such claim when answers stay on this device', () => {
    render(<App store={createLocalScoreStore()} />)

    expect(screen.queryByText(/saved anonymously/i)).not.toBeInTheDocument()
  })

  it('shows "Right!" and adds points for the right bin', async () => {
    const user = await startFirstRound()
    const item = currentItem()

    await user.click(binButton(item, true))

    expect(await screen.findByText('Right!')).toBeInTheDocument()
    expect(screen.getByText(`${item.name} → ${binFor(item.bin).name}`)).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('answers with the bin whose number key is pressed (laptops)', async () => {
    const user = await startFirstRound()
    const item = currentItem()
    const key = catalog.bins.findIndex((bin) => bin.id === item.bin) + 1

    await user.keyboard(String(key))

    expect(await screen.findByText('Right!')).toBeInTheDocument()
    expect(screen.getByText(`${item.name} → ${binFor(item.bin).name}`)).toBeInTheDocument()
  })

  it('explains a wrong answer with the source, then continues', async () => {
    const user = await startFirstRound()
    const item = currentItem()

    await user.click(binButton(item, false))

    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Not quite')).toBeInTheDocument()
    expect(within(sheet).getByText(item.why)).toBeInTheDocument()
    expect(within(sheet).getByText(/Source: Omrin waste guide 2026/)).toBeInTheDocument()

    await user.click(within(sheet).getByRole('button', { name: 'Got it' }))

    expect(await screen.findByText('Item 2 of 10')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '2 of 3 lives left' })).toBeInTheDocument()
  })

  it('puts the glass items in round 1 (test 1 finding)', async () => {
    const user = await startFirstRound()
    const seen: string[] = []

    for (let i = 0; i < 10; i += 1) {
      seen.push((await answerRight(user, i === 9)).id)
    }

    expect(seen).toEqual(expect.arrayContaining(['jam-jar', 'wine-glass']))
    expect(await screen.findByRole('heading', { name: 'Round 1 complete' })).toBeInTheDocument()
  })

  it('saves a score under a made-up name and shows it on the leaderboard', async () => {
    const user = await startFirstRound()
    for (let i = 0; i < 10; i += 1) {
      await answerRight(user, i === 9)
    }
    const nickname = (await screen.findByTestId('nickname')).textContent ?? ''

    await user.click(screen.getByRole('button', { name: 'Save score' }))

    expect(await screen.findByRole('heading', { name: /Leaderboard/ })).toBeInTheDocument()
    expect(await screen.findByText(nickname)).toBeInTheDocument()
  })

  // N+1 guard: a whole visit is one call per answer, one per wrong answer, one to save the score
  // and two for the leaderboard. Never a call per item in a loop.
  it('makes a fixed, small number of database calls for a whole visit', async () => {
    const { store, calls } = countingSharedStore()
    const user = await startFirstRound(store)

    await user.click(binButton(currentItem(), false))
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Got it' }))
    await screen.findByText('Item 2 of 10')
    for (let i = 1; i < 10; i += 1) {
      await answerRight(user, i === 9)
    }
    await user.click(await screen.findByRole('button', { name: 'Save score' }))
    await screen.findByRole('heading', { name: /Leaderboard/ })

    await waitFor(() =>
      expect(calls).toEqual({ submitAnswer: 10, itemStat: 1, submitScore: 1, topScores: 1, mostMissed: 1 }),
    )
  })
})
