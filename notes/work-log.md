# Work log

> One entry per working day: what we did, the problems we hit, and how we solved them. Claude keeps the facts up to date; the "My reflection" lines are mine to fill in. This is raw material for the Gibbs reflections and the growth portfolio, not the reflection itself.
> Plans we agreed on are in `notes/plans/`.

---

## Mon 19 Oct 2026

### What we did
- **Test 1 findings logged** (`research/test-1-findings.md`): wireframes + mid-fi tested. Five themes: glass is a real gap, easy to operate but unclear what it is, explanations teach, "more app than game", ideas for pushing better disposal. Draft change list (MoSCoW).
- **Week plan from the learning goals:** each piece of work should count for more than one goal line (e.g. agent skill 1 also produces the verified items).
- **Stack chosen:** React + TypeScript + Vite, Supabase with RLS, `motion`, Cloudflare Pages: the PayNow stack minus what Which Bin doesn't need (Meta integration, Sentry, extra backends).
- **Agent skill 1 built** (`.claude/skills/check-rule-sources/`) and run on Omrin's 2026 guides (English + Dutch): **15 verified items** in `app/src/data/items.json`, evidence in `research/rule-sources.md`. A script confirmed all 60 quotes appear word for word in the guides.
- **Figma connected** to the right account, and the final design (Mid-fi v3) analysed with the design-critique skill.
- **Plan agreed:** design changes, a "Frisian sticker game" brand, and the frontend boilerplate (`notes/plans/2026-10-19-design-brand-boilerplate.md`).
- **Frontend built in `app/`** (React + TypeScript + Vite, Tailwind, shadcn, `motion`), on branch `feat/app-boilerplate` in staged commits:
  - game rules as pure, tested code (`app/src/domain/`): item checks, rounds (glass items in round 1, mistakes come back), scoring with lives and streaks, generated nicknames
  - a score store interface with a local version, ready to swap for Supabase after the architecture
  - screens: start, how to play, round with a "Not quite" sheet, score, leaderboard
  - the "Frisian sticker game" brand: tokens in `app/src/styles/tokens.css`, two fonts, 15 item stickers, pompeblêd lives
  - **46 unit tests** and **17 browser tests** on Android Chrome, iPhone SE (1st and 3rd gen) and iPhone 14; screenshots in `design/screens/`
- **Brand book** (`design/brand-book.html`), published as a private page: https://claude.ai/artifact/7V3DWDi2mxSp17hoHoyrcm

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| Claude followed an old pointer in `CLAUDE.md` to a different folder (`~/Documents/personal-project-sprint3`), treated a prototype there as our frontend, and saved our findings there | Rewrote `CLAUDE.md`: this repo is the whole project. Moved the findings here, removed what was put there, and saved it to Claude's memory so it doesn't happen again |
| Claude's PDF reader needed a tool that isn't installed (poppler) | Read the PDFs with macOS's built-in PDFKit instead; now a script in the skill (`extract-pdf-text.sh`) |
| Omrin's guide says plastic and cans go in the Sortibak, but many bottles and cans carry a Dutch deposit (statiegeld) | Left plastic bottles and cans out of the game until Omrin answers; listed as a question in `research/rule-sources.md` |
| The English and Dutch guides disagree on bin-out time (07:00 vs 07:30) | Not used in the game; question for Omrin |
| `npm audit`: 7 "high" warnings, and `--force` would downgrade shadcn from 4.22.1 to 1.0.0 | Traced all 7 to one package (`braces`) with no fixed version, used only by the shadcn command-line tool on our laptop. Didn't force it; check again before submitting |
| The Figma connector was signed in to the student account (View seat, 20 reads a month), which couldn't open our files | Reconnected it to tatendawalter62@gmail.com (Full seat); used as few reads as possible (4 so far) |
| `.claude/` was git-ignored, so the agent skill would never reach GitHub | Took `.claude/` out of `.gitignore` |
| The final design (Mid-fi v3) opens as "Your Move", a moving-house app, and needs 5 taps before the first item. That fits test 1's "didn't know what it was" | Built only the core flow: start → how to play → round → score → leaderboard. The start screen says in one line what the game is |
| shadcn's setup stopped to ask for a preset, and added an unfamiliar package called `cn` | Ran it with `--preset nova`. Checked `cn` before keeping it: it's shadcn's own package, so `clsx` and `tailwind-merge` were removed instead |
| Some emoji teach the wrong bin: an egg for an egg carton (an egg is food waste), a pizza for a pizza box | Drew 4 custom stickers in the same flat style; a test fails if any item has no sticker |
| A timing bug: during the 0.25 s animation of the old item, a fast tap answered the next item | The bins wait until the old item has gone, so an answer always belongs to the item on screen |
| On the smallest iPhone (320 × 568) Play was below the screen, the lives bar scrolled off, and a button label stuck out sideways | Added screen-height variants (`short:` / `tall:`) and browser tests that check the lives bar and all six bins are fully on screen |
| "Right! Textielbak" sat under the *next* item's name, so it read as that item's answer | The "Right!" card now sits above the sticker and names the item it's about |
| The brand book scrolled 7px sideways on a phone | Found the element with a script (`box-sizing`) and fixed it before publishing |
| Seeing the app running: the bin colours were too pale to notice | Gave each bin a strong colour plus a darker "lid" band, with ink text (at least 6:1). That made the "Right!" card, which borrowed the Biobak colour, hard to read, so it got its own light green token |
| Still open: the JavaScript bundle is 192 KB gzipped | Within the 300 KB budget for an app page; trim later (zod, motion) |

