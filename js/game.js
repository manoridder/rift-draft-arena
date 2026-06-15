"use strict";
/* ================= SOUND ================= */
var sndOn=true, AC=null, master=null, delayNode=null, noiseBuf=null;
var sfxVol=0.5, musVol=0.35;
function ensureAC(){
  if(AC)return;
  AC=new (window.AudioContext||window.webkitAudioContext)();
  master=AC.createGain(); master.gain.value=sfxVol; master.connect(AC.destination);
  var dl=AC.createDelay(0.6); dl.delayTime.value=0.16;
  var fb=AC.createGain(); fb.gain.value=0.25;
  var wet=AC.createGain(); wet.gain.value=0.16;
  dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
  delayNode=dl;
  var len=Math.floor(AC.sampleRate*0.5);
  noiseBuf=AC.createBuffer(1,len,AC.sampleRate);
  var d=noiseBuf.getChannelData(0);
  for(var i=0;i<len;i++)d[i]=Math.random()*2-1;
}
function env(g,t,a,peak,dur){
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(peak,t+a);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
}
function oscS(type,f0,f1,t,dur,peak,echo){
  var o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();
  fl.type="lowpass"; fl.frequency.value=2400;
  o.type=type; o.frequency.setValueAtTime(f0,t);
  if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  env(g,t,0.006,peak,dur);
  o.connect(fl); fl.connect(g); g.connect(master);
  if(echo){var s=AC.createGain();s.gain.value=0.6;g.connect(s);s.connect(delayNode);}
  o.start(t); o.stop(t+dur+0.05);
}
function noiseS(t,dur,peak,fType,f0,f1){
  var src=AC.createBufferSource(); src.buffer=noiseBuf;
  var fl=AC.createBiquadFilter(); fl.type=fType;
  fl.frequency.setValueAtTime(f0,t);
  if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+dur);
  fl.Q.value=1.1;
  var g=AC.createGain(); env(g,t,0.004,peak,dur);
  src.connect(fl); fl.connect(g); g.connect(master);
  src.start(t); src.stop(t+dur+0.05);
}
function snd(name){
  if(!sndOn)return;
  try{
    ensureAC(); if(AC.state==="suspended")AC.resume();
    var t=AC.currentTime+0.02;
    if(name==="click"){noiseS(t,0.05,0.14,"bandpass",2600);oscS("sine",520,null,t,0.05,0.04);}
    else if(name==="pick"){oscS("triangle",659,null,t,0.3,0.14,true);oscS("triangle",663,null,t,0.3,0.08,true);oscS("triangle",988,null,t+0.09,0.36,0.12,true);}
    else if(name==="ban"){noiseS(t,0.26,0.26,"lowpass",900,110);oscS("sine",165,52,t,0.32,0.26);}
    else if(name==="reroll"){noiseS(t,0.2,0.13,"bandpass",600,3400);oscS("triangle",880,1318,t,0.18,0.07,true);}
    else if(name==="pwin"){oscS("triangle",587,null,t,0.22,0.11,true);oscS("triangle",880,null,t+0.06,0.32,0.13,true);}
    else if(name==="plose"){oscS("triangle",392,null,t,0.22,0.11);oscS("triangle",262,200,t+0.08,0.32,0.11);}
    else if(name==="victory"){[523,659,784,1046,1318].forEach(function(f,i){oscS("triangle",f,null,t+i*0.11,0.42,0.12,true);oscS("sine",f/2,null,t+i*0.11,0.42,0.05);});}
    else if(name==="defeat"){[440,349,262,175].forEach(function(f,i){oscS("triangle",f,f*0.97,t+i*0.16,0.44,0.11,true);});}
  }catch(e){}
}
document.getElementById("sndBtn").addEventListener("click",function(){
  sndOn=!sndOn; this.textContent="Effects: "+(sndOn?"on":"off"); if(sndOn)snd("pick");
});
/* ---- music + easter egg ---- */
var bgm=document.getElementById("bgm"), egg=document.getElementById("eggTrack");
var musOn=false, eggOn=false, bgmWasOn=false;
var musBtn=document.getElementById("musBtn");
var eggOverlay=document.getElementById("eggOverlay");
var chestBox=document.getElementById("chestBox");
function closeEgg(){
  if(eggOverlay)eggOverlay.classList.remove("show");
  if(chestBox)chestBox.classList.remove("chest-open");
  if(eggOn){egg.pause();eggOn=false;}
  if(bgmWasOn&&musOn)bgm.play().catch(function(){});
}
musBtn.addEventListener("click",function(){
  if(eggOn)closeEgg();
  musOn=!musOn; musBtn.textContent="Music: "+(musOn?"on":"off");
  if(musOn){bgm.volume=musVol;bgm.play().catch(function(){musOn=false;musBtn.textContent="Music: off";});}
  else{bgm.pause();}
});
document.getElementById("eggDock").addEventListener("click",function(){
  snd("pick");
  bgmWasOn=musOn;
  if(musOn)bgm.pause();
  eggOverlay.classList.add("show");
  setTimeout(function(){chestBox.classList.add("chest-open");},180);
  eggOn=true; egg.currentTime=0; egg.volume=musVol;
  egg.play().catch(function(){});
});
if(chestBox){
  chestBox.addEventListener("click",function(){
    if(egg.paused){chestBox.classList.add("chest-open");egg.play().catch(function(){});eggOn=true;}
    else{chestBox.classList.remove("chest-open");egg.pause();eggOn=false;}
  });
}
egg.addEventListener("ended",function(){
  chestBox.classList.remove("chest-open"); eggOn=false;
});
document.getElementById("eggClose").addEventListener("click",closeEgg);
eggOverlay.addEventListener("click",function(e){ if(e.target===eggOverlay)closeEgg(); });
/* ---- audio settings ---- */
document.getElementById("audioBtn").addEventListener("click",function(){
  snd("click");
  document.getElementById("audioOverlay").classList.add("show");
});
document.getElementById("audioClose").addEventListener("click",function(){
  document.getElementById("audioOverlay").classList.remove("show");
});
document.getElementById("howBtn").addEventListener("click",function(){
  snd("click");
  document.getElementById("howOverlay").classList.add("show");
});
document.getElementById("howClose").addEventListener("click",function(){
  document.getElementById("howOverlay").classList.remove("show");
});
document.getElementById("howOverlay").addEventListener("click",function(e){
  if(e.target===this)this.classList.remove("show");
});
document.getElementById("musVolR").addEventListener("input",function(){
  musVol=this.value/100;
  document.getElementById("musVolV").textContent=this.value;
  bgm.volume=musVol; egg.volume=musVol;
});
document.getElementById("sfxVolR").addEventListener("input",function(){
  sfxVol=this.value/100;
  document.getElementById("sfxVolV").textContent=this.value;
  if(master)master.gain.value=sfxVol;
});

/* ================= SCORING ================= */
/* Plan scoring rules, keyed by the same ids as PLANS (display data lives there).
   keystone: hard requirement, -10 if missing and +4 if met. nice: tags that grant a small
   bonus when present, never a penalty. forgive: default synergy penalties the plan waives. */
