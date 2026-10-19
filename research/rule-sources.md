# Rule sources: the evidence behind every item

> Made with the `check-rule-sources` agent skill (`.claude/skills/check-rule-sources/`). Checked **2026-10-19**.
> The game's items are in `app/src/data/items.json`. This file shows why each one is there, and why others aren't.

## Sources

| ID | Source |
|---|---|
| EN | Omrin, *Waste Guide 2026*, Leeuwarden, English edition: https://www.omrin.nl/media/0cphazwn/6466-omri_bro_afvalwijzer_2026-engels.pdf |
| NL | Omrin, *Afvalwijzer 2026*, Leeuwarden, Dutch edition: https://www.omrin.nl/media/a2ocvunp/6466_bro_afvalwijzer_nl_2026-def.pdf |

Page numbers are the printed `Pag N` numbers, the same in both editions. Quotes are exact, typos included ([sic]).

## In the game (15)

| # | Item | Bin | Status | EN quote | NL quote | Pag |
|---|---|---|---|---|---|---|
| 1 | Jam jar | Glasbak | confirmed | "Glass bottles and jars (dirty and with lids allowed)" · "jam jars" · "The Omrin Waste App helps you quickly find a glass, paper, or textile container near you!" | "Mag vies en met deksel." · "jampot" · "Er zijn ook verzamelcontainers voor oud papier, glas en textiel." | 7, 11 |
| 2 | Empty wine bottle | Glasbak | confirmed | "wine bottles" | "wijnfles" | 7, 11 |
| 3 | Broken wine glass | Sortibak | confirmed | "These do NOT go in the glass container but are treated as resiudual [sic] waste: … wine glasses" | "Dit hoort NIET in de glascontainer, maar bij restafval: … wijnglas" | 11 |
| 4 | Used pizza box | Sortibak | confirmed | "The following items are NOT recyclable but are treated as rsidual [sic] waste: used pizza and cake boxes" | "Dit hoort NIET bij het oud papier, maar bij restafval: vieze pizza- en taartdozen" | 10 |
| 5 | Milk carton | Sortibak | confirmed | "Plastic · Cans · Cartons" (Sortibak) · "drink cartons" (not paper) · "Plastic, metal cans, drink cartons, and diapers can go into the Sortibak" | "Plastic · Blik · Drinkpakken" · "drinkpakken" (niet bij oud papier) · "Plastic, blik, drinkpakken en luiers mogen bij ons in de Sortibak" | 8, 10, 17 |
| 6 | Plastic food packaging | Sortibak | **category** | "Plastic, metal cans, drink cartons, and diapers can go into the Sortibak … our high-tech machines separate the many different types and sizes of materials afterwards" | "Plastic, blik, drinkpakken en luiers mogen bij ons in de Sortibak" | 8, 17 |
| 7 | Leftover pasta | Biobak | confirmed | "What goes in your household or shared container for organic waste? leftovers" | "Wat hoort er in de Biobak of in de gft-zuil? etensresten" | 6, 9 |
| 8 | Cardboard egg carton | Papierbak | confirmed | "egg cartons" | "eierdozen" | 10 |
| 9 | Envelope with a window | Papierbak | confirmed | "envelopes with windows" | "enveloppen met venster" | 10 |
| 10 | Clean cardboard box | Papierbak | confirmed | "clean paper and cardboard" | "schoon papier en karton" | 10 |
| 11 | Torn T-shirt | Textielbak | confirmed | "clothing, may be worn or torn" · "Collect (damaged) textiles in a plastic bag. Seal the bag tightly" | "kleding, mag versleten of kapot zijn" · "Verzamel (kapot) textiel in een plastic zak." | 12, 19 |
| 12 | Old pair of shoes | Textielbak | confirmed | "pairs of shoes tied together" | "schoenen als paar samen gebonden" | 12 |
| 13 | Used batteries | Not a bin: KCA | confirmed | "By KCA, we mean hazardous waste such as batteries … store them safely in your red KCA box … our chemical waste truck (chemokar) … free of charge" | "Met kca bedoelen we gevaarlijk afval zoals batterijen en verf … rode kca-box … chemokar … GRATIS" | 7 |
| 14 | Old mattress | Not a bin: milieustraat | confirmed | "Hand in your old mattress or duvet for free at the milieustraat." · "you are required to make a reservation" · "Don't forget to bring your milieupas" | "Lever je matrassen, toppers of dekbedden gratis in op de milieustraat." · "Vergeet niet je milieupas mee te nemen!" | 12, 14 |
| 15 | Used frying oil | Not a bin: milieustraat or supermarket | confirmed | "deep-frying oil · Take this to the Milieustraat or your local supermarket" | "frituurvet · Dit lever je in bij de milieustraat of supermarkt" | 9 |

## Not in the game

| Item | Status | Why |
|---|---|---|
| Plastic bottle, drink can | skipped | The guides say plastic and cans go in the Sortibak, but many bottles and cans carry a Dutch deposit (statiegeld) and go back to the shop. The guides don't mention this. Ask Omrin. |
| Tea bag, coffee cup, receipt | not found | Not named in either guide. |
| Broken hairdryer | confirmed, not used | Chemokar or milieustraat (Pag 7). Left out to stay at 15 items. |
| Glass mug | confirmed, not used | EN says "glass mugs", NL says "theeglas" (tea glass). Same rule, slightly different item. The wine glass covers it. |

## Questions for Omrin

1. **Bin-out time:** EN says "before 07:00", NL says "vóór 07.30 uur" (Pag 5). Which is right?
2. **Deposit bottles and cans:** should they go back to the shop, or is the Sortibak fine too?
3. **Source quality:** several NL footers say "Afvalwijzer 2025", while the cover says 2026.

## Colours

Only the Sortibak's colour is stated: "Sortibak (grey bin)" (EN Pag 4). The game shouldn't present any other bin's colour as a rule.
