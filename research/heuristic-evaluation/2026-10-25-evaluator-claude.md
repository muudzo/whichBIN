# Heuristic evaluation: Which Bin? (25 Oct 2026)

**Evaluator:** Claude (one evaluator, an AI), at the student's request, using `template.md`. **Build:** `main` at `3754585` plus the uncommitted drag improvements of 25 Oct. **Devices:** emulated in the browser at 375 × 667, 320 × 568, 667 × 375 (phone held sideways) and 1440 × 900; screenshots in `design/ui102/after/` and `design/screens/`, plus the code. **Not checked:** real phones, real users, screen readers beyond the code.

## Findings

| ID | Heuristic | Screen | Finding | Evidence | Severity | Suggested fix |
|---|---|---|---|---|---|---|
| F1 | H3 User control | S3 Round (all screens) | **The phone's Back button (or a back swipe) leaves the game.** The whole game is one web address with no history entries, so Back goes to the previous website and the round is lost, without warning. On Android, Back is the most common way to "go back a step". | `app/src/app/App.tsx`: screens switch with `setScreen`, no `history.pushState` or `popstate` anywhere | **3** | Add a history entry per screen, so Back goes to the previous screen (from a round: back to the start) |
| F2 | H3 User control | S3 Round | **No way to leave or pause a round.** The round screen has no exit; the only way out is finishing it, or Back (F1) | `Hud.tsx`: lives, score, progress only | **2** | A small "×" in the top bar that returns to the start (confirm if items have been answered) |
| F3 | H1 Visibility · H9 Errors | S5 Score | **Running out of lives isn't explained.** After 3 wrong answers the round stops early, but the score screen says "Round 1 complete" and "3 / 10", as if all 10 items were played | `game.ts` `nextItem`: ends when `lives === 0`; `ScoreScreen.tsx`: always "Round … complete", `correct / total` with total = 10 | **2** | When lives ran out: "Out of lives" as the heading and "3 right of 6 answered", with the mistakes as now |
| F4 | H9 Errors | S6 Leaderboard | **A failed leaderboard load has no retry,** and no other way back to the leaderboard this visit: it's only reachable right after saving a score | `LeaderboardScreen.tsx`: message only; `App.tsx`: leaderboard only via `onSaved` | **2** | A "Try again" button next to the message |
| F5 | H7 Flexibility · H6 Recognition | S1 Welcome, S5 Score | **The leaderboard and the most-missed items are only reachable by saving a score.** A player who doesn't want to save never sees the community results, the part that makes everyone's mistakes visible | `App.tsx`: no route to the leaderboard from the welcome or score screen | **2** | "See the leaderboard" on the welcome screen and as a quiet link on the score screen |
| F6 | H10 Help · H2 Real world | S2 How to play | **Points and streaks aren't explained.** How to play covers dragging, lives and explanations, but not that a right answer is 100 points and a streak of 3+ adds 50. The "×3 streak" badge appears unexplained | `HowToScreen.tsx`; `game.ts` (`STREAK_BONUS_FROM = 3`) | **1** | One line in How to play: "100 points per right answer, +50 when you're on a streak of 3" |
| F7 | H10 Help | S3 Round | **No help during a round.** How to play shows once per visit and can't be reopened | `App.tsx`: `hasSeenHowTo` | **1** | A "?" in the top bar that opens How to play as a sheet |
| F8 | H4 Consistency | S2 How to play | **The bins on How to play look like buttons but do nothing.** They're disabled but look the same as the playable bins | `BinTarget.tsx`: disabled only changes the cursor | **1** | Give display-only bins a calmer look (no shadow), or a caption "Here are the six bins" |
| F9 | H1 Visibility | S3 Round | **Taps are silently ignored for a moment** while the next item flies in (about 0.4 s); the bins don't look different | `RoundScreen.tsx` `isSwapping`; `BinTarget.tsx` | **1** | Dim the bins slightly while they're disabled |
| F10 | H2 Real world | S3 Round | **The bin colours are game colours,** not Leeuwarden's real lid colours (only the Sortibak's grey is confirmed), so a player may learn a colour that doesn't match the street | Comment in `BinTarget.tsx`; `tokens.css` | **1** | Check the real colours with Omrin (SCRUM-47) and match them, or say in How to play that the colours are the game's |
| F11 | H1 Visibility | S6 Leaderboard | **"You" is found by name,** so two players with the same generated name both light up | `LeaderboardScreen.tsx`: `entry.nickname === highlight` | **1** | Highlight the saved row by its id instead of its name |
| F12 | H8 Minimalism | S3 Round (desktop) | **Large empty space** above and below the play area at 1440 × 900 | `design/ui102/after/1440-desktop-round.jpg` | **1** | Centre the top bar and play area together, or let the bins grow on wide screens |
| F13 | H6 Recognition | S3 Round | **"Not a bin: it goes elsewhere"** doesn't hint where before answering; players learn the places (milieustraat, KCA box) only after a mistake. May be intended, since it's a quiz | `items.json` (`where`); bin hint | **1** | Keep, but mention in How to play that some things go to a special place |

