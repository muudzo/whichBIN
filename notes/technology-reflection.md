# Technology and decisions: Which Bin as a continuation of my PayNow internship

> **What this is:** the facts and reasoning behind the technology in Which Bin (19–25 Oct 2026), and how it continues what I learned during my PayNow internship (ZimLivestock, Mar–Jun 2026). My copy is github.com/muudzo/livestockl, a fork of the original github.com/tatenda-source/livestockl, with work until July 2026.
> **Who wrote what:** Claude compiled the facts from this repo, the work log, Jira and my internship repo. The "My reflection" blocks are mine to write. Material for the Learn goal ("apply my PayNow AI workflows… evaluate through reflection") and SCRUM-70 (skills map).

## 1. From the internship to Which Bin, at a glance

| | Internship (ZimLivestock) | Which Bin | What changed, and why |
|---|---|---|---|
| **Project memory** | `CLAUDE.md` | `CLAUDE.md` (git-ignored), plus my learning goals in it | Same habit, tighter: the learning goals, the Jira board and the working agreements live in it, so every session starts from the same rules |
| **Custom skills and agents** | 25 skills (e.g. `rls-audit`, `tdd-workflow`, `session-log`, `verification-loop`, `e2e-testing`) and 29 agents (code reviewer, RLS auditor, schema designer, …) | 1 skill of my own (`check-rule-sources`), plus vetted third-party skills | Fewer, but each one does a job I'd otherwise do by hand: checking every rule against Omrin's guide |
| **Session logging** | A `session-log` skill and `WEEKLY_REFLECTION.md` | `notes/work-log.md` every day, `notes/evidence-map.md` per learning goal, `AI_USE_LOG.md` per deliverable | The internship reflected weekly; here the facts are logged as they happen, so reflection has raw material |
| **Tests first** | A `tdd` skill | Tests written before the code for every feature, including the database rules | From a skill I could call to a default way of working |
| **Database security** | An RLS auditor agent and an `rls-audit` skill | 16 permission tests in SQL (`supabase/tests/permissions.sql`), run locally and in CI | Auditing became proving: the rules are tested, not only reviewed |
| **Git guardrails** | A `git-guardrails` skill; Claude co-authored 402 of 420 commits | No commit without my yes; no AI attribution in commits; AI use logged per deliverable instead | Transparency moved from commit trailers to an AI-use log that says what the AI did and what I did |
| **Frontend stack** | React, Vite, TypeScript, Tailwind, Radix, motion, vaul, Vitest, Sentry, React Query, Zustand, a PWA | React 19, Vite, TypeScript, Tailwind v4, shadcn (on Radix), motion, vaul, zod, Vitest, Playwright | "The PayNow stack minus what Which Bin doesn't need": no router, no global state library, no error tracking |
| **Backend** | A Go backend *and* Supabase, built in parallel; the Go backend was removed in week 3 (−9,548 lines) | Supabase only, from day one | My week-3 lesson: "pick the stack early and commit" |
| **CI** | `ci.yml` and a nightly chaos test | `ci.yml`: root tests, app tests and build, and the database tests on a throwaway Postgres | New: the database rules are tested in CI with no secrets at all |
| **MCP connectors** | None in the repo | Atlassian (Jira), Figma, Artifact (claude.ai pages) | New this sprint |
| **Research tooling** | None | A review scraper (1,462 App Store reviews of 7 apps) and a PDF reader for Omrin's guides | New: research became code too |

