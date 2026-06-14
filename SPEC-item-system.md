# SPEC: Item System Overhaul (Phase 2) v3, open shop

Status: approved design, ready to build. This replaces all previous versions of this spec.
Read CLAUDE.md first. House rules: no em dashes anywhere, all UI text in English, game logic in js/game.js, patch data in js/data.js.

## Vision

The item phase becomes one open shop, like the shop in real League: every champion can buy every item. The player distributes exactly 6 items over 5 champions, max 2 per champion. Builds become versatile and creative. Class pools (CLASSOPTS) and classOf routing disappear from the item flow entirely, so champion tag quality no longer decides what the shop offers.

Scoring is layered, and the layers must stay separate in code:
1. Base verdict: does this item answer the enemy team or amplify our own team. Always evaluated against full teams, never lanes.
2. Fit: does this item suit its holder. One central rule now, extensible per item later.
3. Plan fit (NOT built now): the upcoming comp identity system will add a third layer. Prepare the plumbing only: scoring calls every verdict as v(self, myTeam, enemyTeam, plan) where plan is always null for now. Existing verdict functions need no rewrite, JavaScript ignores extra arguments.

## Out of scope (do NOT build now)

- Comp identities (only the null plan argument plumbing).
- Per-item fit refinements (the hook must exist, zero items may use it yet).
- Champion tag or tier cleanup, handicap changes (1 + skillNow() * 0.012 is untouchable).
- Removing existing items or rewriting existing verdict functions.

## Build steps. Execute ONE step at a time, then stop so the owner can test and commit.

### Step 1: data layer (js/data.js only, non-breaking)

A. Every ITEMDEFS entry gains two metadata fields:
   cat: one of "Tank", "Damage", "Magic", "Support" (shop tab grouping).
   dmg: one of "ad", "ap", "none" (damage profile for the fit rule).

   Existing 24 entries get these values:
   heartsteel Tank none; thornmail Tank none; kaenic Tank none; randuin Tank none;
   trinity Damage ad; eclipse Damage ad; maw Damage ad;
   rabadon Magic ap; voidstaff Magic ap; zhonya Magic ap; morello Magic ap;
   edge Damage ad; serpent Damage ad; youmuu Damage ad;
   bloodthirster Damage ad; ldr Damage ad; mercurial Damage ad; mortal Damage ad;
   moonstone Support none; mikael Support none; locket Support none; mandate Support none; knights Support none; zekes Support none.

B. Add these new ITEMDEFS entries. Every name matches sr-items.json exactly (all verified). Verdicts follow the existing style: v(s, m, e) returns [points 0-5, one short English sentence]. Helpers has(c, tag) and cnt(team, tag) exist. Tags: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain.

| id | name | cat | dmg | rule |
|---|---|---|---|---|
| sunfire | Sunfire Aegis | Tank | none | cnt(e,"v")+cnt(e,"f")>=3 -> 4 "Long brawls, the burn adds up." else 3 |
| warmogs | Warmog's Armor | Tank | none | cnt(m,"n")>=1 -> 4 "With a healer behind you, you never leave the map." else 2 |
| unending | Unending Despair | Tank | none | cnt(m,"f")===1 -> 4 "You soak alone, the drain keeps you standing." else 3 |
| abyssal | Abyssal Mask | Tank | none | cnt(e,"a")>=2 and cnt(m,"a")>=2 -> 5 "Resists for you, amplification for your AP." ; cnt(e,"a")>=2 -> 3 ; else 1 |
| cleaver | Black Cleaver | Damage | ad | cnt(m,"d")>=3 and cnt(e,"f")>=2 -> 5 "You shred armor for the whole AD team." ; cnt(e,"f")>=2 -> 4 ; else 2 |
| steraks | Sterak's Gage | Damage | ad | cnt(e,"v")>=2 -> 4 "The shield survives their all-in." else 2 |
| deathsdance | Death's Dance | Damage | ad | cnt(e,"d")>=3 -> 4 ; cnt(e,"v")>=1 -> 3 ; else 2 |
| titanic | Titanic Hydra | Damage | ad | has(s,"h") -> 4 "Your HP scaling becomes damage." else 3 |
| banshee | Banshee's Veil | Magic | ap | cnt(e,"e")>=2 or cnt(e,"v")>=2 -> 4 "The spellshield eats their engage." else 1 |
| blackfire | Blackfire Torch | Magic | ap | cnt(e,"f")>=2 -> 4 "The burn spreads across their tanks." else 3 |
| shadowflame | Shadowflame | Magic | ap | cnt(e,"f")===0 -> 4 "All squishies, your burst executes." else 2 |
| cryptbloom | Cryptbloom | Magic | ap | cnt(e,"f")>=2 -> 4 "Pen through their resists plus a team heal on kills." else 2 |
| lichbane | Lich Bane | Magic | ap | cnt(e,"f")===0 -> 4 ; else 3 |
| stormsurge | Stormsurge | Magic | ap | cnt(e,"f")<=1 -> 4 "Squishy targets, the storm finishes them." else 2 |
| hubris | Hubris | Damage | ad | has(s,"r") or cnt(m,"r")>=2 -> 4 "Snowball plan, statue stacks early." else 2 |
| profane | Profane Hydra | Damage | ad | cnt(e,"f")===0 -> 4 "Cleave bursts their squishy lineup." else 3 |
| axiom | Axiom Arc | Damage | ad | cnt(e,"f")===0 -> 4 ; else 3 "More ultimates is never wrong." |
| voltaic | Voltaic Cyclosword | Damage | ad | cnt(e,"p")>=2 -> 4 "The slow lets you reach their poke." else 3 |
| collector | The Collector | Damage | ad | cnt(e,"f")===0 -> 4 "Executes plus gold on their squishies." else 3 |
| infinity | Infinity Edge | Damage | ad | has(s,"h") -> 4 "The crit spike caps your scaling." else 3 |
| kraken | Kraken Slayer | Damage | ad | cnt(e,"f")>=2 -> 5 "True damage melts their tanks." ; cnt(e,"f")===1 -> 3 ; else 2 |
| ga | Guardian Angel | Damage | none | cnt(e,"v")>=2 -> 5 "The revive beats their dive." ; cnt(e,"v")===1 -> 3 ; else 2 |
| ardent | Ardent Censer | Support | none | cnt(m,"d")>=2 -> 4 "Your auto attackers spike hard." else 2 |
| redemption | Redemption | Support | none | cnt(e,"v")>=2 -> 4 "The big heal lands under their burst." else 3 |
| helia | Echoes of Helia | Support | none | cnt(m,"p")>=2 -> 4 "Poke wars, the echoes sustain you." else 3 |
| flowingwater | Staff of Flowing Water | Support | none | cnt(m,"a")>=3 -> 4 "Your AP team loves the buff." else 2 |
| dawncore | Dawncore | Support | none | has(s,"h") or cnt(m,"h")>=3 -> 4 "Scaling heal and shield power." else 3 |

   Note: ga has dmg "none" on purpose. Its core value (the revive) is universal; making it carry-biased is a planned future fit refinement, not part of this build.

