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

### My reflection
- What went well:
- What was hard:
- What I'd do differently:
