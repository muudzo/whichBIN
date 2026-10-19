---
name: check-rule-sources
description: Checks Which Bin's waste items against Omrin's official 2026 waste guides for Leeuwarden and records the exact quote, page and check date for each one. Use when adding or changing a waste item, when asked to check or verify the game's rules, or before a test round.
---

# Check rule sources

Every sorting rule in Which Bin must come from Omrin's own words. This skill checks items against Omrin's guides, keeps only the ones the guides back up, and writes down the evidence.

## Sources (primary only)

| ID | Source | URL |
|---|---|---|
| `omrin-2026-en` | Omrin, *Waste Guide 2026*, Leeuwarden, English edition | https://www.omrin.nl/media/0cphazwn/6466-omri_bro_afvalwijzer_2026-engels.pdf |
| `omrin-2026-nl` | Omrin, *Afvalwijzer 2026*, Leeuwarden, Dutch edition | https://www.omrin.nl/media/a2ocvunp/6466_bro_afvalwijzer_nl_2026-def.pdf |

Never use search-engine summaries, AI answers, forums or other municipalities' rules as a source. If an item isn't in these guides, it isn't in the game.

## Steps

1. **Get the text.** Download both PDFs to a scratch folder (not the repo), then run
   `.claude/skills/check-rule-sources/extract-pdf-text.sh <file.pdf> > <file.txt>` for each.
   Each PDF page holds two printed pages. Cite the **printed** page number (the `Pag N` footer), which is the same in both editions.
2. **Find each item** in both editions: the item itself, or the example list it appears in. Copy the exact words in English and Dutch.
3. **Give each item a status:**
   - `confirmed`: named in both editions, same destination.
   - `category`: only its category is named (e.g. "plastic"). Allowed, but say so.
   - `conflict`: the editions disagree. Not in the game; add it to the questions for Omrin.
   - `not found`: not in either guide. Not in the game. Never guess.
   - `skipped`: the guide covers it, but a rule outside the guide also applies (e.g. deposit/statiegeld on bottles and cans). Not in the game until Omrin confirms.
4. **Write the "why" line:** one or two short sentences in plain English, built from the English edition's wording. No facts that aren't in the guides.
5. **Write the output:**
   - `app/src/data/items.json`: only `confirmed` and `category` items, in the format below. Aim for 10–15.
   - `research/rule-sources.md`: the evidence for **every** item checked, including rejected ones, with quotes, pages and status.
6. **Report back:** how many items passed, which were rejected and why, any conflicts, and the check date. Ask before changing the bin of an item that's already in the game.

## Item format (`app/src/data/items.json`)

```json
{
  "id": "jam-jar",
  "name": "Jam jar",
  "bin": "glasbak",
  "why": "Glass jars go in a shared glass container near you. Dirty is fine, and the lid can stay on.",
  "pages": [7, 11],
  "status": "confirmed"
}
```

- `bin` is one of: `sortibak`, `biobak`, `papierbak`, `glasbak`, `textielbak`, `not-a-bin`.
- `not-a-bin` items also get `"where"`: where it goes instead (e.g. "Milieustraat (recycling centre)").
- The file's top level holds `checked` (the check date, YYYY-MM-DD), `sources` and `bins`, so the game can show where each rule comes from.

## Rules

- Never invent a rule. When unsure, the status is `not found`.
- Quotes are exact. Rewording only happens in the "why" line.
- Only the Sortibak's colour (grey) is stated in the guides. Don't give other bins a colour as if it were a rule.
- Never remove an item from the game without saying why.
