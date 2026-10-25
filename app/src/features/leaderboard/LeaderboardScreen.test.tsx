import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createLocalScoreStore, type ScoreStore } from '@/services/scoreStore'
import { LeaderboardScreen } from './LeaderboardScreen'

describe('LeaderboardScreen', () => {
  // F4 (H9): a failed load can be retried right there
  it('offers Try again after a failed load, and shows the board once it works', async () => {
    const local = createLocalScoreStore()
    let failuresLeft = 1
    const store: ScoreStore = {
      ...local,
      topScores: (limit) => (failuresLeft-- > 0 ? Promise.reject(new Error('offline')) : local.topScores(limit)),
    }
    const user = userEvent.setup()
    render(<LeaderboardScreen store={store} onPlay={() => {}} onHome={() => {}} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/Couldn.t load the leaderboard/)
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText(/No scores yet/)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
