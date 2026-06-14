# SPEC: Item Wave 2, expected classics (Phase 2 follow-up)

Status: approved, ready to build. Read CLAUDE.md first. House rules: no em dashes anywhere, all UI text in English, game logic in js/game.js, patch data in js/data.js. Extends the item system; only add, change nothing existing.

## Why this batch

These are the items players expect to see in a shop: the crit ADC family and the mana mage classics. Many are variants on a theme, so each verdict gets a distinct accent to keep the shop choice meaningful instead of five identical crit items. All 18 names verified against sr-items.json. Mana items use dmg "mana" so the existing wave 1 mana-fit rule applies.

## Out of scope

No comp identities, no tier or handicap changes, no rewriting existing verdicts, no wave 3 items.

## Build steps. Edit automatically is fine; this is pure data plus a sim.

### Step 1: add the 18 wave 2 items (js/data.js only)

Add these ITEMDEFS entries. cat (shop tab), dmg (ad / ap / mana / none), verdict v(s, m, e) returns [points 0-5, one short English sentence]. Helpers has(c,tag), cnt(team,tag). Tags: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain, m manahungry.

| id | name | cat | dmg | rule |
|---|---|---|---|---|
| essencereaver | Essence Reaver | Damage | ad | has(s,"h") -> 4 "Crit and haste keep your carry casting." else 3 |
| shieldbow | Immortal Shieldbow | Damage | ad | cnt(e,"v")>=2 or cnt(e,"e")>=2 -> 5 "The shield saves your carry from their all-in." ; cnt(e,"v")===1 -> 3 ; else 2 |
| phantomdancer | Phantom Dancer | Damage | ad | cnt(e,"v")>=2 -> 4 "Move speed and a ghost to slip their dive." else 3 |
| runaans | Runaan's Hurricane | Damage | ad | cnt(e,"f")>=2 -> 4 "Multiple targets means your auto carry cleaves the frontline." else 2 |
| firecannon | Rapid Firecannon | Damage | ad | cnt(e,"p")>=2 -> 4 "Extra range to answer their poke first." else 3 |
| navori | Navori Flickerblade | Damage | ad | has(s,"h") -> 4 "Crit that refunds your carry's abilities." else 3 |
| statikk | Statikk Shiv | Damage | ad | cnt(e,"f")>=2 -> 4 "Chain lightning clears their grouped frontline and waves." else 3 |
| yuntal | Yun Tal Wildarrows | Damage | ad | has(s,"h") -> 4 "Early crit spike for your scaling carry." else 3 |
| stormrazor | Stormrazor | Damage | ad | has(s,"r") or cnt(m,"r")>=2 -> 4 "An energized burst to open fights on your tempo." else 3 |
| rodofages | Rod of Ages | Magic | mana | has(s,"h") -> 5 "A scaling stat stack your late game mage dreams of." else 3 |
| ludens | Luden's Echo | Magic | mana | cnt(e,"f")<=1 -> 4 "Burst and waveclear into their squishy lineup." else 3 |
| malignance | Malignance | Magic | mana | has(s,"h") -> 4 "Ultimate focused mage scaling and burn." else 3 |
| horizon | Horizon Focus | Magic | ap | cnt(m,"p")>=2 -> 4 "Reveals and amps damage in your poke war." else 3 |
| rylais | Rylai's Crystal Scepter | Magic | ap | cnt(m,"p")>=2 or cnt(m,"v")===0 -> 4 "Every spell slows, locking targets for your team." else 3 |
| rocketbelt | Hextech Rocketbelt | Magic | ap | cnt(m,"e")<=1 -> 4 "A dash to give your mage the engage the team lacks." else 3 |
| archangels | Archangel's Staff | Magic | mana | has(s,"h") -> 5 "Mana stacking into a massive late game shield and AP." else 3 |
| manamune | Manamune | Damage | mana | has(s,"h") -> 4 "Mana stacking AD for your scaling caster carry." else 3 |
| guinsoos | Guinsoo's Rageblade | Damage | none | has(s,"a") and has(s,"d") -> 5 "On-hit hybrid scaling for an attack based fighter." ; has(s,"a") -> 3 ; else 2 |

Note: guinsoos is dmg "none" on purpose because it is hybrid; its verdict already checks for the right holder, so the wasted-stats rule should not fight it.

### Step 2: regression sim

Run tools/sim.js. Acceptance: zero errors, all item names matched, smart winrate roughly 80-90 at rank 0 and 40-55 at rank 9. Report the numbers. Outside the bands: stop and report, do not self-tune.

## Definition of done

Two commits (items, then nothing to commit for the sim run itself, just report), sim green, the 18 new items buyable in the shop under the right tabs, game plays end to end. Add a v0.0.10 line to What's new: "Wave 2: crit and mana classics added to the shop."
