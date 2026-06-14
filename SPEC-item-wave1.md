# SPEC: Item Wave 1, gap fillers (Phase 2 follow-up)

Status: approved, ready to build. Read CLAUDE.md first. House rules: no em dashes anywhere, all UI text in English, game logic in js/game.js, patch data in js/data.js. This extends the item system from SPEC-item-system.md; do not change anything from that spec, only add.

## Why this batch

These 18 items answer counter questions the current shop cannot ask (anti attack-speed, anti heal on AD, scaling magic resist, armor pen vs tanks, on-hit AP, and so on). Each new entry matches an sr-items.json name exactly (all verified). One small new mechanic is included: a manahungry tag so mana items do not score full value on champions that do not build mana.

## Out of scope

- No comp identities, no tier or handicap changes, no rewriting existing verdicts.
- Do not touch waves 2 and 3 (those items stay out for now).

## Build steps. ONE step at a time, then stop for testing.

### Step 1: manahungry tag and mana fit rule (js/data.js + js/game.js)

A. In js/data.js, add the letter "m" (manahungry) to the tag string of exactly these champions, leaving their other tags intact:
   Anivia, Annie, Ahri, Azir, Cassiopeia, Orianna, Ryze, Syndra, Viktor, Xerath, Vel'Koz, Lux, Zoe, Twisted Fate, Karthus, Swain, Seraphine, Taliyah, Hwei, Aurelion Sol, Kassadin, Lissandra, Nidalee, Ezreal, Jayce, Anivia.
   (These are mana-scaling mages and mana bruisers. Do NOT tag tanks or enchanters that merely have a mana bar.)
   Add "m" to the tag legend comment near the top of data.js: "m manahungry".

B. In js/game.js, extend the central fit function applyFit so that an item with dmg "mana" is capped at [1, "Wasted stats on this champion."] when the holder does not have tag "m". This mirrors the existing ap/ad wasted-stats rule. Items with dmg "ad" or "ap" keep their current behavior.

C. Acceptance: game runs unchanged, console still reports zero unmatched item names. A mana item on a non-m champion shows the wasted line in analysis.

### Step 2: add the 18 wave 1 items (js/data.js only)

Add these ITEMDEFS entries. Each has cat (shop tab), dmg (ad / ap / mana / none for the fit rule), and a verdict v(s, m, e) returning [points 0-5, one short English sentence]. Helpers has(c,tag), cnt(team,tag). Tags: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain, m manahungry.

| id | name | cat | dmg | rule |
|---|---|---|---|---|
| spiritvisage | Spirit Visage | Tank | none | cnt(m,"n")>=1 or cnt(m,"s")>=2 -> 5 "Amplifies every heal and shield your team has." ; cnt(e,"a")>=2 -> 3 ; else 2 |
| forceofnature | Force of Nature | Tank | none | cnt(e,"a")>=3 -> 5 "A wall of magic resist against their AP." ; cnt(e,"a")>=2 -> 4 ; else 1 |
| frozenheart | Frozen Heart | Tank | mana | cnt(e,"d")>=3 -> 5 "Their AD carries lose a chunk of attack speed." ; cnt(e,"d")>=2 -> 4 ; else 2 |
| deadmans | Dead Man's Plate | Tank | none | cnt(e,"d")>=2 -> 4 "Armor and a slow to stick onto their AD threats." ; has(s,"e") -> 4 "The momentum sets up your engage." ; else 3 |
| jaksho | Jak'Sho, The Protean | Tank | none | cnt(m,"f")===1 -> 5 "Solo frontline scaling into both damage types." ; cnt(e,"a")>=2 and cnt(e,"d")>=2 -> 4 ; else 3 |
| iceborn | Iceborn Gauntlet | Tank | mana | cnt(e,"d")>=2 -> 4 "Armor plus a slow field to lock their AD down." else 3 |
| witsend | Wit's End | Damage | none | cnt(e,"a")>=2 -> 5 "Attack speed bruiser answer to their AP." ; cnt(e,"a")>=1 -> 3 ; else 2 |
| hollowradiance | Hollow Radiance | Tank | none | cnt(e,"a")>=2 and cnt(e,"f")>=2 -> 4 "Magic resist that burns their grouped frontline." else 3 |
| shojin | Spear of Shojin | Damage | ad | has(s,"h") -> 4 "Your ability based carry scales harder every fight." else 3 |
| serylda | Serylda's Grudge | Damage | ad | cnt(e,"f")>=2 -> 5 "Armor pen plus a slow to cut through their tanks." ; cnt(e,"f")===1 -> 3 ; else 2 |
| liandry | Liandry's Torment | Magic | ap | cnt(e,"f")>=2 -> 5 "Percent health burn melts their stacked health." ; cnt(e,"f")===1 -> 3 ; else 2 |
| botrk | Blade of The Ruined King | Damage | ad | cnt(e,"f")>=2 -> 5 "Percent health on-hit shreds their big bodies." ; cnt(e,"v")>=1 -> 3 ; else 2 |
| ravenous | Ravenous Hydra | Damage | ad | cnt(m,"v")>=1 or has(s,"v") -> 4 "Cleave and lifesteal for your divers." else 3 |
| riftmaker | Riftmaker | Magic | ap | has(s,"v") or has(s,"a") and has(s,"f") -> 4 "Sustained AP bruiser damage in long fights." else 3 |
| stridebreaker | Stridebreaker | Damage | ad | cnt(m,"e")<=1 -> 4 "Gives your bruiser the engage tool the team lacks." else 3 |
| nashors | Nashor's Tooth | Magic | ap | has(s,"a") -> 4 "On-hit AP spike for your ability carry." else 2 |
| cosmicdrive | Cosmic Drive | Magic | ap | cnt(m,"p")>=2 -> 4 "Speed to kite in your poke and spread comp." else 3 |
| chempunk | Chempunk Chainsword | Damage | ad | cnt(e,"n")>=1 or cnt(e,"s")>=2 -> 5 "AD grievous wounds against their healing." ; else 2 |

Acceptance: every CLASSOPTS reference still resolves, console reports zero unmatched names, the shop shows the new items under the right tabs, and a full game plays end to end.

### Step 3: regression sim

Run tools/sim.js. Acceptance unchanged from the main spec: zero errors, smart winrate roughly 80-90 at rank 0 and 40-55 at rank 9. Report the numbers. If outside the bands, stop and report, do not self-tune.

## Definition of done

Three steps, three commits, sim reported, game plays end to end in Live Server with the 18 new items buyable and the mana fit rule working.
