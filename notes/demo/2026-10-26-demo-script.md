# Which Bin? · Demo script (Mon 26 Oct 2026)

**Length:** about 6 minutes, plus questions. If the slot is shorter, cut the sections marked *(cut if short)*.
**You need:**
- your phone with the live link open, screen mirrored if the room allows
- a laptop with the before/after images (`design/ui102/compare/`)
- a QR code to the link on a slide or a printout

`[ ]` = fill in before Monday.

---

## Before Monday

**Must have**

- [ ] The game on a public link (SCRUM-27).
- [ ] The live link saves to Supabase (`app/.env.local` filled in), checked with one real round (SCRUM-52, SCRUM-53).
- [ ] The privacy line in the game, before strangers play (SCRUM-54).
- [ ] Played on a real iPhone and a real Android phone: drag, tap, "Not quite", leaderboard (SCRUM-32).
- [ ] Commits made, branch pushed, CI green on the pull request.

**Makes it great**

- [ ] A mini test 2 on Sunday: 2–3 international students play the live link while thinking aloud; ask the three questions in `research/test-1-findings.md` §4 (SCRUM-33).
- [ ] Test 1's gaps filled in: date, number of testers, method. Someone will ask "how many testers?"
- [ ] The architecture diagrams updated to match the build: no Players table; counts worked out when asked; items also in the database.
- [ ] A screen recording of one full round on the live link, as a backup.
- [ ] Two timed run-throughs out loud.

**Monday morning**

- Phone charged.
- Do Not Disturb on, brightness up, the link open.
- Test the link on the room's Wi-Fi or your hotspot.
- **Don't** clear the database: the audience's answers are the community results.

---

## The script

### 0:00 · Hook (30 s)

*Ask the room, hands up.*

> "Quick question. You've just finished a glass of wine, and the glass breaks. Where does it go in Leeuwarden? Hands up for the glass container."
>
> *(pause)*
>
> "It's the grey Sortibak. Drinking glass isn't glass waste here: Omrin's waste guide says so on page 11. If this room doesn't know, imagine arriving from abroad last month."

### 0:30 · The problem (1 min)

> "Leeuwarden has its own rules. A jam jar goes to a container on the street, and it can be dirty with the lid on. A used pizza box isn't paper, it's Sortibak. A milk carton? Also Sortibak. International students get this wrong, not because they don't care, but because nobody showed them.
>
> I checked what's out there. I collected 1,462 App Store reviews of seven Dutch waste apps. They're almost all about collection calendars, notifications and logins. When Dutch users ask 'welke bak?', they mean *which bin goes out on which day*, not *which bin does this item go in*. And very few reviews are in English.
>
> In my first test, the testers didn't know where glass goes. The information exists, in Omrin's guide, but you only look something up when you already know you don't know."

### 1:30 · How others tackle it, and what's different (1 min)

> "Today the options are:
> - **Look-up tools:** Omrin's guide, websites, the A to Z lists in some apps. They help if you think to look.
> - **Reminder apps,** like the ones in my review research. They tell you *when*, not *what*.
> - **Stickers on the bin.** In Dutch, and only once you're standing there.
>
> Which Bin is different in four ways:
> 1. **You learn before you're at the bin, by playing.** Two minutes, no account, in English. You make the mistake in the game, not in the container.
> 2. **Every mistake explains itself, with its source.** Each of the 15 items has a quote from Omrin's 2026 guide, the page number and the date I checked it. You can check me.
> 3. **You're not the only one.** After a wrong answer it says how many other players got it wrong too. Confusion becomes normal, not embarrassing.
> 4. **The answers are useful beyond the game.** The leaderboard shows the most-missed items. That's exactly what Omrin or the municipality would want to know."

### 2:30 · Live demo (1.5 min)

*Show the QR code: "Play along if you like."* Then play on your phone, mirrored.

1. **Welcome:** "It says what it is in one line. That came from test 1, where testers didn't know what they were looking at."
2. **One item right, by dragging it** onto the bin: "Drag or tap. The bin lights up under your finger." Point at the **Right!** card: "It names the item, so you know which answer it was for."
3. **One item wrong on purpose.** The **Not quite** sheet: "Why, with Omrin's page number. And this line: x of y other players got this wrong too." *(Read the real numbers. With the room playing, they'll be live.)*
4. **Finish or skip to the leaderboard:** "Made-up names, so nothing personal is saved. And here: the most-missed items."
5. *(cut if short)* **On the laptop,** show `compare/1440-desktop-round.jpg` and `compare/667x375-landscape-round.jpg`: "It works on any phone, sideways too, and on a laptop. That's from the UI 102 lecture: type scale, spacing system, grids."

### 4:00 · How it's built (45 s) *(cut if short)*

> "It's a React app with a Supabase database in Frankfurt, so the data stays in the EU. I wrote the database rules myself. A browser can add an answer, but never read anyone's answers, change them or delete them. Sixteen tests prove that, and they run on GitHub with every pull request.
>
> I used AI as a tool throughout, and logged what it did next to what I did. One example: an agent skill that checks every game rule against Omrin's guide, so no rule is made up."

### 4:45 · What testing changed (45 s)

> "Test 1 was on the Figma prototype. Three things changed because of it:
> - Testers didn't know where glass goes, so round 1 always includes the glass items.
> - They didn't know what it was, so the welcome screen now says it in one line.
> - It felt more like an app than a game, so I added drag and drop and sticker animations.
>
> `[ ]` If you ran test 2 on Sunday: one sentence on what it showed and what you'll change."

### 5:30 · What's next, and close (30 s)

> "Next: two more test rounds with international students, Omrin checking my rules, and more items. The bigger idea is that the most-missed items tell a city where its explanation fails.
>
> So: where does the broken wine glass go?" *(let the room answer: Sortibak)* "Now you know. Thank you."

---

## Questions you'll probably get

| Question | Short answer |
|---|---|
| Why a game and not an app with a search? | Search only helps when you know you don't know. The game finds the gaps for you, explains each one, and brings your mistakes back in the next round. |
| How do you know the rules are right? | Every item has a quote, page and check date from Omrin's 2026 guide (English and Dutch), checked by an agent skill and by me. Next: Omrin checking them (SCRUM-47). |
| What do you store about players? | Per answer: a random id per visit, the round, the item, the chosen bin and the time. No names, emails or IP addresses. Leaderboard names are generated, and the database refuses anything else. |
| Can someone cheat or wreck the data? | Browsers can only add rows, never change or delete them. Right or wrong is worked out by the database, not sent by the phone. Sixteen tests prove the rules. |
| How many people tested it? | `[ ]` Test 1: how many, who, how. Test 2: `[ ]` if run. Be honest that it's early: one round so far. |
| What did AI do, and what did you do? | Point to `AI_USE_LOG.md`. For example, I wrote the database SQL myself after a short lesson; the diagrams are mine; AI built parts of the frontend that I can explain. |
| Only Leeuwarden? | For now. The rules come from one data file with sources, so another city means new verified data, not new code. |
| Accessibility? | Measured colour contrast of at least 4.5:1, a hyper-legible font, keyboard focus, tap or drag, and it works from the smallest iPhone to a desktop. |

## If something breaks

- **No internet or the link is down:** play the screen recording, and show the before/after images on the laptop.
- **The database is unreachable:** the game keeps playing, with a small message that answers couldn't be saved. Say so: "That's on purpose. Saving never blocks playing."
- **A bug on stage:** "That's what tests 2 and 3 are for." Note it and move on.
