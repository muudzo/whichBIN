# Plan: Which Bin? design changes, brand book and frontend boilerplate

## Context

- **Why now:** the final design is Figma **Mid-fi v3** (`7CDpsR8Mv09HzgemUxLBbQ`, 15 screens). Test 1 said it's easy to use, but unclear what it is, "more app than game", flat (add animations), and testers didn't know where glass goes. You're drawing the architecture now. The frontend needs a base to build on, so the backend (Supabase) can be wired in after the diagrams.
- **Goals this covers** (`learning goals2026P1.pdf`): turn the tested designs into frontend components; touch drag and drop, scoring, lives, leaderboards, explanations; 10–15 verified items (already in `app/src/data/items.json`); feedback feeding the next iteration.
- **Your choices:** brand direction = **bold sticker game × Frisian local**. Stack = React + TypeScript + Vite, Tailwind + shadcn (already installed), `motion`, Supabase later, Cloudflare Pages.
- **Skills used:** `design:design-critique` (part 1). For execution: `figma:figma-design-to-code` (required before reading design details), `apple-design` (motion), `design:accessibility-review` (contrast), `artifact-design` (brand book page), `check-rule-sources` (content).

---

## 1. Design analysis (design-critique) → suggested changes

**Overall:** the flow is honest and well argued (a reason on every screen, a source on every rule). The two biggest problems are framing and fidelity. The app opens as "Your Move", a moving-house app with stages and a path, so the game is 5 taps away. And everything is grey, static wireframe.

| # | Finding | Severity | Suggested change | Links to |
|---|---|---|---|---|
| 1 | **A1 says "Your Move"** and shows Moving in / Living here / Moving out. "Which Bin?" first appears on B1, so the purpose is unclear | 🔴 | A1 becomes **"Which Bin?"**: one-line promise ("Sort everyday stuff into Leeuwarden's bins. 2 minutes."), one item sticker over the bins, a big **Play** button. "Your Move" stays the long-term vision | Test 1 theme B |
| 2 | **5 taps before the first item** (A1 → A2 city → A4 stage → B1 path → C1 → C2). The city list, stage picker and path are app scaffolding | 🔴 | Build flow: **A1 → C1 (How to play, skipped on replay) → C2 round → C3 feedback → C4 score → C5 leaderboard**. Leeuwarden is fixed, shown as a small line "Leeuwarden · rules checked 19 Oct". A2–A4, B1, D1–D4 and E1 stay in Figma as the vision, not built this sprint | Test 1 B + D |
| 3 | **No leaderboard screen**, but your goal names leaderboards and community results | 🔴 | New **C5 Leaderboard**: top 10 this week + your rank, plus "Most-missed items" (community results, test 1 theme E). On C4: "Save your score" with a **random generated nickname** (e.g. "Blue Stork 42"): no typing, no personal data, nothing to moderate | Create goal |
| 4 | **Content out of date:** C2/C3/E2 use "Plastic bottle → Sortibak" (we left bottles out because of statiegeld), pages "pp. 16–17", "pp. 8–9", date "7 Oct" | 🟡 | All text comes from `items.json` (one source). C3 example → "Milk carton → Sortibak", pages and date from the file | `research/rule-sources.md` |
| 5 | **Glass:** the Glasbak target only says "glass" | 🟡 | Hint becomes "street container". At least one glass item (jam jar or wine glass) in round 1 | Test 1 theme A |
| 6 | **No reward for a right answer.** Only wrong answers get a moment (the sheet) | 🟡 | Right: the sticker flies into the bin, the bin "gulps", +points pop, a streak badge at ×3. Wrong: shake, a life drops. Round end: the score counts up. All of it fades only under "reduce motion" | Test 1 theme D |
| 7 | **Dragging isn't obvious:** only the text "Drag it to where it goes", and the card looks static | 🟡 | The sticker lifts (shadow) and wiggles once on the first item; bins light up when dragged over; **tapping a bin also works** (one hand, accessibility) | Nielsen: signifiers |
| 8 | **Lives / Score / Streak** use three different text styles | 🟢 | One HUD component: lives as **3 pompeblêd hearts** (brand), score, streak badge | Consistency |
| 9 | **Small grey hints** ("organic, leftovers", ~11px light grey) likely fail contrast | 🟢 | Hints at 13px+ in a token colour that passes 4.5:1. The 108×84 bin targets are fine (≥ 44px) | Accessibility |
| 10 | "Next round (faster)" but no visible time pressure | 🟢 | Could: a shrinking ring around the sticker from round 2 | Game feel |

**What works and stays:** a source and check date on every rule (trust), "Not quite" explains why (test 1: "very educational"), the 3×2 bin grid in thumb reach, the "Not a bin" target, no login, and the round summary with "Learn from these".

---

## 2. Brand book proposal: "Frisian sticker game"

