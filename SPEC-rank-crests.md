# SPEC: Distinct escalating rank crests

Phase 1, step D-zero of the visual upgrade (see VISUAL-AUDIT.md). Replace the simple color-only crest from SPEC-topbar with ten distinct hand drawn emblems that grow more ornate as you climb: a rough iron crag, a bronze coin, a silver kite shield, a gold laurel, platinum crystals, an emerald hexagon, a diamond star, a master orb, grandmaster crossed swords, and a winged crowned Challenger crest. This SPEC also includes the version bump and the What's new entry so the whole visual batch can be committed and pushed.

Pure presentation. Rendering and CSS only. No scoring, tags, sim, or data changes.

## Relationship to the earlier step

SPEC-topbar added a single hextech shield with id rankGem and changed only its color per rank via RANKCOL, set in renderRank. This SPEC supersedes that crest: it keeps the RANKCOL array (reused as the rim colors) but swaps the static shield for a per-rank builder. So you remove the old crest SVG markup and the gem.setAttribute line, and add the builder below.

## Changes

### 1. index.html: make the crest an empty container

Replace the existing crest span (the static shield SVG added in SPEC-topbar) with an empty container that the builder fills:

```
<span class="crest" id="rankCrest" aria-hidden="true"></span>
```

### 2. js/game.js: add the crest builder

You already have RANKCOL from SPEC-topbar. Add a GEM array and the builder functions near it. The function names are prefixed with crest so they do not collide with anything else.

