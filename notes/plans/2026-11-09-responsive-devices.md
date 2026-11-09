# Plan: Which Bin on every device (9 Nov 2026)

**Status: proposed 9 Nov, built on branch `feat/responsive-devices`, not committed.** Each step below is one commit, after my yes. Nothing here touches `main`, the game rules, the scoring, `items.json`, the wording or `supabase/`.

**Why:** I asked for the game to be fully responsive on every device. The earlier work (`2026-10-24-ui102-responsive.md`, `2026-10-27-responsive-round.md`) made phones, one tablet and one desktop size fit. This plan checks the whole range: small and large phones, phones held sideways, tablets both ways up, laptops, big desktops and 200% text.

## How it was checked (before any change)
- Every screen and state: start screen, How to play (screen and sheet), round (first item, while dragging, "Right!", "Not quite"), "Leave this round?", score, leaderboard (with scores, empty, and the "couldn't load" error).
- 17 sizes in Chrome's engine (Chromium) and Safari's (WebKit):
  - small phones: 320 × 568, 360 × 640, 375 × 667;
  - large phones: 390 × 844, 430 × 932;
  - phones held sideways: 568 × 320, 667 × 375, 844 × 390, and 800 × 304 (a 360 × 800 Android phone held sideways with Chrome's address bar showing);
  - tablets: 768 × 1024, 820 × 1180, 1024 × 768, 1024 × 1366;
  - laptops and desktops: 1280 × 800, 1440 × 900, 1920 × 1080;
  - text at 200% (root font size) on a 375 × 667 phone.
- Measured, not eyeballed: sideways scrolling, page height against the screen, every button's size, the smallest text, overlapping controls, whether the status bar, lives, six bins and the item (or Got it) are fully on screen, the empty space above and below the bins, the focus ring.
- The game played on the local store; no test answers or scores reached the database. The error state used a build pointed at an address that can't exist (`supabase.invalid`).

## What already works (keep it)
- No sideways scrolling on any screen at any size at normal text size, in both engines.
- Upright phones, tablets and desktops: the round fits without scrolling in all three states, with no empty band above the hearts (the 27 Oct work holds at 360 × 640 and 430 × 932 too).
- Phones held sideways at 667 × 375, 844 × 390, and with Safari's bar showing (about 667 × 325 and 844 × 340): the round fits for every item.
- No text under 14px (the tokens' smallest step). Every button is at least 44 × 44px, except one (finding 10).
- The focus ring shows on ×, ? and every bin in both engines, and stays on screen.

## Findings

Severity: 4 blocks the task, 3 people fail or struggle, 2 slows or confuses, 1 cosmetic. Screenshots are Chromium unless the name starts with `webkit-`.

| # | Screen | Size | What's wrong | Evidence (`design/responsive-devices/before/`) | Sev |
|---|---|---|---|---|---|
| 1 | Round, "Right!" | 568 × 320; 800 × 304 and 740 × 300 (Android held sideways, Chrome's bar showing) | The explanation and the next item don't fit in the left column. The page scrolls 31px (568 × 320) or 14px (800 × 304), and the bottom row of bins and the item go off screen. It happens for 9 of the 15 items at 568 × 320 and for most items at 800 × 304. Left column: 264px free at 568 × 320, but the longest "Right!" card (157px) and the item (138px) need 303px | `568x320-round-right.jpg`, `800x304-round-right.jpg` | 3 |
| 2 | Round, "Not quite" | 568 × 320; 800 × 304, 740 × 300 | The card is too tall for the left column: 309px for batteries in a 264px space at 568 × 320, so the page scrolls 50px and the status bar and bottom row of bins go off screen. At 800 × 304 it scrolls 6–8px | `568x320-not-quite.jpg`, `800x304-not-quite.jpg` | 3 |
| 3 | "Leave this round?" sheet | 568 × 320 | "Leave" is cut off at the bottom of the sheet (80% of the screen tall), and the sheet can't scroll | `568x320-leave-sheet.jpg` | 3 |
| 4 | Round, the sheets and the leaderboard | 375 × 667, text at 200% | Bin names run into each other ("Glasbak" over "Textielbak"). The status bar is 116px wider than the screen, so the phone zooms the whole page out. "Leave this round?" has both buttons below the screen and can't scroll. The leaderboard's title, one long word, pushes the page 71px sideways | `webkit-375x667-text200-round-start.jpg`, `webkit-375x667-text200-leave-sheet.jpg`, `webkit-375x667-text200-leaderboard-empty.jpg` | 3 |
| 5 | Every screen after a scrolled one | 667 × 375, 568 × 320 | A screen opens at the previous screen's scroll position. The leaderboard, opened from the score screen's bottom link, opens 25px down at 667 × 375 and 78px down at 568 × 320 (WebKit), so its title is out of view. At 200% text the round opened scrolled, with the status bar out of view | `667x375-leaderboard-opens-scrolled.jpg` | 2 |
| 6 | Start screen | 568 × 320, 667 × 375, 844 × 390 | The page scrolls 99, 51 and 21px. At 568 × 320 Play is half below the screen, and both links and "No account." are below it | `568x320-welcome.jpg`, `667x375-welcome.jpg` | 2 |
| 7 | Round | 1024 × 1366 (13-inch iPad upright) | It gets the desktop's side-by-side layout, because that switches on by width only. The bins (172 × 232px) sit in the middle with 382px empty above the hearts and 396px below | `1024x1366-round-start.jpg` | 2 |
| 8 | Round | 768 × 1024, 820 × 1180 | The round stays a 576px column (70–75% of the width), so the bins are 165px wide and come out 2.0–2.5 times as tall as wide: thin, and the item small at the bottom | `820x1180-round-start.jpg` | 1 |
| 9 | Round | 768 × 1024, 820 × 1180 | A bin that opens (it grows 6%) overlaps the bin above or below it by 2–4px, because the bins are 8px apart and up to 406px tall | `820x1180-not-quite.jpg` | 1 |
| 10 | Leaderboard, "couldn't load" | every phone and tablet | "Try again" is 40px tall, under the 44px minimum for touch | `375x667-leaderboard-error.jpg` | 2 |
| 11 | Round, phone held sideways | notched iPhones, about 812 × 375 and 852 × 393 | The side padding ignores the notch (`safe-area-inset-left/right`, 44–59px): the round's content starts 38–58px from the edge. Worked out from the layout; a browser can't emulate a notch | none | 1 |
| 12 | Round, big desktop | 1920 × 1080 | The board stays 1024 × 480px in the middle, with 239px empty above the hearts and 253px below | `1920x1080-round-start.jpg` | 1 |
| 13 | Round, "Not quite" | 430 × 932 | The bin that opens (6% bigger) overlaps the bin above or below it by 0.9px: the bins are 301px tall and 8px apart. Found by the new browser test (step 9), after the first audit | none (measured) | 1 |

**Outside this plan (game behaviour, not layout):** a drag that passes over a bin and is let go back on the tray *in the same animation frame* as the last move can answer that bin and cost a life. `ItemSticker.tsx` drops at the last position seen while dragging, and motion only reports moves once per frame. It came up with the test robot's very fast moves; with one frame between the last move and letting go, nothing is answered. A real finger rarely moves that fast, but it should be looked at separately.

## Changes (one commit each, after my yes)

| Step | Change | Files | Fixes |
|---|---|---|---|
| 1 | **Phones held sideways: the status bar sits over the bins only**, so the left column (explanation and item, or "Not quite") gets the full screen height: 304px instead of 264px at 568 × 320. The explanation and the item are wrapped in one box. On phones held sideways that box is a column in the grid's left area; everywhere else it is `display: contents`, which means its box disappears and the two parts keep their own grid places, as now. Two more things were needed once built: (a) at 800 × 304 the bins' column was now 26px too tall for the space under the status bar, so where the bins' area is at least 24rem wide (from about 740px wide) the icon sits beside the bin's name instead of above it (a container query); the 1–6 key numbers hide there, as they would cover the name, and phones have no keyboard; (b) the longest "Not quite" (batteries) was still 5px too tall at 568 × 320, so the item's tray loses its top padding sideways and "Got it" is 44px tall there instead of 48 | `RoundScreen.tsx`, `global.css` (`round-layout`), `BinTarget.tsx`, `NotQuiteCard.tsx` | 1, 2 |
| 2 | **"Leave this round?" fits sideways and at 200% text:** the two buttons side by side on phones held sideways, and the text scrolls if it still doesn't fit, with the buttons always in sight (the same fallback as the How to play sheet). With very big text the title drops a step, so the whole question shows above the buttons | `LeaveRoundSheet.tsx` | 3, 4 |
| 3 | **Bigger text:** where the text is too big for three bins in a row, two per row, and at 200% one, so every name stays whole (container queries in rem, which grow with the text size; at normal text no phone is affected). The rows then grow with their labels and the page scrolls. As a last resort a name breaks inside the word rather than run into the next bin. The status bar wraps onto a second line instead of running off the side (the progress bar keeps at least 16px, so at normal text it still fits on one line at 320px with a 4-digit score) | `RoundScreen.tsx`, `BinTarget.tsx`, `Hud.tsx` | 4 |
| 4 | **Every screen opens at the top** | `App.tsx` (+ a stand-in for `window.scrollTo` in `src/test/setup.ts`, which jsdom lacks) | 5 |
| 5 | **Start screen sideways: two columns**, the name and the one-line pitch on the left, Play and the links on the right, so all of it is on screen without scrolling | `WelcomeScreen.tsx` | 6 |
| 6 | **Tablets:** the round goes side by side only on screens wider than they are tall, so an iPad held upright keeps the upright layout. Upright tablets get a wider column: 672px from 768px wide, 768px from 1024px wide. Bins 8px further apart from 768px wide (16px, as on desktops), and 12px between the rows on tall phones | `global.css` (`side-by-side`), `RoundScreen.tsx`, `BinGrid.tsx` | 7, 8, 9, 13 |
| 7 | **Leaderboard:** "Try again" gets the normal button size (48px); with very big text the title drops a step and the trophy may go on its own line, so the page doesn't scroll sideways | `LeaderboardScreen.tsx` (only the old lines 43–44 and 59, away from my edit around line 103) | 4, 10 |
| 8 | **Notch-safe side padding** for the round and the start screen (the two that are wide when held sideways): a small `px-safe-*` utility that uses the padding or the notch's inset, whichever is bigger | `global.css`, `RoundScreen.tsx`, `WelcomeScreen.tsx` | 11 |
| 9 | **A responsive browser test** that loops over the size matrix in Chromium and WebKit: no sideways scrolling on any screen; the round fits without scrolling in all three states, using a fixed round with the longest explanations (batteries, frying oil, wine glass, jam jar); an open bin doesn't overlap its neighbour; the sheets' buttons on screen; every button at least 44px; every screen opens at the top; at 200% text, nothing runs off the side and bin names stay inside their bins. Two new projects (`responsive-chromium`, `responsive-webkit`) run it; the four phone projects skip it | `tests/e2e/responsive.spec.ts`, `playwright.config.ts` | all |
| 10 | **Record:** before and after screenshots in `design/responsive-devices/`, with a README | `design/responsive-devices/` | — |

## Not changing, and why
- **Big desktops (finding 12).** The round stays a 1024px board in the middle of the screen. Growing it further would make the bins thinner or the drag longer, and a centred board is what most web games do. The bins are 172 × 232px, plenty for a mouse.
- **Start, score, leaderboard and How to play on desktops** stay a 576px column. These are reading screens, and 576px keeps lines at a comfortable length (about 65 characters).
- **How to play, score and leaderboard scroll** on small and sideways phones. They are pages to read, not the playfield; their buttons are reachable by scrolling, and nothing is cut off.
- **The round at 200% text scrolls.** Doubling the text doubles everything measured in rem, so the round is like a 187px-wide screen; it can't fit. The aim there is that nothing overlaps or runs off the side.
- **The sheets' height cap (`80vh` in the shadcn drawer)** stays. Measured, the sheets' buttons are on screen at every size; changing a shadcn component isn't needed.
- **The top safe area** on the start and score screens (`pt-6`, `pt-12`). It only matters when the game runs as an installed web app, which it doesn't (no manifest).
- **Upright bins up to 2.4 times as tall as wide** (27 Oct decision): kept. The wider tablet column in step 6 brings tablets to about 1.7–2.1.
- **"Got it" and Safari's floating address bar** on a real iPhone (step 3 of the 27 Oct plan) still needs checking on my phone; a browser on a laptop can't show it.

## Result (9 Nov, measured on the built game, same audit, same seeded round)
- **Phones held sideways:** the round no longer scrolls in any state at 568 × 320, 667 × 325, 667 × 375, 740 × 300, 800 × 304, 844 × 340, 844 × 390 or 932 × 380, for all 10 items of the round, in both engines (before: up to 31px for "Right!" and 50px for "Not quite" at 568 × 320; 5–13px in every state at 800 × 304). The start screen fits without scrolling (before: 99, 51, 21 and 104px).
- **"Leave this round?"** sideways: both buttons on screen (before: "Leave" cut off). At 200% text: both buttons on screen and the whole question above them; the explanation scrolls.
- **200% text:** no sideways scrolling on any screen (before: 116–156px on the round and sheets, 71px on the leaderboard). Bin names stay whole, one bin per row, and inside their bins.
- **Every screen opens at the top** (leaderboard before: 25px down at 667 × 375, 78px in WebKit at 568 × 320).
- **Tablets upright:** 1024 × 1366 has the upright layout (bins 172 × 232 → 224 × 469, empty space above the hearts 406 → 26px). 768 × 1024 and 820 × 1180: column 576 → 672px, bins 165 → 192px wide, 1.74 and 2.15 times as tall as wide (were 2.05 and 2.45). An open bin overlaps no other bin at any size (before: 2.2px and 4.2px on tablets, 0.9px at 430 × 932).
- **Buttons:** every button at every size is at least 44 × 44px ("Try again" 40 → 48px tall).
- **Unchanged where it already worked:** 1024 × 768 and the desktops measure the same as before (bins 172 × 232). Upright phones too, except 4px more between the two rows of bins on tall phones (390 × 844 and up: bins 2px shorter).

## Before each commit
Unit and browser tests, lint, type check and build (`npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run test:e2e`, `npm run build` in `app/`). Screenshots before and after in `design/responsive-devices/`.
