# Learning-goal evidence map

> A living list. For each line of my learning goals (`learning goals2026P1.pdf`) it shows what proves it, where that lives, how to show it in about a minute, and what's still missing. Update it whenever a deliverable lands. It lists facts only; whether the evidence is enough is for me and the assessors to judge.

**Status:** Tue 27 Oct 2026 · deadline Fri 23 Oct (morning)

## Showcase list: the headline demos

1. **Before and after.** Show Mid-fi v3 screens A1 (welcome) and C2 (round) beside the coded `design/screens/01-welcome.png` and `design/screens/03-round.png`. Export the two Figma frames from the Figma app, which uses none of the connector's reads, into `design/before-after/`.
2. **Live on a phone.** Play one round, get one wrong to show "Not quite" with the Omrin page, then open the leaderboard.
3. **Tests running.** `npm test` (51 unit tests) and `npm run test:e2e` (browser tests on four phone sizes, 25 passing runs). Testing found real problems:
   - The app tests caught a timing bug: a fast tap answered the next item (fixed in `a8306e6`).
   - The screenshots showed that on the smallest iPhone, Play sat below the screen and the lives bar scrolled away. This was fixed in `ce0931d`, and a browser test now checks it.
4. **The commit history.** `git log --oneline main..feat/app-boilerplate` gives one small step per commit, a trace of how the app was built.
5. **Agent skill 1 live.** Run `check-rule-sources` on one item, then show its evidence in `research/rule-sources.md` and the result in `app/src/data/items.json`.
6. **A 5-minute MCP and agent skill demo for classmates** (SCRUM-72), following the storyline in `notes/work-log.md`:
   1. A Figma read leads to a design critique.
   2. A Jira comment.
   3. Publishing a private page.
   4. The agent skill.
7. **The brand book**, https://claude.ai/artifact/7V3DWDi2mxSp17hoHoyrcm. Its measured contrast ratios are usability evidence.
8. **`AI_USE_LOG.md`**, once I've filled in "What we did" and "What we learned". It shows fair use: what the AI did next to what I did.
9. **The work log's "Problems and how we solved them" tables**: raw material for Gibbs.

---

## Create

### Research and define requirements
- **Evidence now:**
  - The review scraper (`scraper.js`, tests in `scraper.test.js`) collected 1,462 App Store reviews of 7 waste apps, with no reviewer names.
  - 15 Omrin items, each with a quote, page and check date (`research/rule-sources.md`, `app/src/data/items.json`).
  - Test 1 grouped into five themes (`research/test-1-findings.md`).
- **Show it:** one item's journey: the quote in Omrin's guide → `research/rule-sources.md` → its "why" line in the game.
- **Still missing:**
  - The residents' survey analysis.
  - The review findings written up in `research/` (now only in my local notes).
  - A finding → decision trace table.
- **Jira:** SCRUM-68, SCRUM-69

### Prototype in Figma, then turn the tested design into components
- **Evidence now:**
  - Mid-fi v3 (15 screens), tested in test 1.
  - The design critique and its 10 changes (`notes/plans/2026-10-19-design-brand-boilerplate.md`).
  - Five coded screens (`app/src/features/`, screenshots in `design/screens/`).
- **Show it:** the before-and-after pair (showcase 1), then one change traced from a test 1 theme → critique finding → screen. For example, "didn't know what it was" → the "Your Move" welcome → a welcome that says what the game is.
- **Still missing:** the before-and-after export.
- **Jira:** SCRUM-26

### Architecture diagrams
- **Evidence now:** both diagrams, drawn by me in Mermaid (`design/architecture/`, `3e35ea1`): the application (flowchart) and answer submission → storage → database (sequence diagram). The database was built from them.
- **Show it:** open them on GitHub, then follow one answer from the tap to `public.answers` in the SQL file.
- **Still missing:**
  - Updates where the build differs: no Players table; the counts are worked out when asked; the items are also in the database; after a wrong answer the game asks for that item's counts, not the leaderboard.
  - PNG or SVG exports for the portfolio.
- **Jira:** SCRUM-75

