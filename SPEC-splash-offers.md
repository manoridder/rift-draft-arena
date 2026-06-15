# SPEC: Splash art on the daily offer cards

Phase 1, step 2 of the visual upgrade (see VISUAL-AUDIT.md). Give the three pick offer cards the same portrait look the team slots got in SPEC-splash-slots.md: loading art, a scrim, the name over the art, a hover lift. Reuses the slotImg helper that step 1 already added, so there is almost no new code.

Pure presentation. Rendering and CSS only. No scoring, tags, sim, or data changes.

## Why this is safe and worth doing

In the new draft flow, ranked serves picks through the full pool grid (renderPickGrid) and the daily challenge serves picks through the offer panel (the three ocard cards plus reroll). So the offer cards live on in the daily mode and polishing them is not wasted. The full pool grid stays as square tiles on purpose: it is a dense selector and large art there would be heavy and busy. This SPEC touches the offer cards only.

## Current state

In js/game.js, renderPickers builds each offer card as:

```
var d=document.createElement("div");d.className="ocard";
d.innerHTML='<div class="cpic">'+imgTag(ch)+'</div><b>'+ch[0]+'</b><span>'+ROLENL[ch[1]]+'</span>';
```

imgTag(ch) returns the square icon. The name (b) and role (span) sit as separate lines below a square picture.

slotImg(ch) already exists in js/data.js from step 1. It returns loading art with a square-icon fallback and an initials fallback, using the existing imgFail and .fb machinery.

## Target look

A taller portrait card: loading art fills it, a dark scrim fades up from the bottom, the champion name in Cinzel sits over the scrim, and the role is a small label under the card. On hover the card lifts and gains a gold and teal glow. This matches the offer column treatment in visuals-upgrade-demo.html. The reroll button and the "choose one" title are unchanged.

## The change

### 1. Update the ocard render in js/game.js (inside renderPickers)

Swap imgTag for slotImg, add the scrim and the name overlay, and keep the role label below:

```
var d=document.createElement("div");d.className="ocard";
d.innerHTML='<div class="cpic">'+slotImg(ch)+'<span class="scrim"></span><span class="slotnm">'+ch[0]+'</span></div>'+
  '<span class="ocrole">'+ROLENL[ch[1]]+'</span>';
d.addEventListener("click",function(){doPlayer(ch);});
```

The old standalone name line (the b element) is removed because the name now sits on the art. The role moves to a small label with its own class so the old .ocard b and .ocard span rules are not relied on.

### 2. CSS in css/style.css

Update the .ocard picture to a portrait and add the overlay rules. The .scrim and .slotnm rules may already exist from step 1; if so, do not duplicate them, just confirm they apply here too. Add or adjust:

```
.ocard .cpic{
  width:100%; aspect-ratio:3/4; height:auto;
  background:#10203a; position:relative; overflow:hidden;
  border-radius:3px;
}
.ocard .cpic img{
  width:100%; height:100%; object-fit:cover; object-position:top center; display:block;
  transition:transform .35s ease;
}
.ocard:hover .cpic img{ transform:scale(1.05); }
.ocard .slotnm{
  position:absolute; left:0; right:0; bottom:4px; z-index:2;
  font-family:"Cinzel",serif; font-size:14px; color:var(--gold-bright);
  line-height:1.1; padding:0 6px; text-shadow:0 1px 3px #000;
}
.ocard .ocrole{
  display:block; text-align:center; font-size:11px; text-transform:uppercase;
  letter-spacing:.1em; color:var(--blue); padding:6px 0 2px;
}
```

Keep the existing .ocard hover lift and glow. If the old .ocard b and .ocard span rules are now unused, they can stay harmlessly or be removed.

## Build in testable steps

1. Update the render line and the CSS. Commit.
2. Open the daily challenge, reach a pick, and confirm the three cards now show portrait loading art with the name over a scrim and the role below, and that they lift on hover.

## How to verify

- Daily challenge: the three offer cards show portrait art, names readable, roles below, hover lift works.
- Clicking a card still picks that champion (doPlayer still fires).
- Reroll still works and still shows the count.
- Ranked is unaffected: picks still come from the full pool grid as square tiles.
- Break one loading URL in devtools to confirm the fallback drops to the square icon and then initials.
- Narrow screen: the three cards still wrap and stay readable.

## Rollback

Revert the render line and the CSS additions to return to square icons. No data or scoring affected.