var PLAN_RULES={
 fronttoback:{keystone:function(t){return cnt(t,"f")>=2;},fail:"Front to back has no frontline to fight behind",nice:["h","n","c"],forgive:["engage"]},
 dive:{keystone:function(t){return cnt(t,"v")>=2;},fail:"Dive lacks the divers to collapse on their carry",nice:["e","f","r"],forgive:[]},
 pick:{keystone:function(t){return cnt(t,"c")>=3;},fail:"Pick has no cc chain to lock a target down",nice:["e","r","g"],forgive:["damage","frontline"]},
 protect:{keystone:function(t){return cnt(t,"h")>=1&&cnt(t,"f")>=1;},fail:"Get Down Mr President has no carry and frontline core to protect",nice:["n","s","c"],forgive:["engage"]},
 pokesiege:{keystone:function(t){return cnt(t,"p")>=2;},fail:"Poke and siege has too little poke to chip them down",nice:["g","c","h"],forgive:["frontline","engage"]},
 splitpush:{keystone:function(t){return cnt(t,"g")>=1||cnt(t,"v")>=2;},fail:"Split push has no global or diver to threaten side lanes",nice:["h","c","p"],forgive:["engage","frontline"]},
 earlyskirmish:{keystone:function(t){return cnt(t,"r")>=1&&(cnt(t,"c")>=1||cnt(t,"e")>=1);},fail:"Early skirmish has no early tool to force fights",nice:["g","v","d"],forgive:["frontline"]}
};
function synergy(team,plan){
  var rules=plan?PLAN_RULES[plan]:null;
  /* Forgiveness is disabled: synergy penalties always count in full. The plan only adds its
     keystone and nice bonuses. The forgive sets stay in PLAN_RULES as a design record but are
     not applied. The v0.1.0 balance pass showed forgiveness only ever subsidised the gappier
     comp (the AI), pulling the optimal player's high-rank winrate to the floor. */
  var s=[]; var fl=cnt(team,"f");
  if(fl>=2)s.push(["Sturdy frontline ("+fl+" tanks)",6]);
  else if(fl===1)s.push(["Thin frontline",2]);
  else s.push(["No frontline, your carries are exposed",-8]);
  var ap=cnt(team,"a"),ad=cnt(team,"d");
  if(ap>0&&ad>0)s.push(["Mixed damage (AP and AD)",6]);
  else s.push(["One-dimensional damage, enemy stacks a single resistance",-6]);
  var eng=cnt(team,"e");
  if(eng>=1&&cnt(team,"v")>=1)s.push(["Engage with follow-up",6]);
  else if(eng===0)s.push(["No engage, you wait for their mistakes",-4]);
  var cc=cnt(team,"c");
  if(cc>=3)s.push(["CC chain ("+cc+" champs with CC)",5]);
  if(cnt(team,"g")>=2)s.push(["Map pressure through globals",3]);
  if(rules){
    if(rules.keystone(team))s.push(["Keystone met: "+planLabel(plan),4]);
    else s.push([rules.fail,-10]);
    rules.nice.forEach(function(tag){
      var n=cnt(team,tag);
      if(n>=1)s.push(["Bonus: "+TAGNAMES[tag].toLowerCase()+" rounds out the comp",n>=2?2:1]);
    });
  }
  return s;
}
function counters(meT,enT){
  var out=[];
  if(cnt(meT,"e")>=2&&cnt(enT,"p")>=2)out.push(["Your engage catches their poke comp",4]);
  if(cnt(meT,"p")>=2&&cnt(enT,"e")===0)out.push(["Free poke, they cannot punish you",3]);
  if(cnt(meT,"f")>=2&&cnt(enT,"d")>=4)out.push(["Armor stacking into their full AD",3]);
  if(cnt(meT,"n")>=1&&cnt(enT,"e")>=2)out.push(["Your enchanter saves the engage target",2]);
  if(cnt(meT,"r")>=2&&cnt(enT,"h")>=3)out.push(["Early stomp before they come online",3]);
  if(cnt(meT,"v")>=2&&cnt(enT,"f")===0)out.push(["Their backline has no protection against your dives",3]);
  return out;
}
/* Central fit layer (one location). Layer 1 is the item's own verdict v(); this is layer 2.
   Global rule: an item whose damage type the holder cannot use is capped to wasted stats.
   Then an optional per-item fit(baseResult, champ, myTeam, enemyTeam) hook runs. No item
   defines fit() yet; it is the extension point for per-item refinements. First planned
   candidate: Guardian Angel carry bias (boost when the holder hard-carries). */
function applyFit(baseResult,item,champ){
  var r=baseResult;
  if((item.dmg==="ap"&&!has(champ,"a"))||(item.dmg==="ad"&&!has(champ,"d"))||(item.dmg==="mana"&&!has(champ,"m"))){
    r=[1,"Wasted stats on this champion."];
  }
  if(typeof item.fit==="function") r=item.fit(r,champ,arguments[3],arguments[4]);
  return r;
}
function evalTeam(team,picks,enemy,plan){
  var base=team.reduce(function(a,c){return a+TIERPTS[c[2]];},0);
  var syn=synergy(team,plan); var synT=syn.reduce(function(a,x){return a+x[1];},0);
  var ctr=counters(team,enemy); var ctrT=ctr.reduce(function(a,x){return a+x[1];},0);
  var itemRows=picks.map(function(p){
    var holder=team[p.slot]; var item=ITEMDEFS[p.itemId];
    var r=applyFit(item.v(holder,team,enemy,plan),item,holder,team,enemy);
    return {champ:holder,item:item.n,pts:r[0],why:r[1]};
  });
  var itemT=itemRows.reduce(function(a,x){return a+x.pts;},0);
  return {base:base,syn:syn,synT:synT,ctr:ctr,ctrT:ctrT,items:itemRows,itemT:itemT,
          total:Math.round(base+synT+ctrT+itemT)};
}
function phasePower(ev,team){
  var b=ev.total;
  return{ early:b+2*cnt(team,"r")+1.5*cnt(team,"e")+cnt(team,"v")-1.5*cnt(team,"h"),
          mid:b+cnt(team,"c")+.5*cnt(team,"e")+.5*cnt(team,"p"),
          late:b+2.5*cnt(team,"h")+.5*cnt(team,"c") };
}