## What works

| Heuristic | Where |
|---|---|
| H1 Visibility | Lives, score, progress bar and "Item x of 10" always on screen, including on a phone held sideways; the bin under a dragged item lights up and all bins lift; "Saving…" on the save button; "Right!" names the item it was for |
| H2 Real world | Omrin's real bin names with English hints; dragging an item into a bin; a sorted item flies into its bin |
| H3 User control | A drop outside the bins springs back without costing a life; Back on How to play; the nickname can be reshuffled |
| H4 Consistency | One top bar, one sticker style, one type scale and spacing system (UI 102); the same "drag or tap" wording on How to play and in the round |
| H5 Error prevention | Taps wait until the next item is on screen, so an answer can't land on the wrong item; near misses count for the nearest bin; nicknames are generated, so there's nothing to mistype or abuse; the save button is disabled while saving |
| H6 Recognition | All six bins are always visible, each with an icon, its Dutch name and an English hint |
| H7 Flexibility | Drag or tap; keys 1–6 on laptops; How to play only once per visit; works from 320 px phones to desktops |
| H8 Minimalism | One item at a time; clear hierarchy (the item is the biggest thing); the item's name fades while dragging |
| H9 Errors | "Not quite" says why, with Omrin's page; mistakes come back next round; failed saves say what happened and that you can keep playing |
| H10 Help | How to play: one screen, then play; the first item wiggles and the hint is bold |

## Summary

- **Findings per severity:** 4: none · 3: 1 (F1) · 2: 4 (F2–F5) · 1: 8 (F6–F13).
- **Top fixes, in order** (severity, effort, and what the demo will hit):
  1. **F3 Out of lives** (about 15 min). Someone in the audience will lose all their lives, and the screen should say so.
  2. **F1 Back button** (about 45 min). The most serious problem, and a common gesture on Android.
  3. **F5 Leaderboard link** (about 15 min). It puts the community results, the "invisible → visible" story, one tap from the start.
  4. **F4 Retry** (about 10 min).
  5. **F2 Leave a round** (about 20 min).
  - F6–F13 after the demo.
- **Limits:** one evaluator, and an AI, while Nielsen recommends 3–5 people; emulated devices, not real phones; no users. The student's own pass with `template.md` would add a second, independent view; merge the two lists and agree on severities. Problems only users can show (is it fun? do they learn?) need tests 2 and 3.

## Fixes (25 Oct, evening)

All severity 3 and 2 findings are fixed (plan: `notes/plans/2026-10-25-heuristic-fixes.md`). Each fix had its test written first; screenshots are in `fixes/`.

| Finding | What changed | Test | Screenshot |
|---|---|---|---|
| F1 · sev 3 | The game keeps one browser-history entry past the start screen: Back returns to the start, and during a round it asks first (`App.tsx`) | App tests (Back from a round, Back from How to play); browser test with a real Back on four phones | `fixes/F1-F2-leave-this-round.jpg` |
| F2 · sev 2 | A "Leave round" (×) button in the top bar opens "Leave this round?"; "Keep playing" is the main button, and answering is paused while it's open (`Hud.tsx`, `LeaveRoundSheet.tsx`) | App tests (× asks, Keep playing stays, keys ignored while it's open) | `fixes/F2-round-leave-button.jpg` |
| F3 · sev 2 | Score screen: "Out of lives", correct out of answered, "Round n ended after 3 wrong answers" (`ScoreScreen.tsx`, `RoundScreen.tsx`) | App test (three wrong answers) | `fixes/F3-out-of-lives.jpg` |
| F4 · sev 2 | "Try again" next to the error, which now says what to do (`LeaderboardScreen.tsx`) | Leaderboard test with a store that fails once | `fixes/F4-leaderboard-try-again.jpg` |
| F5 · sev 2 | "See the leaderboard" on the welcome and score screens; from there, Play goes through How to play for first-time players, labelled "Play" instead of "Play again" (`WelcomeScreen.tsx`, `ScoreScreen.tsx`, `App.tsx`) | App tests (both links) | `fixes/F5-welcome-leaderboard-link.jpg` |

**Side effect handled:** the extra welcome-screen link made the screen too tall on 375 × 667 and 390 × 664 phones, hiding the privacy line. The hero stickers are now smaller on mid-height phones, and the welcome screen fits at 320 × 568, 375 × 667, 390 × 664, 412 × 839 and 768 × 1024.

**Checks after the fixes:** 80 unit tests, 50 browser runs, type check and build passed.

**Still open:** the cosmetic findings F6–F13; the welcome screen on a phone held sideways still scrolls (Play stays on screen).
