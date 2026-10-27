# Framing: what is Which Bin for? (27 Oct 2026)

Variant: old problem (one test round, one earlier reframe) · Depth: quick pass · Readiness: split, see below

> **Who made what:** Claude wrote this as the first real run of the `frame-creation` skills (plan `notes/plans/2026-10-27-frame-skills.md`). It uses only evidence in this repo. Claude wrote the skills and also ran them, so this is a first check of the skills, not an independent evaluation. **The frames are hypotheses for me to test, not findings.** Choosing a frame, or none, is my decision.
>
> **Evidence labels:** **[E]** = evidence in this repo (file named) · **[A]** = assumption, with a way to check it.
>
> **Method:** adapted from Kees Dorst, *Frame Innovation* (MIT Press, 2015).

**The question:** test 1 found Which Bin easy to use but unclear in purpose ("more app than game vibes"), and testers asked how it could push better disposal for students and for the governing bodies. What should Which Bin be, and what should test round 2 check?

---

## 1–2 Archaeology and paradox

### As presented
The question as test 1 left it: make it *more of a game* (notes 5–6), make clear *what it is* (note 2), and make it *push better disposal for students and governing bodies* (note 7) [E `research/test-1-findings.md`].

Words that assume a solution:
- "**add animations**" assumes the missing game feeling is motion;
- "**game**" in the learning goal ("interactive gameplay") fixes the form before the purpose [E CLAUDE.md, Goal 1].

### History
| When | What happened | Source |
|---|---|---|
| Before 19 Oct | Mid-fi v3 in Figma opens as **"Your Move"**, a moving-house journey (Moving in / Living here / Moving out). The game is one part of it, 5 taps from the start | [E] `notes/plans/2026-10-19-design-brand-boilerplate.md`, findings 1–2 |
| 19 Oct | 1,462 App Store reviews of 7 waste apps. The apps are pickup calendars. "Welke bak" means *which bin goes out on which day*. Very few reviews are in English | [E] CLAUDE.md, research findings |
| 19 Oct (reported) | **Test 1** on the wireframes and Mid-fi v3, so with the "Your Move" opening. The glass rules were a gap; easy to use; unclear what it is; "very educational"; "more app than game"; asked about governing bodies. Date, number of testers and method are not filled in | [E] `research/test-1-findings.md` |
| 19 Oct | Reply to test 1: "Your Move" cut to the core game; the first screen says what it is ("A 2-minute game · Leeuwarden"); motion as a Should; most-missed items as a Could; "anything aimed at the governing bodies" a Won't this sprint. "Your Move" and game 2 stay in Figma as the vision | [E] the same plan; `test-1-findings.md` §3; `WelcomeScreen.tsx` |
| 21–25 Oct | Built: drag or tap, an explanation with an Omrin page after every answer, "x of y other players got this wrong too", most-missed items on the leaderboard, Supabase. Live on 25 Oct | [E] `app/src/features/round/community.ts`, `LeaderboardScreen.tsx`, work log |
| 25 Oct | Heuristic evaluation (Claude): 13 findings, all about usability of the quiz | [E] `research/heuristic-evaluation/2026-10-25-evaluator-claude.md` |
| 26–27 Oct | My design review leads to 6 steps on the round screen: bins that look like bins, feedback at the bins, easier drag, calmer motion | [E] `notes/plans/2026-10-26-gameplay-ui.md` |
| Today | **Test 2 has not run** (SCRUM-33). None of the replies to test 1 have been tested with people | [E] CLAUDE.md, "1 of 3 run" |

### Paths not taken
- **Your Move, the settling-in journey.** It was cut because the game sat 5 taps deep behind app scaffolding. Test 1's "didn't know what it was meant to be" may partly come from that opening. The *idea* (sorting as part of arriving in a new home) was never tested apart from its scaffolding.
- **A pickup calendar or reminders.** This is what every reviewed app does. It was rightly left out: the gap is *where things go*, not *when*.
- **A lookup ("where does X go?").** Omrin already publishes "Wat hoort waar in?" and the Afvalwijzer [E `research/rule-sources.md`]. A lookup would duplicate it and feel like an app.
- **Something for the governing bodies.** Testers asked for it (note 7); it was parked as a Won't for this sprint.

