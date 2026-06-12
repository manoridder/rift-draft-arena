/* =====================================================================
   Rift Draft Arena: headless balance simulation (Phase 2, step 5)
   Run with: node tools/sim.js

   Loads js/items-data.js, js/data.js, js/game.js into a stubbed-DOM vm
   context, then plays full games headlessly using the real game functions
   (pro draft, AI opponent, item distribution, evalTeam, phase rolls).

   Reports, per rank (0, 4, 9), 400 games each, the winrate of a smart player
   (bans S tiers, picks to fix missing frontline and damage mix, items by best
   pipeline score) versus a random player, both against the game AI.

   Acceptance: zero thrown errors; smart winrate roughly 80-90% at rank 0 and
   40-55% at rank 9. Outside that range, the numbers are reported as-is. This
   script never tunes the game; it only measures.
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

/* ---- minimal DOM / browser stubs so the game scripts load without a browser ---- */
function makeEl() {
  return {
    style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, removeEventListener() {},
    appendChild() {}, removeChild() {}, insertBefore() {}, remove() {},
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    querySelector() { return makeEl(); }, querySelectorAll() { return []; },
    cloneNode() { return makeEl(); }, focus() {}, click() {},
    textContent: "", innerHTML: "", value: "", disabled: false, checked: false,
    nextElementSibling: null, parentElement: null, firstChild: null, children: []
  };
}
const sandbox = {};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.console = console;
sandbox.setTimeout = () => 0;
sandbox.clearTimeout = () => {};
sandbox.setInterval = () => 0;
sandbox.clearInterval = () => {};
sandbox.requestAnimationFrame = () => 0;
sandbox.cancelAnimationFrame = () => {};
sandbox.performance = { now: () => 0 };
sandbox.navigator = { clipboard: null };
sandbox.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
sandbox.scrollTo = () => {};
sandbox.document = {
  getElementById() { return makeEl(); },
  querySelector() { return makeEl(); },
  querySelectorAll() { return []; },
  createElement() { return makeEl(); },
  addEventListener() {}, removeEventListener() {},
  body: makeEl(), documentElement: makeEl()
};
sandbox.AudioContext = function () {
  const node = { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
    frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
    delayTime: { value: 0 }, Q: { value: 0 }, type: "", buffer: null,
    connect() {}, start() {}, stop() {}, getChannelData() { return []; } };
  return { createGain: () => node, createDelay: () => node, createBuffer: () => node,
    createOscillator: () => node, createBiquadFilter: () => node, createBufferSource: () => node,
    destination: {}, currentTime: 0, sampleRate: 44100, state: "running", resume() {} };
};

vm.createContext(sandbox);
const root = path.join(__dirname, "..");
["js/items-data.js", "js/data.js", "js/game.js"].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox, { filename: f });
});

const S = sandbox;

