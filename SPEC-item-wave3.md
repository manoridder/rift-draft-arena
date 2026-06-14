# SPEC: Item Wave 3, the final shelf (Phase 2 follow-up)

Status: approved, ready to build. Read CLAUDE.md first. House rules: no em dashes anywhere, all UI text in English, game logic in js/game.js, patch data in js/data.js. Extends the item system; only add, change nothing existing. This batch completes the Summoner's Rift item pool.

## Why this batch

The remaining 17 niche and S16 legendaries. Each gets a verdict tied to a real reason to buy it, so none are filler. After this, every meaningful completed SR item from sr-items.json is in the shop. Boots are deliberately left out (see step 3).

## Out of scope

No comp identities, no tier or handicap changes, no rewriting existing verdicts. Boots are not added.

## Build steps. Edit automatically is fine; pure data plus a sim, then one doc note.

### Step 1: add the 17 wave 3 items (js/data.js only)

cat (shop tab), dmg (ad / ap / mana / none), verdict v(s, m, e) returns [points 0-5, short English sentence]. Helpers has(c,tag), cnt(team,tag). Tags: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain, m manahungry.

| id | name | cat | dmg | rule |
|---|---|---|---|---|
| mejais | Mejai's Soulstealer | Magic | ap | has(s,"r") and cnt(m,"r")>=2 -> 4 "Snowball comp, the stacks turn a lead into a landslide." else 1 |
| terminus | Terminus | Damage | none | cnt(e,"a")>=2 and cnt(e,"d")>=1 -> 4 "On-hit that punches through mixed resists." else 3 |
| gunblade | Hextech Gunblade | Magic | ap | has(s,"v") -> 4 "Hybrid damage and healing for an AP diver." else 2 |
| sunderedsky | Sundered Sky | Damage | ad | cnt(m,"v")>=1 or has(s,"v") -> 4 "A guaranteed crit and a heal to win bruiser duels." else 3 |
| bastionbreaker | Bastionbreaker | Damage | ad | cnt(e,"f")>=2 -> 4 "Built to break the bigger bodies in front of you." else 3 |
| endlesshunger | Endless Hunger | Damage | ad | cnt(e,"e")>=2 or cnt(e,"v")>=2 -> 4 "Omnivamp and tenacity to grind out their all-in." else 3 |
| bloodmail | Overlord's Bloodmail | Damage | ad | has(s,"v") or has(s,"f") -> 4 "Health that becomes damage for a frontline bruiser." else 2 |
| actualizer | Actualizer | Magic | mana | has(s,"h") -> 4 "Cheap mana and scaling for your caster's mid game." else 3 |
| bandlepipes | Bandlepipes | Support | none | cnt(e,"a")>=1 and cnt(e,"d")>=1 -> 4 "Resists both ways plus utility for an enchanter." else 3 |
| bloodletter | Bloodletter's Curse | Magic | ap | cnt(e,"f")>=2 -> 4 "Magic pen that scales against their stacked health." else 3 |
| protoplasm | Protoplasm Harness | Tank | none | cnt(m,"a")>=2 or cnt(m,"p")>=2 -> 4 "A tanky battery for a backline caster under pressure." else 3 |
| hexoptics | Hexoptics C44 | Damage | ad | cnt(e,"f")===0 -> 4 "Crit and tempo to delete their squishy lineup." else 3 |
| fiendhunter | Fiendhunter Bolts | Damage | ad | cnt(e,"v")>=2 -> 4 "Attack speed and crit that punish their divers." else 3 |
| hexplate | Experimental Hexplate | Damage | ad | has(s,"v") -> 4 "Ultimate haste and attack speed for a fighter who dives." else 3 |
| duskdawn | Dusk and Dawn | Damage | none | has(s,"a") and has(s,"d") -> 4 "Hybrid stats for a champion that wants both." ; has(s,"a") -> 3 ; else 2 |
| wintersapproach | Winter's Approach | Tank | mana | cnt(e,"e")>=2 -> 4 "Mana, health and a slow shield against their engage." else 3 |
| shurelyas | Shurelya's Battlesong | Support | none | cnt(m,"e")>=2 or cnt(m,"v")>=2 -> 5 "The team speed turns your engage into a coordinated wave." else 3 |

### Step 2: regression sim

Run tools/sim.js. Acceptance: zero errors, all item names matched, smart winrate roughly 80-90 at rank 0 and 40-55 at rank 9. Report the numbers. Outside the bands: stop and report, do not self-tune.

### Step 3: document the boots decision (CLAUDE.md only)

Add a short note under a "Design decisions" heading in CLAUDE.md:
"Tier 3 boots (Armored Advance, Chainlaced Crushers, Gunmetal Greaves, Spellslinger's Shoes) are intentionally excluded from the shop. In the current 6-item budget they would waste a slot and rarely beat a legendary. If a future game mode adds a separate boots slot, they can be reintroduced with their own scoring (movement, tenacity vs CC, armor vs AD, magic pen vs AP)."

## Definition of done

Two commits (items, then the CLAUDE.md note), sim reported, all 17 new items buyable under the right tabs, game plays end to end. Add a v0.0.11 line to What's new with title "The Last Crate" and text "The final legendaries hit the shelves. The shop is fully stocked."