**My reflection:** which of these did I carry over consciously, and which only because they were habits? Which internship lesson did I apply, and which did I repeat? (The feature branch ran 31 commits ahead of `main` before the first merge, which my internship's week 4 warned about.)

## 2. The tools, by layer

### AI workflow
- **Claude Code** as a pair-programmer and planner: plan first, saved as a `.md` file in `notes/plans/`, agreed, then executed in small, tested steps.
- **MCP connectors:**
  - **Atlassian:** Jira is the to-do list. Tickets are updated with evidence comments as work lands (SCRUM-24 to SCRUM-75).
  - **Figma:** Mid-fi v3 read with only a few reads, then turned into a design critique.
  - **Artifact:** the brand book published as a private page.
- **Skills:**
  - **My own agent skill, `check-rule-sources`:** checked 20 candidate items against Omrin's 2026 guides and kept 15. A script confirmed all 60 quotes appear word for word.
  - **Built-in skills:** research synthesis (test 1 themes), design critique (10 findings), config updates (no commit without approval).
  - **A third-party skill, `brag-slim`:** read in full before installing; it made the launch video.
- **Markdown files as the operating system of the project:**
  - `CLAUDE.md`: the rules
  - `notes/plans/`: every agreed plan
  - `notes/work-log.md`: what happened, with a problems table
  - `notes/evidence-map.md`: evidence per learning goal
  - `AI_USE_LOG.md`: fair use
  - `supabase/README.md`: the SQL lesson
  - `docs/ci.md`: how CI works and how to fix it
  - `research/heuristic-evaluation/template.md`: a reusable method
- **Settings:**
  - Claude Code asks before every `git commit`.
  - AI attribution is switched off.
  - The memory notes make later sessions start from the same agreements.

### Frontend
- **React 19, TypeScript, Vite:** the internship stack; fast to build, and nothing server-side is needed.
- **Tailwind v4 with design tokens, and shadcn:**
  - The brand (the "Frisian sticker game") lives in `app/src/styles/tokens.css`.
  - The UI 102 lecture turned it into one type scale and one spacing system.
- **motion:** drag and drop, and the sticker animations.
- **zod:** checks the item data and the database's replies.
- **A local store as a fallback:** the game works without the database, and the browser tests never touch real data.

### Backend and data
- **Supabase**, in Frankfurt (EU): Postgres, row level security, an API generated from the tables, and the `supabase-js` client.
- **My SQL:**
  - three tables, with checks on every field
  - every browser right taken away, then only insert (answers) and insert and select (scores) given back
  - two counting functions
- **Tooling:** `npm run db:apply`, `db:test` and `db:reset`, built on `psql`.

### Quality
- **Unit and component tests:** 80 (Vitest and Testing Library). They include a "request budget" test that fails if a visit makes more than its 14 database calls (an N+1 guard).
- **Browser tests:** 50 runs on four phone profiles (Playwright), including a real Back press, a landscape phone and desktop sizes.
- **Database tests:** 16 permission tests in SQL.
- **Lint:** oxlint.
- **A heuristic evaluation** against Nielsen's 10 heuristics: 13 findings, and all 5 major and minor ones fixed, with tests.

### Delivery
- **Git:** a feature branch, small staged commits, and conventional messages.
- **GitHub Actions CI:** validation only. The first run was blocked by a billing lock on the account, not by the code.
- **Vercel:** the public link, https://which-bin-leeuwarden.vercel.app.
- **Diagrams as code:** Mermaid, in `design/architecture/`.

## 3. The main decisions, with the alternatives

| Decision | Alternatives | Why this one | Trade-off |
|---|---|---|---|
| **Supabase** for the database | A backend of my own (Node or Go with a Postgres I host); Firebase | See below | Depends on one provider; no rate limit yet |
| **Counts worked out when asked** (two SQL functions) | A trigger that updates a statistics table on every answer, as first drawn in my diagram | Nothing can get out of sync; one table less to protect; fast enough at this size | Slower at very large numbers (an index on `answers(item_id)` is the next step) |
| **The database decides right and wrong** (an `items` table) | Trust the `correct` the browser sends | A fake request can't skew the counts | `items.json` and the table must match; `db:apply` checks that |
| **No Players table** | A table per player, as first drawn | A player is only a random id per visit, already on every answer | Diagrams to update |
| **Generated nicknames** only, enforced in the database | Typed names | Nothing personal stored, nothing to moderate | Less personal |
| **A single-page app (Vite)** | Next.js | No server rendering or routes needed; the internship stack | Back-button handling had to be added by hand (heuristic fix F1) |
| **Vercel** for hosting | Cloudflare (tried first) | Zero config for a Vite app. Cloudflare's tool rewired `vite.config.ts` and changed scripts without asking, so it was undone | One more account; auto-deploys only once GitHub is connected |
| **A local store fallback** | Supabase only | The game works offline and in tests; the browser tests never write test data | Two stores to keep identical (the same 5 methods, tested) |
| **Tests first** | Code first, test later | Bugs found before they shipped (the cut-off button, the class merger dropping sizes, the drag misplacing the sticker) | Slower first step |
| **Mermaid diagrams** | Figma or FigJam | They live next to the code, render on GitHub, and change with it | Less visual freedom |

### Why Supabase rather than "a real database"

Supabase **is** a real database: it runs PostgreSQL. The real choice was between Supabase and **building and hosting the backend myself**:

- **What a backend of my own would have meant:** a Node or Go API server, a Postgres to host and secure, an endpoint per action (save an answer, save a score, read the leaderboard), and code in that server deciding who may do what. That's more code to write, host, secure and explain, for a game whose server only has to store answers and count them.
- **What Supabase gives instead:** Postgres with an API generated from the tables, and **row level security**, so the rules sit in the database itself:
  - a browser may add an answer, but never read, change or delete one
  - the leaderboard is readable
  - the counts come from functions that never expose individual answers

  The public key is safe in the browser *because* the database refuses everything else. My 16 tests prove that.
- **Why it fits this project:**
  - I already knew it from the internship.
  - It's free at this size.
  - The data stays in the EU (Frankfurt).
  - It let me write and explain the SQL myself, which is part of the Create goal.
- **The internship lesson:** in ZimLivestock I ran a Go backend and Supabase side by side, and removed the Go backend weeks later. Here I chose one backend on day one.
- **What I gave up:**
  - **No rate limit:** anyone with the public key can send many answers. That needs a server-side limit later (an edge function or a per-session cap).
  - **Provider dependence:** I depend on Supabase's service.

## 4. Did it make me more efficient? The record

**In one week (Mon 19 – Sun 25 Oct):**
- **Research:** the scraper and 1,462 reviews; 15 rules, each with an Omrin quote and page.
- **Design:** a brand book; the UI 102 changes, with before and after screenshots.
- **The game:** a playable game with drag and drop.
- **Backend:** a Supabase backend with tested rules.
- **Delivery:** CI and a public link.
- **Evaluation:** a heuristic evaluation with fixes.
- **Demo:** a demo script and a launch video.

All of it with tests, plans, logs and Jira kept up to date.

**Where the speed came from:**
- **Plans saved first:** they cut rework. The plan's review caught design problems before code, such as the round answering behind the leave question.
- **MCP connectors:** they removed the switching between Jira, Figma and the editor.
- **The agent skill:** it did the slow, error-prone work of checking 60 quotes.
- **Tests:** they caught mistakes immediately rather than at the demo.
- **Markdown files:** they carried decisions between sessions, so nothing was re-argued.

**Where it cost time, or went wrong:**
- **19–20 Oct:** Claude used a prototype in a *different* folder as evidence and marked Jira tickets Done. Found and corrected; this repo is now the only source.
- **20–21 Oct:** two days with no progress logged.
- **Cloudflare:** its deploy tool rewired the project, and the change had to be undone.
- **CI:** the first run was blocked by a GitHub billing lock.
- **Flaky tests:** some browser tests failed under load; the fix was fewer workers.
- **The heuristic evaluation came late:** planned for 7 Oct (SCRUM-25), done on 25 Oct.
- **A 31-commit merge:** the feature branch ran 31 commits ahead before the first merge.

**My reflection:**
- Where did AI make me faster without making me understand less, and where did I accept something I couldn't yet explain?
- What did I learn by writing the SQL myself after a short lesson, compared with reading code Claude wrote?
- What would I keep, drop or change in this workflow for my next project?

## 5. Still open
- A test on real phones (SCRUM-32), and test rounds 2 and 3 with international students.
- A rate limit on inserts, and the index on `answers(item_id)`.
- Connect GitHub to Vercel, and fix the GitHub billing lock, so CI runs.
- My own heuristic evaluation pass, then merge it with Claude's.
- The skills map (SCRUM-70) and agent skill 2 (SCRUM-71).