### From plain to vibrant: how the MCPs and skills were used
The steps that took Which Bin from a greyscale Figma mid-fi to the coloured "Frisian sticker game", in order. Each step names the tool, what it did and what it produced.

1. **Atlassian MCP + `design:research-synthesis` skill:** turned our test 1 notes into five themes, including "more app than game" and "add animations" (`research/test-1-findings.md`), with comments on SCRUM-24 and SCRUM-25.
2. **Figma MCP:** checked which account the connector used, moved it to the Full seat, then read Mid-fi v3: the page list and two screenshots (4 reads in total).
3. **`design:design-critique` skill** on those reads: 10 findings. The root of "more app than game": the design is greyscale and static, and opens as "Your Move", a moving-house app, five taps away from the game (`notes/plans/2026-10-19-design-brand-boilerplate.md`).
4. **My decisions:** Mid-fi v3 as the final design, the brand mix (bold sticker game × Frisian local), and approving the plan before anything was built.
5. **Code:** the brand became tokens in `app/src/styles/tokens.css`, plus two fonts, Fluent Emoji stickers plus 4 custom ones, pompeblêd lives and the stripe band. A script measured the contrast of every text colour (`43f8245`, `a8306e6`).
6. **Playwright screenshots** at the smallest iPhone size (320 × 568) showed three layout problems, all fixed (`ce0931d`, `897c6ff`).
7. **`run` skill:** started the app on the dev server, also reachable from a phone on the same Wi-Fi. Seeing it running, I said the bin colours weren't showing. They became stronger colours with a darker lid, and the contrast was measured again (`2a68550`).
8. **Artifact (claude.ai):** published the brand book as a private page and updated it to version 2 with the new colours: https://claude.ai/artifact/7V3DWDi2mxSp17hoHoyrcm (`0a40915`, `696599c`).
9. **Atlassian MCP:** progress comments on SCRUM-26 (design), SCRUM-32 (frontend) and SCRUM-74 (agent skill 1).

**What the tools did *not* do:**
- The shadcn MCP is set up in `.mcp.json` but was never called; the shadcn command-line tool was used instead.
- The plan named three more skills (design-to-code, motion, accessibility review), but they were never loaded. Contrast was measured with our own script instead.
- The Figma file itself wasn't changed: the test 1 fixes went into the code and the brand book.

### What today adds to my learning goals
Goal lines are shortened from `learning goals2026P1.pdf`.

