# Plan: fix the major and minor heuristic findings (25 Oct 2026)

From `research/heuristic-evaluation/2026-10-25-evaluator-claude.md`: all severity 3 and 2 findings, all client-side. The cosmetic ones (severity 1, F6–F13) wait until after the demo.

| Finding | Fix | Test (written first) |
|---|---|---|
| F1 · H3 · sev 3: the phone's Back button leaves the game | One browser-history entry for "in the game": Back from any game screen returns to the start, and during a round it first asks (as F2) | App test: Back during a round asks; Back from How to play returns to the start. Browser test with a real Back |
| F2 · H3 · sev 2: no way to leave a round | A "Leave round" (×) button in the top bar, opening a "Leave this round?" sheet; the safe choice, "Keep playing", is the main button (H5) | App test: × asks; Keep playing stays; Leave goes to the start |
| F3 · H1/H9 · sev 2: running out of lives not explained | Score screen: "Out of lives" heading and "x / y" out of the items answered, with "Round n ended after 3 wrong answers" | App test: three wrong answers show "Out of lives" |
| F4 · H9 · sev 2: no retry on a failed leaderboard | A "Try again" button next to the message | Test with a store that fails once, then works |
| F5 · H7/H6 · sev 2: leaderboard only after saving | "See the leaderboard" on the welcome screen and on the score screen. Play from the leaderboard goes through How to play for first-time players | App tests for both links |

Constraints: the welcome screen still fits the smallest iPhone; all existing tests pass; each fix stays small enough to explain. Commits only after my yes.
