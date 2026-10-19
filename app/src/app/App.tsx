import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import type { Item } from '@/domain/catalog'
import { FIRST_ROUND_MUST_INCLUDE, buildRound } from '@/domain/round'
import { catalog } from '@/features/game/catalog'
import { HowToScreen } from '@/features/how-to/HowToScreen'
import { LeaderboardScreen } from '@/features/leaderboard/LeaderboardScreen'
import { RoundScreen, type RoundResult } from '@/features/round/RoundScreen'
import { ScoreScreen } from '@/features/score/ScoreScreen'
import { WelcomeScreen } from '@/features/welcome/WelcomeScreen'
import type { ScoreStore } from '@/services/scoreStore'
import { createSessionId } from './sessionId'

// The build flow from the plan: A1 Welcome → C1 How to play → C2/C3 Round → C4 Score → C5 Leaderboard.
type Screen =
  | { name: 'welcome' }
  | { name: 'how-to' }
  | { name: 'round'; roundNumber: number; items: readonly Item[] }
  | { name: 'score'; result: RoundResult }
  | { name: 'leaderboard'; highlight?: string }

type Props = {
  store: ScoreStore
}

export function App({ store }: Props) {
  const [screen, setScreen] = useState<Screen>({ name: 'welcome' })
  const [sessionId] = useState(createSessionId)
  const [hasSeenHowTo, setHasSeenHowTo] = useState(false)
  const [roundsPlayed, setRoundsPlayed] = useState(0)
  const [lastMistakeIds, setLastMistakeIds] = useState<readonly string[]>([])

  function startNextRound() {
    const roundNumber = roundsPlayed + 1
    // Round 1 always has the glass items; later rounds bring back last round's mistakes.
    const mustInclude = roundNumber === 1 ? FIRST_ROUND_MUST_INCLUDE : lastMistakeIds
    setScreen({ name: 'round', roundNumber, items: buildRound(catalog.items, { mustInclude }) })
  }

  function handlePlay() {
    if (hasSeenHowTo) {
      startNextRound()
      return
    }
    setScreen({ name: 'how-to' })
  }

  function handleRoundFinished(result: RoundResult) {
    setRoundsPlayed(result.roundNumber)
    setLastMistakeIds(result.mistakes.map((item) => item.id))
    setScreen({ name: 'score', result })
  }

  function renderScreen() {
    switch (screen.name) {
      case 'welcome':
        return <WelcomeScreen onPlay={handlePlay} />
      case 'how-to':
        return (
          <HowToScreen
            onBack={() => setScreen({ name: 'welcome' })}
            onStart={() => {
              setHasSeenHowTo(true)
              startNextRound()
            }}
          />
        )
      case 'round':
        return (
          <RoundScreen
            key={screen.roundNumber}
            items={screen.items}
            roundNumber={screen.roundNumber}
            sessionId={sessionId}
            store={store}
            onFinish={handleRoundFinished}
          />
        )
      case 'score':
        return (
          <ScoreScreen
            result={screen.result}
            store={store}
            onNextRound={startNextRound}
            onSaved={(nickname) => setScreen({ name: 'leaderboard', highlight: nickname })}
          />
        )
      case 'leaderboard':
        return (
          <LeaderboardScreen
            store={store}
            highlight={screen.highlight}
            onPlay={startNextRound}
            onHome={() => setScreen({ name: 'welcome' })}
          />
        )
    }
  }

  return <MotionConfig reducedMotion="user">{renderScreen()}</MotionConfig>
}
