# Plan: today's reflection material: the MCP story, learning goals and evidence (19 Oct)

## Context

- **You asked:** add to today's reflection:
  - how the MCPs and skills took the app from a plain greyscale mid-fi to the "Frisian sticker game";
  - how that maps to your learning goals (`learning goals2026P1.pdf`);
  - what you'd showcase to prove each goal.
- **Working agreement (CLAUDE.md):** the work log holds facts, and the reflection (Gibbs, "My reflection") is your writing. So I add the facts, the goal mapping, the evidence list and **questions** to prompt your reflection. I don't write the reflection itself. Say so if you want that changed.
- **Facts checked against today's session record, not memory:**
  - **Figma MCP:** an account check (`whoami`), then reads of Mid-fi v3 (page list + screenshots).
  - **Atlassian MCP:** comments on SCRUM-24, 25, 26, 32 and 74.
  - **Skills loaded:** `design:research-synthesis`, `design:design-critique`, `run`, plus our own `check-rule-sources`.
  - **Artifact:** brand book published and updated (v2).
  - **Not used:** the shadcn MCP was configured but never called (the shadcn CLI was used). The design-to-code, motion and accessibility skills named in the plan were never loaded (contrast was measured with our own script). The log will say this honestly.

## 1. `notes/work-log.md`: two new sections in "Mon 19 Oct 2026", above "My reflection"

**"From plain to vibrant: how the MCPs and skills were used"** is a numbered chain. Each step has one line naming the tool, what it did and the file or link it produced:

1. Atlassian MCP + research-synthesis: test 1 notes became five themes (`research/test-1-findings.md`, SCRUM-24/25).
2. Figma MCP: checked the signed-in account and moved to the Full seat, then read Mid-fi v3 (4 reads).
3. design-critique on those reads: 10 findings. The root cause of "more app than game" is that the design is greyscale and static and framed as a moving-house app.
4. **Your decisions:** the brand mix (bold sticker × Frisian local), Mid-fi v3 as the final design, and approving the plan.
5. Code: the brand became tokens (`app/src/styles/tokens.css`), two fonts, Fluent Emoji + 4 custom stickers, pompeblêd lives and stripes, with contrast measured by a script.
6. Playwright screenshots at 320×568 found 3 layout problems, which were fixed (`ce0931d`).
7. run skill: the app ran on your laptop and phone. **Your feedback** "bins aren't showing" led to stronger colours and lids, contrast re-measured (`2a68550`).
8. Artifact: the brand book was published privately and updated to v2.
9. Atlassian MCP: SCRUM-26 and SCRUM-32 were updated, and SCRUM-74 for the skill.

It ends with a short "what the tools did *not* do" note (see Context).

**"What today adds to my learning goals"** is a table: goal line (short, from the PDF) | what today added | status after today.
- **Create:** research · Figma → components · architecture · frontend · Supabase · integrate/deploy · 3 test iterations.
- **Learn:** PayNow skills map + gaps (MoSCoW) · AI workflows (fair-use guide, 2 agent skills) · explain/Gibbs/usability teachers · Ikigai + share the workflow.
- Usability checks applied today get their own line, for you to say which were new to you: contrast ≥ 4.5:1, touch targets, colour never the only signal, reduced motion, the smallest phone.

**"My reflection"** keeps your three empty lines. Under them go 5–6 Gibbs-stage questions tied to today, as questions only. For example:
- "What did you expect when you first saw it on your phone?"
- "Why did the greyscale prototype read as an app?"
- "Which decisions were yours, which the AI's, and how did you check the AI's output?"
- "What went wrong with the wrong-folder mix-up, and what will you change?"

## 2. New living file: `notes/evidence-map.md`

There is one section per goal line, each listing:
- **Evidence now:** the file, link or commit, plus how to show it in about one minute.
- **Still missing**
- **Jira key**

It opens with a short **showcase list** (headline demos):

1. **Before/after:** Mid-fi v3 A1 + C2 next to `design/screens/01-welcome.png` and `03-round.png`. You export the Figma frames yourself, which costs no Figma reads, into `design/before-after/`.
2. **Live on a phone:** play a round, show "Not quite" with the Omrin page, then the leaderboard.
3. **Tests running:** 46 unit + 17 browser on four phones. "Tests found a real bug": the timing fix in `ce0931d`.
4. **Staged commit history** on `feat/app-boilerplate`, as a trace of the work.
5. **Agent skill 1:** run `check-rule-sources` on one item, then show `items.json` and the quote check.
6. **5-minute MCP + skill demo for classmates:**
   - Figma read → critique
   - Jira comment
   - publishing an Artifact
   - the skill
7. **Brand book link,** with its contrast ratios as usability evidence.
8. **`AI_USE_LOG.md`** with your "what we did / learned" columns filled in (fair use).
9. **The work-log Problems table,** as raw material for Gibbs.

**Gaps listed honestly:**
- residents' survey
- finding → decision trace (SCRUM-69)
- architecture diagrams (SCRUM-75)
- drag and drop and real-phone check (SCRUM-32)
- Supabase + RLS (SCRUM-51–54)
- deploy (SCRUM-27)
- tests 2–3 (SCRUM-33/55)
- agent skill 2 (SCRUM-71)
- fair-use guide (SCRUM-57)
- PayNow skills map (SCRUM-70)
- Gibbs (SCRUM-42/56)
- teacher feedback (SCRUM-41)
- Ikigai (SCRUM-76)
- demo (SCRUM-72)

## 3. Bookkeeping

- Save this plan as `notes/plans/2026-10-19-reflection-and-evidence.md`, per the CLAUDE.md rule.
- `CLAUDE.md` (local): one line in "Daily work log": update `notes/evidence-map.md` whenever a deliverable lands.
- `AI_USE_LOG.md` (local): one row, facts only, with your columns left empty.
- Jira: one comment on SCRUM-61 (growth portfolio epic) pointing to the evidence map.

## 4. Commits (docs only, on `feat/app-boilerplate`, not pushed)

1. `docs: add today's MCP story and learning-goal links to the work log` (with the plan copy)
2. `docs: add the learning-goal evidence map`

## Verification

- A script checks that every path in the two files exists (`test -e`) and every commit hash resolves (`git cat-file -e`).
- Counts and ticket keys match the session record above.
- Tables render in the editor's Markdown preview.
- `git status` is clean after the two commits, and nothing is pushed.
