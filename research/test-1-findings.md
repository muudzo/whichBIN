# Test 1 findings: wireframes + mid-fi prototype (Figma)

> **Status:** notes reported on Mon 19 Oct. **Fill in the `[ ]` gaps** before this counts as test 1 evidence.
> **Who made what:** the notes are ours. Claude grouped them into themes and drafted the change list for us to decide on.
> Jira: run the test SCRUM-24 · log findings SCRUM-25 · design fixes SCRUM-26.

| | |
|---|---|
| Date | `[ ]` |
| Prototype | Wireframes + mid-fi prototype · Figma link `[ ]` |
| Testers | `[ ]` how many (P1, P2…) · international students? · not classmates? |
| Method | `[ ]` think-aloud? remote or in person? which tasks? |

---

## 1. What testers said and did (our notes, unedited)

1. They didn't know where glass should go, or how glass is sorted in Leeuwarden.
2. The interface was confusing: they didn't know what it was meant to be.
3. The feedback loops work well. "Very educational", "nice to know".
4. It's easy to use; the questions are straightforward.
5. **Recommendation:** add animations to bring it to life.
6. **Recommendation:** it gives more app than game vibes.
7. **Recommendation:** how can the game prompt better disposal systems, for students and for the governing bodies?

`[ ]` Per finding: which tester (P#) and which screen? A finding from 1 of 2 testers weighs differently from 2 of 2.

---

## 2. Themes

### A. Glass is a real knowledge gap
**Observation:** testers didn't know where glass goes (note 1).
**Why it matters:** in Leeuwarden glass doesn't go in a bin at home. It goes in a **shared glass container (Glasbak) on the street**, and it **may be dirty and keep its lid on** ("mag vies en met deksel"). A **drinking glass is not glass waste**: it goes with residual waste. Three surprises in one material.
**Source:** Omrin, *Afvalwijzer 2026*, Leeuwarden edition, pp. 10–11 (https://www.omrin.nl/media/a2ocvunp/6466_bro_afvalwijzer_nl_2026-def.pdf) and Omrin, "Wat hoort waar in?" (https://www.omrin.nl/zelf-regelen/scheiden/container). `[ ]` Check date.

### B. Easy to operate, unclear what it is
**Observation:** "easy to use, straightforward questions" (note 4) and "confusing, didn't know what it was meant to be" (note 2).
**Interpretation (to check):** these don't contradict each other. Answering a question was easy; understanding *what the product is for* wasn't. That points at the first screen, not the sorting itself. `[ ]` Which screen was confusing?

### C. The explanations teach
**Observation:** the feedback loops work well, "very educational", "nice to know" (note 3).
**Implication:** keep an explanation after every answer. This is the part that does the teaching.

### D. It feels like an app, not a game
**Observation:** more app than game vibes; add animations (notes 5, 6).
**Caveat:** a Figma mid-fi is static by nature, so part of this is the fidelity. Test 2, on the coded frontend, shows whether the feeling stays.

### E. Beyond the game: prompting better disposal
**Recommendation:** reach both students and the governing bodies (note 7).
**Fit with the goals:** the community results already planned (Supabase answers + aggregate scores) can show which items players get wrong most. That's something Omrin and the municipality could act on, and it links to the Ikigai point about a product made with Omrin.

---

## 3. Changes (our decision: fill in "Do?")

MoSCoW for the time left (deadline Fri 23 Oct).

| # | From | Change | Where | MoSCoW | Do? |
|---|---|---|---|---|---|
| 1 | A | Glass feedback says **where**: "a shared glass container on the street, not your bin at home" | Item content + Figma | Must | `[ ]` |
| 2 | A | A glass item (jar or drinking glass) in round 1, so every tester meets it | Frontend | Should | `[ ]` |
| 3 | B | The first screen says in one line **what it is**: a short game about Leeuwarden's bins | Figma + frontend | Must | `[ ]` |
| 4 | C | Keep an explanation after every answer | Frontend | Must | `[ ]` |
| 5 | D | Motion on the key moments: item drops into the bin, wrong answer, score at round end. Off under "reduce motion" | Frontend | Should | `[ ]` |
| 6 | D | Ask in test 2: "Does this feel more like an app or a game?" | Test 2 | Must | `[ ]` |
| 7 | E | "Most-missed items" from the community results | Frontend + Supabase | Could | `[ ]` |
| 8 | E | Anything aimed at the governing bodies inside the game | — | Won't (this sprint) | `[ ]` |

---

## 4. Questions to add to test 2

- **Before they start:** "Before you press anything: what do you think this is?" (Theme B)
- **After the round:** "Does this feel more like an app or a game? Why?" (Theme D)
- **Watch:** the glass item. Right first time? (Theme A)
