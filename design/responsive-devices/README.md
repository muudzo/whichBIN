# Which Bin on every device (9 Nov 2026)

I asked for the game to be fully responsive on every device. Plan, findings and the measured result: `notes/plans/2026-11-09-responsive-devices.md`.

- `before/`: the game as it was on `main` (commit `1277f7e`).
- `after/`: the same views on branch `feat/responsive-devices`.

The files in both folders have the same names, so each pair can be compared. Screenshots are from Chrome's engine (Chromium) unless the name starts with `webkit-` (Safari's engine). The names give the screen size in CSS pixels and the state: `round-start` (first item), `round-right` (a "Right!" card), `not-quite`, `leave-sheet` ("Leave this round?"), `welcome`, `score`, `leaderboard-empty`, `leaderboard-error` ("couldn't load"). `text200` means text at 200%. The before shot `667x375-leaderboard-opens-scrolled.jpg` pairs with the after shot `667x375-leaderboard-opens-at-top.jpg`.

## How they were made

The built game, with the local store (blank Supabase settings), so no test answers or scores reached the database. The "couldn't load" state used a build pointed at an address that can't exist (`supabase.invalid`). The item order was seeded, so before and after show the same items. Reduced motion, so nothing is caught mid-animation.

Every screen and state was checked at 17 sizes in both engines: 320 × 568, 360 × 640, 375 × 667, 390 × 844, 430 × 932 (phones); 568 × 320, 667 × 375, 844 × 390 and 800 × 304 (phones held sideways, the last an Android phone with Chrome's address bar showing); 768 × 1024, 820 × 1180, 1024 × 768, 1024 × 1366 (tablets); 1280 × 800, 1440 × 900, 1920 × 1080; and text at 200% on a 375 × 667 phone. The same checks now run as a browser test: `app/tests/e2e/responsive.spec.ts`.

## What changed, per pair

| Pair | Before | After |
|---|---|---|
| `568x320-round-right`, `568x320-not-quite`, `800x304-*` | The page scrolls 31px ("Right!") and 50px ("Not quite") at 568 × 320, and 5–13px in every state at 800 × 304; the bottom row of bins goes off screen | Nothing scrolls. The status bar sits over the bins only, so the explanation and the item get the full height on the left. At 800 × 304 the bins' icons sit beside their names |
| `568x320-leave-sheet` | "Leave" cut off below the sheet | Both buttons side by side, on screen |
| `webkit-375x667-text200-*` | Bin names run into each other; the page is 116–156px too wide; the sheet's buttons are below the screen; the leaderboard is 71px too wide | One bin per row, names whole; nothing too wide; the sheet's buttons and the whole question on screen (the explanation scrolls); the round itself scrolls at this size |
| `667x375-leaderboard-opens-*` | Opens 25px down, title out of view | Opens at the top |
| `568x320-welcome`, `667x375-welcome`, `844x390-welcome` | Scrolls 99, 51 and 21px; Play half below the screen at 568 × 320 | Two columns, everything on screen |
| `1024x1366-round-start` | The desktop's side-by-side board, 406px empty above the hearts | The upright layout, filling the screen |
| `820x1180-*` | A 576px column, thin bins (2.45 times as tall as wide); an open bin overlaps the one below by 4px | A 672px column (bins 2.15); no overlap |
| `375x667-leaderboard-error` | "Try again" 40px tall | 48px |
| `320x568-round-start`, `390x844-round-right`, `844x390-not-quite`, `768x1024-welcome`, `1440x900-*`, `1920x1080-round-start` | Already worked | The same |

Not shown: notch-safe side padding on the round and start screen (a browser can't emulate a notch), and the 1–6 key numbers, which hide on the bins where the icon sits beside the name.
