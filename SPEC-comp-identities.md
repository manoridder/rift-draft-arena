# SPEC: Comp Identity System (Phase 2, the big one) v3

Status: design ready, build when the owner says go. Read CLAUDE.md first. House rules: no em dashes anywhere, all UI text in English, game logic in js/game.js, patch data in js/data.js.

## The idea

Synergy is currently scored against one universal mold, so a comp without a frontline always loses points even when that was the plan. This system lets the player declare a game plan AFTER picks and items, just before the match, the way pro teams read their finished comp and commit to a win condition. Synergy is then judged against that plan: what the plan wants is rewarded, a complete comp gets nice-to-have bonuses, penalties the plan does not need are forgiven, and failing the plan's keystone is punished hard. The freedom is in choosing any plan; the judgement is in whether it fits the five champions you actually have. The AI also picks a plan and is judged the same way.

Champion tags in data.js: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain.

## Phase order (important change)

The plan phase comes AFTER the item phase. Flow: side select, draft, items, PLAN, match, analysis. In code: the "Lock in items" handler currently calls startMatch; it should instead open the plan phase, and locking in the plan calls startMatch.

## The seven plans

Each plan has: a one line win condition (shown to the player), keystone (hard requirement, -10 if missing, +4 if met), nice (nice-to-have tags that grant a small bonus when present but are never punished when absent), and forgive (default synergy penalties waived because the plan does not need them).

1. Front to back. Win: "Fight slowly and safely, your carries hit the nearest safe target and win with sustained damage." keystone: at least 2 frontline (f). nice: h, n, c. forgive: low engage.
   Note: front to back is treated as a standard variation, the default-feeling plan, not an exotic one.
2. Dive. Win: "Start fast, kill their carry, end the fight before it begins." keystone: at least 2 divers (v). nice: e, f, r. forgive: nothing.
3. Pick. Win: "Catch one target with crowd control and burst, then take an objective five versus four." keystone: at least 3 cc (c). nice: e, r, g. forgive: one-dimensional damage, thin frontline.
4. Get Down Mr President (protect the carry). Win: "Build the team around one hypercarry and keep them alive at all costs." keystone: at least 1 scaling carry (h) AND at least 1 frontline (f). nice: n, s, c. forgive: low engage.
   Note: the playful name is intentional, keep it exactly.
5. Poke and siege. Win: "Chunk their health from range, force them off objectives, take towers without full fights." keystone: at least 2 poke (p). nice: g, c, h. forgive: no frontline penalty, no engage penalty.
6. Split push. Win: "Force them to answer the side lanes, then take objectives with the numbers advantage." keystone: at least 1 global or at least 2 divers (g, or v twice). nice: h, c, p. forgive: no engage penalty, no frontline penalty.
7. Early skirmish. Win: "Win the small fights early and snowball before they come online." keystone: at least 1 early game champ (r) AND at least 1 cc or engage (c or e), because you need a tool to force fights. nice: g, v, d. forgive: no frontline penalty, scaling weakness is expected.

## Scoring rule

The plan reshapes synergy, it does not replace it.

- Existing synergy checks stay, but a penalty whose tag is in the active plan's forgive set becomes 0 with a neutral label (for example "No frontline, but your plan does not need one").
- Keystone: fail -> -10 with a clear label (for example "Get Down Mr President has no frontline to body-block for the carry"). Met -> +4 "Keystone met".
- nice tags: for each, +2 if cnt(team, tag) >= 2, +1 if cnt(team, tag) === 1, 0 if absent. Label like "Bonus: extra crowd control rounds out the comp". These are rewards for a complete comp, never penalties.
- If plan is null (safety), synergy behaves exactly like today.

Net effect: a frontline-less Poke comp loses the -8 (forgiven) and gains poke value, scoring well. A frontline-less Front to back comp keeps the -8 AND fails its keystone, scoring badly. Same comp, opposite verdict, because the plan differs.

## Build steps. ONE step at a time, test and commit between each.

### Step 1: plan phase UI after items (index.html, css/style.css, js/game.js)

- New screen scr-plan, shown after "Lock in items". Seven cards: plan name, one line win condition, and "Needs: ..." for the keystone. Reuse existing card and screen styling. A "Lock in plan" button calls startMatch.
- The "Lock in items" handler now opens scr-plan instead of calling startMatch.
- Store the choice in G.plan (id string). Show it in the analysis ("Your plan: Pick").
- Card titles exactly: "Front to back", "Dive", "Pick", "Get Down Mr President", "Poke and siege", "Split push", "Early skirmish".

### Step 2: plan-aware synergy (js/game.js)

- Add a PLANS table (id -> {label, win, keystone: function(team){...}, nice:[], forgive:[]}) near the synergy function.
- Change synergy(team) to synergy(team, plan) implementing keystone, nice and forgive.
- Wire G.plan into the player's evalTeam call and G.foePlan into the enemy's (the pipeline already carries a plan slot).
- Update the analysis synergy panel and math panel to show the plan name, the win condition, and the plan-driven lines.

### Step 3: AI picks a plan (js/game.js)

- After the AI finishes drafting and items, it picks the plan whose keystone its comp best satisfies, with a light R()-weighted tiebreak so the daily stays deterministic. This is more honest than a blind random plan: the AI commits to what its comp can actually do.
- The AI is scored with its own plan.

### Step 4: regression sim (tools/sim.js)

- The smart player picks the plan best matching its final comp (same logic as the AI is fine).
- Report per rank (0, 4, 9), 400 games. New target band: smart winrate roughly 78-90 at rank 0 and 38-55 at rank 9. If outside, report and stop, do not self-tune. We tune the keystone, nice and bonus numbers together after seeing the output.

## Out of scope for v1 (next spec)

- Plan-versus-plan counters (dive beats poke, split beats front to back, pick beats protect). Its own spec and sim pass later.
- Per-plan item recommendations.
- Tier or champion tag changes.

## Definition of done

Four steps, four commits, sim reported (we tune together after). Game plays end to end: side, draft, items, plan, match, analysis showing how the comp scored against the chosen plan. What's new line v0.1.0, title "Know Your Win Condition", text "After items, declare your game plan. Your comp is now judged on the strategy you chose, not one rigid mold."