**Idea:** a sticker pack from Friesland. Bold, thick-outlined, slightly tilted stickers give the game energy. The Frisian flag gives local roots: blue and white diagonal stripes, red **pompeblêden** (the heart-shaped leaves). The pompeblêd becomes the **life heart**: lose a leaf when you get it wrong. No municipality or Omrin logos (we don't imitate them).

| Token | Proposal | Use |
|---|---|---|
| `--ink` | #13233F deep navy | Text, 3px outlines, hard shadows |
| `--fries-blue` | #1B4FA3 | Primary buttons, stripe band, links |
| `--pompebled` | #D7263D | Lives, "Not quite" (always with icon + text, never colour only) |
| `--meadow` | #1E8A4C | Right answer, progress |
| `--sun` | #FFC531 | Score, streak, highlights (never text on cream) |
| `--cream` | #FFF8EC | Background: not plain white |
| `--paper` | #FFFFFF | Cards, sheets |
| `--sortibak-grey` | #8A9099 | Sortibak (the only bin colour Omrin confirms) |

Hex values are a starting point; execution checks every text/background pair for ≥ 4.5:1 and adjusts.

- **Type (2 families, self-hosted via @fontsource):** **Bricolage Grotesque** ExtraBold for headings and scores (characterful, chunky). **Atkinson Hyperlegible** for body and explanations, made for readability, which suits non-native readers.
- **Shapes:** 3px ink outlines, 4px offset hard shadow (the sticker look), radius 18 on cards, pill buttons, stickers tilted ±2°, item stickers with a white die-cut border.
- **Motifs:** a diagonal stripe band (headers, round end), pompeblêd hearts (lives, perfect-round confetti).
- **Bins:** a sticker card with icon + Dutch name + English hint. Only the Sortibak uses its real colour (grey). The other bins use tints with **icon and name as the main signal**, and the brand book says they're game colours, not Omrin's. Real lid colours become a question for Omrin.
- **Item art (for now):** **Fluent Emoji Flat** (Microsoft, MIT licence) as stickers. Gaps such as "plastic food packaging" get a simple custom SVG. Credited in the brand book.
- **Motion:** quick springs (150–400ms), "gulp" on right, shake on wrong, count-up at round end; only fades under `prefers-reduced-motion`. Built with `motion`.
- **Voice:** friendly, direct, plain English (B1 level); Dutch bin names with an English hint; never shaming ("Not quite", "lots of people miss this one").

**Brand book output:** the tokens in code (`app/src/styles/tokens.css`, the source of truth) and **`design/brand-book.html`**: palette with contrast ratios, type scale, stickers, bins, motion, voice, do/don't. Published as a private Artifact so you can share the link with your teacher. It's yours to adapt.

---

## 3. Boilerplate (what I'll build)

```
app/                         Vite + React + TS (its own package.json)
  vite.config.ts             React + Tailwind plugins, "@" alias
  components.json            shadcn, pointed at the brand tokens
  src/
    data/items.json          exists: 15 verified items (reuse as is)
    domain/                  pure logic + tests: types, loadItems (zod-validated),
                             buildRound (10 items, glass in round 1), scoring (points, streak, lives, speed-up)
    features/                welcome, how-to, round (Hud, ItemSticker, BinGrid, BinTarget, NotQuiteSheet),
                             score, leaderboard: one folder per screen
    components/ui/           shadcn button + drawer, restyled to the brand
    services/scoreStore.ts   interface (submitAnswer, submitScore, topScores, itemStats)
                             + a local in-memory version, so the UI works now;
                             the Supabase version swaps in after your architecture
    styles/                  tokens.css, global.css (Tailwind 4 @theme)
  tests/e2e/                 Playwright smoke at 320 / 375 / 768
supabase/                    empty, for migrations after the diagrams
design/brand-book.html
```

**Scope of this run:** setup, brand tokens, brand book, all 6 build screens navigable with real items, **tap-to-sort working** with feedback (C3) and the round score, and the leaderboard on local data. **Next run, after your diagrams:** drag and drop + motion polish, Supabase tables + RLS, deploy.

**Housekeeping:**
- Move `motion` and `shadcn` from the root `package.json` to `app/`; the root keeps the scraper only.
- Pin `.mcp.json` to `shadcn@4.22.1` instead of `@latest`.
- Use the versions the Vite template pins (avoid the brand-new TypeScript 7 unless the template uses it).

---

## 4. Order (small steps; suggested commit after each)

1. Setup `app/` (create-vite in a temp folder, copied in so `items.json` isn't touched), Tailwind, shadcn, housekeeping. **Commit: "chore: scaffold app"**
2. `domain/` with tests written first (items validation, round building, scoring). **Commit**
3. Brand tokens + fonts + HUD/sticker/bin components. **Commit**
4. Screens A1 → C1 → C2 → C3 → C4 → C5, read from Figma (≤ 3 more Figma reads: C2, C3, C4 design context). **Commit**
5. Brand book page + Artifact link. **Commit**
6. Updates: AI-use log rows, Jira comments (SCRUM-26 design changes, SCRUM-32 frontend), `CLAUDE.md` status.

After each step I explain what was made, so you can explain it to assessors.

---

## 5. Verification

- `npm run build`, `npm run typecheck`, `npm test` (Vitest: domain logic, item validation; ≥ 80% on `domain/`).
- Playwright smoke on mobile Chrome + WebKit at 320/375/768: A1 renders, Play → round, tap the right bin → points, tap a wrong bin → "Not quite" with the right why-line and page, round end → score → leaderboard. No horizontal scroll.
- A script computes contrast for every token pair (≥ 4.5:1 for text, ≥ 3:1 for large text and UI).
- Screenshots at 375px for you to compare with Figma; reduced-motion checked.
- `npm audit` noted (the known shadcn/braces warning, a dev tool only).

## 6. Decided in this plan (change any when you review)

- Build only the core game flow this sprint; the "Your Move" path and game 2 stay as the vision in Figma.
- Leaderboard nicknames are generated, not typed.
- Brand applied in code + brand book; the Figma file isn't redrawn (it saves Figma reads). The coded screens can be captured into Figma later for the process book.
- Light theme only for now.