/* ---- player policies (the AI opponent uses the game's own aiPick/aiBan/aiItems) ---- */
function untaken(G) { return S.C.filter(function (c) { return !G.taken[c[0]]; }); }
function openRolePool(G) {
  var pool = [];
  S.openRoles(G.my).forEach(function (r) {
    S.byRole[r].forEach(function (c) { if (!G.taken[c[0]]) pool.push(c); });
  });
  return pool;
}
function playerBan(G, smart) {
  var pool = untaken(G);
  if (smart) {
    var s = pool.filter(function (c) { return c[2] === "S"; });
    var arr = s.length ? s : pool;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
function playerPick(G, smart) {
  var pool = openRolePool(G);
  if (!smart) return pool[Math.floor(Math.random() * pool.length)];
  var meT = S.teamArr(G.my);
  var needF = S.cnt(meT, "f") < 2, needAP = S.cnt(meT, "a") === 0, needAD = S.cnt(meT, "d") === 0;
  var best = null, bs = -Infinity;
  pool.forEach(function (c) {
    var sc = S.TIERPTS[c[2]];
    if (needF && S.has(c, "f")) sc += 5;
    if (needAP && S.has(c, "a")) sc += 4;
    if (needAD && S.has(c, "d")) sc += 4;
    if (sc > bs) { bs = sc; best = c; }
  });
  return best;
}
function randomPicks() {
  var ids = Object.keys(S.ITEMDEFS), picks = [], perSlot = [0, 0, 0, 0, 0], used = {}, guard = 0;
  while (picks.length < 6 && guard++ < 5000) {
    var slot = Math.floor(Math.random() * 5);
    if (perSlot[slot] >= 2) continue;
    var id = ids[Math.floor(Math.random() * ids.length)];
    var key = slot + ":" + id;
    if (used[key]) continue;
    picks.push({ slot: slot, itemId: id }); perSlot[slot]++; used[key] = true;
  }
  return picks;
}

/* ---- one full game; returns true if the player wins ---- */
function playGame(rank, smart) {
  S.MODE = "ranked";
  S.ladder.ri = rank;
  S.newGame();
  var G = S.G;
  G.side = "B";
  S.buildSeq();
  while (G.idx < G.seq.length) {
    var a = G.seq[G.idx], c;
    if (a.who === "P") {
      c = a.act === "ban" ? playerBan(G, smart) : playerPick(G, smart);
      G.taken[c[0]] = true;
      if (a.act === "ban") G.myBans.push(c); else G.my[c[1]] = c;
    } else {
      c = a.act === "ban" ? S.aiBan() : S.aiPick();
      G.taken[c[0]] = true;
      if (a.act === "ban") G.foeBans.push(c); else G.foe[c[1]] = c;
    }
    G.idx++;
  }
  var meT = S.teamArr(G.my), foeT = S.teamArr(G.foe);
  var myPicks = smart ? S.bestItemPicks(meT, foeT, 0) : randomPicks();
  var foePicks = S.aiItems(foeT, meT);
  var myEv = S.evalTeam(meT, myPicks, foeT);
  var foeEv = S.evalTeam(foeT, foePicks, meT);
  foeEv.total = Math.round(foeEv.total * (1 + S.skillNow() * 0.012));
  var myP = S.phasePower(myEv, meT), foeP = S.phasePower(foeEv, foeT);
  var wins = 0;
  ["early", "mid", "late"].forEach(function (ph) {
    var m = myP[ph] * (0.88 + Math.random() * 0.24);
    var e = foeP[ph] * (0.88 + Math.random() * 0.24);
    if (m >= e) wins++;
  });
  return wins >= 2;
}

/* ---- run ---- */
function pct(w, n) { return (100 * w / n).toFixed(1) + "%"; }
function inRange(x, lo, hi) { return x >= lo && x <= hi ? "ok" : "OUT OF RANGE"; }

try {
  var RANKS = [0, 4, 9], N = 400;
  console.log("Rift Draft Arena item system simulation");
  console.log("Loaded items: " + S.SR_ITEMS.items.length + ", champions: " + S.C.length + ", item defs: " + Object.keys(S.ITEMDEFS).length);
  console.log("N = " + N + " games per cell\n");
  console.log("rank | smart winrate | random winrate | smart target");
  console.log("-----|---------------|----------------|-------------");
  var rows = [];
  RANKS.forEach(function (rank) {
    var sw = 0, rw = 0, i;
    for (i = 0; i < N; i++) if (playGame(rank, true)) sw++;
    for (i = 0; i < N; i++) if (playGame(rank, false)) rw++;
    var smartPct = 100 * sw / N;
    var target = rank === 0 ? inRange(smartPct, 80, 90) + " (80-90)"
      : rank === 9 ? inRange(smartPct, 40, 55) + " (40-55)"
      : "(no target)";
    rows.push([rank, smartPct]);
    console.log(" " + rank + "   | " + pad(pct(sw, N), 13) + " | " + pad(pct(rw, N), 14) + " | " + target);
  });
  console.log("\nDone. Zero thrown errors.");
} catch (err) {
  console.error("Simulation threw an error:");
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

function pad(s, n) { s = String(s); while (s.length < n) s += " "; return s; }
