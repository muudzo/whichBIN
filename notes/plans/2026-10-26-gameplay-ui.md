# Plan: a clearer, calmer round screen (26 Oct 2026)

**Status: done 27 Oct.** Commits: step 0 `a57cd72`, 1 `0db109b`, 2 `3c7eb4a`, 3 `8969bbb`, 4 `8895408`, 5 `e3e2465`, 6 `eec713f` (steps 3–6 committed as each passed its tests, as agreed on 26 Oct). Still to do: the bins move up about 30px when "Not quite" appears; the dragged item covers the middle of a bin's name. Earlier status: agreed 26 Oct, steps 0 and 1 first. One step at a time: Claude builds a step, shows before and after screenshots, I review, Claude proposes the commit (files and message), I say yes or no. One commit per step.

**Why:** feedback from my design review (26 Oct 2026) on the gameplay screen. Keep the brand, the rules and every feature; don't redesign the game.

## What the review found (measured 26 Oct, the round screen at six sizes)

| # | Problem | Evidence |
|---|---|---|
| P1 | The bins read as coloured cards, not bins. While dragging, all six lift at once, and the 80px sticker covers the name of the bin it's over | Screenshots, drag state at 375 × 667 and 390 × 844 |
| P2 | Space isn't used well. Upright phones and tablets have an empty band between the item and the bins; on a desktop the bins use a third of the width, with empty space under them | Gap item → bins: 94px (390 × 844), 165px (768 × 1024), 4px (320 × 568). Desktop: bins 32% of the width, 253px empty at the bottom |
| P3 | Long drags | Item centre → bins centre: 323px (390 × 844), 412px (768 × 1024), 506px (desktop) |
| P4 | The status bar takes three rows (lives and score, progress bar, "Item 1 of 10"), and the lives sit at the very top, far from the item and the bins | Status bar is 85px tall; lives at y = 21 on every phone |
| P5 | "Right!" appears at the top, away from the bin the player just used. On the smallest phone its explanation is cut off ("…goes in the…") | 320 × 568 capture |
| P6 | "Not quite" is a sheet that covers the bins, so the player can't see which bin was right while reading why | Every size |
| P7 | A phone held sideways scrolls: the page is 395px on a 390px screen, and when "Right!" appears the lives and score scroll off the top | 844 × 390 capture |
| P8 | First-time cue is a line of text above the item, away from where the player acts. Decorative motion (tilted sticker, rotating entrance, all bins lifting) competes with the sorting | Screenshots |

## Steps (each one is its own commit, after my yes)

| Step | Change | Files | Fixes | Tests |
|---|---|---|---|---|
| 0 | New branch `feat/gameplay-ui` from `main`. Keep the before screenshots in `design/gameplay-ui/before/` | — | — | — |
| 1 | **Bins that look like bins.** A simple bin drawing (lid wider than the body, slightly narrower at the bottom, two wheels) behind the name and hint; "Not a bin" drawn as a signpost instead, because it isn't one. The button stays a full rectangle to tap. While an item is over a bin, its lid tilts open and it gets the thick outline; the other bins stay still | `BinTarget.tsx`, maybe a small `BinShape.tsx` | P1 | Existing bin tests pass; browser test: the highlighted bin is still the one under the item |
| 2 | **Bins in the centre, the item at the bottom** (upright phones and tablets): status bar, then the six bins, bigger, centred in the free space, then the item in a tray at the bottom, in thumb reach. Desktop and sideways phones stay side by side, with bigger bins and the content centred | `RoundScreen.tsx`, `ItemSticker.tsx`, `BinGrid.tsx` | P2, P3, P7 | New browser test: no scrolling and nothing overlapping at 320 × 568, 375 × 667, 390 × 844, 844 × 390, 768 × 1024, 1440 × 900. Drag distances measured before and after |
| 3 | **A one-row status bar, lives lower.** Top: leave (×), a thin progress bar with "3/10" and the score. The hearts move lower, closer to where the eyes already are. Try two or three places (e.g. just above the bins, or beside the tray) and compare screenshots; the bottom mustn't get crowded on small phones | `Hud.tsx`, `RoundScreen.tsx` | P4 | Lives and progress keep their screen-reader labels; existing tests pass |
| 4 | **Feedback next to the action.** Right: the bin used gets a green tick, and a short card between the bins and the tray gives the full "why" (never cut off), in a slot of fixed height so nothing jumps. Wrong: the chosen bin shows a red cross, the right bin is outlined with its lid open, and the explanation ("Not Biobak. Broken wine glass → Sortibak", why, Omrin source, Got it) takes the tray's place, so the bins stay visible | `RoundScreen.tsx`, `NotQuiteSheet.tsx` (replaced by an inline card), `BinTarget.tsx` | P5, P6 | Written first: right and wrong feedback name the item, the bin chosen and the right bin; Got it moves on; the right bin is marked. Focus moves to Got it; Enter works. Browser tests updated from "dialog" to the new card |
| 5 | **Easier to drag, clearer for first-timers.** The whole tray is the handle; the item lifts when pressed; while dragged it shrinks to about 64px so the bin's name stays readable. Under the item, until the first answer of a visit: "Drag me into a bin, or tap a bin". No new screen | `ItemSticker.tsx`, `RoundScreen.tsx` | P1, P3, P8 | Drag tests on four phones, repeated; hint shown on the first item only |
| 6 | **Calmer motion.** Remove the sticker's tilt and rotating entrance, the hover grow, and all bins lifting during a drag. Keep what explains something: the item flying into its bin and the lid opening. "Reduce motion" still respected | `ItemSticker.tsx`, `BinTarget.tsx` | P8 | Existing tests; check with reduced motion on |

After every step: type check, lint, unit tests, browser tests on the four phones, and screenshots at the six sizes in `design/gameplay-ui/after/`. Work log, evidence map and `AI_USE_LOG.md` updated as each step lands.

**Not in this plan:** new items or rules, colours other than the bins' drawing, the welcome, score and leaderboard screens, new packages.

## Decided (26 Oct)
1. Wrong answer: the explanation goes in the tray, so players still see the bins.
2. The tray holds only the current item; no queue of next items for now.
3. The feedback came from my design review on 26 Oct.
4. Where the lives sit is to be tried out in step 3, keeping the bottom uncrowded on small phones.
