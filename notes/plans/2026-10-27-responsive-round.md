# Plan: less text, and a round that fills every screen (27 Oct 2026)

**Status: agreed 27 Oct. Steps 1 and 2 built, tested and committed 27 Oct (`b252a99`, `d3031a6`, branch `feat/responsive-round`); step 3 (my iPhone) still to do.** My requests, after a design review of the top of the round and a screenshot from my iPhone 11 Pro Max:
- "remove everything after No account";
- take the Omrin guide out of the app ("we don't need to tell the user we are using Omrin's guide");
- the blank space with the hearts in it looks weird;
- "the responsive design aspect we really lacked, try fix it".

My answers to Claude's questions:
- **Start screen:** only "No account." stays.
- **Sources:** remove every source and date line from the app.
- **Top of the round:** the bins fill the screen.

## What the review measured (27 Oct)
- **The empty band.** At the start of a round and after each wrong answer, there's an empty band between the top bar and the hearts: 82px at 320 × 568, 123px at 390 × 844, 182px at 430 × 932, 147px on an iPad, 134–173px on laptops. The bins stop growing at a fixed height, so the rest of the space collects above them. The hearts sit alone at its bottom edge.
- **The page scrolls after a wrong answer on small phones.** At 320 × 568 and 375 × 667, "Not quite" makes the page scroll by 66px and 22px, so the top bar (×, score, ?) slides out of view.
- **Safari's address bar covers "Got it" on my iPhone.** It floats over the bottom of the page. `env(safe-area-inset-bottom)` only covers the home indicator, not this bar. Sizing the screen with `svh` (the "small viewport", measured with the browser's bars shown) is the likely fix, but nobody has confirmed it on a real iOS 26 iPhone.

## Steps (one commit each, after my yes)

### 1. Less text
- **Start screen:** only "No account." stays under the links. Gone: "About 2 minutes." (the yellow pill already says it), the anonymous-saving line (SCRUM-54) and the source line.
- **Sources:** the source line on How to play and "Source: Omrin waste guide…" on the "Not quite" card both go. How to play's third rule becomes "Every wrong answer tells you why."
- **What stays:**
  - the sources remain in `items.json` and `research/rule-sources.md`;
  - three item explanations still name Omrin as the waste company (for example "The Omrin Waste App shows the nearest one"), because that's advice, not a credit.
- **Tests first:**
  - the start screen shows no source, saving or "2 minutes" line;
  - neither "Not quite" nor How to play shows a source.

### 2. The round fills the screen
- **The bins:** they grow into all the free height, up to the shape of a real wheelie bin (about twice as tall as wide), on every screen size. No empty band; the hearts sit right under the top bar or the "Right!" card. A "Right!" card or "Not quite" takes its room from the bins, which shrink, rather than pushing the page past the screen.
- **The screen height:** it comes from `svh`, so the layout fits with the browser's bars shown.
- **Tests first,** at every phone size plus 414 × 896 (iPhone 11 Pro Max), a tablet and two laptop sizes:
  - in all three states (start, "Right!", "Not quite"), nothing scrolls and the top bar stays on screen;
  - on upright screens the gap above the hearts is small;
  - bins are no more than about twice as tall as wide.

### 3. Check on my iPhone
A preview link to open on the iPhone 11 Pro Max in Safari, with a wrong answer: is "Got it" clear of the address bar? If not, the next step is to measure Safari's visible height in JavaScript (`visualViewport`).

## Before each commit
Unit and browser tests, lint, type check and build. Screenshots before and after in `design/gameplay-ui/after/8-fill-the-screen/`.
