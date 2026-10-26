# Gameplay UI after the design review (26 Oct 2026)

Feedback from my design review on 26 Oct: bins that look like bins, better use of the screen, lives where they can be seen out of the corner of the eye, feedback next to the action, easier dragging, less decoration. Plan: `notes/plans/2026-10-26-gameplay-ui.md`.

- `before/`: the round screen as it was (commit `8a16bb8`).
- `after/`: the round screen after each step, added as the steps land.
  - `after/1-bins/`: step 1, the bins drawn as wheelie bins, whose lid opens while an item is over them (moments 1 and 2).
  - `after/2-layout/`: step 2, upright screens with the bins in the middle and the item at the bottom; side by side on sideways phones and desktops (moments 1 and 3).
  - `after/3-status-bar/`: step 3, a one-row status bar (leave, progress, score; 85 → 32px tall) and the lives right on top of the bins (on phones from y = 21 to y = 122–146, next to the bins), also after a lost life with a streak. Two places for the lives were tried: `compare/3-lives-options-A-above-bins-B-beside-item.jpg`. A (on top of the bins) was chosen: B put the hearts beside the item, which crowded the bottom of the smallest phone.
- `compare/`: before (top) and after (bottom), per step.

Each set shows the same four moments at six sizes: **1** the first item, **2** dragging it over its bin, **3** the "right" feedback, **4** the "not quite" feedback. Sizes: 320 × 568 (smallest iPhone), 375 × 667, 390 × 844, 844 × 390 (phone held sideways), 768 × 1024 (tablet), 1440 × 900 (desktop). The item order is seeded, so before and after show the same items.

## Measured before

| Size | Gap item → bins | Item centre → bins centre | Notes |
|---|---|---|---|
| 320 × 568 | 4px | 189px | "Right!" explanation cut off |
| 375 × 667 | 31px | 235px | |
| 390 × 844 | 94px | 323px | |
| 844 × 390 | side by side | 365px | Page 395px tall on a 390px screen; "Right!" scrolls the lives off the top |
| 768 × 1024 | 165px | 412px | |
| 1440 × 900 | side by side | 506px | Bins use 32% of the width; 253px empty under them |

Status bar: three rows, 85px tall, lives at the top (y = 21) on every phone.

## Measured after step 2 (layout)

| Size | Item centre → bins centre | Bin size | Notes |
|---|---|---|---|
| 320 × 568 | 189 → 169px | 91 × 117 | Fits, also after "Right!" |
| 375 × 667 | 235 → 217px | 109 × 142 | |
| 390 × 844 | 323 → 272px | 114 × 156 → 188 | Empty band above the bins 42px (was 150px before the space was shared 2 : 1) |
| 844 × 390 | 365 → 366px | 131 × 135 | No scrolling; lives and score stay on screen after "Right!" |
| 768 × 1024 | 412 → 328px | 165 × 112 → 236 | Empty band 65px (was 165px, between item and bins) |
| 1440 × 900 | 506 → 509px | 141 × 128 → 172 × 232 | Side by side as before, with bigger bins |

The item now sits right under the bins on upright screens (7–10px apart); the leftover height goes above the bins, never into the drag.