### Frontend
- **Evidence now:**
  - Gameplay screen redesigned after my design review (26–27 Oct; plan `notes/plans/2026-10-26-gameplay-ui.md`, evidence `design/gameplay-ui/`): bins drawn as wheelie bins whose lid opens under the dragged item; bins in the middle and the item at the bottom on upright screens (item → bins 323 → 272px on a 390 × 844 phone); a one-row status bar with the lives on top of the bins (two placements compared); feedback at the bins (tick, cross) with the explanation in the tray instead of a sheet over the bins; the whole tray as drag handle; calmer motion. Six commits on `feat/gameplay-ui`, each with tests written first and before/after screenshots at six sizes.
  - Responsive from 320px phones to 1440px desktops (24 Oct): the round goes side by side on desktops and on phones held sideways; browser tests check the fit at 320, 667×375, 768 and 1440 (`design/ui102/`).
  - Drag and drop made forgiving and clearer (25 Oct): judged by where the item is, near misses count, the item shrinks while dragging (the bins lifting was removed on 26 Oct), sorted items fly into their bin; keys 1–6 on laptops. Tested on four phones, including repeated runs.
  - Touch drag and drop (21 Oct): drag the item onto a bin, and the bin under the finger lights up. Tapping still works. The drop check is two plain functions with 5 tests (`app/src/features/round/dropTarget.ts`).
  - Tap-to-sort, scoring with streaks, 3 lives, a leaderboard on local data, and explanations with sources.
  - How to play can be opened again (27 Oct, heuristic evaluation F7; plan `notes/plans/2026-10-27-how-to-play-again.md`): a link on the start screen, and a "?" in the round's top bar that opens the rules as a sheet while the round waits. Found from my iPad report; screenshots in `design/gameplay-ui/after/7-how-to-play/`.
  - 85 unit tests, and browser tests on four phone profiles (98 passing runs on 27 Oct), including dragging onto a bin, dropping outside the bins, the layout at six sizes, the feedback at three and the rules sheet at two.
  - The game rules are plain, tested functions (`app/src/domain/game.ts`).
- **Show it:** showcases 2 and 3, then walk through `roundReducer` in `app/src/domain/game.ts`: what happens on a right answer, a wrong answer and "continue". For drag and drop, explain `targetAt` in `dropTarget.ts` (how a drop becomes the same answer as a tap).
- **Still missing:**
  - Round-end motion.
  - A check on a real phone, with a note of which phone.
- **Jira:** SCRUM-32

### Backend and database (Supabase)
- **Evidence now:**
  - A Supabase project in Frankfurt (EU), 24 Oct.
  - My SQL, `supabase/migrations/001_tables_and_permissions.sql`: the `items`, `answers` and `scores` tables with checks (real items and bins only, generated nicknames only, possible scores only); browsers' rights taken away, then insert on answers and insert and select on scores given back; row level security; the counts `item_stat` and `most_missed`.
  - The database decides right or wrong: the counts compare each answer with the `items` table, which `npm run db:apply` copies from `items.json` and checks.
  - No N+1 queries: a whole visit is 14 database calls, guarded by a unit test (25 Oct).
  - 16 permission tests pass against the live project (`npm run db:test`, `supabase/tests/permissions.sql`). They prove browsers can't read individual answers or change or delete anything, and they undo their own rows.
- **Show it:** run `npm run db:test` live, then walk through one grant, one policy and `item_stat` in the SQL file.
- **Still missing:** the game connected to the database (the Supabase score store), and the privacy line (SCRUM-54).
- **Jira:** SCRUM-51, SCRUM-52, SCRUM-53, SCRUM-54

### Integrate, test, deploy
- **Evidence now:**
  - **Public link (25 Oct):** https://which-bin-leeuwarden.vercel.app, on Vercel, saving to Supabase.
  - The game saves to Supabase (25 Oct): a real round's answers and score arrived; the database works out right and wrong; through the live API, reading answers is refused and reading the leaderboard is allowed.
  - CI on GitHub Actions (`.github/workflows/ci.yml`, `docs/ci.md`): every push to `main` and every pull request runs the root tests, the app's lint, type check, unit tests and build, and the 16 database permission tests on a throwaway Postgres. Checked locally; not yet run on GitHub.
- **Still missing:** the frontend connected to Supabase, tests of submissions, scores and permissions, and a public link (Cloudflare Pages).
- **Jira:** SCRUM-27

