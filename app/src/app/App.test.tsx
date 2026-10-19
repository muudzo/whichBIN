import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Item } from '@/domain/catalog'
import { binFor, catalog } from '@/features/game/catalog'
import { createLocalScoreStore } from '@/services/scoreStore'
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

async function startFirstRound() {
  const user = userEvent.setup()
  render(<App store={createLocalScoreStore()} />)
  await user.click(screen.getByRole('button', { name: 'Play' }))
  await user.click(screen.getByRole('button', { name: 'Start round' }))
  return user
}

describe('App', () => {
  it('opens on a screen that says what the game is', () => {
    render(<App store={createLocalScoreStore()} />)

    expect(screen.getByRole('heading', { name: /Which\s*Bin\?/ })).toBeInTheDocument()
    expect(screen.getByText(/Sort everyday stuff into Leeuwarden/)).toBeInTheDocument()
  })

  it('shows "Right!" and adds points for the right bin', async () => {
    const user = await startFirstRound()
    const item = currentItem()

    await user.click(binButton(item, true))

    expect(await screen.findByText('Right!')).toBeInTheDocument()
    expect(screen.getByText(`${item.name} → ${binFor(item.bin).name}`)).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
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
})
