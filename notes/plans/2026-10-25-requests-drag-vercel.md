# Plan: database calls, a better drag, then Vercel (25 Oct 2026, the day before the demo)

Asked: check for N+1 queries and pages that could fire hundreds of database calls; make drag and drop (the core of the game) feel right on phones and laptops; then deploy to Vercel. Plan first, review it, then execute.

## 1. Database calls: findings

**There is no N+1, and no screen can fire hundreds of calls.** Checked in the code and in Postgres:

| Where | Calls | When |
|---|---|---|
| Round screen | 1 insert per answer; 1 `item_stat` after a wrong answer (shared store only) | On a tap or drop, never in a loop or effect. Taps are ignored while the next item animates in |
| Score screen | 1 insert | On "Save score"; the button is disabled while saving |
| Leaderboard | 2 (`top_scores` query, `most_missed`) in parallel | Once per visit to the screen. The app's only `useEffect`; the store is created once in `main.tsx` |

- **Worst case per round:** 10 answers + 3 wrong (3 lives) = 13 small requests. Then 1 to save the score and 2 for the leaderboard.
- **In the database:** each function is one SQL query (a join plus counts), never a query per item.
- **Retries:** failed reads are retried at most 3 times, inside the 8-second deadline.
- **Real issue 1, speed at scale:** `answers` has no index on `item_id` (`EXPLAIN` shows a full scan for every `item_stat`). That's harmless at 16 rows, slow at 100,000. Fix: `create index … on public.answers (item_id)` in a new migration `002`. It's **my SQL** (one line), Claude coaches.
- **Real issue 2, not for tomorrow:** anyone with the public key can send many inserts. There's no rate limit, so someone could skew the counts. Options later: a per-session cap in the database, or an edge function with rate limiting. I'll state it honestly if asked.

**Action:** a "request budget" unit test that counts store calls through a full round, a score save and the leaderboard, so a future change that adds calls fails the test.

## 2. Drag and drop: what's wrong now (from the code)

1. **The drop goes where the finger is, not where the item is.** Players aim the sticker, but the game checks the finger. Grab the sticker by an edge, and "it's on the bin" can still miss.
2. **The 8px gaps between bins are dead zones.** A drop there bounces back and feels like the game failed.
3. **The dragged item grows (×1.08) and covers the bins.** On a phone, your finger and a big sticker hide the bin you're aiming at.
4. **No sign of where you can drop until you're over a bin.** The bins don't react when a drag starts.
5. **A sorted item always falls straight down,** not into the bin it went to. Sorting doesn't look like sorting ("more app than game", test 1).
6. **Discoverability:** the only clue that you can drag is a small grey hint, which got quieter in the UI 102 change.
7. **Laptops:** dragging on a trackpad is awkward, and there's no keyboard way to play quickly.
8. **Each move re-measures all six bins** (6 layout reads per pointer move). Measuring once at drag start is enough.

### Changes, in priority order

**P1 (makes it feel right):**
- **Aim with the item:** the drop point is the sticker's centre, not the finger.
- **Forgiving targets:** a drop up to 24px outside a bin, including the gaps, counts for the nearest bin. A pure, tested function in `dropTarget.ts`.
- **Shrink while dragging:** the item shrinks to 60% around its centre, so the bins stay visible. (Shrinking toward the grab point was tried and dropped while executing: when the sticker was grabbed during its entrance animation, WebKit tests showed it landing up to 110px from the finger.)
- **Bins wake up when a drag starts:** all bins lift slightly; the bin you'll drop into grows and gets the thick outline, as now.
- **Fly into the bin:** a sorted item shrinks into the bin it went into, for taps too. After a wrong answer, "Got it" sends it into the **right** bin, a last teaching moment.
- **Measure once:** the bins are measured at drag start, not on every move.

**P2 (if time allows, in this order):**
- **A one-time hint:** on the first item of a visit, the sticker nudges toward the bins with "Drag me to a bin". Skipped when the phone asks for reduced motion.
- **Laptop keys:** keys 1–6 pick a bin, with small key labels shown only on devices with a mouse or trackpad.
- **A haptic tick on drop** on Android phones that support it (iPhones don't allow it from the web).

**Tap stays exactly as it is.** Every change keeps tapping a bin working.

## 3. Vercel

1. **Me:** say yes to the commits, then push `main`.
2. **Me:** import the repo at vercel.com, root directory `app`, add the two `VITE_SUPABASE_…` variables, Deploy.
3. **Claude:** check the live link loads with the shared database and the privacy line. No test answers are sent.
4. **Me:** play it on an iPhone and an Android phone (SCRUM-32), dragging especially.

## 4. Tests and order

- **Order:** the request-budget test; then P1 change by change, with tests first where it's logic (`nearestTarget`); then P2 if time allows; then commits (my yes), push, Vercel.
- **Must keep passing:** the existing drag tests (onto a bin; dropped outside, nothing answered) on all four phones. New tests: a drop on the gap counts for the nearest bin; the keys pick bins.
- **Verified with:** the type check, unit tests, browser tests and screenshots at phone, landscape and desktop sizes.

## Review of this plan (before executing)

- **Risk:** changing the core interaction the night before the demo. *Kept:* each change is its own commit, so any one can be dropped before the demo. Tap is untouched, and the existing drag tests must pass.
- **Problem found in my own idea:** shrinking around the sticker's **centre** would pull it a little away from the finger when grabbed off-centre. *Changed:* shrink around the grab point. *Reversed while executing:* the grab point is miscalculated while the sticker is still scaling in, so it shrinks around its centre after all. The drop is judged by the sticker's centre, which is what the player sees.
- **Problem found:** the fly-in needs the sticker's resting position while it's still being dragged. *Changed:* the sticker works out its own target when it leaves, from the destination the round screen hands it.
- **Not needed tonight:** the haptic tick is low value (Android only). It stays last in P2, and is the first to cut.
- **Kept out:** the rate limit (needs a server-side design) and sound effects.
- **My SQL:** the index migration is mine to write. The rest is Claude's code, and I need to be able to explain it, so each change gets a short why.

## Results (25 Oct, evening)

- **Section 1:** request-budget test added (a visit = 14 calls). The index migration `002` is mine to write. The rate limit is still open.
- **Section 2, P1:** done, with changes found while testing: the sticker shrinks around its centre (not the grab point) to a fixed ~80px; the drop uses the last drag position; the name fades while dragging.
- **Section 2, P2:** done (the wiggle and bold hint on the first item, keys 1–6 with labels on mouse and trackpad devices, the Android vibration).
- **Checks:** 72 unit tests, 46 browser runs, drag tests repeated 36 times on four phones, build passed (255 kB gzipped).
- **Next:** commits (my yes), push, Vercel, a real-phone check.