/* ================= MODES, RNG, LADDER ================= */
var MODE="ranked";
var R=Math.random;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function todayStr(){var d=new Date();return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0");}
function todaySeed(){return +todayStr().replace(/-/g,"");}

var RANKS=["Iron","Bronze","Silver","Gold","Platinum","Emerald","Diamond","Master","Grandmaster","Challenger"];
var ladder={ri:0,lp:0,champion:false};
function skillNow(){return MODE==="daily"?5:ladder.ri;}
function renderRank(){
  document.getElementById("rankTxt").textContent=RANKS[ladder.ri]+" \u00b7 "+ladder.lp+" LP";
  document.getElementById("lpFill").style.width=Math.min(100,ladder.lp)+"%";
}
function applyLP(won){
  var d=won?25:-20; var old=RANKS[ladder.ri];
  ladder.lp+=d;
  if(ladder.lp>=100){
    if(ladder.ri<RANKS.length-1){ladder.ri++;ladder.lp=0;}
    else{ladder.lp=100;if(!ladder.champion){ladder.champion=true;document.getElementById("champOverlay").classList.add("show");}}
  }
  if(ladder.lp<0){ if(ladder.ri>0){ladder.ri--;ladder.lp=60;} else ladder.lp=0; }
  renderRank();
  return {delta:d,promo:RANKS[ladder.ri]!==old&&won,demo:RANKS[ladder.ri]!==old&&!won};
}

/* ================= GAME STATE ================= */
var FOES=["Iron Wolves","Hex Raiders","Void Brothers","Baron Bandits","Crit Happens","Gank Squad","Mid Diff Inc","Elder Dragons","Nexus Nightmares","Peak Performance"];
var G=null;
function newGame(){
  G={taken:{},myBans:[],foeBans:[],my:{TOP:null,JGL:null,MID:null,ADC:null,SUP:null},
     foe:{TOP:null,JGL:null,MID:null,ADC:null,SUP:null},
     side:null,seq:null,idx:0,items:[null,null,null,null,null],
     arena:true,rerolls:2,offer:null,plan:null,foePlan:null,
     foeName:MODE==="daily"?"Daily Gauntlet":FOES[Math.min(skillNow(),FOES.length-1)]};
}
function teamArr(p){return ROLES.map(function(r){return p[r];});}
function openRoles(p){return ROLES.filter(function(r){return !p[r];});}

/* ================= AI ================= */
function tierW(t){ return Math.pow(TIERPTS[t]/6.5, 1+skillNow()*0.32); }
function aiPick(){
  var roles=openRoles(G.foe);
  var pool=[];
  roles.forEach(function(r){ byRole[r].forEach(function(c){ if(!G.taken[c[0]]) pool.push(c); }); });
  var meT=teamArr(G.my), foeT=teamArr(G.foe);
  var aware=skillNow()/9;
  var lastSlot=roles.length===1;
  var scored=pool.map(function(c){
    var w=tierW(c[2]);
    if(R()<aware){
      if(cnt(meT,"p")>=2&&has(c,"e"))w*=1.7;
      if(cnt(meT,"h")>=3&&has(c,"r"))w*=1.5;
      if(cnt(meT,"e")>=2&&has(c,"n"))w*=1.5;
      if(cnt(meT,"d")>=4&&has(c,"f"))w*=1.4;
    }
    if(skillNow()>=3){
      if(lastSlot&&cnt(foeT,"f")===0&&has(c,"f"))w*=2.4;
      if(lastSlot&&cnt(foeT,"a")===0&&has(c,"a"))w*=1.8;
      if(lastSlot&&cnt(foeT,"d")===0&&has(c,"d"))w*=1.8;
    }
    return [c,w];
  });
  var tot=scored.reduce(function(a,x){return a+x[1];},0), r=R()*tot;
  for(var i=0;i<scored.length;i++){r-=scored[i][1];if(r<=0)return scored[i][0];}
  return scored[scored.length-1][0];
}
function aiBan(){
  var pool=C.filter(function(c){return !G.taken[c[0]];});
  var scored=pool.map(function(c){return [c,tierW(c[2])];});
  var tot=scored.reduce(function(a,x){return a+x[1];},0), r=R()*tot;
  for(var i=0;i<scored.length;i++){r-=scored[i][1];if(r<=0)return scored[i][0];}
  return scored[0][0];
}
/* Score every champion-item pair with the full pipeline (verdict plus fit), add skill
   scaled noise, then greedily take the best 6 respecting max 2 per champion. Each pair is
   unique, so the same item never lands on one champion twice. Uses only R() (daily seed safe). */
function bestItemPicks(team,enemy,noiseAmp){
  var pairs=[];
  team.forEach(function(c,slot){
    Object.keys(ITEMDEFS).forEach(function(id){
      var item=ITEMDEFS[id];
      var sc=applyFit(item.v(c,team,enemy,null),item,c)[0]+R()*noiseAmp;
      pairs.push({slot:slot,itemId:id,score:sc});
    });
  });
  pairs.sort(function(a,b){return b.score-a.score;});
  var picks=[],perSlot=[0,0,0,0,0];
  for(var i=0;i<pairs.length&&picks.length<6;i++){
    if(perSlot[pairs[i].slot]>=2)continue;
    picks.push({slot:pairs[i].slot,itemId:pairs[i].itemId});
    perSlot[pairs[i].slot]++;
  }
  return picks;
}
function aiItems(team,enemy){
  var smart=Math.min(1,0.3+skillNow()*0.078);
  return bestItemPicks(team,enemy,(1-smart)*5);
}
/* The AI commits to the plan that scores its finished comp best (synergy under each plan, so a
   met keystone and bonuses win out), with a light R()-weighted tiebreak. Uses R() only, so the
   daily seed stays deterministic. */
function aiPlan(team){
  var best=null,bs=-Infinity;
  PLANS.forEach(function(p){
    var sc=synergy(team,p.id).reduce(function(a,x){return a+x[1];},0)+R()*1.5;
    if(sc>bs){bs=sc;best=p.id;}
  });
  return best;
}

/* ================= NAV & SHARED UI ================= */
function show(id){
  document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("active");});
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
}
function bindTabs(section,onChange){
  section.querySelectorAll(".tab").forEach(function(t){
    t.addEventListener("click",function(){
      section.querySelectorAll(".tab").forEach(function(x){x.classList.remove("on");});
      t.classList.add("on"); snd("click"); onChange(t.dataset.role);
    });
  });
}
function champGrid(host,filterRole,q,opts){
  host.innerHTML="";
  var g=document.createElement("div");g.className="grid";
  C.filter(function(c){
    if(filterRole!=="ALL"&&c[1]!==filterRole)return false;
    if(q&&c[0].toLowerCase().indexOf(q)<0)return false;
    return true;
  }).sort(function(a,b){return a[0].localeCompare(b[0]);}).forEach(function(c){
    var d=document.createElement("div");
    var off=opts.isOff(c);
    d.className="champ"+(off?" off":"");
    d.innerHTML=(opts.badges?'<span class="tbadge" style="background:'+TIERCOL[c[2]]+'">'+c[2]+'</span>':"")+
      picHtml(c,"cpic")+'<div class="cn">'+c[0]+'</div><div class="cr">'+ROLENL[c[1]]+'</div>';
    if(!off)d.addEventListener("click",function(){opts.onPick(c);});
    g.appendChild(d);
  });
  host.appendChild(g);
}

/* ================= CODEX ================= */
var codexRole="ALL",codexQ="";
function openInfo(c){
  document.getElementById("infoPic").innerHTML=imgTag(c);
  document.getElementById("infoName").textContent=c[0];
  document.getElementById("infoRole").textContent={TOP:"Top lane",JGL:"Jungle",MID:"Mid lane",ADC:"ADC",SUP:"Support"}[c[1]];
  var tp=document.getElementById("infoTier");
  tp.textContent=c[2]; tp.style.background=TIERCOL[c[2]];
  document.getElementById("infoTags").innerHTML=c[3].split(" ").map(function(t){return "<span>"+TAGNAMES[t]+"</span>";}).join("");
  document.getElementById("infoNote").textContent=NOTES[c[0]]||"No headline changes in 26.11 or 26.12. Tier based on current stat-site performance.";
  document.getElementById("infoOverlay").classList.add("show");
}
document.getElementById("infoClose").addEventListener("click",function(){document.getElementById("infoOverlay").classList.remove("show");});
function renderCodex(){
  var host=document.getElementById("codexGrid");host.innerHTML="";
  ["S","A","B","C","D"].forEach(function(t){
    var sub=C.filter(function(c){
      if(c[2]!==t)return false;
      if(codexRole!=="ALL"&&c[1]!==codexRole)return false;
      if(codexQ&&c[0].toLowerCase().indexOf(codexQ)<0)return false;
      return true;
    });
    if(!sub.length)return;
    var h=document.createElement("div");h.className="tierhead";h.style.color=TIERCOL[t];
    h.textContent=t+" tier ("+sub.length+")";host.appendChild(h);
    var g=document.createElement("div");g.className="grid";
    sub.sort(function(a,b){return a[0].localeCompare(b[0]);}).forEach(function(c){
      var d=document.createElement("div");d.className="champ";
      d.innerHTML='<span class="tbadge" style="background:'+TIERCOL[t]+'">'+t+'</span>'+picHtml(c,"cpic")+'<div class="cn">'+c[0]+'</div><div class="cr">'+ROLENL[c[1]]+'</div>';
      d.addEventListener("click",function(){snd("click");openInfo(c);});
      g.appendChild(d);
    });
    host.appendChild(g);
  });
}
bindTabs(document.getElementById("scr-codex"),function(r){codexRole=r;renderCodex();});
document.getElementById("codexSearch").addEventListener("input",function(e){codexQ=e.target.value.toLowerCase();renderCodex();});
document.getElementById("openCodex").addEventListener("click",function(){snd("click");renderCodex();show("scr-codex");});
document.getElementById("codexBack").addEventListener("click",function(){show("scr-menu");});
document.getElementById("homebtn").addEventListener("click",function(){show("scr-menu");});

