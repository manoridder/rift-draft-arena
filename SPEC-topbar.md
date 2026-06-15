# SPEC: Topbar cleanup and rank crest

Phase 1, step C of the visual upgrade (see VISUAL-AUDIT.md). Two parts:

1. A rank crest: a small inline SVG emblem next to the rank text whose color changes per rank, so climbing from Iron to Challenger has a visual reward. Pure visual.
2. Audio declutter: replace the three topbar audio buttons (Music, Effects, Audio) with one speaker icon that opens the existing Audio panel, and move the Music and Effects toggles into that panel. Done as a markup relocation so no audio behavior changes.

No scoring, tags, sim, or data changes.

## Current state

Topbar rankwrap in index.html:

```
<div class="rankwrap">
  <button class="btn ghost small" id="musBtn">Music: off</button>
  <button class="btn ghost small" id="sndBtn">Effects: on</button>
  <button class="btn ghost small" id="audioBtn">Audio</button>
  <span class="rank" id="rankTxt">Iron &middot; 0 LP</span>
  <div class="lpbar"><div class="fill" id="lpFill" style="width:0%"></div></div>
</div>
```

In js/game.js: RANKS is the 10 rank names, ladder.ri is the rank index 0 to 9, ladder.lp is LP, and renderRank sets rankTxt and lpFill. The musBtn, sndBtn and audioBtn click handlers are bound by id. The easter egg code reads musOn and writes musBtn.textContent, so the musBtn element must keep its id.

## Part 1: rank crest (do this first, pure visual)

### 1a. Add the crest to the topbar in index.html

Put it right before rankTxt inside rankwrap:

```
<span class="crest" id="rankCrest" aria-hidden="true">
  <svg viewBox="0 0 24 28" width="20" height="24">
    <path d="M12 1 L23 6 V15 C23 22 12 27 12 27 C12 27 1 22 1 15 V6 Z" fill="#0b1a2e" stroke="#785A28" stroke-width="1.4"/>
    <path id="rankGem" d="M12 7 L17 12 L12 17 L7 12 Z" fill="#6b6b6b"/>
  </svg>
</span>
```

This is a small hextech shield with a diamond gem. Only the gem color changes per rank.

### 1b. Add a rank color map in js/game.js

Next to RANKS:

```
var RANKCOL=["#6b6b6b","#8c6239","#9fb0c3","#c8aa6e","#3fd0c4","#1f9e5a","#5aa9ff","#9b59c6","#e84057","#f0e6d2"];
```

These line up with Iron, Bronze, Silver, Gold, Platinum, Emerald, Diamond, Master, Grandmaster, Challenger.

### 1c. Update the gem in renderRank

Add to renderRank, after it sets rankTxt:

```
var gem=document.getElementById("rankGem");
if(gem)gem.setAttribute("fill",RANKCOL[ladder.ri]);
```

### 1d. CSS in css/style.css

```
.crest{ display:inline-flex; align-items:center; filter:drop-shadow(0 1px 3px rgba(0,0,0,.5)); }
.crest svg{ display:block; }
```

Optional nice-to-have, a one-time pulse when you rank up. Only add if easy: in applyResult you already know lp.promo. When promo is true, add a class to rankCrest that runs a short scale pulse, then remove it. Skip if it complicates the step.

## Part 2: audio declutter (markup relocation, no behavior change)

The trick that keeps this safe: the musBtn and sndBtn elements keep their ids and their existing click handlers. They just move from the topbar into the Audio panel. The topbar keeps one button with id audioBtn (its existing handler already opens the panel), restyled as a speaker icon.

### 2a. Replace the three topbar buttons with one icon

In index.html, replace the three button lines in rankwrap with a single icon button that reuses id audioBtn:

```
<button class="btn ghost small icon" id="audioBtn" aria-label="Audio settings">
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor"/>
    <path d="M16 9 Q19 12 16 15" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <path d="M16 6 Q21 12 16 18" fill="none" stroke="currentColor" stroke-width="1.6"/>
  </svg>
</button>
```

The existing audioBtn click handler (which opens audioOverlay) needs no change.

### 2b. Move the Music and Effects toggles into the Audio panel

In the audioOverlay obox in index.html, add the two buttons (same ids, so their handlers still bind) above the volume sliders:

```
<div class="audiotoggles">
  <button class="btn ghost small" id="musBtn">Music: off</button>
  <button class="btn ghost small" id="sndBtn">Effects: on</button>
</div>
```

Now the panel has the on and off toggles plus the existing Music and Effects volume sliders, all in one place.

### 2c. CSS in css/style.css

```
.btn.icon{ padding:7px 9px; line-height:0; }
.btn.icon svg{ display:block; }
.audiotoggles{ display:flex; gap:10px; justify-content:center; margin-bottom:6px; flex-wrap:wrap; }
```

## Build in testable steps

1. Part 1, the rank crest. Commit. Confirm a colored gem shows next to the rank and that it changes color after a rank up.
2. Part 2, the audio relocation. Commit. Confirm the topbar shows one speaker icon, clicking it opens the panel, and Music and Effects toggles plus sliders all work from inside the panel.

## How to verify (Live Server)

- A small shield with a colored gem sits next to the rank text. Win games until you promote and confirm the gem color changes (Iron gray up to Challenger pale gold).
- Topbar now shows one speaker icon instead of three buttons. Clicking it opens the Audio panel.
- Inside the panel: Music toggle starts and stops the track, Effects toggle works and previews a click, both volume sliders still work.
- The easter egg still works: opening the chest pauses music and resumes it on close, exactly as before (this relies on musBtn keeping its id, which it does).
- Rank text and LP bar are unchanged.

## Rollback

All changes are presentation and markup. Move the buttons back to the topbar, remove the crest and the icon, and revert the RANKCOL and renderRank lines. No data or scoring affected.
