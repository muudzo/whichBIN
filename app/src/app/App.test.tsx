import { act, render, screen, waitFor, within } from '@testing-library/react'
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

  // Design review 26 Oct: the explanation sits in the tray, not in a sheet over the bins, so the player can see
  // which bin was chosen (a cross) and which was right (a tick, lid open) while reading why.
  it('explains a wrong answer next to the bins, marks both bins, and Enter continues', async () => {
    const user = await startFirstRound()
    const item = currentItem()
    const wrongBin = binButton(item, false)

    await user.click(wrongBin)

    const card = await screen.findByRole('region', { name: 'Not quite' })
    expect(within(card).getByText(item.why)).toBeInTheDocument()
    expect(within(card).getByText(`You chose ${wrongBin.getAttribute('aria-label')?.split(':')[0]}.`)).toBeInTheDocument()
    expect(within(card).getByText(/Source: Omrin waste guide 2026/)).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(wrongBin).toHaveAttribute('data-mark', 'wrong')
    expect(binButton(item, true)).toHaveAttribute('data-mark', 'right')
    expect(within(card).getByRole('button', { name: 'Got it' })).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(await screen.findByText('Item 2 of 10')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '2 of 3 lives left' })).toBeInTheDocument()
  })

  // Design review 26 Oct: first-time players get the instruction where they look, under the item, until their first answer.
  it('says how to play under the first item, and only until the first answer', async () => {
    const user = await startFirstRound()
    const tray = screen.getByRole('region', { name: 'Item to sort' })
    expect(within(tray).getByText(/into its bin/)).toBeInTheDocument()

    await answerRight(user, false)

    expect(screen.queryByText(/into its bin/)).not.toBeInTheDocument()
  })

  it('puts a tick on the bin after a right answer', async () => {
    const user = await startFirstRound()
    const item = currentItem()

    await user.click(binButton(item, true))

    expect(binButton(item, true)).toHaveAttribute('data-mark', 'right')
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
    await user.click(await screen.findByRole('button', { name: 'Got it' }))
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

  // Heuristic fixes (research/heuristic-evaluation/2026-10-25-evaluator-claude.md)

  // F3 (H1, H9): a round that ends on lives says so, instead of "complete"
  it('says "Out of lives" when three wrong answers end the round early', async () => {
    const user = await startFirstRound()
    for (let i = 0; i < 3; i += 1) {
      await user.click(binButton(currentItem(), false))
      await user.click(await screen.findByRole('button', { name: 'Got it' }))
      if (i < 2) await screen.findByText(`Item ${i + 2} of 10`)
    }

    expect(await screen.findByRole('heading', { name: 'Out of lives' })).toBeInTheDocument()
    expect(screen.getByText(/ended after 3 wrong answers/)).toBeInTheDocument()
  })

  // F2 (H3, H5): a clearly marked way out of a round, which asks first; the safe choice is the main button
  it('asks before leaving a round with the × button, and Keep playing stays in the round', async () => {
    const user = await startFirstRound()

    await user.click(screen.getByRole('button', { name: 'Leave round' }))
    const sheet = await screen.findByRole('dialog', { name: 'Leave this round?' })
    await user.click(within(sheet).getByRole('button', { name: 'Keep playing' }))

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Leave this round?' })).not.toBeInTheDocument())
    expect(screen.getByText('Item 1 of 10')).toBeInTheDocument()
  })

  it('ignores the number keys while "Leave this round?" is open', async () => {
    const user = await startFirstRound()
    const item = currentItem()
    await user.click(screen.getByRole('button', { name: 'Leave round' }))
    await screen.findByRole('dialog', { name: 'Leave this round?' })

    await user.keyboard(String(catalog.bins.findIndex((bin) => bin.id === item.bin) + 1))

    expect(screen.queryByText('Right!')).not.toBeInTheDocument()
    expect(screen.getByText('Item 1 of 10')).toBeInTheDocument()
  })

  // F7 (H10): the rules can be checked during a round, and the round waits
  it('opens How to play over the round from the top bar; the round waits, then goes on with the same item', async () => {
    const user = await startFirstRound()
    const item = currentItem()

    await user.click(screen.getByRole('button', { name: 'How to play' }))
    const sheet = await screen.findByRole('dialog', { name: 'How to play' })
    expect(within(sheet).getByText('3 lives')).toBeInTheDocument()
    await user.keyboard(String(catalog.bins.findIndex((bin) => bin.id === item.bin) + 1))
    expect(screen.queryByText('Right!')).not.toBeInTheDocument()

    await user.click(within(sheet).getByRole('button', { name: 'Back to the round' }))

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'How to play' })).not.toBeInTheDocument())
    expect(currentItem().id).toBe(item.id)
    expect(screen.getByText('Item 1 of 10')).toBeInTheDocument()
  })

  it("closes How to play with the phone's Back button, without asking to leave the round", async () => {
    const user = await startFirstRound()
    await user.click(screen.getByRole('button', { name: 'How to play' }))
    await screen.findByRole('dialog', { name: 'How to play' })

    act(() => window.history.back())

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'How to play' })).not.toBeInTheDocument())
    expect(screen.queryByRole('dialog', { name: 'Leave this round?' })).not.toBeInTheDocument()
    expect(screen.getByText('Item 1 of 10')).toBeInTheDocument()
  })

  // F1 (H3): the phone's Back button stays in the game; during a round it asks first
  it("asks before the phone's Back button leaves a round, then goes back to the start", async () => {
    const user = await startFirstRound()

    act(() => window.history.back())
    const sheet = await screen.findByRole('dialog', { name: 'Leave this round?' })
    await user.click(within(sheet).getByRole('button', { name: 'Leave' }))

    expect(await screen.findByRole('heading', { name: /Which\s*Bin\?/ })).toBeInTheDocument()
  })

  it("goes back to the start with the phone's Back button from How to play", async () => {
    const user = userEvent.setup()
    render(<App store={createLocalScoreStore()} />)
    await user.click(screen.getByRole('button', { name: 'Play' }))
    await screen.findByRole('heading', { name: 'How to play' })

    act(() => window.history.back())

    expect(await screen.findByRole('heading', { name: /Which\s*Bin\?/ })).toBeInTheDocument()
  })

  // F7 (H10): Play shows How to play only before the first round of a visit, so the start screen opens it again
  it('opens How to play from the start screen, even after a round has been started', async () => {
    const user = await startFirstRound()
    await user.click(screen.getByRole('button', { name: 'Leave round' }))
    const sheet = await screen.findByRole('dialog', { name: 'Leave this round?' })
    await user.click(within(sheet).getByRole('button', { name: 'Leave' }))
    await screen.findByRole('heading', { name: /Which\s*Bin\?/ })

    await user.click(screen.getByRole('button', { name: 'How to play' }))

    expect(await screen.findByRole('heading', { name: 'How to play' })).toBeInTheDocument()
  })

  // F5 (H7, H6): the community results are reachable without saving a score
  it('opens the leaderboard from the welcome screen, with Play (not Play again) for a first visit', async () => {
    const user = userEvent.setup()
    render(<App store={createLocalScoreStore()} />)

    await user.click(screen.getByRole('button', { name: 'See the leaderboard' }))

    expect(await screen.findByRole('heading', { name: /Leaderboard/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back to the start' }))
    expect(await screen.findByRole('heading', { name: /Which\s*Bin\?/ })).toBeInTheDocument()
  })

  it('opens the leaderboard from the score screen without saving the score', async () => {
    const user = await startFirstRound()
    for (let i = 0; i < 10; i += 1) {
      await answerRight(user, i === 9)
    }

    await user.click(await screen.findByRole('button', { name: 'See the leaderboard' }))

    expect(await screen.findByRole('heading', { name: /Leaderboard/ })).toBeInTheDocument()
    expect(screen.getByText(/No scores yet/)).toBeInTheDocument()
  })
})