C. Do NOT remove CLASSOPTS or classOf in this step. The old item phase must keep working until step 2 replaces it. Acceptance: game runs unchanged, console reports zero ITEMDEFS names unmatched in SR_ITEMS.

### Step 2: open shop UI and selection model (js/game.js, index.html, css/style.css)

- G.items becomes a pick list, each pick = {slot: roleIndex 0..4, itemId}. End state: exactly 6 picks, max 2 per slot, no duplicate itemId within one slot. Champions with 0 items are allowed.
- Layout: a champion selector row at the top (the 5 champion cards, each showing two small item slots; clicking a card makes it the active champion, with a clear highlight). Below it the shop: a search box, tabs ALL / DAMAGE / MAGIC / TANK / SUPPORT (filtering on cat), and a grid of item cards showing name, gold and the statsText line from SR_ITEMS (the lookup helper from the earlier task already exists).
- Clicking a shop item assigns it to the active champion (first free slot). Clicking a filled slot on a champion card removes that item. Clicking a shop item when the active champion already has 2 gives a brief visual hint and does nothing.
- Sticky counter: "Items left: X of 6" plus the line "Max 2 per champion". The "Lock in items" button enables only at exactly 6.
- The enemy peek panel stays unchanged.
- Remove CLASSOPTS and classOf in this step if nothing else references them; report any remaining references instead of deleting blindly.

### Step 3: scoring pipeline (js/game.js)

- Central fit layer, one function, one location, with this exact extension structure:
  applyFit(baseResult, item, champ): if item.dmg is "ap" and not has(champ,"a"), or item.dmg is "ad" and not has(champ,"d"), the result is capped at [1, "Wasted stats on this champion."]. Otherwise unchanged. After the global rule, if the item defines an optional fit(baseResult, champ, myTeam, enemyTeam) hook, call it. No item defines this hook yet; it exists for future per-item refinements (Guardian Angel carry bias is the documented first candidate, add it as a code comment).
- evalTeam consumes the pick list. Each pick: base verdict v(s, m, e, null) where s is the holder, then applyFit. itemT = sum of all 6 (raw max 30).
- Update every "/25" display and formula to "/30": analysis panels, math panel text, share text, coach score (itemPct = itemT/30, weights stay 45/40/15).
- Analysis item rows list 6 entries as "Champion: Item", including the wasted-stats reason when the cap applied.

### Step 4: AI distribution (js/game.js)

- aiItems returns a legal pick list (exactly 6, max 2 per champion, no duplicate item per champion) built greedily over all champion-item pairs, scored with the FULL pipeline (verdict plus fit). Blend with randomness via the existing skillNow() pattern. Use only R() so the daily seed stays deterministic.

### Step 5: headless simulation (new file tools/sim.js)

- Node script: stub the DOM (getElementById returning no-op elements, matchMedia, requestAnimationFrame), load js/data.js, js/items-data.js, js/game.js, play full games headlessly: pro draft, AI both sides where needed, item distribution, evalTeam, phase rolls.
- Report per rank (0, 4, 9), 400 games each: smart player (bans S tiers, picks to fix missing frontline and damage mix, items by best pipeline score) versus random player winrates.
- Acceptance: zero thrown errors; smart winrate roughly 80 to 90 percent at rank 0 and 40 to 55 at rank 9. Outside that range: report the numbers and stop, do not self-tune.

## UI strings (use exactly these)

"ITEM SHOP", "Items left: X of 6", "Max 2 per champion", "Lock in items", "Wasted stats on this champion.", tabs: "ALL", "DAMAGE", "MAGIC", "TANK", "SUPPORT".

## Definition of done

Five steps in five separate commits, sim green, game plays end to end in Live Server, and the math panel adds up for both teams: tiers + synergy + counters + items = total.