/* ================= DRAFT (pro format) ================= */
var draftRole="ALL",draftQ="";
var SEQ_PRO=[
 {t:"B",act:"ban"},{t:"R",act:"ban"},{t:"B",act:"ban"},{t:"R",act:"ban"},{t:"B",act:"ban"},{t:"R",act:"ban"},
 {t:"B",act:"pick"},{t:"R",act:"pick"},{t:"R",act:"pick"},{t:"B",act:"pick"},{t:"B",act:"pick"},{t:"R",act:"pick"},
 {t:"R",act:"ban"},{t:"B",act:"ban"},{t:"R",act:"ban"},{t:"B",act:"ban"},
 {t:"R",act:"pick"},{t:"B",act:"pick"},{t:"B",act:"pick"},{t:"R",act:"pick"}
];
function buildSeq(){
  G.seq=SEQ_PRO.map(function(s){return {who:(s.t===G.side?"P":"E"),act:s.act};});
  G.idx=0;
}
function cur(){return G.seq[G.idx];}
function draftDone(){return G.idx>=G.seq.length;}
function phaseName(){
  if(G.idx<6)return "Ban phase 1";
  if(G.idx<12)return "Pick phase 1";
  if(G.idx<16)return "Ban phase 2";
  return "Pick phase 2";
}
function renderTeamInto(hostId,team){
  var host=document.getElementById(hostId);if(!host)return;host.innerHTML="";
  ROLES.forEach(function(r){
    var c=team[r];
    host.innerHTML+='<div class="pslot'+(c?" filled":"")+'">'+
      '<div class="pic">'+(c?slotImg(c)+'<span class="scrim"></span><span class="slotnm">'+c[0]+'</span>':"?")+'</div>'+
      '<div class="rl">'+ROLENL[r]+'</div></div>';
  });
}
function renderTeams(){
  renderTeamInto("mySlots",G.my);
  renderTeamInto("foeSlots",G.foe);
}
function renderBans(){
  [["myBans",G.myBans],["foeBans",G.foeBans]].forEach(function(pair){
    var host=document.getElementById(pair[0]);host.innerHTML="";
    pair[1].forEach(function(c){
      host.innerHTML+='<div class="ban"><img src="'+imgUrl(c)+'" data-alt="'+imgUrl2(c)+'" alt="'+c[0]+'" onerror="imgFail(this)"><span class="x">&times;</span></div>';
    });
  });
}
function setDraftMsg(){
  var el=document.getElementById("draftMsg");
  var title=document.getElementById("draftPhaseTitle");
  if(draftDone()){title.textContent="Draft complete";el.textContent="";el.classList.remove("enemy");return;}
  title.textContent=phaseName();
  var a=cur();
  if(a.who==="P"){el.textContent=a.act==="ban"?"Your ban":"Your pick";el.classList.remove("enemy");}
  else{el.textContent=G.foeName+(a.act==="ban"?" is banning...":" is picking...");el.classList.add("enemy");}
}
function makeOffer(){
  var pool=[];
  openRoles(G.my).forEach(function(r){ byRole[r].forEach(function(c){ if(!G.taken[c[0]]) pool.push(c); }); });
  for(var i=pool.length-1;i>0;i--){var j=Math.floor(R()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
  G.offer=pool.slice(0,3);
}
function renderBanGrid(){
  champGrid(document.getElementById("draftGrid"),draftRole,draftQ,{
    badges:false,
    isOff:function(c){return !!G.taken[c[0]];},
    onPick:function(c){doPlayer(c);}
  });
}
/* Ranked picks are an open pick phase like a real lobby: pick any champion whose role you have
   not filled yet. Taken champions and filled roles are greyed out. The daily challenge keeps the
   three-option offer plus rerolls. */
function renderPickGrid(){
  champGrid(document.getElementById("draftGrid"),draftRole,draftQ,{
    badges:false,
    isOff:function(c){return !!G.taken[c[0]]||!!G.my[c[1]];},
    onPick:function(c){doPlayer(c);}
  });
}
/* Which open grid the player uses on their turn: bans always, and picks too in ranked.
   The daily challenge serves picks through the offer panel instead, so this returns null there.
   Returns the renderer to call, or null when the offer panel should show. */
function playerGrid(){
  if(!G||!G.seq||draftDone())return null;
  var a=cur();
  if(a.who!=="P")return null;
  if(a.act==="ban")return renderBanGrid;
  if(a.act==="pick"&&MODE!=="daily")return renderPickGrid;
  return null;
}
function renderPickers(){
  var offer=document.getElementById("offerWrap");
  var classic=document.getElementById("classicWrap");
  if(draftDone()){offer.style.display="none";classic.style.display="none";return;}
  var grid=playerGrid();
  if(grid){classic.style.display="block";offer.style.display="none";grid();return;}
  classic.style.display="none";offer.style.display="block";
  var a=cur();
  var cards=document.getElementById("offerCards");
  var rb=document.getElementById("rerollBtn");
  if(a.who==="P"){
    document.getElementById("offerTitle").textContent="YOUR PICK \u00b7 CHOOSE ONE";
    rb.style.display="inline-block";rb.disabled=G.rerolls<=0;
    rb.textContent="Reroll ("+G.rerolls+" left)";
    cards.innerHTML="";
    G.offer.forEach(function(ch){
      var d=document.createElement("div");d.className="ocard";
      d.innerHTML='<div class="cpic">'+slotImg(ch)+'<span class="scrim"></span><span class="slotnm">'+ch[0]+'</span></div>'+
        '<span class="ocrole">'+ROLENL[ch[1]]+'</span>';
      d.addEventListener("click",function(){doPlayer(ch);});
      cards.appendChild(d);
    });
  } else {
    document.getElementById("offerTitle").textContent="OPPONENT IS "+(a.act==="ban"?"BANNING":"PICKING")+"...";
    cards.innerHTML="";rb.style.display="none";
  }
}
function doPlayer(c){
  var a=cur();
  G.taken[c[0]]=true;
  if(a.act==="ban"){snd("ban");G.myBans.push(c);}
  else{snd("pick");G.my[c[1]]=c;}
  G.idx++;advance();
}
function doEnemy(){
  var a=cur();
  var c=a.act==="ban"?aiBan():aiPick();
  G.taken[c[0]]=true;
  if(a.act==="ban")G.foeBans.push(c);else G.foe[c[1]]=c;
  G.idx++;advance();
}
function advance(){
  renderTeams();renderBans();setDraftMsg();
  if(!draftDone()){
    var a=cur();
    if(a.who==="P"&&a.act==="pick"&&MODE==="daily")makeOffer();
  }
  renderPickers();
  if(draftDone()){setTimeout(startItems,700);return;}
  if(cur().who==="E"){setTimeout(doEnemy,700+R()*700);}
}
bindTabs(document.getElementById("scr-draft"),function(r){
  draftRole=r;
  var grid=playerGrid();if(grid)grid();
});
document.getElementById("draftSearch").addEventListener("input",function(e){
  draftQ=e.target.value.toLowerCase();
  var grid=playerGrid();if(grid)grid();
});
document.getElementById("rerollBtn").addEventListener("click",function(){
  if(!G||G.rerolls<=0)return;
  G.rerolls--;snd("reroll");makeOffer();renderPickers();
});

/* ================= ITEM PHASE ================= */
/* Real SR item data (gold + statsText) from SR_ITEMS, matched on name. Display only, no effect on scoring. */
var SR_BY_NAME={};
if(typeof SR_ITEMS!=="undefined"&&SR_ITEMS&&SR_ITEMS.items){
  SR_ITEMS.items.forEach(function(it){SR_BY_NAME[it.name]=it;});
}
function srMeta(name){
  var it=SR_BY_NAME[name];
  if(!it)return "";
  return '<span class="srmeta"><span class="g">'+it.gold.total+'g</span> · '+it.statsText+'</span>';
}
/* Open shop (Phase 2). G.items is a pick list: each entry {slot, itemId}.
   End state: exactly 6 picks, max 2 per slot, no duplicate itemId within one slot. */
var shopCat="ALL",shopQ="";
function itemIcon(id){
  var sr=SR_BY_NAME[ITEMDEFS[id].n];
  return sr&&sr.image?'<img src="'+sr.image+'" alt="'+ITEMDEFS[id].n+'" loading="lazy">':"";
}
function picksFor(slot){return G.items.filter(function(p){return p.slot===slot;});}
function renderShopChamps(){
  var meT=teamArr(G.my);
  var host=document.getElementById("shopChamps");host.innerHTML="";
  meT.forEach(function(c,i){
    var picks=picksFor(i),slotsHtml="";
    for(var k=0;k<2;k++){
      var p=picks[k];
      slotsHtml+=p
        ? '<div class="islot filled" data-slot="'+i+'" data-item="'+p.itemId+'" title="Remove '+ITEMDEFS[p.itemId].n+'">'+itemIcon(p.itemId)+'<span class="rm">\u00d7</span></div>'
        : '<div class="islot" data-slot="'+i+'"></div>';
    }
    host.innerHTML+='<div class="shopchamp'+(i===G.activeChamp?" active":"")+'" data-slot="'+i+'">'+
      '<div class="pic">'+imgTag(c)+'</div>'+
      '<div class="nm">'+c[0]+'</div><div class="rl">'+ROLENL[ROLES[i]]+'</div>'+
      '<div class="islots">'+slotsHtml+'</div></div>';
  });
  host.querySelectorAll(".shopchamp").forEach(function(card){
    card.addEventListener("click",function(e){
      var slotEl=e.target.closest?e.target.closest(".islot.filled"):null;
      if(slotEl){removePick(+slotEl.dataset.slot,slotEl.dataset.item);return;}
      G.activeChamp=+card.dataset.slot;snd("click");renderShopChamps();renderShopGrid();
    });
  });
}
function renderShopGrid(){
  var host=document.getElementById("shopGrid");host.innerHTML="";
  var g=document.createElement("div");g.className="shopgrid";
  Object.keys(ITEMDEFS).map(function(id){return [id,ITEMDEFS[id]];})
    .filter(function(pair){
      if(shopCat!=="ALL"&&pair[1].cat.toUpperCase()!==shopCat)return false;
      if(shopQ&&pair[1].n.toLowerCase().indexOf(shopQ)<0)return false;
      return true;
    })
    .sort(function(a,b){return a[1].n.localeCompare(b[1].n);})
    .forEach(function(pair){
      var id=pair[0],it=pair[1];
      var owned=picksFor(G.activeChamp).some(function(p){return p.itemId===id;});
      var d=document.createElement("div");
      d.className="shopitem"+(owned?" owned":"");
      d.innerHTML='<div class="ico">'+itemIcon(id)+'</div><div class="info"><b>'+it.n+'</b>'+srMeta(it.n)+(it.d?'<span class="idesc">'+it.d+'</span>':"")+'</div>';
      d.addEventListener("click",function(){assignItem(id);});
      g.appendChild(d);
    });
  host.appendChild(g);
}
function flashActive(){
  var card=document.querySelector('.shopchamp[data-slot="'+G.activeChamp+'"]');
  if(!card)return;
  card.classList.add("flash");
  setTimeout(function(){card.classList.remove("flash");},450);
}
function assignItem(id){
  var picks=picksFor(G.activeChamp);
  if(picks.length>=2||G.items.length>=6||picks.some(function(p){return p.itemId===id;})){
    snd("click");flashActive();return;
  }
  G.items.push({slot:G.activeChamp,itemId:id});
  snd("pick");renderShopChamps();renderShopGrid();updateShopState();
}
function removePick(slot,id){
  var i=G.items.findIndex(function(p){return p.slot===slot&&p.itemId===id;});
  if(i<0)return;
  G.items.splice(i,1);
  snd("ban");renderShopChamps();renderShopGrid();updateShopState();
}
function updateShopState(){
  document.getElementById("itemsLeft").textContent="Items left: "+(6-G.items.length)+" of 6";
  document.getElementById("lockItems").disabled=G.items.length!==6;
}
function startItems(){
  var foeT=teamArr(G.foe);
  document.getElementById("peekName").textContent=G.foeName.toUpperCase()+" \u00b7 KNOW YOUR ENEMY";
  var peek=document.getElementById("peekSlots");peek.innerHTML="";
  foeT.forEach(function(c){
    peek.innerHTML+='<div class="pslot filled"><div class="pic">'+slotImg(c)+'<span class="scrim"></span><span class="slotnm">'+c[0]+'</span></div></div>';
  });
  G.items=[];G.activeChamp=0;shopCat="ALL";shopQ="";
  var sb=document.getElementById("shopSearch");if(sb)sb.value="";
  document.querySelectorAll("#scr-items .controls .tab").forEach(function(x){x.classList.toggle("on",x.dataset.cat==="ALL");});
  renderShopChamps();renderShopGrid();updateShopState();
  show("scr-items");
}
document.querySelectorAll("#scr-items .controls .tab").forEach(function(t){
  t.addEventListener("click",function(){
    document.querySelectorAll("#scr-items .controls .tab").forEach(function(x){x.classList.remove("on");});
    t.classList.add("on");snd("click");shopCat=t.dataset.cat;renderShopGrid();
  });
});
document.getElementById("shopSearch").addEventListener("input",function(e){
  shopQ=e.target.value.toLowerCase();renderShopGrid();
});
document.getElementById("lockItems").addEventListener("click",function(){snd("pick");startPlan();});

/* ================= PLAN PHASE ================= */
/* Display data for the seven plans. Step 2 adds keystone/nice/forgive scoring to the same ids. */
var PLANS=[
 {id:"fronttoback",label:"Front to back",win:"Fight slowly and safely, your carries hit the nearest safe target and win with sustained damage.",needs:"At least 2 frontline"},
 {id:"dive",label:"Dive",win:"Start fast, kill their carry, end the fight before it begins.",needs:"At least 2 divers"},
 {id:"pick",label:"Pick",win:"Catch one target with crowd control and burst, then take an objective five versus four.",needs:"At least 3 crowd control"},
 {id:"protect",label:"Get Down Mr President",win:"Build the team around one hypercarry and keep them alive at all costs.",needs:"A scaling carry and a frontline"},
 {id:"pokesiege",label:"Poke and siege",win:"Chunk their health from range, force them off objectives, take towers without full fights.",needs:"At least 2 poke"},
 {id:"splitpush",label:"Split push",win:"Force them to answer the side lanes, then take objectives with the numbers advantage.",needs:"A global, or 2 divers"},
 {id:"earlyskirmish",label:"Early skirmish",win:"Win the small fights early and snowball before they come online.",needs:"An early game champ plus cc or engage"}
];
function planLabel(id){for(var i=0;i<PLANS.length;i++){if(PLANS[i].id===id)return PLANS[i].label;}return null;}
function planWin(id){for(var i=0;i<PLANS.length;i++){if(PLANS[i].id===id)return PLANS[i].win;}return "";}
function startPlan(){
  G.plan=null;
  var grid=document.getElementById("planGrid");grid.innerHTML="";
  PLANS.forEach(function(p){
    var d=document.createElement("div");d.className="plancard";d.dataset.plan=p.id;
    d.innerHTML='<b>'+p.label+'</b><span class="win">'+p.win+'</span><span class="needs">Needs: '+p.needs+'</span>';
    d.addEventListener("click",function(){
      snd("click");G.plan=p.id;
      grid.querySelectorAll(".plancard").forEach(function(x){x.classList.remove("sel");});
      d.classList.add("sel");
      document.getElementById("lockPlan").disabled=false;
    });
    grid.appendChild(d);
  });
  renderTeamInto("planMySlots",G.my);
  renderTeamInto("planFoeSlots",G.foe);
  var pfn=document.getElementById("planFoeName");if(pfn)pfn.textContent=(G.foeName||"OPPONENT").toUpperCase();
  document.getElementById("lockPlan").disabled=true;
  show("scr-plan");
}
document.getElementById("lockPlan").addEventListener("click",function(){snd("pick");startMatch();});

/* ================= RIFT MAP ================= */
var LANES={
  top:[[10,90],[10,10],[90,10]],
  mid:[[10,90],[90,10]],
  bot:[[10,90],[90,90],[90,10]]
};
function laneLen(pts){var L=0;for(var i=1;i<pts.length;i++){L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);}return L;}
function pointAt(pts,u){
  var total=laneLen(pts), d=u*total;
  for(var i=1;i<pts.length;i++){
    var seg=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
    if(d<=seg){var k=seg?d/seg:0;return [pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k];}
    d-=seg;
  }
  return pts[pts.length-1];
}
var mapState=null;
function buildMap(){
  var svg=document.getElementById("riftmap");
  var lanePath=function(pts){return '<polyline points="'+pts.map(function(p){return p.join(",");}).join(" ")+'" fill="none" stroke="#24364f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';};
  var turrets={blue:[[10,62],[10,34],[34,66],[52,48],[62,90],[90,66]],red:[[38,10],[66,10],[48,52],[66,34],[10,38]?[34,10]:[34,10],[90,38]]};
  turrets={blue:[[10,62],[10,34],[34,66],[52,48],[62,90],[90,62]],red:[[38,10],[66,10],[48,52],[66,34],[90,38],[90,66]?[90,38]:[90,38]]};
  turrets={blue:[[10,62],[10,34],[34,66],[52,48],[62,90],[88,78]],red:[[38,10],[66,10],[48,52],[66,34],[12,22],[90,38]]};
  var t='<rect x="0" y="0" width="100" height="100" fill="#07101f"/>'+
    '<path d="M0 76 L24 100 L100 24 L76 0 Z" fill="#0a2233"/>'+
    lanePath(LANES.top)+lanePath(LANES.mid)+lanePath(LANES.bot);
  ["blue","red"].forEach(function(side){
    turrets[side].forEach(function(p,i){
      t+='<rect class="tw" data-side="'+side+'" data-i="'+i+'" x="'+(p[0]-1.7)+'" y="'+(p[1]-1.7)+'" width="3.4" height="3.4" fill="'+(side==="blue"?"#0AC8B9":"#E84057")+'"/>';
    });
  });
  t+='<circle id="nexusB" cx="10" cy="90" r="4.2" fill="#0AC8B9"/>'+
     '<circle id="nexusR" cx="90" cy="10" r="4.2" fill="#E84057"/>'+
     '<circle id="boom" cx="50" cy="50" r="0" fill="none" stroke="#F0E6D2" stroke-width="1.5" opacity="0"/>';
  ["top","mid","bot"].forEach(function(l){
    var p=pointAt(LANES[l],0.5);
    t+='<circle class="pm" id="pm-'+l+'" cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" fill="#F0E6D2" stroke="#C8AA6E" stroke-width="0.8"/>';
  });
  svg.innerHTML=t;
  mapState={u:{top:.5,mid:.5,bot:.5},destroyed:{blue:0,red:0}};
}
function tweenMarkers(targets){
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var start={top:mapState.u.top,mid:mapState.u.mid,bot:mapState.u.bot};
  var t0=performance.now(),dur=reduce?0:650;
  function frame(now){
    var k=dur?Math.min(1,(now-t0)/dur):1;
    ["top","mid","bot"].forEach(function(l){
      var u=start[l]+(targets[l]-start[l])*k;
      var p=pointAt(LANES[l],u);
      var el=document.getElementById("pm-"+l);
      if(el){el.setAttribute("cx",p[0]);el.setAttribute("cy",p[1]);}
    });
    if(k<1)requestAnimationFrame(frame);
    else mapState.u=targets;
  }
  requestAnimationFrame(frame);
}
function mapPhase(playerWon){
  var d=playerWon?0.15:-0.15;
  var targets={top:Math.min(.95,Math.max(.05,mapState.u.top+d)),
               mid:Math.min(.95,Math.max(.05,mapState.u.mid+d)),
               bot:Math.min(.95,Math.max(.05,mapState.u.bot+d))};
  tweenMarkers(targets);
  var side=playerWon?"red":"blue";
  var tws=document.querySelectorAll('.tw[data-side="'+side+'"]');
  var idx=mapState.destroyed[side];
  if(tws[idx]){tws[idx].setAttribute("fill","#3a4a63");mapState.destroyed[side]++;}
}
function mapEnd(playerWon){
  var nx=document.getElementById(playerWon?"nexusR":"nexusB");
  var boom=document.getElementById("boom");
  if(nx){
    boom.setAttribute("cx",nx.getAttribute("cx"));
    boom.setAttribute("cy",nx.getAttribute("cy"));
    nx.setAttribute("fill","#3a4a63");
    boom.setAttribute("opacity","1");
    var r=0,t0=performance.now();
    function fr(now){var k=Math.min(1,(now-t0)/700);boom.setAttribute("r",k*14);boom.setAttribute("opacity",String(1-k));if(k<1)requestAnimationFrame(fr);}
    requestAnimationFrame(fr);
  }
}

/* ================= MATCH ================= */
var PHNL={early:"Early game",mid:"Mid game",late:"Late game"};
var WINTXT=["Your support lands the engage of the night.","Perfect itemization, their damage just stopped working.","Baron steal at 20 HP.","Your carry free-hits for 8 full seconds thanks to the peel.","Flawless Elder fight."];
var LOSETXT=["Their assassin one-shots your carry before the fight even starts.","Missed engage, your team follows anyway.","Outscaled. From minute 35 your comp was simply done.","Their support hooks your carry out of position.","Their items were just better picked."];
var matchResult=null;
function startMatch(){
  var meT=teamArr(G.my),foeT=teamArr(G.foe);
  var foePicks=aiItems(foeT,meT);
  G.foePlan=aiPlan(foeT);
  var myEv=evalTeam(meT,G.items,foeT,G.plan);
  var foeEv=evalTeam(foeT,foePicks,meT,G.foePlan);
  foeEv.total=Math.round(foeEv.total*(1+skillNow()*0.012));
  var myP=phasePower(myEv,meT),foeP=phasePower(foeEv,foeT);
  document.getElementById("matchFoe").textContent=G.foeName;
  buildMap();
  var mp=document.getElementById("matchPhases");
  mp.innerHTML=["early","mid","late"].map(function(ph){
    return '<div class="mphase"><div class="plabel"><span>'+PHNL[ph]+'</span><span id="pr-'+ph+'">...</span></div><div class="bar"><div class="m" id="bar-'+ph+'" style="width:50%"></div><div class="e"></div></div></div>';
  }).join("");
  document.getElementById("matchLog").innerHTML="";
  document.getElementById("matchNext").innerHTML="";
  show("scr-match");
  var phases=["early","mid","late"],i=0,wins=0,phaseWins=[],phaseDetail=[];
  function step(){
    if(i>=phases.length){
      var won=wins>=2;
      mapEnd(won);
      matchResult={won:won,myEv:myEv,foeEv:foeEv,foePicks:foePicks,meT:meT,foeT:foeT,phaseWins:phaseWins,phaseDetail:phaseDetail,side:G.side,plan:G.plan,foePlan:G.foePlan};
      document.getElementById("matchNext").innerHTML='<button class="btn primary" id="toAnalysis">View analysis</button>';
      document.getElementById("toAnalysis").addEventListener("click",showAnalysis);
      return;
    }
    var ph=phases[i];
    var m=myP[ph]*(0.88+R()*0.24), e=foeP[ph]*(0.88+R()*0.24);
    var share=Math.round(100*m/(m+e));
    document.getElementById("bar-"+ph).style.width=share+"%";
    var w=m>=e;if(w)wins++;phaseWins.push(w);phaseDetail.push({ph:ph,mb:Math.round(myP[ph]),eb:Math.round(foeP[ph]),mr:Math.round(m),er:Math.round(e),won:w});
    snd(w?"pwin":"plose");
    mapPhase(w);
    document.getElementById("pr-"+ph).innerHTML=w?'<span class="pos">won</span>':'<span class="neg">lost</span>';
    var pool=w?WINTXT:LOSETXT;
    document.getElementById("matchLog").innerHTML+='<div>'+PHNL[ph]+': '+pool[Math.floor(R()*pool.length)]+'</div>';
    i++;setTimeout(step,1300);
  }
  setTimeout(step,500);
}

/* ================= ANALYSIS & SHARE ================= */
function grade(p){return p>=4?["Strong","g-good"]:p>=2?["Decent","g-ok"]:["Weak","g-bad"];}
function clamp01(x){return Math.max(0,Math.min(1,x));}
function coachScore(ev){
  var synPct=clamp01((ev.synT+18)/44);
  var itemPct=clamp01(ev.itemT/30);
  var ctrPct=clamp01(ev.ctrT/12);
  var sc=Math.round(100*(0.40*synPct+0.45*itemPct+0.15*ctrPct));
  var g=sc>=85?"S":sc>=70?"A":sc>=55?"B":sc>=40?"C":"D";
  return {score:sc,grade:g};
}
function synHtml(rows){
  return rows.map(function(x){
    var cl=x[1]>=0?"pos":"neg";
    return '<div class="aline"><span>'+x[0]+'</span><span class="'+cl+'">'+(x[1]>=0?"+":"")+x[1]+'</span></div>';
  }).join("")||'<div class="aline"><span>No notable effects</span><span>0</span></div>';
}
function shareText(R0){
  var head=MODE==="daily" ? "Rift Draft Arena daily "+todayStr() : "Rift Draft Arena ("+RANKS[ladder.ri]+" ladder)";
  var sideTxt=R0.side==="B"?"Blue side":"Red side";
  var sq=R0.phaseWins.map(function(w){return w?"\uD83D\uDFE6":"\uD83D\uDFE5";}).join(" ");
  var cs=coachScore(R0.myEv);
  return head+" ("+sideTxt+")\n"+(R0.won?"VICTORY":"DEFEAT")+" vs "+G.foeName+
    "\nCoach score "+cs.score+"/100 (grade "+cs.grade+")"+
    "\nEarly Mid Late: "+sq+
    "\nSynergy "+(R0.myEv.synT>=0?"+":"")+R0.myEv.synT+", counters +"+R0.myEv.ctrT+", items "+R0.myEv.itemT+"/30";
}
function copyShare(R0,btn){
  var txt=shareText(R0);
  function done(){btn.textContent="Copied!";setTimeout(function(){btn.textContent="Copy result";},1500);}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,function(){window.prompt("Copy your result:",txt);});}
  else{window.prompt("Copy your result:",txt);}
}
function showAnalysis(){
  var R0=matchResult;
  snd(R0.won?"victory":"defeat");
  var rb=document.getElementById("resultBanner");
  var lpline="";
  if(MODE==="ranked"){
    var lp=applyLP(R0.won);
    lpline='<div class="lp '+(R0.won?"pos":"neg")+'">'+(R0.won?"+25":"-20")+' LP'+
      (lp.promo?' \u00b7 <span class="neutral">PROMOTED to '+RANKS[ladder.ri]+'</span>':"")+
      (lp.demo?' \u00b7 <span class="neg">Demoted to '+RANKS[ladder.ri]+'</span>':"")+'</div>';
  } else {
    lpline='<div class="lp neutral">Daily challenge '+todayStr()+' \u00b7 everyone faces the same AI seed today, it reacts to your choices</div>';
  }
  var cs=coachScore(R0.myEv);
  rb.innerHTML='<div class="resultbanner '+(R0.won?"win":"lose")+'"><h2>'+(R0.won?"VICTORY":"DEFEAT")+'</h2>'+lpline+
    '<div class="lp neutral">Coach score '+cs.score+'/100 \u00b7 grade '+cs.grade+' (your synergy, counters and items, tier luck excluded)</div>'+
    (R0.plan?'<div class="lp neutral">Your plan: '+planLabel(R0.plan)+'</div>':"")+'</div>';
  var mx=Math.max(R0.myEv.total,R0.foeEv.total,1);
  document.getElementById("powerCompare").innerHTML='<h3>TEAM POWER (hidden during the game)</h3>'+
    '<div class="pbrow"><span class="who" style="color:var(--blue)">YOU</span><div class="track"><i style="width:'+Math.round(100*R0.myEv.total/mx)+'%;background:var(--blue)"></i></div><b>'+R0.myEv.total+'</b></div>'+
    '<div class="pbrow"><span class="who" style="color:var(--red)">'+G.foeName.toUpperCase()+'</span><div class="track"><i style="width:'+Math.round(100*R0.foeEv.total/mx)+'%;background:var(--red)"></i></div><b>'+R0.foeEv.total+'</b></div>'+
    '<p class="hint" style="margin-top:8px">Your breakdown: tiers '+Math.round(R0.myEv.base)+' \u00b7 synergy '+(R0.myEv.synT>=0?"+":"")+R0.myEv.synT+' \u00b7 counters +'+R0.myEv.ctrT+' \u00b7 items +'+R0.myEv.itemT+'</p>';
  document.getElementById("myTiers").innerHTML=R0.meT.map(function(c){
    return '<div class="champline"><div class="mini">'+imgTag(c)+'</div><span class="grow">'+c[0]+'</span><span class="tpill" style="background:'+TIERCOL[c[2]]+'">'+c[2]+'</span><span style="width:42px;text-align:right;color:var(--white)">'+TIERPTS[c[2]]+'</span></div>';
  }).join("");
  var planHdr=R0.plan?'<div class="aline"><span style="color:var(--gold-bright)">Plan: '+planLabel(R0.plan)+'</span></div><div class="hint" style="margin:2px 0 8px">'+planWin(R0.plan)+'</div>':"";
  document.getElementById("mySyn").innerHTML=planHdr+synHtml(R0.myEv.syn);
  document.getElementById("myCtr").innerHTML=synHtml(R0.myEv.ctr);
  document.getElementById("myItems").innerHTML=R0.myEv.items.map(function(row){
    var g=grade(row.pts);
    return '<div class="champline"><div class="mini">'+imgTag(row.champ)+'</div><div class="grow"><span style="color:var(--white)">'+row.champ[0]+': '+row.item+'</span><br><span class="hint">'+row.why+'</span></div><span class="gpill '+g[1]+'">'+g[0]+' +'+row.pts+'</span></div>';
  }).join("");
  document.getElementById("foeSummary").innerHTML=R0.foeT.map(function(c,i){
    var its=R0.foePicks.filter(function(p){return p.slot===i;}).map(function(p){return ITEMDEFS[p.itemId].n;});
    var itxt=its.length?its.join(", "):"no items";
    return '<div class="champline"><div class="mini">'+imgTag(c)+'</div><span class="grow">'+c[0]+' <span class="hint">\u00b7 '+itxt+'</span></span><span class="tpill" style="background:'+TIERCOL[c[2]]+'">'+c[2]+'</span></div>';
  }).join("")+'<div class="aline" style="margin-top:8px"><span>Enemy synergy plus counters</span><span>'+(R0.foeEv.synT+R0.foeEv.ctrT>=0?"+":"")+(R0.foeEv.synT+R0.foeEv.ctrT)+'</span></div>';
  var fm=document.getElementById("mathPanel");
  fm.innerHTML='<h3>THE MATH</h3>'+
    '<p class="hint" style="margin-bottom:8px">Team power = tier points + synergy + counters + items. Phase power adds style modifiers: early champs and engage count extra in the early game, scalers in the late game, CC in the mid game. Each phase both teams roll 88 to 112 percent of their phase power, highest roll wins. Win 2 of 3 phases for the match. The AI gets a ladder handicap of times (1 + 0.012 per rank).</p>'+
    (R0.plan?'<div class="aline"><span style="color:var(--gold-bright)">Your plan</span><span>'+planLabel(R0.plan)+'</span></div><p class="hint" style="margin:2px 0 8px">'+planWin(R0.plan)+'</p>':"")+
    '<div class="aline"><span style="color:var(--gold-bright)">Your totals</span><span>tiers '+Math.round(R0.myEv.base)+' / syn '+(R0.myEv.synT>=0?"+":"")+R0.myEv.synT+' / ctr +'+R0.myEv.ctrT+' / items +'+R0.myEv.itemT+' = '+R0.myEv.total+'</span></div>'+
    '<div class="aline"><span style="color:var(--gold-bright)">Enemy totals</span><span>tiers '+Math.round(R0.foeEv.base)+' / syn '+(R0.foeEv.synT>=0?"+":"")+R0.foeEv.synT+' / ctr +'+R0.foeEv.ctrT+' / items +'+R0.foeEv.itemT+' = '+R0.foeEv.total+' (after handicap)</span></div>'+
    '<div style="margin-top:10px;font-size:13px;color:var(--gold)">PHASE ROLLS</div>'+
    R0.phaseDetail.map(function(p){
      var nm=p.ph==="early"?"Early":p.ph==="mid"?"Mid":"Late";
      return '<div class="aline"><span>'+nm+': you '+p.mb+' rolled <b style="color:var(--white)">'+p.mr+'</b>, enemy '+p.eb+' rolled <b style="color:var(--white)">'+p.er+'</b></span><span class="'+(p.won?"pos":"neg")+'">'+(p.won?"won":"lost")+'</span></div>';
    }).join("")+
    '<div style="margin-top:10px;font-size:13px;color:var(--gold)">ENEMY BREAKDOWN'+(R0.foePlan?' (plan: '+planLabel(R0.foePlan)+')':'')+'</div>'+
    synHtml(R0.foeEv.syn)+synHtml(R0.foeEv.ctr)+
    R0.foeEv.items.map(function(row){
      var g=grade(row.pts);
      return '<div class="aline"><span>'+row.champ[0]+': '+row.item+'</span><span class="'+(row.pts>=4?"pos":row.pts>=2?"neutral":"neg")+'">+'+row.pts+'</span></div>';
    }).join("");
  var btns=document.getElementById("analysisBtns");
  btns.innerHTML='<button class="btn" id="shareBtn">Copy result</button> '+
    (MODE==="ranked"?'<button class="btn primary" id="nextGame">Next game</button> ':"")+
    '<button class="btn ghost" id="toMenu">Menu</button>';
  document.getElementById("shareBtn").addEventListener("click",function(){copyShare(R0,this);});
  if(MODE==="ranked")document.getElementById("nextGame").addEventListener("click",function(){requestGame("ranked");});
  document.getElementById("toMenu").addEventListener("click",function(){show("scr-menu");});
  show("scr-analysis");
}
document.getElementById("closeOverlay").addEventListener("click",function(){document.getElementById("champOverlay").classList.remove("show");});

