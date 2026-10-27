# Plan: a frame creation skill suite, with a real test run on Which Bin (27 Oct 2026)

**Status: agreed 27 Oct** ("all five plus the set, make it global, have a real test run").

**Source:** Kees Dorst, *Frame Innovation: Create New Thinking by Design* (MIT Press, 2015). The skills put its method in Claude's own words and credit the book; no long quotes or retold case studies, because the book is copyrighted.

## What gets built (global, in `~/.claude/skills/`, outside this repo)

| Skill | Book steps | Job |
|---|---|---|
| `frame-creation` | all nine | The hub: checks whether a problem is ready for reframing, picks the variant, runs the steps through the other skills, writes one framing document |
| `problem-archaeology` | 1–2 | History, earlier attempts, fixed constraints, stuck patterns, the core paradox as a "Because…" chain |
| `theme-finder` | 3–5 | Inner ring, wider field, needs/values/currency, clusters into themes, theme strength; every claim marked evidence or assumption |
| `frame-lab` | 6–7 | "If we approach this as if… then…" frames, quality and fruitfulness, futures, value per party |
| `frame-to-action` | 8–9 | What each party must change, which frames to drop, quick wins vs longer change, how to test the frame with people |
| `design-discourse` | integration | A living record of frames and themes per project and across projects |

Plus one line in `design-critic`: when the brief itself looks like the wrong problem, suggest `frame-creation` first.

## The test run

Run `frame-creation` on a real Which Bin question, using only evidence in this repo (test 1 findings, the App Store review research, the rule sources, the work log): test 1 found the game easy to use but unclear in purpose, "more app than game", and testers asked how it could push better disposal. Output saved in `research/framing/`, with stakeholder values marked as evidence or assumption, and ending in what test round 2 should check.

Limits to state honestly: Claude wrote the skills and also runs the test, so this is a first check, not an independent evaluation. The framing is a set of hypotheses for me to test with real students, not findings.

Commits only after my yes.