### The owner's role (no blame)
- Every reply since test 1 has made the *quiz* clearer, livelier and easier to use: a one-line promise, motion, real-looking bins, feedback at the bins. That includes Claude's own reviews (25 Oct heuristic evaluation, 26–27 Oct gameplay work). None of them asked what the game is for, beyond a round.
- That was reasonable: the learning goal asks for gameplay and the deadline is short.
- Building continued for 8 days without a second test, so it is unknown whether any of it answered test 1.

### Non-negotiables
- Every sorting rule has an Omrin source and a check date [E CLAUDE.md].
- The learning goal: 10–15 verified items, interactive gameplay, community results, 3 test iterations with international students [E CLAUDE.md, Goal 1].
- No personal data: generated nicknames, no reviewer names [E CLAUDE.md; plan 19 Oct].
- Time: the sprint deadline in CLAUDE.md is Fri 23 Oct, and work has continued since. Confirm how much time is really left before choosing anything long term.
- Omrin and the municipality have not been contacted. SCRUM-47, to check the real bin colours with Omrin, is still open [E heuristic evaluation F10].

### Stuck patterns
- **Lone warrior (mild):** the product is shaped by me and Claude. Testers were met once; Omrin and the municipality not at all.
- **Self-made box (possible):** test 1's "app, not game" was answered with more design polish, the approach that worked for usability. It may be right, but it is untested.
- **The opposite of freeze-the-world:** not waiting for certainty, but building and polishing instead of testing again.

### Core paradox (a chain)
1. **Because** testers asked for more of a game [E notes 5–6], Which Bin leans into play: a 2-minute solo round with stickers, points, streaks and motion.
2. **Because** it is a short solo round, what it changes stays inside the round: one person learns a few rules once [A: no evidence yet on what players remember or do afterwards. Check by asking test-2 testers a few days later].
3. **Because** its effect stays inside the round, it can't do what the same testers asked for: prompt better disposal for students and governing bodies [E note 7]. Each step towards that (sources, explanations, community data, a page for Omrin) makes it more app again, and less clear what it is [E note 2].

**Check:** picking one side doesn't solve it. "Just a game" drops note 7 and the reason the game exists; "a disposal tool" brings the app feeling back.

### Readiness: split
| Condition | Here |
|---|---|
| Conflicting aims | Yes: more game (notes 5–6) against more effect on disposal (note 7) [E] |
| No obvious solution | Partly: "add motion" was the obvious fix, and it's done but untested |
| Context can be widened | Yes: shared houses, the street containers, arrival in a new city, Omrin, the municipality |
| Someone with influence open to change | I am; Omrin and the municipality are unknown |
| Earlier attempts haven't satisfied | **Unknown:** test 2 hasn't run |

**Verdict:**
- **"App or game?" may be a fidelity problem**, to solve directly: test 1 used a static Figma prototype, and the coded build now moves. Test 2 shows whether the feeling stays.
- **"What is it for, beyond one round?" is a framing question.** The frames below are offered as **probes for test 2**, not as a redesign before it.

---

## 3–4 Context and field

### Inner ring (already involved)
| Party | What they do | What drives it | Source |
|---|---|---|---|
| Test 1 testers (international students) | Answered easily; didn't know where glass goes; called the explanations "very educational", "nice to know"; asked for animations and more game; asked about governing bodies | Unknown: how many testers, who said what and on which screen are not recorded | [E] `test-1-findings.md` notes 1–7 |
| Me (designer and developer) | Cut "Your Move" to the core game; 15 sourced items; usability and motion work; a leaderboard with most-missed items | The learning goals (Create + Learn), the deadline, being able to explain every line | [E] CLAUDE.md, plans, work log |
| Claude | Grouped test notes into themes, drafted change lists, the heuristic evaluation, built the UI changes | Works inside the brief it's given | [E] `test-1-findings.md` header; `AI_USE_LOG.md` |
| Omrin | Publishes the rules (Afvalwijzer 2026 in Dutch and English, "Wat hoort waar in?"); collects the waste | Not involved in the project | [E] `research/rule-sources.md` |
| Existing waste apps | Pickup calendars and reminders; reviewers complain about calendars, notifications, logins and addresses | Serve residents who already know what goes where | [E] CLAUDE.md, review research |
| Players of the live game | Their answers feed "x of y got this wrong too" and the most-missed list | Unknown: no live data looked at | [E] `community.ts`; [A] check Supabase |
| Teachers and assessors | Judge against the learning goals; the usability teachers' feedback is still to come | Course criteria | [E] CLAUDE.md, SCRUM-41 |

