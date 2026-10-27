# Plan: How to play can be opened again (27 Oct 2026)

**Status: agreed 27 Oct** ("do 1 and 2"). **Both steps built and tested 27 Oct, not committed yet.**

## The problem
On an iPad, "the rules page" seemed to be missing. It isn't: the iPad shows How to play, checked at four iPad sizes in Safari's and Chrome's engines, locally and on the live link. But Play shows it only until the first "Start round" of a visit (`hasSeenHowTo` in `app/src/app/App.tsx`), and nothing opens it again. Tablets keep tabs open for days, so a returning player never sees the rules again. The heuristic evaluation already listed this as F7 ("How to play shows once per visit and can't be reopened").

## Steps (one commit each, after my yes)

### 1. "How to play" on the start screen
- A "How to play" link beside "See the leaderboard", in the same row, so the start screen gets no taller on small phones.
- It opens the same How to play screen. Back returns to the start, and Start round starts a round.
- **Tests first:**
  - unit: the link opens How to play even after a round has been started;
  - browser: at every phone size the start screen shows Play and both links without scrolling.
  - Browser tests that press Play now match the name exactly, because "How to play" also contains "play".

### 2. "?" in the round's top bar
- A "?" button at the right end of the top bar, mirroring × on the left. It opens the three rules as a sheet over the round.
- The round waits while the sheet is open, and "Back to the round" returns to the same item. The phone's Back button closes the sheet rather than asking to leave.
- The three rules move into one small component (`HowToSteps.tsx`), so the screen and the sheet can't drift apart.
- **Tests first:**
  - unit: the sheet opens, the number keys are ignored while it's open, and the round continues on the same item;
  - unit: Back closes the sheet;
  - browser: the top bar stays one row on a 320px phone, and the sheet's button is on screen on the small phone and the sideways phone.

## Checks before each commit
Unit tests, browser tests, lint, type check and build. Screenshots at phone, iPad and desktop sizes. `design/screens/` is restored after the browser runs.

## Not in this plan
- The empty band between the bins and Start round on tall screens (iPad), noted for later.
- Explaining points and streaks (F6).
