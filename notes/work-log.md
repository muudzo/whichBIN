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

---

## Wed 21 Oct 2026

### What we did
- **Final-push plan agreed** (evening): what fits before Friday morning, by day with Jira keys, and what to drop. Saved as `notes/plans/2026-10-21-final-push.md`, git-ignored on request (`501ca30`).
- **Drag and drop, step 1** (SCRUM-29): the "which bin is under the finger?" check as two plain functions, `targetAt` and `measureTargets` (`app/src/features/round/dropTarget.ts`), with 5 tests written first (`a280644`). 51 unit tests pass.
- **How-to guide** for finishing the goals while learning: `notes/how-to-learn-while-building.md` (git-ignored on request, `bb4c251`).
- **Drag and drop, step 2** (SCRUM-29, now Done): the item sticker can be dragged onto a bin; the bin under the finger grows and gets an outline; a drop on a bin counts exactly like a tap; dropped anywhere else, the item springs back without answering. Tapping still works. The hint texts now say "drag or tap" (`7bf71da`). Two browser tests written first (drag onto the right bin; drop outside the bins) pass on all four phone sizes. Screen captures refreshed (`e293479`); `notes/evidence-map.md` updated.

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| No commits or logged progress on Tue 20 and most of Wed 21, two days before the deadline | Cut the plan to what Friday can't do without; dropped the UI 102 exercise, city screens, mid-fi v2, validation sessions and the classmate demo |
| Deploying to Cloudflare Pages needs a login only the student can do | Asked the student to run `npx wrangler login`; drag and drop started in the meantime |
| The drag library reports the finger's position on the page, but the bins' positions are measured on the screen | Converted the page position to a screen position (subtract the scroll) before checking which bin is under the finger |
| The bins were drawn after the item, so a dragged item would slide under them | The item gets a higher layer while it's dragged (`zIndex` in `whileDrag`) |
| SCRUM-29's description also asks for rounds that get faster, which this app doesn't have | Not in the learning goals PDF, so left out; noted on the ticket |

### My reflection
- What went well:
- What was hard:
- What I'd do differently:

---

## Sat 24 Oct 2026