### Three test iterations with international students
- **Evidence now:** test 1 → MoSCoW change list → changes in the code. Test 2 questions drafted (`research/test-1-findings.md`). A framing of test 1's open question (what is it for, beyond one round?) with extra test-2 probes: a pair of housemates on one phone, a paper sketch of a "your mistakes join the city's list" end card, and "where do you live, and who deals with the bins?" (`research/framing/2026-10-27-what-is-which-bin.md`; hypotheses, not findings).
- **Still missing:**
  - Test 2 on the coded app.
  - Test 3.
  - For each test, what changed because of it.
- **Jira:** SCRUM-24, SCRUM-33, SCRUM-55

---

## Learn

### Map PayNow skills, find gaps, prioritise (MoSCoW + timeboxes)
- **Evidence now:**
  - The stack choice in `notes/work-log.md` (the PayNow stack minus what Which Bin doesn't need).
  - MoSCoW used on the test 1 changes.
  - The usability checks applied on 19 Oct (listed in the work log).
- **Still missing:** the skills map itself: PayNow skill → where it shows up in Which Bin → the gap → priority and timebox.
- **Jira:** SCRUM-70, SCRUM-39, SCRUM-40

### Apply and evaluate AI workflows (fair-use guide, two agent skills)
- **Evidence now:**
  - Agent skill 1 (`.claude/skills/check-rule-sources/`) and its first run.
  - The MCP connectors used on 19 Oct (Figma, Atlassian, Artifact), recorded in `notes/work-log.md`.
  - `AI_USE_LOG.md`, one row per AI-made deliverable.
  - A global agent skill, `design-critic` (26 Oct, outside this repo in `~/.claude/skills/design-critic/`): a UI/UX critic for any project, used on the gameplay redesign; includes an audit script that was checked on a page with planted problems.
  - A global suite of six frame-creation skills (27 Oct, outside this repo in `~/.claude/skills/`; plan `notes/plans/2026-10-27-frame-skills.md`), adapted from Kees Dorst, *Frame Innovation*: `frame-creation` (the hub), `problem-archaeology`, `theme-finder`, `frame-lab`, `frame-to-action`, `design-discourse`. First real run on Which Bin: `research/framing/2026-10-27-what-is-which-bin.md`, recorded in `design/discourse.md`. The run led to three fixes in the skills. Claude wrote and ran them, so this is a first check, not an independent evaluation.
- **Still missing:**
  - Agent skill 2 (test notes → changes log).
  - The one-page fair-use guide.
  - My columns in `AI_USE_LOG.md`.
  - A decision on sharing `AI_USE_LOG.md`: it is git-ignored for now, so un-ignore or export it before the portfolio.
  - The 60-quote check from 19 Oct was a one-off script; it needs saving into the skill to be demoed.
- **Jira:** SCRUM-74, SCRUM-71, SCRUM-57

### Explain the work, Gibbs reflections, usability teachers' feedback
- **Evidence now:**
  - A heuristic evaluation of all six screens against Nielsen's 10 heuristics (25 Oct, Claude as one evaluator): 13 findings with severities and fixes, plus what works (`research/heuristic-evaluation/`). All 5 major and minor findings fixed the same evening, each with a test and a screenshot (`fixes/`). My own pass is still to do.
  - Small commits I can walk through one by one, plus the work log's facts and problems tables as raw material.
  - The UI 102 lesson applied to Which Bin (24 Oct): type scale, spacing system, grids per screen size, hierarchy and affordances, with before and after screenshots of the same screens in `design/ui102/` (labelled comparisons in `compare/`).
- **Still missing:**
  - My Gibbs reflections.
  - Feedback from the usability teachers, including the UI 102 exercise.
  - A session explaining the code, database and architecture to peers.
- **Jira:** SCRUM-42, SCRUM-56, SCRUM-41, SCRUM-67, SCRUM-59

### Ikigai and sharing the workflow
- **Evidence now:** the MCP storyline in the work log (for the demo).
- **Still missing:**
  - My Ikigai reflection (coding, full-stack skills, the educational need, a product for schools or with Omrin).
  - The one-page workflow guide.
  - The demo given to classmates.
- **Jira:** SCRUM-76, SCRUM-72