```
var GEM=["#8a8a8a","#c98a4a","#d7e3f0","#f0d693","#6ef0e4","#4fe08a","#9cccff","#c79be8","#ff7d8e","#bff7ef"];
function crestMir(s){return '<g transform="translate(80,0) scale(-1,1)">'+s+'</g>';}
function crestGlow(i){if(i<4)return{d:"",e:""};var op=(0.14+(i-4)*0.055).toFixed(2);
  return{d:'<defs><filter id="b'+i+'" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter></defs>',
  e:'<circle cx="40" cy="44" r="25" fill="'+RANKCOL[i]+'" opacity="'+op+'" filter="url(#b'+i+')"/>'};}
function crestRays(i){if(i<6)return"";return '<g stroke="'+GEM[i]+'" stroke-width="1.3" stroke-linecap="round" opacity="0.7">'+
  '<path d="M40 9 V2"/><path d="M28 12 L23 4"/><path d="M52 12 L57 4"/><path d="M18 20 L10 14"/><path d="M62 20 L70 14"/></g>';}
function crestFront(i){
  switch(i){
  case 0: return '<path d="M27 24 L50 19 L59 38 L54 58 L33 63 L20 46 Z" fill="#23272e" stroke="#6b6b6b" stroke-width="2.4" stroke-linejoin="round"/>'+
    '<path d="M41 23 L36 42 L44 56" fill="none" stroke="#14161b" stroke-width="2.2" stroke-linecap="round"/>'+
    '<circle cx="31" cy="33" r="2" fill="#6b6b6b"/><circle cx="50" cy="49" r="2" fill="#6b6b6b"/>';
  case 1: return '<circle cx="40" cy="42" r="20" fill="#0b1a2e" stroke="#8c6239" stroke-width="3"/>'+
    '<path d="M28 48 L40 31 L52 48" fill="none" stroke="#c98a4a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<circle cx="40" cy="54" r="2.4" fill="#c98a4a"/><circle cx="20" cy="42" r="2" fill="#8c6239"/><circle cx="60" cy="42" r="2" fill="#8c6239"/>';
  case 2: return '<path d="M40 20 L59 31 L40 65 L21 31 Z" fill="#0b1a2e" stroke="#9fb0c3" stroke-width="2.6" stroke-linejoin="round"/>'+
    '<path d="M24 39 L56 39 L51 47 L29 47 Z" fill="#9fb0c3"/><path d="M40 23 V33" stroke="#9fb0c3" stroke-width="2" stroke-linecap="round"/>';
  case 3: var l3='<path d="M28 58 C16 50 16 33 26 26" fill="none" stroke="#c8aa6e" stroke-width="2.2"/>'+
    '<ellipse cx="20" cy="49" rx="3.4" ry="1.7" transform="rotate(42 20 49)" fill="#c8aa6e"/>'+
    '<ellipse cx="18.5" cy="40" rx="3.4" ry="1.7" transform="rotate(22 18.5 40)" fill="#c8aa6e"/>'+
    '<ellipse cx="22" cy="32" rx="3.2" ry="1.6" transform="rotate(4 22 32)" fill="#c8aa6e"/>';
    return l3+crestMir(l3)+'<circle cx="40" cy="42" r="12" fill="#0b1a2e" stroke="#c8aa6e" stroke-width="2.4"/>'+
    '<path d="M40 33 L42.5 40 L50 40 L44 44.5 L46 52 L40 47.5 L34 52 L36 44.5 L30 40 L37.5 40 Z" fill="#f0d693"/>';
  case 4: var w4='<g fill="#2aa89e"><path d="M30 40 L12 30 L31 36 Z"/><path d="M30 45 L11 40 L31 43 Z"/></g>';
    return w4+crestMir(w4)+'<path d="M40 18 L48 40 L40 62 L32 40 Z" fill="#3fd0c4"/><path d="M40 18 L48 40 L40 62 Z" fill="#2aa89e"/>'+
    '<path d="M28 30 L33 44 L28 58 L23 44 Z" fill="#3fd0c4"/><path d="M28 30 L33 44 L28 58 Z" fill="#249b91"/>'+
    '<path d="M52 30 L57 44 L52 58 L47 44 Z" fill="#3fd0c4"/><path d="M52 30 L57 44 L52 58 Z" fill="#249b91"/>'+
    '<path d="M40 18 L44 30 L40 34 L36 30 Z" fill="#a7f0e8" opacity="0.7"/>';
  case 5: var l5='<path d="M27 58 C15 50 15 32 25 25" fill="none" stroke="#1f9e5a" stroke-width="2.2"/>'+
    '<ellipse cx="19" cy="49" rx="3.6" ry="1.8" transform="rotate(42 19 49)" fill="#1f9e5a"/>'+
    '<ellipse cx="17.5" cy="40" rx="3.6" ry="1.8" transform="rotate(22 17.5 40)" fill="#2bb86c"/>'+
    '<ellipse cx="21" cy="31" rx="3.4" ry="1.7" transform="rotate(4 21 31)" fill="#1f9e5a"/>';
    return l5+crestMir(l5)+'<path d="M32 31 L48 31 L55 42 L48 53 L32 53 L25 42 Z" fill="#1f9e5a" stroke="#0c5a31" stroke-width="1.4" stroke-linejoin="round"/>'+
    '<path d="M36 35 L44 35 L49 42 L44 49 L36 49 L31 42 Z" fill="none" stroke="#7fe0a8" stroke-width="1.1"/>'+
    '<path d="M32 31 L48 31 L44 35 L36 35 Z" fill="#3ec47e" opacity="0.7"/>'+
    '<path d="M50 30 L51 33 L54 34 L51 35 L50 38 L49 35 L46 34 L49 33 Z" fill="#ffffff" opacity="0.85"/>';
  case 6: var w6='<g fill="#3a86d6"><path d="M30 40 L10 28 L31 35 Z"/><path d="M30 46 L8 38 L31 43 Z"/><path d="M31 51 L12 52 L31 50 Z"/></g>';
    return w6+crestMir(w6)+'<path d="M40 14 L46 36 L68 42 L46 48 L40 70 L34 48 L12 42 L34 36 Z" fill="#5aa9ff"/>'+
    '<path d="M40 14 L46 36 L40 42 L34 36 Z" fill="#9cccff"/><path d="M40 42 L46 48 L40 70 L34 48 Z" fill="#3a86d6"/>'+
    '<path d="M40 42 L68 42 L46 48 Z" fill="#7fbcff"/><path d="M40 42 L12 42 L34 48 Z" fill="#4a92e0"/>'+
    '<path d="M54 28 L55 31 L58 32 L55 33 L54 36 L53 33 L50 32 L53 31 Z" fill="#fff" opacity="0.9"/>';
  case 7: var w7='<g fill="#7a3fa6"><path d="M30 42 L12 28 L31 37 Z"/><path d="M30 47 L11 39 L31 44 Z"/><path d="M31 51 L15 50 L31 50 Z"/></g>';
    return w7+crestMir(w7)+'<path d="M33 31 L34 23 L40 27 L46 23 L47 31 Z" fill="#c79be8"/>'+
    '<circle cx="40" cy="44" r="11" fill="#9b59c6"/><circle cx="40" cy="44" r="11" fill="none" stroke="#e0c4f5" stroke-width="1.4"/>'+
    '<circle cx="36.5" cy="40.5" r="3.4" fill="#ecd6f7" opacity="0.8"/>';
  case 8: var g8='<g fill="#a32d3a"><path d="M30 40 L9 26 L31 35 Z"/><path d="M30 46 L7 38 L31 43 Z"/><path d="M31 51 L11 53 L31 50 Z"/></g>';
    return g8+crestMir(g8)+'<g stroke="#cdd6e0" stroke-width="2.6" stroke-linecap="round"><path d="M24 62 L54 24"/><path d="M56 62 L26 24"/></g>'+
    '<circle cx="24" cy="62" r="2.4" fill="#8c6239"/><circle cx="56" cy="62" r="2.4" fill="#8c6239"/>'+
    '<path d="M40 34 L48 43 L40 53 L32 43 Z" fill="#e84057"/>'+
    '<path d="M30 24 L31 15 L36 20 L40 11 L44 20 L49 15 L50 24 Z" fill="#e84057"/>';
  case 9: var c9='<g fill="#c8aa6e"><path d="M30 38 L8 22 L31 33 Z"/><path d="M30 44 L6 34 L31 41 Z"/><path d="M30 50 L9 49 L31 48 Z"/><path d="M31 55 L14 58 L31 54 Z"/></g>';
    return c9+crestMir(c9)+'<path d="M28 26 L29 14 L35 21 L40 10 L45 21 L51 14 L52 26 Z" fill="#f0e6d2" stroke="#c8aa6e" stroke-width="1"/>'+
    '<circle cx="40" cy="8" r="2.6" fill="#bff7ef"/>'+
    '<path d="M40 32 L43 41 L53 41 L45 47 L48 57 L40 51 L32 57 L35 47 L27 41 L37 41 Z" fill="#bff7ef"/>'+
    '<path d="M40 38 L41.5 42 L46 42 L42.5 45 L44 49 L40 46.5 L36 49 L37.5 45 L34 42 L38.5 42 Z" fill="#ffffff" opacity="0.6"/>';
  }
}
function crestSVG(i){var g=crestGlow(i);
  return '<svg viewBox="0 0 80 84" width="24" height="25" style="display:block;overflow:visible">'+g.d+g.e+crestRays(i)+crestFront(i)+'</svg>';}
```

