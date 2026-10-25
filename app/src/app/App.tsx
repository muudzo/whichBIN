import { MotionConfig } from 'motion/react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { Item } from '@/domain/catalog'
import { FIRST_ROUND_MUST_INCLUDE, buildRound } from '@/domain/round'
import { catalog } from '@/features/game/catalog'
import { HowToScreen } from '@/features/how-to/HowToScreen'
import { LeaderboardScreen } from '@/features/leaderboard/LeaderboardScreen'
import { LeaveRoundSheet } from '@/features/round/LeaveRoundSheet'
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

// The phone's Back button (H3): past the start screen the game keeps one browser-history entry,
// so Back returns to the start instead of leaving the site. During a round it asks first.
const START_ENTRY = { whichBin: 'start' }
const GAME_ENTRY = { whichBin: 'game' }
const isGameEntry = (state: unknown) => (state as { whichBin?: string } | null)?.whichBin === 'game'

export function App({ store }: Props) {
  const [screen, setScreen] = useState<Screen>({ name: 'welcome' })
  const [sessionId] = useState(createSessionId)
  const [hasSeenHowTo, setHasSeenHowTo] = useState(false)
  const [roundsPlayed, setRoundsPlayed] = useState(0)
  const [lastMistakeIds, setLastMistakeIds] = useState<readonly string[]>([])
  const [isConfirmingLeave, setIsConfirmingLeave] = useState(false)
  // Set while the game itself goes back to the start, so the Back handler doesn't ask again.
  const isGoingHomeRef = useRef(false)

  useEffect(() => {
    window.history.replaceState(START_ENTRY, '')
  }, [])

  useEffect(() => {
    if (screen.name !== 'welcome' && !isGameEntry(window.history.state)) window.history.pushState(GAME_ENTRY, '')
  }, [screen.name])

  function goHome() {
    setIsConfirmingLeave(false)
    if (!isGameEntry(window.history.state)) {
      setScreen({ name: 'welcome' })
      return
    }
    isGoingHomeRef.current = true
    window.history.back() // handleBack shows the start screen
  }

  const handleBack = useEffectEvent((event: PopStateEvent) => {
    if (isGameEntry(event.state)) return // Forward, back into the game: stay where we are
    if (isGoingHomeRef.current || screen.name !== 'round') {
      isGoingHomeRef.current = false
      setIsConfirmingLeave(false)
      setScreen({ name: 'welcome' })
      return
    }
    // During a round: put the entry back, stay, and ask first.
    window.history.pushState(GAME_ENTRY, '')
    setIsConfirmingLeave(true)
  })

  useEffect(() => {
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

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
        return (
          <WelcomeScreen
            onPlay={handlePlay}
            onLeaderboard={() => setScreen({ name: 'leaderboard' })}
            savesAnswers={store.isShared}
          />
        )
      case 'how-to':
        return (
          <HowToScreen
            onBack={goHome}
            onStart={() => {
              setHasSeenHowTo(true)
              startNextRound()
            }}
          />
        )
      case 'round':
        return (
          <>
            <RoundScreen
              key={screen.roundNumber}
              items={screen.items}
              roundNumber={screen.roundNumber}
              sessionId={sessionId}
              store={store}
              onFinish={handleRoundFinished}
              onRequestLeave={() => setIsConfirmingLeave(true)}
              isPaused={isConfirmingLeave}
            />
            <LeaveRoundSheet isOpen={isConfirmingLeave} onStay={() => setIsConfirmingLeave(false)} onLeave={goHome} />
          </>
        )
      case 'score':
        return (
          <ScoreScreen
            result={screen.result}
            store={store}
            onNextRound={startNextRound}
            onSaved={(nickname) => setScreen({ name: 'leaderboard', highlight: nickname })}
            onLeaderboard={() => setScreen({ name: 'leaderboard' })}
          />
        )
      case 'leaderboard':
        return (
          <LeaderboardScreen
            store={store}
            highlight={screen.highlight}
            hasPlayed={roundsPlayed > 0}
            onPlay={handlePlay}
            onHome={goHome}
          />
        )
    }
  }

  return <MotionConfig reducedMotion="user">{renderScreen()}</MotionConfig>
}