/* ================= WHAT'S NEW ================= */
/* Named versions, newest first. Early pre-release, so we count in small 0.0.x steps.
   1.0 is reserved for the finished game. Bump VERSION and prepend an entry per release. */
var VERSION={num:"0.1.1",name:"Read the Fine Print"};
var CHANGELOG=[
 {v:"0.1.1",name:"Read the Fine Print",notes:[
   "Every item description now matches what the item actually does on the Rift, rewritten from the real in-game text.",
   "Each item in the shop now shows that one-line description under its stats, so you draft knowing exactly what you are buying."
 ]},
 {v:"0.1.1",name:"Lock It In",notes:[
   "Ranked is now an open pick phase: pick any champion whose role is still open, just like champ select. No more rerolls.",
   "The three random offers and the two rerolls move to the daily challenge for now."
 ]},
 {v:"0.1.0",name:"The Master Plan",notes:[
   "After the item phase you now declare a game plan, your win condition for the match ahead, chosen from seven identities from a patient front to back to an all-out dive.",
   "Your team is judged on whether it can actually deliver that plan instead of one rigid mold: land the plan's keystone and round it out with the right pieces.",
   "The post-game report then lays out exactly how well you set up your chosen strategy."
 ]},
 {v:"0.0.11",name:"The Last Crate",notes:[
   "The final legendaries hit the shelves. The shop is fully stocked."
 ]},
 {v:"0.0.10",name:"The Armory Expands",notes:[
   "Crit carries and mana mages restock the shelves. Build paths just got wider."
 ]},
 {v:"0.0.9",name:"Restock",notes:[
   "Eighteen new items join the shop: anti attack-speed, anti-heal, scaling magic resist, armor penetration against tanks, on-hit AP and more.",
   "Mana items only pay off on champions that actually build mana, otherwise they read as wasted stats."
 ]},
 {v:"0.0.8",name:"Open Shop",notes:[
   "The item phase is now an open shop: buy any item for any champion, six items across the team, max two per champion.",
   "Items are scored against both teams with a fit check, so off-type buys like an AP item on an AD champion are flagged as wasted stats.",
   "The AI itemizes from the same open shop, and the post-game analysis shows the full six-item breakdown out of 30."
 ]},
 {v:"0.0.7",name:"Single Source",notes:[
   "The Roadmap on the menu now reads the live board (roadmap-data.json), so there is one place to maintain it. It falls back to a built-in list when the file cannot be loaded."
 ]},
 {v:"0.0.6",name:"Itemize",notes:[
   "Every item in the item phase now shows its real gold cost and stats, pulled from verified Summoner's Rift data (Data Dragon 16.12.1)."
 ]},
 {v:"0.0.5",name:"Skill Expression",notes:[
   "Tier point spread compressed so smart drafting outweighs raw tier luck.",
   "Coach score from 0 to 100 with a letter grade added to the result banner and share text, based only on what you control."
 ]},
 {v:"0.0.4",name:"Open Book",notes:[
   "The Math panel breaks down every result: your totals, the enemy totals, item verdicts and the exact phase rolls."
 ]},
 {v:"0.0.3",name:"Patch Verified",notes:[
   "All item and champion data verified against the official 26.12 notes, Summoner's Rift sections only.",
   "Arena-only changes removed, wrong items fixed, and real 26.12 champion notes added."
 ]},
 {v:"0.0.2",name:"Tournament Realm",notes:[
   "Blue or red side select before every game.",
   "Full pro draft order with interleaved double ban phases."
 ]},
 {v:"0.0.1",name:"First Blood",notes:[
   "First playable build: ban, draft with three-option offers and two rerolls, item phase and full post-game analysis.",
   "Daily challenge with a shared AI seed, and a ranked ladder from Iron to Challenger.",
   "League style UI, a soundtrack with volume sliders, and a hidden Hextech chest."
 ]}
];
function escHtml(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function renderNews(){
  document.getElementById("newsList").innerHTML=CHANGELOG.map(function(e){
    return '<div class="ver"><div class="vhead"><span class="vnum">v'+e.v+'</span><span class="vname">'+escHtml(e.name)+'</span></div><ul>'+
      e.notes.map(function(n){return '<li>'+escHtml(n)+'</li>';}).join("")+'</ul></div>';
  }).join("");
}
function showOv(id){document.getElementById(id).classList.add("show");}
function hideOv(id){document.getElementById(id).classList.remove("show");}
document.getElementById("verTag").textContent="v"+VERSION.num+" "+VERSION.name;
document.getElementById("whatsNewBtn").addEventListener("click",function(){snd("click");renderNews();showOv("newsOverlay");});
document.getElementById("newsClose").addEventListener("click",function(){hideOv("newsOverlay");});
document.getElementById("newsOverlay").addEventListener("click",function(e){if(e.target===this)hideOv("newsOverlay");});

/* ================= START ================= */
var pendingMode="ranked";
function requestGame(mode){
  pendingMode=mode;snd("click");
  document.getElementById("sideOverlay").classList.add("show");
}
function launch(side){
  document.getElementById("sideOverlay").classList.remove("show");
  MODE=pendingMode;
  R = MODE==="daily" ? mulberry32(todaySeed()) : Math.random;
  newGame();
  G.side=side;buildSeq();
  draftRole="ALL";draftQ="";document.getElementById("draftSearch").value="";
  document.getElementById("foeName").textContent=G.foeName.toUpperCase();
  show("scr-draft");advance();
}
document.getElementById("startGame").addEventListener("click",function(){requestGame("ranked");});
document.getElementById("startDaily").addEventListener("click",function(){requestGame("daily");});
document.getElementById("sideBlue").addEventListener("click",function(){snd("pick");launch("B");});
document.getElementById("sideRed").addEventListener("click",function(){snd("pick");launch("R");});
document.getElementById("sideClose").addEventListener("click",function(){document.getElementById("sideOverlay").classList.remove("show");});
renderRank();

