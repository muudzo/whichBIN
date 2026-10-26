# Gameplay UI after the design review (26 Oct 2026)

Feedback from my design review on 26 Oct: bins that look like bins, better use of the screen, lives where they can be seen out of the corner of the eye, feedback next to the action, easier dragging, less decoration. Plan: `notes/plans/2026-10-26-gameplay-ui.md`.

- `before/`: the round screen as it was (commit `8a16bb8`).
- `after/`: the round screen after each step, added as the steps land.

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