| Goal line | What today added | Status after today |
|---|---|---|
| **Create:** research and requirements (surveys, Omrin rules, competing apps) traced to decisions | 15 Omrin items, each with a quote, page and check date (agent skill 1). Test 1 grouped into five themes. Each of the 10 design changes in the plan names its reason: a test 1 theme, a goal or a design principle | Partly done. The residents' survey and a finding → decision trace (SCRUM-69) are still to do |
| **Create:** Figma wireframes and prototype, validated, then translated into frontend components | Mid-fi v3 (tested in test 1) became five coded screens with the test 1 fixes: one tap to the game instead of five, glass in round 1, a leaderboard screen added | Core flow translated. The Figma file stays as tested |
| **Create:** two architecture diagrams | The score store interface (`app/src/services/scoreStore.ts`) lists what the backend must do: save an answer, save a score, top scores, item stats, most missed | I'm drawing the diagrams (SCRUM-75) |
| **Create:** frontend with drag and drop, scoring, lives, leaderboards, explanations, on real phones | Tap-to-sort, scoring with streaks, 3 pompeblêd lives, a local leaderboard, and "Not quite" with the reason and the Omrin page. 46 unit tests + 17 browser tests on four phone sizes | Drag and drop, round-end motion and a check on a real phone are still to do (SCRUM-32) |
| **Create:** Supabase backend with row level security | The local store has the same interface, so Supabase can replace it | Starts after the diagrams (SCRUM-51 to SCRUM-54) |
| **Create:** integrate, test, deploy publicly | — | Not started (SCRUM-27) |
| **Create:** 3 test iterations with international students | Test 1 → MoSCoW change list → changes now in the code. Test 2 questions drafted in `research/test-1-findings.md` | 1 of 3 (SCRUM-33, SCRUM-55) |
| **Learn:** map PayNow skills, find full-stack and usability gaps, MoSCoW + timeboxes | Stack chosen as the PayNow stack minus what Which Bin doesn't need. MoSCoW used for the test 1 changes | The skills map itself is still to write (SCRUM-70) |
| **Learn:** AI workflows: fair-use guide, two agent skills | Agent skill 1 built and run. Three connectors used (Figma, Atlassian, Artifact) plus three loaded skills. Every AI-made deliverable has a row in `AI_USE_LOG.md` | Agent skill 2 (SCRUM-71) and the fair-use guide (SCRUM-57) still to do |
| **Learn:** explain code, database and architecture; Gibbs reflections; usability teachers' feedback | The app was built in small commits, one step each, so each can be explained. The game rules are plain functions with tests (`app/src/domain/`) | Gibbs (SCRUM-42, SCRUM-56) and teacher feedback (SCRUM-41) still to do |
| **Learn:** Ikigai; share the workflow (one-page guide + MCP and agent skill demo) | The MCP chain above is a ready storyline for the demo | Still to do (SCRUM-76, SCRUM-72) |

**Usability checks applied today** (for me to say which were new to me):
- Text contrast of at least 4.5:1, measured for every colour pair.
- Bin buttons well above the 44 px minimum touch size.
- Colour is never the only signal: each bin also has an icon, its Dutch name and an English hint.
- "Reduce motion" is respected.
- The layout fits the smallest iPhone (320 × 568).
- "Right!" is announced to screen readers.

Where the evidence lives and what to showcase: `notes/evidence-map.md`.

### My reflection
- What went well:
- What was hard:
- What I'd do differently:

*Questions to get started (Gibbs). They are prompts only; the answers are mine:*
- *Description:* What happened between this morning's grey Figma screens and tonight's coloured app, in my own words?
- *Feelings:* What did I expect when I first saw the app running, and what did I notice first?
- *Evaluation:* Which decisions today were mine and which came from the AI? How did I check what the AI made (tests, screenshots, my own eyes)?
- *Analysis:* Why did testers read the greyscale prototype as "an app"? What in the new brand answers that, and what hasn't been tested yet?
- *Analysis:* What caused the wrong-folder mix-up, and what does it teach me about giving an AI the right context?
- *Conclusion and action plan:* Which usability checks were new to me, and what will I do differently tomorrow (Figma reads, commits, testing on a real phone)?

---

## Tue 20 Oct 2026

### What we did
- **Jira corrected** (evening): SCRUM-29 (drag and drop still to do) and SCRUM-31 (city screens not built) back to In Progress, SCRUM-27 (not deployed) back to To Do, SCRUM-24 (test 1) to Done, SCRUM-74 (agent skill 1, to review) to In Progress. SCRUM-75 now points to `app/src/services/scoreStore.ts`.

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| On 19 Oct Claude marked SCRUM-28 to SCRUM-31 Done using a prototype in a different folder, not this repo | Checked each ticket against `app/` and reset the statuses; corrected Claude's comments on SCRUM-27 and SCRUM-29 |

### My reflection
- What went well:
- What was hard:
- What I'd do differently:
