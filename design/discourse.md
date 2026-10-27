# Design discourse: Which Bin?

The frames, themes, principles and methods this project has used, kept so the next problem (and the next project) starts from what we learned rather than from scratch. Each entry says whether it was tested. Method: the `design-discourse` skill, adapted from Kees Dorst, *Frame Innovation* (MIT Press, 2015).

Status words:
- **fresh:** new, untested;
- **in use:** the product is built on it;
- **fading:** becoming routine, worth questioning;
- **retired:** dropped, with the reason.

## Frames

### Which Bin as a sorting quiz (19 Oct 2026)
- **Type:** frame
- **Statement:** "If we approach the newcomer's bin problem as a quiz, then each item is a question and each answer gets an explanation with Omrin's source."
- **Born from:** the review research. Existing apps are pickup calendars, and no one teaches *where* things go (CLAUDE.md).
- **What happened:** test 1 (Figma): easy to use and "very educational", but "more app than game", and unclear what it's for (`research/test-1-findings.md`).
- **Status:** in use. It is fading as a frame: every change since test 1 has polished the quiz, not questioned it (`research/framing/2026-10-27-what-is-which-bin.md`).
- **Might transfer to:** any rule set people must learn once (recycling elsewhere, local traffic rules, house rules).

### "Your Move": sorting as part of moving house (before 19 Oct 2026)
- **Type:** frame
- **Statement:** "If we approach waste sorting as one part of moving into, living in and moving out of a home, then the game sits inside a settling-in journey."
- **Born from:** Mid-fi v3 in Figma.
- **What happened:** tested in test 1 inside the Figma prototype. The game was 5 taps deep and testers were unclear what it was. It was cut for the scaffolding, not for the idea (`notes/plans/2026-10-19-design-brand-boilerplate.md`).
- **Status:** parked as the vision. The idea is untested on its own.
- **Might transfer to:** onboarding for any newcomer service, where the moment of arrival gives the purpose.

### The house plays, the city listens (27 Oct 2026)
- **Type:** frame (a combination of two)
- **Statement:** "If we approach Which Bin as a game a student house plays together, whose mistakes are reported to the city as what newcomers find confusing, then game feel comes from playing with people, and the effect reaches the house and Omrin."
- **Born from:** the paradox "more game" against "push better disposal for students and governing bodies" (test 1, notes 5–7).
- **What happened:** untested. The probe planned for test 2 is a pair session on one phone, plus a paper sketch of the end card.
- **Status:** fresh.
- **Might transfer to:** any solo learning product whose real effect depends on a group (shared spaces, teams, households).

## Themes

### Not knowing what you don't know (27 Oct 2026)
- **Type:** theme
- **Statement:** newcomers don't feel ignorant until a rule surprises them (glass has no home bin, a drinking glass isn't glass waste). Residents never meet these surprises, so the tools they use assume the knowledge.
- **Born from:** test 1 note 1 (glass), the review research (calendar apps, few English reviews).
- **What happened:** the cognitive side is evidenced; the social and emotional sides are assumptions.
- **Status:** fresh.
- **Might transfer to:** every newcomer-facing project.

### Shared bins, shared responsibility (27 Oct 2026)
- **Type:** theme
- **Statement:** waste is one of the few things a house or street shares, so sorting is social, and the system owes newcomers clarity too.
- **Born from:** test 1 note 7, and the street containers for glass and clothes.
- **What happened:** untested. It depends on whether international students share houses and bins (ask in test 2).
- **Status:** fresh.
- **Might transfer to:** shared kitchens, shared tools, any commons.

### Arriving: making a place home (27 Oct 2026)
- **Type:** theme
- **Statement:** learning the bins belongs with the first week's jobs (keys, bike, bank). Its meaning is "now I live here".
- **Born from:** the Your Move vision.
- **What happened:** untested.
- **Status:** fresh.
- **Might transfer to:** welcome and onboarding work.

## Principles (from what the project already does)

- **Every rule has a source.** An Omrin page and a check date for every sorting rule, never invented (CLAUDE.md). It makes the game trustworthy. What it makes us prone to overlook: whether the official rules themselves are the confusing part.
- **Every mistake tells you why.** An explanation after every answer (test 1 theme C: "very educational").
- **No personal data.** Generated nicknames, no free text, no reviewer names.

## Method cards

### Quick-pass framing from repo evidence
- **When:** a product's purpose is unclear after a test, and the next test round is coming.
- **Steps:**
  1. Archaeology from the plans, test notes and git history.
  2. Write the paradox as a "Because…" chain.
  3. Inner ring and wider field, each claim marked [E] or [A].
  4. Two to four themes.
  5. Eight to twelve frames, scored.
  6. Futures for the strongest frames.
  7. A test-round probe that needs no new code.
- **Example:** `research/framing/2026-10-27-what-is-which-bin.md`.
- **Pitfalls:**
  - with thin test notes, almost the whole field is assumption, so say so at the top;
  - frames sliding back into the existing product type (reminders, lookups);
  - redesigning before the next test instead of probing.