### The wider field
| Party | Currency | Power / interests | What they could bring | Source |
|---|---|---|---|---|
| Housemates in a shared student house | Fairness, a clean kitchen, getting along | They share the bins and who takes them out | A house's own rules; social play | [A] ask testers where they live and who handles the bins |
| Landlords and student housing providers | A clean bin area, no complaints or extra costs | They control the building's bins and the welcome information | Welcome emails, signs at the bins | [A] |
| The university's international office and intro week | Students who settle in well | They control the first-week programme | A moment when newcomers are looking for exactly this | [A] |
| The Municipality of Leeuwarden | Cleaner streets, better sorting, newcomers who find their way | Policy and communication | Communication to newcomers | [A]; testers named "governing bodies" [E note 7] |
| Omrin | Less wrongly sorted waste, clear rules | They own the rules and the street containers | Data on what's confusing; their own guides | [A]; most-missed data could interest them [E theme E, as an interpretation] |
| Dutch neighbours | A tidy street, shared norms | Social pressure | The unwritten rules | [A] |
| Dutch language classes for internationals | Everyday vocabulary | Reach to newcomers | The bin names are Dutch words (Sortibak, Biobak, Glasbak) | [E] items.json shows the Dutch names with English hints; the rest [A] |
| Family and friends back home | Staying in touch, comparing lives | None here | The "at home we do it like this" conversation | [A] |
| The milieustraat, textile and reuse collectors | Reuse, separate streams | They take what isn't a bin | Mattress, frying oil, batteries, old shoes | [E] items.json, the "Not a bin" items |
| Next year's international students | Getting it right from day one | Future players | This year's mistakes as their head start | [A] |

---

## 5 Themes

Notes regrouped by meaning, ignoring who they came from:
- **Not knowing:** glass, "nice to know", the Dutch bin names, "every mistake tells you why", "got this wrong too", existing apps assuming you already know.
- **Shared bins:** street containers, shared houses, housemates, neighbours, landlords, governing bodies.
- **Arriving:** Your Move, intro week, welcome emails, language, moving in and moving out.
- **Being heard:** most-missed items, Omrin, the municipality, note 7.

Rejected:
- **"Fun and play":** it restates the request and leads straight back to "add more animation".
- **"Education":** that is the current frame.

### Theme 1: not knowing what you don't know
A newcomer doesn't feel ignorant about bins until something surprising happens: a glass jar has no bin at home, a drinking glass isn't glass waste, a greasy pizza box isn't paper. Residents never meet these surprises because they grew up with them. That's why the existing apps can assume the "what goes where" and only remind people "when".
- **Evidence:** glass gap [E note 1]; "nice to know" [E note 3]; glass is three surprises in one material [E test-1 theme A, Omrin pp. 10–11]; few English reviews [E CLAUDE.md].
- **Strength:**
  - cognitive [E];
  - social: getting it wrong in front of housemates [A];
  - emotional: unease about breaking rules you can't see [A];
  - physical: where the glass container on the street actually is [A];
  - contextual: the first weeks [A].

  The cognitive side is solid; the rest is untested.
- **Related concepts:** surprise ★, the rules nobody tells you ★, "at home we…" ★, embarrassment, asking a neighbour ★, local knowledge, Dutch words.

### Theme 2: shared bins, shared responsibility
Waste is one of the few things people in a house or street *share*: the bins in the hall, the glass and textile containers on the street. One person's wrong sorting is everyone's problem, and testers asked about the system as well as the person.
- **Evidence:** glass and clothes go "on the street" [E items.json]; "for students and for the governing bodies" [E note 7].
- **Strength:**
  - social and motivational [A: shared houses are assumed];
  - contextual [E: the street containers];
  - emotional: fairness, annoyance at housemates [A].

  Strong *if* testers live in shared houses; check that first.
- **Related concepts:** fairness, the housemate who sorts for everyone ★, house rules, visible norms, blame, the bin area as a meeting point ★. Also a two-way duty ★: the system owes newcomers clarity, and their confusion is a signal for Omrin and the municipality.

