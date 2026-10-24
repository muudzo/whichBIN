# Plan: UI 102 principles + a responsive UI (24 Oct 2026)

**Source:** UI 102 lecture (Interactive Design Studio, 19 Oct 2026). Its outcome: "apply principles in your own projects (also retroactively)". Its five topics: hierarchy, type, spacing, colour, grids.
**Jira:** SCRUM-41 (usability teachers' feedback), SCRUM-67 (UI 102 exercise).
**Agreed:** 24 Oct, all five changes; the round screen goes side by side on desktop and landscape phones. Brand book update not included (offer later).

## Audit before the changes (six sizes, 320 to 1440 wide)

- Already good: no sideways scrolling; bins at least 89×101 px; every text colour pair at least 4.5:1; colours already 60/30/10 and meaningful.
- Type: 14 different sizes, including one-offs (13px, 15px); default line heights.
- Spacing: 2, 6, 10, 12, 14 and 20 px next to 8 and 16; no system.
- Grid: every screen a 448px strip; small and lost on tablet and desktop; the stripe band stops at 448px.
- Hierarchy: on a landscape phone the round screen is 536px tall on a 375px screen; lives, score and item count scroll out of sight.
- Colour as affordance: no hover state on the bins; a faint 40% focus ring.

## Changes

1. **One type scale** in `tokens.css`: small 14/145%, body 16/150%, lead 18/150%, title 20/125%, heading 32/110%, display 56→80/100%. Slightly larger on big screens; body text about 65 characters per line at most.
2. **One spacing system** from the lecture: 4, 8, 16, 24, 32, 48 (64 on desktop). Closer means it belongs together. Off-scale gaps go to the step that matches their relationship.
3. **A grid per screen size:** phones as now; landscape phones and desktop (≥1024) put the round screen side by side (item left, bins right, lives and score on top); tablet (≥768) a wider column; stripe band full width; "Not quite" sheet a centred card on wide screens.
4. **Hierarchy and affordances:** the item is the biggest thing on the round screen; quieter hint; hover lift on bins; solid focus ring; the 60/30/10 roles written into the tokens. No new colours.
5. **Tests and records:** browser tests for the landscape phone (everything visible without scrolling) and no sideways scrolling at 768 and 1440; all existing tests pass; before and after screenshots in `design/ui102/`; work log, evidence map, AI-use log.

Not touched: game rules, wording, colours, database, Figma. Commits only after my yes.
