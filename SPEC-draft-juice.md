# SPEC: Draft juice (turn glow and lock-in flash)

Phase 1, step B of the visual upgrade (see VISUAL-AUDIT.md). Two small effects that make the draft feel alive instead of static:

1. A glow on the team that is currently on the clock, so it is obvious whose turn it is.
2. A short flash on a team slot the moment a champion is locked into it.

Pure presentation. A few lines of JS to mark state plus CSS animation. No scoring, tags, sim, or data changes. The pick sound already fires in doPlayer and doEnemy, so the flash lines up with audio you already have.

## Note on your current code

This SPEC is written against the draft flow functions (advance, doPlayer, doEnemy, setDraftMsg, and the team render). In your local code the slot markup was moved into renderTeamInto by the earlier plan-teams refactor, so apply the slot change there rather than in renderTeams. The function names and exact lines may differ slightly from this SPEC; match the behavior, not the line numbers.

## How the flow works (for reference)

- cur() returns the current step {who:"P" or "E", act:"pick" or "ban"}.
- doPlayer(c) handles your pick or ban, doEnemy() handles the AI, both call advance().
- advance() rebuilds the teams (renderTeams, which uses renderTeamInto), the bans, the turn message (setDraftMsg), then the pickers.
- The two team panels in index.html are div.side.me (holding mySlots) and div.side.foe (holding foeSlots).

## Effect 1: turn glow on the active side

### JS

In setDraftMsg (which already runs every advance and already knows whose turn it is), toggle an "active" class on the correct side panel. Add this after the existing who check:

```
var meSide=document.querySelector(".side.me");
var foeSide=document.querySelector(".side.foe");
if(meSide&&foeSide){
  var pTurn=!draftDone()&&cur().who==="P";
  var eTurn=!draftDone()&&cur().who==="E";
  meSide.classList.toggle("active",pTurn);
  foeSide.classList.toggle("active",eTurn);
}
```

When the draft is done both come off, because pTurn and eTurn are both false.

### CSS in css/style.css

```
.side.active{ animation:sideglow 1.6s ease-in-out infinite; }
.side.me.active{ border-color:var(--blue); }
.side.foe.active{ border-color:var(--red); }
@keyframes sideglow{
  0%,100%{ box-shadow:0 0 0 rgba(10,200,185,0); }
  50%{ box-shadow:0 0 16px rgba(10,200,185,.28); }
}
.side.foe.active{ animation-name:sideglowfoe; }
@keyframes sideglowfoe{
  0%,100%{ box-shadow:0 0 0 rgba(232,64,87,0); }
  50%{ box-shadow:0 0 16px rgba(232,64,87,.28); }
}
```

## Effect 2: lock-in flash on the new slot

### JS

Record which slot was just filled, so the renderer can flash only that one.

In doPlayer, on a pick (not a ban), set the marker before advance:

```
else{snd("pick");G.my[c[1]]=c;G.lastPick={side:"my",role:c[1]};}
```

In doEnemy, on a pick:

```
if(a.act==="ban")G.foeBans.push(c);else{G.foe[c[1]]=c;G.lastPick={side:"foe",role:c[1]};}
```

In the team renderer (renderTeamInto in your code), when building a slot, add a "justpicked" class if it matches G.lastPick. The slot is built per side and per role, so you know both. Conceptually:

```
var isNew=G.lastPick&&G.lastPick.side===thisSideKey&&G.lastPick.role===r;
// add " justpicked" to the pslot class when isNew is true
```

where thisSideKey is "my" for mySlots and "foe" for foeSlots.

After both teams are rendered, clear the marker so it flashes once and does not re-trigger on the next advance. Put this at the very end of renderTeams (after renderTeamInto has run for both sides):

```
G.lastPick=null;
```

If G.lastPick is undefined on the first render, nothing matches and nothing flashes, which is correct.

### CSS in css/style.css

```
.pslot.justpicked .pic{ animation:lockflash .6s ease; }
@keyframes lockflash{
  0%{ transform:scale(1); box-shadow:inset 0 0 0 1px rgba(70,55,20,.55); }
  35%{ transform:scale(1.07); box-shadow:0 0 20px rgba(10,200,185,.7), inset 0 0 0 1px var(--gold); }
  100%{ transform:scale(1); box-shadow:inset 0 0 0 1px rgba(70,55,20,.55); }
}
```

## Reduced motion

Add the new animations to the existing prefers-reduced-motion block so they switch off:

```
@media (prefers-reduced-motion: reduce){
  .side.active, .pslot.justpicked .pic{ animation:none; }
}
```

## Build in testable steps

1. Effect 1 (turn glow): add the setDraftMsg lines and the .side.active CSS. Commit. Confirm the glow follows whose turn it is and turns off when the draft completes.
2. Effect 2 (lock-in flash): add the G.lastPick lines in doPlayer and doEnemy, the justpicked class in renderTeamInto, the clear at the end of renderTeams, and the lockflash CSS. Commit. Confirm only the newly filled slot flashes once on each pick, for both you and the AI.

## How to verify (Live Server)

- Start a ranked draft: your side glows on your turn, the enemy side glows while the AI picks.
- Each pick flashes only the slot that was just filled, once, then settles. The AI picks flash too.
- Bans do not flash a team slot (correct, bans go to the ban row).
- When the draft completes, neither side glows.
- Turn on reduced motion in the OS and confirm the glow and flash stop.

## Rollback

All changes are presentation. Remove the setDraftMsg class toggles, the G.lastPick lines, the justpicked class and clear, and the CSS keyframes. No data or scoring affected.