### Theme 3: arriving, making a place home
Learning where the bins are belongs with the first week's other jobs: keys, a bike, a bank account, the supermarket. It's part of becoming someone who lives here. "Your Move" was built on this, and was cut for its scaffolding, not because the theme was tested and failed.
- **Evidence:** the Your Move vision [E plan 19 Oct]; the brand is a Frisian sticker game [E brand book]; moving out shows up in the items: mattress, batteries, frying oil [E items.json].
- **Strength:**
  - contextual and motivational: newcomers look for this information at a specific moment [A];
  - emotional: belonging [A].
- **Related concepts:** welcome rituals ★, the first-week checklist, the guidebook, moving out ★ (what to do with a mattress), local pride ★, "now I live here".

---

## 6–7 Frames and futures

Scores run from 1 (weak) to 3 (strong). Answers brief = does it still answer test 1 (what it is, game feel, disposal beyond the round)?

| # | Frame: if we approach Which Bin as if it is… then… | Route | Integr. | Coher. | Shared | Orig. | Action. | Alive | Answers brief |
|---|---|---|---|---|---|---|---|---|---|
| 1 | …**a field guide to local surprises**, then it opens with "what's different here" and picks only the surprising items | Theme 1 | 2 | 3 | 3 | 1 | 3 | 2 | 2 |
| 2 | …**a game a student house plays together in its first week**, then it becomes a shared moment: housemates compare, argue, settle their own house rules, and their mistakes become the house's reminder | Theme 2, narrowed to one house | 3 | 2 | 2 | 2 | 2 | 3 | 2 |
| 3 | …**part of arriving**, like getting your keys and your bike, then it lives in the welcome moment (intro week, the housing welcome email) as "Leeuwarden in 2 minutes" | Theme 3, the future of arriving | 3 | 3 | 3 | 2 | 1 | 2 | 2 |
| 4 | …**a pub quiz**, then it has teams, a host, rounds and "did you know?" reveals, and houses or corridors compete | Metaphor | 2 | 3 | 3 | 2 | 2 | 3 | 1 |
| 5 | …**the city's listening device**: every wrong answer is a report of what's confusing. Players contribute, not just learn, and the most-missed list goes to Omrin and the municipality | Shift the owner; theme 2's two-way duty | 3 | 2 | 2 | 3 | 2 | 2 | 3 |
| 6 | …**a collection of surprises**, where a mistake is the prize ("I didn't know that!"), then wrong answers unlock cards and the aim is to find every surprise | Inversion: be *for* mistakes | 2 | 3 | 2 | 2 | 3 | 3 | 2 |
| 7 | …**a first Dutch lesson**, then the bin names are vocabulary and it fits Dutch courses for internationals | An unexpected party in the field | 1 | 3 | 2 | 3 | 2 | 2 | 1 |
| 8 | …**a week in a student house**, then items come from scenes (Sunday clean-up, a party, moving out) and consequences show | Metaphor (a story) | 2 | 2 | 2 | 2 | 1 | 3 | 2 |
| 9 | …**practice for the real game, played at the bin weeks later**, then the moment of throwing away needs a cue (something at the house's bins), and the phone round is training | Abstraction: the value is sorting right at the bin | 3 | 3 | 2 | 3 | 2 | 2 | 3 |
| 10 | …**a moving-out game**, then it's for the last week, with "Not a bin" places as the stars | Narrowed to one moment | 2 | 3 | 3 | 2 | 2 | 2 | 1 |

Notes on the scores:
- **Frame 1** is nearly today's product with a sharper opening, a direct fix rather than a new frame.
- **Frame 3** scores low on action only because it needs a partner I haven't contacted.
- **Frame 9's** ideas drift towards reminders and lookups, which is what the existing apps already do: watch for that.

### Futures for the four strongest

**Frame 2, the house plays together**
- **Ideas:**
  - "pass the phone": one round, housemates take turns, one house score;
  - at the end, the house's mistakes as a small printable "our bins" card for the kitchen;
  - house against house on the leaderboard;
  - a link for the house group chat.
- **Fruitfulness:** high. Ideas came quickly and varied: a way to play, an object, competition, sharing.
- **Value per party:**
  - students: settle the rules without nagging [A];
  - housemates: fairness [A];
  - Omrin: fewer wrongly sorted bins [A];
  - me: social play answers "more game" without a multiplayer backend ("pass the phone" needs no server).
- **Answers the paradox by:** making the game more of a game through play with other people, not more motion, and by carrying its effect out of the round into the house. It doesn't reach the governing bodies.

**Frame 5, the city's listening device**
- **Ideas:**
  - at the end, "your mistakes join N others: this is what newcomers find hardest";
  - a public "what newcomers get wrong" page, built from the most-missed list that already exists, sent to Omrin once a month;
  - Omrin's reply shown in the game, if they answer;
  - players pick an item they weren't sure about from a list (no free text, so no personal data and nothing to moderate).
- **Fruitfulness:** medium to high.
- **Value per party:**
  - players: their confusion counts and mistakes feel useful [A];
  - Omrin and the municipality: data on which rules confuse people [A: they may not want it];
  - me: it builds on the community results already in the learning goal, and on the Ikigai point "a product with Omrin" [E CLAUDE.md].
- **Answers the paradox by:** answering note 7 directly, without making the round itself more app-like.

**Frame 9, the real game is at the bin**
- **Ideas:**
  - a few days later, a replay of only the items you got wrong (mistakes already come back next round [E heuristic evaluation, What works H9]);
  - a sign at the house's bins pointing to the game;
  - a "your three bins" round with only the bins your house has.
- **Fruitfulness:** medium. A second and third idea came, but kept sliding towards reminder apps.
- **Value per party:**
  - students: help at the moment it matters [A];
  - landlords: a cleaner bin area [A].
- **Answers the paradox by:** yes on effect beyond the round; risky on the game feeling.

**Frame 3, part of arriving**
- **Ideas:**
  - "Leeuwarden in 2 minutes" in intro week or a housing welcome email;
  - "Your Move" brought back as three short games: arriving, living here, moving out (frame 10 becomes the third);
  - an opening that names the surprises (frame 1).
- **Fruitfulness:** medium to high.
- **Value per party:**
  - the university and housing providers: a friendly welcome item [A];
  - students: the answer when they're looking for it [A];
  - Omrin: reaching newcomers early [A].
- **Answers the paradox by:** making clear what it is through where you meet it ("it came with my keys"). It needs a partner.

### Combinations
- **2 + 5, "the house plays, the city listens":** a house plays together, and its mistakes join the city's list. Social play for game feel, and a route to the governing bodies. The strongest pair.
- **3 + 10 + 1:** "Your Move" as three short games, each opening with what's surprising. The long-term vision, close to the original Figma.

### Recommendation (my choice to make)
- **Don't rebuild before test 2.** Test the current build: it holds all the replies to test 1, and none of them has met a user.
- **Use test 2 to probe frame 2 + 5 cheaply,** with no new code: one session where two housemates play together on one phone, and a paper sketch of the "your mistakes join the city's list" end card.
- **Why:** this pair is the only one that answers both halves of the paradox, and its first probe costs nothing.
- **Main risk:** the themes rest on 7 unattributed notes from an unknown number of testers, and frame 2 assumes testers share a house and its bins.
- **What would prove it wrong:**
  - solo testers on the coded build no longer say "app" and can say what it is from the first screen. Then test 1's problem was fidelity and the Your Move opening; leave the framing for later;
  - or pairs play in silence, taking turns, never mentioning their own house. Then frame 2 is weak.

---

## 8–9 Transformation and integration

### What changes, per party (frame 2 + 5)
| Party | See | Think | Do | Gains | Feasible now? |
|---|---|---|---|---|---|
| Me | The product as something played together, whose mistakes matter beyond the round | Test before building more | Run test 2 with one pair and one sketch | An answer to test 1; evidence for the test iterations | Yes |
| Test-2 testers | The game as a thing to play with housemates | Mistakes are shared, not personal | Play together, talk | Fun, and settling their house rules [A] | Yes, in the test |
| Housemates (beyond the test) | The bins as a shared thing to sort out | — | Play one round together | Fairness [A] | Only if the test shows it |
| Omrin / the municipality | Newcomers' confusion as useful data | Their rules may be the confusing part | Receive the list; maybe respond | Data [A] | **No**: never contacted. Long term |
| Claude | — | Don't speak for testers | Help analyse test 2; keep the evidence labels | — | Yes |

### Dropped and why
- **Frame 7, Dutch lesson:** needs language teachers to adopt it, with little for them to gain from a 15-item game, and it doesn't answer the brief.
- **Frame 8, a week in a student house:** too much new content and building for the time left.
- **Frame 9's sign at the bins:** needs landlords and housemates to allow it, for an unclear gain; the "replay your mistakes later" idea stays.
- **Frame 3:** not dropped, but long term; it depends on a partner (intro week or housing) whose interest is unknown.

### Short term (start now)
- [ ] Fill test 1's gaps (date, testers, method, who said what) in `research/test-1-findings.md`. Without them test 1 doesn't count as evidence, and the themes above weaken.
- [ ] Test 2 (SCRUM-33) on the coded build, keeping test 1's three checks:
  - "Before you press anything: what do you think this is?";
  - "App or game, and why?";
  - watch the glass item.
- [ ] Add: "Where do you live, and who deals with the bins?" This checks frame 2's assumption.
- [ ] Add one pair session: two housemates, one phone, one round. Watch whether they talk about their own house's bins, disagree, laugh, or ask for another round.
- [ ] Show a paper sketch of the end card "your mistakes join what newcomers find hardest, shared with Omrin". Watch the reaction before asking anything.
- [ ] Look at the most-missed list in the live Supabase data (live since 25 Oct), if anyone has played.

### Long term (practice change)
- [ ] If frame 2 holds: a "pass the phone" house round and an "our bins" card.
- [ ] If frame 5 holds: contact Omrin, together with SCRUM-47 (the bin colours), with the most-missed list.
- [ ] Your Move as a series of short games, with an intro-week or housing partner (frame 3).

### Test with people
- **Claim:** if Which Bin is a game a house plays together and whose mistakes count, then pairs talk about *their* bins and rules, want another round, and can say what it's for. Solo players still see a quiz.
- **Signals for:**
  - unprompted "in our house…" or "at home we…";
  - a disagreement settled by the explanation;
  - asking to play again;
  - interest in where the mistakes go.
- **Signals against:**
  - silent turn-taking;
  - no mention of their own house;
  - "app" again;
  - indifference to the end card.
- **Probe:** the live build on one phone, plus one paper sketch. No new code.
- **Who and how many:** 3–5 international students, not classmates, at least one pair from the same house. Use P1, P2…, ask for consent, and record no names.
- **When:** test 2 (SCRUM-33). Its findings feed test 3 (SCRUM-55).

### Integration
- **The original paradox:** frame 2 + 5 *dissolves* it rather than picking a side. "More game" comes from playing with people instead of more motion, and "disposal beyond the round" comes from the house and the city instead of one player's memory. This only holds if testers share houses and bins.
- **Also applies to:**
  - test 3 (SCRUM-55);
  - the "most-missed" leaderboard (heuristic evaluation F5);
  - material for my Ikigai reflection (a product with Omrin or for schools), which I write myself;
  - other "rules nobody tells newcomers" problems.
- **Recorded in discourse:** `design/discourse.md`.
- **Themes to watch:** "not knowing what you don't know" may return in any newcomer-facing project.

---

## Evidence gaps
| Gap | Why it matters | How to check |
|---|---|---|
| Test 1: date, number of testers, method, who said what, which screen confused them | Every theme leans on these 7 notes | Fill in `research/test-1-findings.md` from my own notes |
| Did test 1's confusion come from the "Your Move" opening (removed since) or from the game itself? | Decides whether "what is it?" is already solved | Test 2 question 1 on the coded build |
| Do international students share houses and bins, and who takes them out? | Frame 2 depends on it | Ask in test 2 |
| The residents' survey (not analysed) | It could show what locals think newcomers get wrong | Analyse it (Goal 1, research) |
| Omrin's and the municipality's interest | Frame 5's long-term half depends on it | One email to Omrin, with SCRUM-47 |
| Live most-missed data in Supabase | Real behaviour beats the 15 items' expected difficulty | Query it (read only) |
| Whether the "app, not game" feeling stays on the moving, coded build | Theme D may be fidelity only | Test 2, question 2 |

**What this quick pass skipped:**
- talking to anyone;
- watching students sort at home;
- any contact with Omrin;
- deepening the themes with research.

A full framing would do those before and after a session like this.
