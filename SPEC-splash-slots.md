# SPEC: Splash art on team slots

Phase 1, step 1 of the visual upgrade (see VISUAL-AUDIT.md). The smallest safe presentation change: turn the small square champion slots on the draft screen into portrait cards using free Data Dragon loading art, with a frame, a scrim and a hover lift. The look is already proven in visuals-upgrade-demo.html.

This is pure presentation. It touches rendering and CSS only. It does not change scoring, tags, the sim, or any game logic.

## Why this first

It is visible on the main screen, it has no external art dependency (loading art is free from the same source you already use), and it is safe under the new draft flow: ranked moves to free pick from the pool, the daily puzzle keeps the random offers, but both keep the team slots. So this work is never thrown away.

## Scope

In scope: the filled team slots rendered by renderTeams (mySlots and foeSlots) and the enemy peek slots (peekSlots) on the item screen, all of which use the pslot markup.

Out of scope for this SPEC: the offer cards (ocard), the full pool grid (champ), the menu, the topbar, plan emblems. Those are later steps.

## Current state

In js/game.js, renderTeams builds each slot as:

```
'<div class="pslot'+(c?" filled":"")+'">'+
  '<div class="pic">'+(c?imgTag(c):"?")+'</div>'+
  '<div class="rl">'+ROLENL[r]+'</div><div class="nm">'+(c?c[0]:"")+'</div></div>'
```

imgTag(c) in js/data.js returns the 120px square icon (imgUrl) with a CommunityDragon square fallback (data-alt) and an initials fallback span (.fb), handled by imgFail.

CSS for .pslot puts the name and role as separate lines under a 56px square.

## Target look

A portrait card, taller than wide, with the loading art filling it, a dark gradient scrim from the bottom, the champion name in Cinzel over the scrim, and the role as a small label. Empty slots keep the current dim placeholder with a question mark. On hover the card lifts slightly and gains a teal glow. This mirrors the upgraded column in visuals-upgrade-demo.html.

## The change

### 1. Add a loading-art URL helper in js/data.js

Next to imgUrl and imgUrl2, add:

```
function imgLoading(c){ return "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/"+imgId(c)+"_0.jpg"; }
```

Loading art is versionless, so it does not need DD_VERSION. Use the same imgId(c) so the IMGFIX name corrections still apply.

### 2. Add a portrait image helper in js/data.js

So the slot can fall back gracefully if a champion has no loading art (rare). Add:

```
function slotImg(c){
  return '<img src="'+imgLoading(c)+'" data-alt="'+imgUrl(c)+'" alt="'+c[0]+'" loading="lazy" onerror="imgFail(this)"><span class="fb">'+initials(c[0])+'</span>';
}
```

This reuses the existing imgFail and .fb machinery: if loading art fails it swaps to the square icon, and if that fails it shows initials.

### 3. Update renderTeams in js/game.js

Change the filled branch to use slotImg and move the name into the picture so it can sit on the scrim. Keep the empty branch as is:

```
host.innerHTML+='<div class="pslot'+(c?" filled":"")+'">'+
  '<div class="pic">'+(c?slotImg(c)+'<span class="scrim"></span><span class="slotnm">'+c[0]+'</span>':"?")+'</div>'+
  '<div class="rl">'+ROLENL[r]+'</div></div>';
```

Note the old separate .nm line is removed because the name now sits over the art. Leave the .rl role label below.

### 4. CSS in css/style.css

Replace the .pslot and .pslot .pic rules with a taller card. Keep the existing .fb rule. New rules:

```
.pslot{ width:84px; text-align:center; }
.pslot .pic{
  width:84px; aspect-ratio:3/4; height:auto;
  border:1px solid var(--line); background:var(--panel2);
  display:flex; align-items:center; justify-content:center;
  font-family:"Cinzel",serif; color:#33415c; font-size:18px;
  overflow:hidden; position:relative; border-radius:3px;
  transition:transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.pslot.filled .pic{
  border-color:var(--gold-dim);
  box-shadow:inset 0 0 0 1px rgba(70,55,20,.55);
}
.pslot.filled .pic:hover{
  transform:translateY(-3px); border-color:var(--gold);
  box-shadow:inset 0 0 0 1px var(--gold-dim), 0 0 16px rgba(10,200,185,.3);
}
.pslot img{ width:100%; height:100%; object-fit:cover; object-position:top center; display:block; }
.pslot .scrim{
  position:absolute; left:0; right:0; bottom:0; height:60%;
  background:linear-gradient(180deg, rgba(1,10,19,0), rgba(1,10,19,.9));
}
.pslot .slotnm{
  position:absolute; left:0; right:0; bottom:3px; z-index:2;
  font-size:11px; color:var(--white); line-height:1.1; padding:0 2px;
  text-shadow:0 1px 3px #000;
}
.pslot .rl{
  font-size:10px; letter-spacing:.1em; color:var(--text);
  text-transform:uppercase; margin-top:3px;
}
```

## Build in testable steps

1. Add imgLoading and slotImg to data.js. Commit. (No visible change yet.)
2. Update renderTeams and the CSS. Commit. Open the draft screen, pick a champion, confirm the slot now shows loading art with the name on a scrim and lifts on hover.
3. Apply the same slotImg plus scrim plus slotnm markup to the peekSlots render on the item screen (line that builds the enemy peek). Commit and confirm there too.

## How to verify

- Draft a full team and check all five of your slots and all five enemy slots show portrait art, names readable, roles below.
- Check a champion with a name that has an IMGFIX correction still loads (the helper uses imgId so it should).
- Temporarily break the loading URL for one champion in devtools to confirm the fallback drops to the square icon and then to initials.
- Confirm empty slots before a pick still show the dim question mark placeholder.
- Resize narrow to confirm slots still wrap.

## Rollback

All changes are presentation. Revert the renderTeams line, the CSS block, and the two helpers to return to the square icons. No data or scoring is affected.