### 3. js/game.js: use the builder in renderRank

Remove the old crest line from SPEC-topbar (the one that read rankGem and called setAttribute). In its place, set the container HTML:

```
document.getElementById("rankCrest").innerHTML=crestSVG(ladder.ri);
```

### 4. CSS in css/style.css

Update the .crest rule so the wings, rays and glow are not clipped:

```
.crest{ display:inline-flex; align-items:center; line-height:0; overflow:visible; filter:drop-shadow(0 1px 3px rgba(0,0,0,.5)); }
.crest svg{ display:block; overflow:visible; }
```

## Build in testable steps

1. Replace the crest markup in index.html, add the builder and GEM array in game.js, switch renderRank to crestSVG, and update the CSS. Commit. Confirm the Iron crest shows at the start and that the emblem changes shape and richness after a promotion.

## How to verify (Live Server)

- At Iron the crest is a rough metal crag. Win games to climb and confirm each rank shows a different emblem, ending in the winged crowned Challenger crest.
- The crest is not clipped at the top of the bar (wings and glow show fully).
- Rank text and LP bar still read correctly next to it.

## Version bump and What's new (do this last, right before the push)

This entry covers the whole visual batch in this push (slots, offer cards, draft juice, topbar, crests), not only the crests. In js/game.js:

Change VERSION to:

```
var VERSION={num:"0.1.2",name:"Splash Damage"};
```

Prepend this entry to the top of the CHANGELOG array (newest first):

```
{v:"0.1.2",name:"Splash Damage",notes:[
  "Champions now show their splash art across the draft. Your team, the enemy team and your plan screen swap small square icons for full portrait cards with the champion name set over the art.",
  "The daily challenge's three pick cards get the same portrait treatment.",
  "The draft feels alive: the side on the clock glows, and a champion flashes the moment it locks into a slot, for your picks and the AI's.",
  "The three audio buttons in the top bar collapse into one speaker icon that opens the audio panel, where the music and effects toggles now sit next to their volume sliders.",
  "Your rank wears a crest. Ten hand drawn emblems that grow as you climb, from a rough block of iron to a winged, crowned Challenger."
]},
```

If you prefer a different name than Splash Damage, two alternatives that fit: The Glow Up, or War Paint. Just change both the VERSION name and the entry name to match.

## Rollback

All changes are presentation. Restore the simple crest from SPEC-topbar, remove the builder and GEM array, and revert the VERSION and CHANGELOG. No data or scoring affected.
