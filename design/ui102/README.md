# UI 102 applied to Which Bin (24 Oct 2026)

The UI 102 lecture (Interactive Design Studio, 19 Oct 2026) states its outcome: *"apply principles in your own projects (also retroactively)"*. This folder is the evidence that the five principles were applied to Which Bin, and that the game now works from the smallest phone to a desktop.

- `before/`: the game as it was (commit `2dfbbaa`).
- `after/`: the game with the changes.
- `compare/`: before and after side by side, labelled with the principle each one shows.

Both sets use the same screens and the same sizes. The game's random choices are fixed for the captures, so the same items appear in both.

## What changed, by lecture topic

| UI 102 topic | Before | After | Files |
|---|---|---|---|
| **Type** ("always start with type") | 14 text sizes, including one-offs (13px, 15px); default line heights | One scale of six steps: small 14px, body 16px, lead 18px, title 20px, heading 32px, display 56px. Running text 145–150% line height, headings tighter. The bigger steps grow slightly on bigger screens | `app/src/styles/tokens.css`, every screen |
| **Spacing** (4 · 8 · 16 · 24 · 32 · 48) | 2, 6, 10, 12, 14 and 20px next to 8 and 16 | Only the lecture's steps. The closer two things belong together, the smaller the gap: 4–8px inside a component, 16px card padding, 24px between groups | `tokens.css` (the rule), every screen |
| **Grids** | Every screen a 448px strip, small and lost on a tablet or desktop; the stripe band stopped at 448px | Phones: one column. Tablets: a 576px column with 32px margins. Desktops and phones held sideways: the round screen side by side (item left, bins right). Full-width stripe band. The "Not quite" sheet a centred card on wide screens | `RoundScreen.tsx`, `NotQuiteSheet.tsx`, the screens, `global.css` (`landscape-phone:` variant) |
| **Hierarchy** (size, colour, placement) | Phone held sideways: the round was 536px tall on a 375px screen, so the lives and score, or the bins, were out of view | Everything on screen at 667×375. The item is the biggest thing (224px on a desktop, up from 160px); the hint text is quieter | `RoundScreen.tsx`, `ItemSticker.tsx`, `Hud.tsx` |
| **Colour** (60/30/10, affordances, accessibility) | Already 60/30/10 and measured; no hover state on bins; a faint 40% focus ring | No new colours; the 60/30/10 roles written into the tokens. Bins lift on hover (mouse only). A solid blue focus ring with a cream gap on bins and buttons | `tokens.css`, `BinTarget.tsx`, `button.tsx` |

## Measured

| Size | Before | After |
|---|---|---|
| 667×375, phone held sideways | Round 536px tall on a 375px screen | 375px: lives, item and all six bins on screen |
| 568×320, smallest phone held sideways | Didn't fit | All six bins and the lives on screen (11px of bottom padding below the fold) |
| 768×1024, tablet | 448px column | 576px column, item 192px, bins 165×112px |
| 1440×900, desktop | 448px column, bins 132×89px | 1024px, side by side, bins 141×128px |
| 320×568 and 375×667, phones | Fit | Still fit (checked by the browser tests) |

## Checks

- **New browser tests,** on all four phones (`app/tests/e2e/smoke.spec.ts`):
  - The landscape round fits.
  - The landscape "Not quite" sheet shows Got it.
  - No sideways scrolling at 768px and 1440px.
- The worst case was checked by hand: the "Not quite" sheet for the three longest explanations on landscape phones.
- **Results:** 64 unit tests and 42 browser runs pass; the type check is clean.
- **A bug found on the way:** the class-merging helper (`cn`) didn't know the new size names. It took `text-heading` for a colour and dropped it, so "Not quite" shrank to 16px. Fixed in `app/src/lib/utils.ts`, with a test (`utils.test.ts`). The two shadcn components now import `cn` from there.
- **New captures in `design/screens/`:** `08-round-desktop.png` and `09-round-landscape.png` (`npm run screens`).

Not changed: the game rules, the wording, the colours, the database and the Figma file.