### What we did
- **Architecture diagrams set up in Mermaid** (SCRUM-75): starter files in `design/architecture/`. `README.md` explains how to preview, export and write the syntax; `1-application.md` (flowchart) and `2-answer-submission.md` (sequence diagram) each have drawing notes and an empty diagram. The diagrams themselves are still to draw.
- **Architecture diagrams drawn** by me and committed (`3e35ea1`).
- **Supabase plan agreed** (SCRUM-51): `notes/plans/2026-10-24-supabase.md`. I write the SQL with a quick lesson; the counts are worked out when asked; the database decides right or wrong from an `items` table; the Players table and city requests are dropped.
- **Database groundwork** (Claude): the lesson and specification in `supabase/README.md`; 16 tests of what browsers may and may not do (`supabase/tests/permissions.sql`), written before the SQL; `npm run db:apply`, `db:test` and `db:reset` (`supabase/db.js`, 5 tests). The tests were checked against a throwaway local database: they pass on a correct schema, leave no rows, and catch a missing `revoke` with a hint.
- **Supabase project connected** (SCRUM-51): project in Frankfurt (EU), with row level security switched on automatically for new tables. The session-pooler connection string is in `supabase/.env` (git-ignored); `npm run db:test` reached the project.
- **I wrote the database SQL** (SCRUM-51): `supabase/migrations/001_tables_and_permissions.sql`: the `items`, `answers` and `scores` tables with their checks; all rights taken from browsers, then insert on `answers` and insert and select on `scores` given back; row level security with three policies; `item_stat` and `most_missed` as `security definer` functions with an empty `search_path`. `npm run db:apply` applied it and copied the 15 items; **all 16 permission tests passed** against the live project; applying again changed nothing. Checks afterwards: root tests 30 passed, app build passed, 51 unit tests passed, 25 browser runs passed (3 skipped by design: the screen captures run on one phone only).
- **The game can use the database** (Claude, SCRUM-52, SCRUM-53): `app/src/services/supabaseScoreStore.ts` has the same 5 methods as the local store and sends no right/wrong and no time (the database decides both). Replies are checked with zod, and every request has an 8-second deadline. 9 tests with a fake network, written first. `chooseScoreStore.ts` (2 tests) picks Supabase when `app/.env.local` has the URL and publishable key, and the local store otherwise. The browser tests always run on the local store (`playwright.config.ts`), checked with a fake settings file. Results: type check clean, 62 unit tests, 25 browser runs, build passed (JavaScript 249 kB gzipped, was 193 kB).
- **CI on GitHub Actions** (Claude, on request): `.github/workflows/ci.yml` checks every push to `main` and every pull request; validation only, nothing deploys. Three jobs: root tests; app lint, type check, unit tests and build; database permission tests on a throwaway Postgres 17 (the Supabase project's version) with Supabase's browser roles added by `supabase/tests/ci-setup.sql`. No secrets; a guard step stops the database job if it points anywhere but the throwaway database. How it works and how to fix failures: `docs/ci.md`. Checked locally on a clean copy without installs or secret files: all three jobs' steps pass (30 root tests; lint, type check, 62 unit tests, build; 16 database tests on a fresh Postgres, no rows left behind). Not yet run on GitHub.
- **UI 102 applied to Which Bin** (Claude, on request; plan `notes/plans/2026-10-24-ui102-responsive.md`; SCRUM-41, SCRUM-67): re-read the lecture and audited the game at six sizes (320 to 1440 wide), then made five changes. (1) One type scale of six steps in `app/src/styles/tokens.css`. (2) One spacing system from the lecture (4, 8, 16, 24, 32, 48), written into the tokens. (3) A grid per screen size: the round screen side by side on desktops and on phones held sideways; a 576px column on tablets; full-width stripe band; the "Not quite" sheet a centred card on wide screens. (4) Hierarchy and affordances: a bigger item, a quieter hint, hover lift and a solid focus ring on bins and buttons; no new colours. (5) Four new browser tests and two new captures. Before and after screenshots of the same screens and items, with labelled comparisons: `design/ui102/` (see its README). Results: type check clean, 64 unit tests, 42 browser runs.
- **Demo prepared** (Claude, on request): script and weekend checklist for the demo on Mon 26 Oct in `notes/demo/2026-10-26-demo-script.md`. Gaps to fill: test 1's date, testers and method; test 2 if run.

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| The root `npm test` also ran the app's TypeScript tests, which only work in Vite (10 failures) | Limited it to `scraper.test.js` and `supabase/db.test.js`; 30 pass |
| Supabase gives browsers every right on a new table by default | The lesson starts each table by taking all rights away (`revoke`), and test 3 fails with a hint if that's missing |
| `password authentication failed` on the first connection | The `[YOUR-PASSWORD]` placeholder, and then its brackets, were still in `supabase/.env`; replaced it with the password alone |
| The deadline test hung: the Supabase client retries a failed read 3 times (1, 2, then 4 seconds apart), and a deadline set inside the network call looked like a network error to it | The deadline is now given to each request (`abortSignal`), so the client stops retrying when it passes |
| A settings file in `app/` would have made the browser tests save test answers in the real database | Blank Supabase settings in `playwright.config.ts` win over `app/.env.local`; a build with a fake settings file confirmed it |
| CI must not touch the real database or need its password | The database job starts its own Postgres, adds the Supabase roles itself, and a guard step refuses any other `DATABASE_URL` (checked with a CI address, a Supabase address and an empty one) |
| On a phone held sideways the round screen was 536px tall on a 375px screen | Side-by-side layout for phones held sideways (`landscape-phone:` variant); a browser test now checks it fits |
| The phone-height rules (`tall:`) beat the tablet and desktop sizes (`md:`, `lg:`), so the item stayed 160px on big screens | Measured it in the browser, then limited the height rules to phone widths (`max-md:tall:`) |
| The class-merging helper took the new `text-heading` for a colour and dropped it, so "Not quite" shrank to 16px | Registered the six sizes in `app/src/lib/utils.ts`, with a test; the shadcn button and drawer now use that helper instead of the package directly |
| On a phone held sideways, Got it was cut off for items with long explanations | A more compact sheet in landscape, checked with the three longest explanations; on the smallest phone it scrolls as a fallback |
| VS Code's built-in preview doesn't draw Mermaid, and the `code` command isn't available in the terminal to install the extension | Install "Markdown Preview Mermaid Support" from the Extensions panel; mermaid.live works without installing anything |

### My reflection
- What went well:
- What was hard:
- What I'd do differently:

---

## Sun 25 Oct 2026

### What we did
- **Merged `feat/app-boilerplate` into `main`** (on request): a fast-forward of 31 commits up to `3754585`, so no merge conflicts and no merge commit. First checked the commits for secret files (none) and ran every check on the committed code: 30 root tests, type check, lint, 64 unit tests, build, 40 browser runs. Not yet pushed to GitHub's `main`.
- **Installed a third-party agent skill,** `brag-slim` (github.com/latent-spaces/brag, MIT), for Claude Code in this project: it turns a project into a ~20-second launch video. Its one file was read in full before installing; the installer's scans said Safe (Gen), 0 alerts (Socket), Med Risk (Snyk). Git-ignored with its `skills-lock.json`, as a file given to Claude.
- **The game is connected to Supabase** (SCRUM-52 Done, SCRUM-53 In Progress): `app/.env.local` created (git-ignored) with the project URL; I added the publishable key. One real round saved 6 answers under one session id; the database worked out 3 right and 3 wrong; the score (Lucky Tulip 72, 300 points, 3/10) is on the shared leaderboard. Through the live API, reading answers is refused (401) and reading the leaderboard is allowed. The "x of y other players" line waits for a second visit.
- **Community line seen live** (SCRUM-53 Done): a second visit got batteries and jam jar wrong after the first, so its sheet showed "1 of 1 other player got this wrong too".
- **Privacy line** (SCRUM-54, Claude): the welcome screen says "Answers are saved anonymously, to show which items people get wrong", only when answers go to the shared database. 2 tests written first; still fits on the smallest iPhone.
- **Database calls checked for N+1** (Claude; plan `notes/plans/2026-10-25-requests-drag-vercel.md`): none. A whole visit is 14 calls (10 answers, 1 count per wrong answer, 1 score, 2 for the leaderboard); each database function is one query. A new unit test fails if that number grows. Found: `answers` has no index on `item_id` (every count is a full scan; fine now, slow at scale): a one-line migration `002` for me to write. Not fixed: no rate limit on inserts.
- **Drag and drop made forgiving and clearer** (Claude): the drop is judged by where the sticker is, not the finger; drops up to 24px from a bin (including the gaps) count for the nearest bin (`nearestTarget`, 4 tests first); while dragged the sticker shrinks to about 80px on every device, its name fades and all bins lift; a sorted item flies into its bin (after a wrong answer, "Got it" sends it into the right one); bins are measured once per drag. Also: a one-time wiggle and bold hint on the first item; keys 1–6 pick bins on laptops (labels only with a mouse or trackpad, 1 test); a small vibration on drop on Android. 72 unit tests, 46 browser runs, drag tests repeated 36 times on four phones.
- **Heuristic evaluation** (Claude, one evaluator, at my request; SCRUM-25): template `research/heuristic-evaluation/template.md`; results `research/heuristic-evaluation/2026-10-25-evaluator-claude.md`. 13 findings: severity 3: the phone's Back button leaves the game; severity 2: no way to leave a round, running out of lives isn't explained, no retry when the leaderboard fails, leaderboard only reachable by saving; 8 cosmetic. Plus what works, per heuristic. My own independent pass still to do.
- **Major and minor heuristic findings fixed** (Claude, on request; plan `notes/plans/2026-10-25-heuristic-fixes.md`): F1 the phone's Back button returns to the start and asks first during a round; F2 a "Leave round" button with a "Leave this round?" sheet (Keep playing is the main button, answering paused while it's open); F3 "Out of lives" on the score screen; F4 "Try again" on a failed leaderboard; F5 "See the leaderboard" on the welcome and score screens. 8 tests first (7 app, 1 leaderboard) plus a browser test with a real Back. 80 unit tests, 50 browser runs. Screenshots in `research/heuristic-evaluation/fixes/`.
- **Merged into `main` and pushed** (on request): GitHub's `main` went from `08094bc` to `8a16bb8` as a fast-forward, after root tests (30), type check, lint and unit tests (80) passed on the committed code. CI's first run (40219350699) didn't start: GitHub says the account is locked because of a billing issue. No job ran, so it says nothing about the code.
- **Launch video** (Claude, with the `/brag-slim` skill): a 20-second 1080p video with its own soundtrack, built from the game's real components and item texts, for the demo (`brag-output/`, git-ignored): hook "Broken wine glass. Which bin?", the wrong answer with Omrin's source, the welcome screen, a right answer flying into the Glasbak, the leaderboard (made-up names), outro. No link shown, because the public link isn't live yet.
- **Launch video v2, the demo opener** (Claude, `/brag-slim` re-roll, on request: v1 felt dull, and VS Code's preview played it without sound): `brag-output-2026-10-25-195033/brag.mp4` (git-ignored). A quick quiz with a 3·2·1 countdown (broken wine glass: Glasbak or Sortibak?), "It gets weirder" rapid fire (jam jar, used pizza box, batteries), the real game (welcome, drag onto the Papierbak, "Not quite" with Omrin's page highlighted), and the live link as the last scene. A new 120 BPM soundtrack: ticking tension, toms on the countdown, a drop on the reveal, sidechained bass. The sound plays in QuickTime or a browser; VS Code's preview doesn't play AAC audio.
- **QR code in the opener** (on request): installed `qrcode` 1.5.4 (MIT) only in the video's work folder, not the app. The last scene now has a big "Scan to play" QR code for https://which-bin-leeuwarden.vercel.app; macOS's own QR reader decoded it from the final compressed video at 16.6, 18.0 and 19.5 s. A standalone `qr-which-bin.png` sits in the same folder for the demo slides.
- **Live on Vercel** (SCRUM-27): I deployed from the command line as project `which-bin-leeuwarden` (root `app/`, the two Supabase settings in Production): https://which-bin-leeuwarden.vercel.app. Claude checked it: the live build contains the project address and the exact publishable key and no secret key; on a phone-sized browser the privacy line shows, and the leaderboard reads the real scores and most-missed items from Supabase, with no errors. Checked read-only, so no test answers were saved. `whichbin.vercel.app` and `which-bin.vercel.app` are other people's sites.

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| CI's first run on GitHub failed in 4 seconds | Not the code: "The job was not started because your account is locked due to a billing issue." Needs fixing in my GitHub billing settings, then re-run |
| The new number keys would still answer the item behind the "Leave this round?" sheet | Found while reviewing the fix: the round is paused while the sheet is open, with a test |
| The welcome screen's new leaderboard link pushed the privacy line below the fold on 375 × 667 and 390 × 664 phones | Smaller hero stickers on mid-height phones; measured to fit at five sizes |
| Shrinking the dragged sticker toward the grab point sent it up to 110px away from the finger when it was grabbed during its entrance animation (WebKit) | Measured it mid-drag; it now shrinks around its centre, and the drop is judged by the sticker's centre |
| On a near miss, the drop position was read after the spring back home had started, so it could tip into the neighbouring bin | The drop uses the last position seen during the drag |
| The new near-miss browser test failed now and then: an exact tie in an 8px gap, then a middle bin read as a left one by a fraction of a pixel | Drops just outside the bin's outer edge; the middle column is recognised within half a bin; gap rules stay in the unit tests |
| Repeated browser runs with 4 workers timed out while opening the page (WebKit overloaded) | Not a game bug: no failure after the page loaded. With 2 workers, 60 of 60 and 36 of 36 passed |
| One unit-test run failed once without a name in the output | Not reproduced in 13 further runs; noted |
| Deploying: Cloudflare's tool created a Workers project instead of a Pages one, and without asking added two packages, rewired `vite.config.ts` and changed the `preview` script the browser tests and CI depend on | Undid its four file changes and removed its config; type check, 66 unit tests and 40 browser runs pass again. Hosting choice (Cloudflare or Vercel) back to me |

### My reflection
- What went well:
- What was hard:
- What I'd do differently:

---

## Mon 26 Oct 2026

### What we did
- **Feedback from my design review on the gameplay screen:** plan of six steps agreed, `notes/plans/2026-10-26-gameplay-ui.md`. Decided: after a wrong answer the explanation goes in the tray so the bins stay visible; the tray holds only the current item; where the lives go is to be tried out, keeping the bottom uncrowded on small phones. New branch `feat/gameplay-ui`.
- **Review of the round screen** (Claude): screenshots and measurements at six sizes, from 320 × 568 to 1440 × 900, in `design/gameplay-ui/before/` and its README. Gap between item and bins 4–165px; item-to-bins drags 189–506px; lives at the top of a three-row status bar; the "Right!" explanation cut off at 320px wide; a phone held sideways scrolls by 5px.
- **Step 1, bins that look like bins** (Claude): `app/src/features/round/BinShape.tsx` draws a wheelie bin behind each bin's label (a lid wider than the body, a body narrowing towards the bottom, two wheels); "Not a bin" is a dashed outline instead. While an item is dragged over a bin, its lid tilts open; the other bins stay still (the "all bins lift" effect and the `isDragging` state removed). New tokens `--drop-shadow-sticker` and `--drop-shadow-sticker-sm`. Browser test written first: during a drag, only the bin under the item opens. 80 unit tests and 54 browser runs passed. Screenshots in `design/gameplay-ui/after/1-bins/`, before and after in `design/gameplay-ui/compare/`.
- **Step 1 committed** after my review: `a57cd72` (plan and before screenshots), `0db109b` (the bins).
- **Step 2, bins in the middle and the item at the bottom** (Claude): the round screen is one CSS grid with named areas (`round-layout` in `app/src/styles/global.css`): upright, the status bar, feedback, bins and the item's tray from top to bottom; side by side on sideways phones and desktops (new `side-by-side:` variant). The bins grow into the free height up to a limit; the free height is shared 2 : 1 between bins and tray, so the item stays right under the bins. Item centre → bins centre: 323 → 272px at 390 × 844, 412 → 328px on a tablet; the sideways phone no longer scrolls. In the code the item still comes before the bins, the order a screen reader reads them in. Browser test written first: at six sizes, at the start and after "Right!", nothing scrolls or overlaps and the item sits below the bins on upright screens. 80 unit tests and 70 browser runs passed; the layout test 96 of 96 times when repeated. Screenshots in `design/gameplay-ui/after/2-layout/`, measurements in its README.

- **Global agent skill `design-critic`** (Claude, at my request; outside this repo, in `~/.claude/skills/design-critic/`): a reusable UI/UX critic for any project (`/design-critic`, also triggered automatically during UI work). It reviews before major changes, challenges weak decisions, checks the rendered interface at several screen sizes, and reports what still needs work, using Nielsen, Gestalt, Fitts and WCAG where they help. Includes `references/principles.md`, `references/verification.md` and `scripts/audit.mjs`, which screenshots a page at seven sizes and flags sideways scroll, small or overlapping targets, unnamed controls, small text, likely low contrast and images without alt. The script was checked on a page with planted problems (every check fired) and on a Which Bin round (no findings).
- **Step 2 committed** after my yes (`3c7eb4a`); steps 3–6 to be committed one by one once their tests pass (my answer, 26 Oct).
- **Step 3, a one-row status bar and the lives on top of the bins** (Claude): `Hud.tsx` is now one row (leave, progress with "Item n of 10", score), 85 → 32px tall; the hearts and the streak moved to a new `Lives.tsx`, placed right on top of the bins and moving with them. Two places were tried with screenshots: on top of the bins, or beside the item (`design/gameplay-ui/compare/3-lives-options-A-above-bins-B-beside-item.jpg`); beside the item crowded the bottom of the smallest phone, so on top of the bins was kept. The layout test now also checks, at six sizes, that the status bar is one row and the lives sit 0–16px above the bins (it failed on step 2's code, then passed). 80 unit tests, 70 browser runs passed.

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| The bins' labels ran past the narrowing body: "clothes, on the" by 1px at 375px wide, and 2px from the bottom edge at 320px | Measured each label against the drawn body; more side padding from 360px wide, less on the narrowest phones so "Textielbak" fits; 2px less above the icon, so the bins didn't get taller |
| The first item of the seeded round goes in "Not a bin", which has no lid, so the drag screenshot couldn't show a lid opening | The capture hovers over the Papierbak first, then drops on the right bin; the before set was re-taken the same way from commit `8a16bb8` |
| Running all browser tests rewrites the captures in `design/screens/` | Restored them; they'll be refreshed once at the end of the plan |
| The grid's base rules were missing from the built CSS, so the round stayed one long column | The `side-by-side` variant was written on one line with a comma for "or"; Tailwind doesn't read it that way. Rewritten in its long form with one `@slot` per case, then checked in an unminified build |
| At 375 × 667 the page scrolled by 14px once "Right!" appeared | The screen had only a minimum height, so the grid worked the 2 : 1 split out from the content (bins row = 2 × the tray). With `h-dvh` it shares out the screen's height instead |
| At 320 × 568 the layout test failed now and then: item and bins overlapping | The item's box grows while it turns in (up to 11°) and during the first-item wiggle; less screen padding on short phones (16 → 8px) gives it room, and the test measures with reduced motion so it checks the layout at rest |
| With only the word "Item" hidden from sight ("2 of 10" on screen), 5 unit tests no longer found "Item 2 of 10" | Showed "Item 2 of 10" in full: "2 of 10" next to the score could be read as a score, and the progress bar still has 93px or more at 320px wide |
| On tall phones the lives drifted away from the bins (the spare height opened up between them) | The lives moved inside the bins' area, so they always sit right on top of the bins |

### My reflection
- What went well:
- What was hard:
- What I'd do differently:

---

## Tue 27 Oct 2026

### What we did
- **Step 3 committed** (`8969bbb`).
- **Step 4, feedback next to the action** (Claude; plan `notes/plans/2026-10-26-gameplay-ui.md`): after a right answer the bin gets a tick for 1.2 s and the "Right!" card above the bins shows the whole explanation in one paragraph, never cut off. After a wrong answer the item flies straight into the right bin, which opens with a tick; the chosen bin gets a cross; the explanation (item → where it goes, why, community line, Omrin source, Got it) takes the item's place in the tray (`app/src/features/round/NotQuiteCard.tsx`), replacing the sheet that covered the bins (`NotQuiteSheet.tsx` removed). Focus moves to Got it, whose description is the explanation, so screen readers read it out and Enter continues. Tests written first: 2 new unit tests (both bins marked and Enter continues; the tick after a right answer) and a browser test at 320 × 568, 667 × 375 and 1440 × 900 that the card fits beside the bins with Got it on screen. 81 unit tests; 156 of 156 browser runs over two full passes. Screenshots in `design/gameplay-ui/after/4-feedback/`.

- **Step 4 committed** (`8895408`).
- **CI checked** (my question): none of the gameplay commits have been through CI. The branch `feat/gameplay-ui` hasn't been pushed; `ci.yml` runs on pushes to `main` and on pull requests only; its one run on GitHub (25 Oct, `40219350699`) didn't start because of the billing lock; it doesn't run the browser tests; and deploying to Vercel is still done by hand.
- **Step 5, easier dragging and a first-time cue** (Claude): the whole tray is the handle (`useDragControls` with `snapToCursor` in `RoundScreen.tsx`): pressed anywhere in it, the item jumps under the finger, and a tap without a drag springs it back. While dragged the item shrinks to about 64px (was 80px) and gets a deeper shadow. The instruction moved from above the bins to under the first item, and shows until the first answer ("tap" on touch screens, "click" with a mouse). Tests written first: a unit test for the hint, and browser tests for grabbing the tray beside the item and for the 64px size. 82 unit tests, 86 browser runs passed; drag tests 48 of 48 when repeated.

- **Step 5 committed** (`e3e2465`).
- **Step 6, calmer motion** (Claude): a new item comes in straight instead of spinning in from −8°, lands without a wobble (spring damping 22 → 32) and no longer grows under the mouse; on hover it shows the lifted shadow instead. Kept: the fly into the bin, the lid opening, the tick and cross, and the first item's one wiggle. Browser test written first, recording the item's rotation on every frame: 8–15 tilted frames on the old code, 0 now. 82 unit tests, 90 browser runs passed.

- **Preview link for a tester** (Claude, on request; I chose a preview over updating the live link): `vercel deploy` from `app/` → https://which-bin-leeuwarden-8o9iw5wlc-muudzos-projects.vercel.app (commit `eec713f`, status Ready). The live link still serves the 25 Oct version. The preview has no Supabase settings (they're set for Production only), so it plays on the local store and saves nothing. Vercel's Deployment Protection puts previews behind a Vercel login, so the tester needs a share link from the deployment page, or the protection switched off for previews.
- **Frame-creation skills** (Claude; plan `notes/plans/2026-10-27-frame-skills.md`): six global skills adapted from Kees Dorst, *Frame Innovation*, in `~/.claude/skills/` (outside this repo):
  - `frame-creation`, the hub;
  - `problem-archaeology`;
  - `theme-finder`;
  - `frame-lab`;
  - `frame-to-action`;
  - `design-discourse`.

  `design-critic` now suggests `frame-creation` when the brief itself looks like the wrong problem.
- **Test run on Which Bin** (Claude): a quick pass on "what is Which Bin for?", from repo evidence only: `research/framing/2026-10-27-what-is-which-bin.md`.
  - **Readiness, split:** "app or game" may be fidelity (test 1 used a static Figma prototype; test 2 will show); "what is it for beyond one round" is a framing question.
  - **Core paradox:** more game (test 1 notes 5–6) against more effect on disposal (note 7).
  - **Frames:** three themes, ten frames scored, and futures for four.
  - **Recommendation, for me to decide:** no rebuild before test 2. Instead, probe "the house plays, the city listens" in test 2 with one pair session and a paper sketch.
  - **Records:** frames, themes and a method card in `design/discourse.md`.
- **"The iPad has no rules page"** (my report). Claude checked it at four iPad sizes in Safari's and Chrome's engines, locally and on the live link: How to play does show. But Play shows it only before a visit's first round (`hasSeenHowTo` in `app/src/app/App.tsx`), and nothing opened it again (heuristic evaluation F7). Plan `notes/plans/2026-10-27-how-to-play-again.md`; I chose fixes 1 and 2.
- **Fix 1, How to play on the start screen** (Claude): a "How to play" link beside "See the leaderboard" (`WelcomeScreen.tsx`). Tests written first and confirmed failing: a unit test that it opens How to play after a round has been started, and a browser test that Play and both links are on screen at every phone size without overlapping. Browser tests now press Play by its exact name, since "How to play" also contains "play".
- **Fix 2, "?" in the round's top bar** (Claude): it opens the three rules as a sheet over the round (`app/src/features/how-to/HowToSheet.tsx`). The round waits, Back to the round returns to the same item, and the phone's Back button closes the sheet instead of asking to leave. The three rules moved into one component (`HowToSteps.tsx`), shared by the screen and the sheet. Tests written first and confirmed failing:
  - two unit tests: the round waits and goes on with the same item; Back closes the sheet;
  - a browser test at 320 × 568 and 667 × 375: the progress bar keeps at least 32px, and all three rules and the button are in sight.

  85 unit tests and 98 browser runs passed; the new browser tests 60 of 60 when repeated. Screenshots in `design/gameplay-ui/after/7-how-to-play/`.
- **Merged** `feat/gameplay-ui` into `main` myself (PR #1, `f719e8a`).
- **Design review of the top of the round** (Claude, `design-critic` skill, at my request: "the blank space we filled with hearts looks weird"), measured at nine sizes in three states:
  - **The band:** an empty band of 82–182px sat between the top bar and the hearts. The bins stopped growing at a fixed height, and the rest collected above them, waiting for the "Right!" card.
  - **Scrolling:** "Not quite" scrolled the page on 320 and 375px phones, hiding the top bar.
  - **My iPhone 11 Pro Max:** my screenshot showed Safari's floating address bar covering "Got it".

  Plan `notes/plans/2026-10-27-responsive-round.md`. I chose:
  - only "No account." on the start screen;
  - no source or date in the app;
  - the bins filling the screen.
- **Step 1, less text** (Claude):
  - **Start screen:** ends at "No account." "About 2 minutes" (the pill already says it), the anonymous-saving line (SCRUM-54) and the source line are gone.
  - **Sources:** no source line on How to play or on "Not quite" (`SourceLine.tsx` deleted, `sourceLabel` and `checkedLabel` removed from `catalog.ts`).
  - **How to play, rule 3:** now "Every wrong answer tells you why."
  - **Tests** written first and confirmed failing: 2 new unit tests, 1 changed.
- **Step 2, the round fills the screen** (Claude):
  - **Bins:** on upright screens they take all the free height (`round-layout` rows `auto auto 1fr auto` in `app/src/styles/global.css`), up to 2.4 times as tall as wide (the new `max-h-wheelie`, measured against the bins area's width with a container query).
  - **Spacing:** the feedback row takes no room when empty, and each area brings its own spacing instead of a grid row gap.
  - **Height:** the screens use `svh` (the height with the browser's bars shown) instead of `dvh`.
  - **Bin labels** sit near the top of each bin.
  - **Unchanged:** desktops and sideways phones keep their layout.
  - **New browser test,** written first and confirmed failing at 5 of 6 sizes: at six upright sizes, in the start, "Right!" and "Not quite" states, no empty band above the hearts (at most 28px), no scrolling, the top bar and "Got it" fully on screen.
  - **Results:** 85 unit tests and 122 browser runs passed; the new layout and sheet tests 132 of 132 when repeated; lint and build passed.
  - Screenshots and measurements in `design/gameplay-ui/after/8-fill-the-screen/`.
- **Handover to Codex:** `HANDOVER.md` and `.handover/`, both git-ignored.
- **Steps 1 and 2 committed** after my yes, on the new branch `feat/responsive-round`: `b252a99` (less text), `d3031a6` (the round fills the screen). Step 1 was checked on its own first (a copy of just its files: type check, lint, 85 unit tests and build passed); step 2 again before its commit (type check, 85 unit tests, build).

### Problems and how we solved them
| Problem | How we solved it |
|---|---|
| With the full "Right!" text, the smallest phone (320 × 568) was about 10px too short | First tried the item's name beside the sticker on short phones; that broke dragging (the drop follows the sticker's centre, so grabbing the name landed the item about 80px from the finger) and was reverted. Instead the verdict and the reason became one paragraph, which saves a line |
| On the smallest phone the item, resting at a 3° tilt, came within a few pixels of the bins under the longest "Right!" texts (the layout test failed now and then) | The item now rests straight; this part of step 6 (calmer motion) was brought forward |
| The opening lid of the right bin covered the hearts, just when a life was lost | The hearts are drawn above the bins, so the lid tucks behind them |
| Android's 2.625 pixel ratio measured fully visible bins at 0.9999999 of their size, failing "fully on screen" checks | One named tolerance in the browser tests (`FULLY = 0.99`, under 2px), with the reason in a comment |
| A wrong answer makes the bins move up about 30px on a 390 × 844 phone, because the card is taller than the item | Not solved; noted as still to do |
| Over a bin's centre, the dragged item (now about 64px) still covers the middle of the bin's name | Not solved in step 5; the lid, colour and icon still show the bin. A floating "→ Papierbak" label is the likely fix |
| The first version of the "no spin" test passed on the old code: by the time it looked, the spin had already settled | The page records the item's rotation on every animation frame from before the answer, so the test sees the whole entrance; it then failed on the old code and passed on the new |
| Test 1's notes have no date, tester count or attribution, so most of the framing's field and two of its three themes rest on assumptions | Every claim is marked evidence [E] or assumption [A]. The key assumptions became test-2 questions, and the gaps are listed at the end of the framing document |
| The skills only allowed "reframe" or "solve directly", but one half of the question looked like fidelity and the other like framing | Added a "split" verdict to `problem-archaeology` and the hub |
| The hub and each sub-skill had their own output template, so a full run could produce five files | The hub now says the sub-skills' outputs go into its one framing document; `theme-finder` now says to flag thin evidence at the top |
| With icons, the two start-screen links needed 371px in one row; a 375 × 667 phone has 343px and only 7px of height to spare, so a second row would push Play down | Underlined text links instead of icons (315px). On a 320px phone they wrap, which fits because that screen has 68px to spare (measured) |
| The new browser test found the rules sheet cutting off its own button: 7% on the 320 × 568 phone, all of it on the sideways phone, because the drawer is capped at 80% of the screen height | The rules scroll as a fallback, so the button always stays in sight. When sideways the sheet is wider with smaller text, so all three rules fit; the test now also checks that every rule is fully in sight |
| The empty band above the bins was the space kept free for the "Right!" card, so taking it away means either the bins move or the bins change size when a card appears | I chose "bins fill the screen": the bins get shorter while a card shows. A grid row gap would still have left space around the empty feedback row, so each area now brings its own spacing |
| Bins that fill the height of a tall screen got up to 2.4 times as tall as wide, and their centred labels floated in a lot of colour | Labels moved near the top of each bin, like the sticker on a real bin. With Safari's bars showing on my iPhone 11 Pro Max (414 × 715) the bins come out about 1.5 times as tall as wide |
| Safari's floating address bar on my iPhone covered "Got it"; `env(safe-area-inset-bottom)` only covers the home indicator | The screens use `svh` instead of `dvh`. Nobody has confirmed this on a real iOS 26 iPhone, so it has to be checked on my phone (plan step 3) |
| Steps 1 and 2 were both uncommitted in the same files, but agreed as one commit each; then `git apply --cached .handover/step1-less-text.patch` failed with "can't open patch", because I ran it from `app/` and the patch is at the repo root | Step 1 was saved as a patch and staged on its own with `git apply --cached`, run from the repo root; step 2 was then committed from what was left |

### My reflection
- What went well:
- What was hard:
- What I'd do differently:
