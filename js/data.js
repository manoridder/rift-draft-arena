/* =====================================================================
   RIFT DRAFT ARENA: DATA (patch 26.12)
   Everything you edit per patch lives in this file:
   - TIERPTS / champion list C (name, role, tier, tags)
   - NOTES (patch notes per champion shown in the codex)
   - ITEMDEFS + CLASSOPTS (the item pool and verdicts)
   The engine never needs touching for a data update.
   ===================================================================== */
var DATA_VERSION="26.12";

"use strict";
/* tags: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain/heal */
var TIERPTS={S:9,A:8,B:7,C:6,D:5};
var TIERCOL={S:"var(--tS)",A:"var(--tA)",B:"var(--tB)",C:"var(--tC)",D:"var(--tD)"};
var ROLES=["TOP","JGL","MID","ADC","SUP"];
var ROLENL={TOP:"Top",JGL:"Jgl",MID:"Mid",ADC:"ADC",SUP:"Sup"};
var TAGNAMES={f:"Frontline",e:"Engage",c:"Crowd control",a:"AP damage",d:"AD damage",h:"Scaling",r:"Early game",p:"Poke",n:"Enchanter",v:"Diver",g:"Global",s:"Sustain"};

var C=[
["Aatrox","TOP","A","f d r s"],["Ambessa","TOP","A","d v r"],["Camille","TOP","B","d v"],
["Cho'Gath","TOP","B","f a h c"],["Darius","TOP","A","f d r"],["Dr. Mundo","TOP","B","f h s"],
["Fiora","TOP","A","d h s"],["Gangplank","TOP","B","d h p"],["Garen","TOP","S","f d"],
["Gnar","TOP","B","f c d e"],["Gragas","TOP","B","f e c a"],["Gwen","TOP","B","a h"],
["Illaoi","TOP","A","f d s"],["Irelia","TOP","B","d v r"],["Jax","TOP","S","d h"],
["Jayce","TOP","B","d p r"],["K'Sante","TOP","A","f c"],["Kayle","TOP","B","a h"],
["Kennen","TOP","B","a c e"],["Kled","TOP","B","d e r"],["Malphite","TOP","A","f e c a"],
["Mordekaiser","TOP","D","a f"],["Nasus","TOP","B","f h c s"],["Olaf","TOP","B","d r s"],
["Ornn","TOP","A","f e c"],["Pantheon","TOP","B","d r c"],["Poppy","TOP","B","f c"],
["Quinn","TOP","C","d g"],["Renekton","TOP","B","d r c"],["Riven","TOP","B","d r v"],
["Rumble","TOP","B","a r"],["Sett","TOP","A","f d c"],["Shen","TOP","S","f c g"],
["Singed","TOP","A","f a"],["Sion","TOP","S","f e c"],["Tahm Kench","TOP","B","f c s"],
["Teemo","TOP","B","a p"],["Trundle","TOP","C","f d s"],["Tryndamere","TOP","B","d h"],
["Urgot","TOP","B","f d"],["Vladimir","TOP","B","a h s"],["Volibear","TOP","B","f d r"],
["Wukong","TOP","B","f d e c"],["Yorick","TOP","B","d h"],
["Amumu","JGL","B","f e c a"],["Bel'Veth","JGL","A","d h s"],["Briar","JGL","S","d v e r s"],
["Diana","JGL","A","a e v"],["Ekko","JGL","A","a v"],["Elise","JGL","B","a r c"],
["Evelynn","JGL","B","a v"],["Fiddlesticks","JGL","A","a e c s"],["Graves","JGL","B","d r"],
["Hecarim","JGL","B","e d v"],["Ivern","JGL","C","n c"],["Jarvan IV","JGL","A","e c d f"],
["Karthus","JGL","B","a h g"],["Kayn","JGL","B","d v s"],["Kha'Zix","JGL","B","d v"],
["Kindred","JGL","B","d h"],["Lee Sin","JGL","B","d r v"],["Lillia","JGL","B","a c h"],
["Master Yi","JGL","S","d h"],["Nidalee","JGL","C","a p r s"],["Nocturne","JGL","B","d v g"],
["Nunu & Willump","JGL","B","f e c a g s"],["Rammus","JGL","B","f e c"],["Rek'Sai","JGL","B","d r e"],
["Rengar","JGL","B","d v r"],["Sejuani","JGL","A","f e c a"],["Shaco","JGL","C","d r"],
["Shyvana","JGL","C","a d h"],["Skarner","JGL","A","f e c"],["Taliyah","JGL","B","a c g"],
["Udyr","JGL","B","f d r s"],["Vi","JGL","A","e c d"],["Viego","JGL","A","d v h s"],
["Warwick","JGL","B","f d r s"],["Xin Zhao","JGL","B","d e r"],["Zac","JGL","A","f e c a s"],
["Ahri","MID","A","a c"],["Akali","MID","B","a v"],["Akshan","MID","B","d v g"],
["Anivia","MID","B","a c h"],["Annie","MID","B","a e c"],["Aurelion Sol","MID","A","a h"],
["Aurora","MID","A","a c"],["Azir","MID","A","a h"],["Cassiopeia","MID","B","a h"],
["Corki","MID","C","d p h"],["Fizz","MID","B","a v"],["Galio","MID","B","f a c e g"],
["Heimerdinger","MID","C","a p"],["Hwei","MID","A","a p c"],["Kassadin","MID","S","a h"],
["Katarina","MID","B","a v"],["LeBlanc","MID","B","a v"],["Lissandra","MID","B","a e c"],
["Malzahar","MID","B","a c h"],["Mel","MID","A","a p"],
["Naafiri","MID","B","d v"],["Neeko","MID","B","a e c"],["Orianna","MID","A","a c e"],
["Qiyana","MID","B","d v r"],["Ryze","MID","B","a h g"],["Swain","MID","A","a f c e s"],
["Sylas","MID","A","a v c s"],["Syndra","MID","A","a c p"],["Talon","MID","B","d v g"],
["Twisted Fate","MID","B","a c g"],["Veigar","MID","B","a h c"],["Vel'Koz","MID","B","a p c"],
["Vex","MID","A","a e c"],["Viktor","MID","A","a h c"],["Xerath","MID","B","a p c"],
["Yasuo","MID","S","d h c"],["Yone","MID","A","d h v c"],["Zed","MID","S","d v"],
["Ziggs","MID","B","a p h"],["Zoe","MID","B","a p c"],
["Aphelios","ADC","B","d h"],["Ashe","ADC","S","d c p g"],["Caitlyn","ADC","S","d p h"],
["Draven","ADC","B","d r"],["Ezreal","ADC","B","d p v"],["Jhin","ADC","A","d p c"],
["Jinx","ADC","A","d h"],["Kai'Sa","ADC","A","d h v"],["Kalista","ADC","B","d v r"],
["Kog'Maw","ADC","B","d h p"],["Lucian","ADC","A","d r v"],["Miss Fortune","ADC","B","d p"],
["Nilah","ADC","B","d h v s"],["Samira","ADC","A","d v r s"],["Sivir","ADC","B","d h"],
["Smolder","ADC","D","d h"],["Tristana","ADC","B","d r v"],["Twitch","ADC","B","d h v"],
["Varus","ADC","B","d p c"],["Vayne","ADC","A","d h"],["Xayah","ADC","A","d c h"],
["Yunara","ADC","B","d h"],["Zeri","ADC","B","d h"],
["Alistar","SUP","A","f e c s"],["Bard","SUP","A","c g s"],["Blitzcrank","SUP","S","e c"],
["Brand","SUP","B","a p"],["Braum","SUP","A","f c"],["Janna","SUP","B","n c"],
["Karma","SUP","A","n p c"],["Leona","SUP","S","f e c"],["Lulu","SUP","C","n c"],
["Lux","SUP","A","a p c"],["Maokai","SUP","B","f e c a s"],["Milio","SUP","B","n s"],
["Morgana","SUP","S","a c p"],["Nami","SUP","B","n c s"],["Nautilus","SUP","S","f e c"],
["Pyke","SUP","S","e c v r"],["Rakan","SUP","A","e c n"],["Rell","SUP","A","f e c"],
["Renata Glasc","SUP","B","n c e"],["Senna","SUP","A","d n p h s"],["Seraphine","SUP","S","a n c s"],
["Sona","SUP","B","n c h s"],["Soraka","SUP","B","n s"],["Taric","SUP","B","f c n h s"],
["Thresh","SUP","S","e c f"],["Yuumi","SUP","D","n s"],["Zilean","SUP","B","c n h"],
["Zyra","SUP","B","a p c"]
];

var NOTES={
"Kassadin":"Buffed in 26.11. The main reason he sits in S tier right now.",
"Aatrox":"26.12 buff: more Q sweet spot damage. Riot wants him threatening again.",
"Gwen":"26.12 buff: stronger Q snips and early E attack speed.",
"Hwei":"26.12 buff: higher Q ratios and a shorter E cooldown.",
"Jax":"26.12 buff: cheaper Q and more E percent health damage.",
"Lee Sin":"26.12 nerf: AD growth and Q damage trimmed.",
"Nocturne":"26.12 nerf: Q damage down at most ranks.",
"Orianna":"26.12 nerf: early game shaved, ultimate scales harder instead.",
"Ryze":"26.12 nerf: early base stats down, scaling untouched.",
"Sylas":"26.12 buff: Q damage and W heal ratios up.",
"Syndra":"26.12 buff: base health and Q damage up.",
"Tristana":"26.12 buff aimed at mid lane: AD growth and cheaper Q.",
"Varus":"26.12 nerf targeting lethality builds, on-hit mostly spared.",
"Xin Zhao":"26.12 nerf: AP mid Xin loses sustain and mana efficiency.",
"Diana":"Buffed in 26.11.","Ekko":"Buffed in 26.11.","Heimerdinger":"Buffed in 26.11.","Quinn":"Buffed in 26.11.",
"Smolder":"Gutted in 26.11. Q passive damage at low stacks was cut hard, his snowball window is gone.",
"Brand":"Nerfed in 26.11 after quietly dominating as a support.",
"Teemo":"Nerfed in 26.11 after overperforming all of 26.10.",
"Mordekaiser":"Compounding nerfs left him without a clear identity. Skip until Riot touches his kit.",
"Thresh":"Top tier tank support meta. Profits from the 26.11/26.12 engage item buffs.",
"Nautilus":"Top tier tank support meta. Profits from the 26.11/26.12 engage item buffs.",
"Leona":"Top tier tank support, lifted by Aftershock and the engage item buffs.",
"Rell":"Tank support on the rise after the 26.11/26.12 tank support buffs.",
"Seraphine":"One of the few ranged supports still S tier after the enchanter nerfs.",
"Lux":"Poke support that survived the enchanter item nerfs in good shape.",
"Lulu":"Hit hard by the 26.11 enchanter item nerfs (Aery, Moonstone, Helia).",
"Janna":"Hit by the 26.11 enchanter item nerfs.","Soraka":"Hit by the 26.11 enchanter item nerfs.",
"Nami":"Lost her Imperial Mandate synergy in the rework and fell out of tier 1.",
"Milio":"Dropped down the tiers after the enchanter item nerfs.",
"Yuumi":"Hit hardest by the 26.09 Moonstone changes, got AP ratio compensation buffs in 26.12.",
"Garen":"Holding S+ on the big stat sites for 26.12.",
"Yasuo":"S+ mid on the 26.12 stat sites.","Master Yi":"S+ jungle on the 26.12 stat sites.",
"Caitlyn":"S+ ADC on the 26.12 stat sites.","Ashe":"S tier ADC on the 26.12 stat sites.",
"Zed":"S tier mid on the 26.12 stat sites."
};

var DD_VERSION="16.12.1";
var IMGFIX={"Wukong":"MonkeyKing","Nunu & Willump":"Nunu","Renata Glasc":"Renata","Bel'Veth":"Belveth","Cho'Gath":"Chogath","Kai'Sa":"Kaisa","Kha'Zix":"Khazix","Kog'Maw":"KogMaw","LeBlanc":"Leblanc","Vel'Koz":"Velkoz","Rek'Sai":"RekSai","K'Sante":"KSante","Dr. Mundo":"DrMundo","Jarvan IV":"JarvanIV","Lee Sin":"LeeSin","Master Yi":"MasterYi","Miss Fortune":"MissFortune","Tahm Kench":"TahmKench","Twisted Fate":"TwistedFate","Xin Zhao":"XinZhao","Aurelion Sol":"AurelionSol"};
function imgId(c){ return IMGFIX[c[0]] || c[0].replace(/[^A-Za-z]/g,""); }
function imgUrl(c){ return "https://ddragon.leagueoflegends.com/cdn/"+DD_VERSION+"/img/champion/"+imgId(c)+".png"; }
function imgUrl2(c){ return "https://cdn.communitydragon.org/latest/champion/"+imgId(c)+"/square"; }
window.imgFail=function(img){
  var step=+img.dataset.step||0;
  if(step===0){ img.dataset.step=1; img.src=img.dataset.alt; return; }
  img.style.display="none";
  if(img.nextElementSibling) img.nextElementSibling.style.display="flex";
};
function initials(name){
  var p=name.replace(/['.&]/g,"").split(/\s+/).filter(Boolean);
  return p.length>1 ? (p[0][0]+p[1][0]).toUpperCase() : name.slice(0,2);
}
function imgTag(c){
  return '<img src="'+imgUrl(c)+'" data-alt="'+imgUrl2(c)+'" alt="'+c[0]+'" loading="lazy" onerror="imgFail(this)"><span class="fb">'+initials(c[0])+'</span>';
}
function picHtml(c,cls){ return '<div class="'+cls+'">'+imgTag(c)+'</div>'; }
function has(c,t){ return c[3].split(" ").indexOf(t)>=0; }
function cnt(team,t){ return team.filter(function(x){return x&&has(x,t);}).length; }

var byRole={}; ROLES.forEach(function(r){ byRole[r]=C.filter(function(c){return c[1]===r;}); });

/* ================= ITEMS ================= */
function classOf(c){
  if(c[1]==="SUP") return has(c,"n") ? "ENCH":"ENGS";
  if(c[1]==="ADC") return "MARK";
  if(has(c,"v")&&!has(c,"f")) return "ASSA";
  if(has(c,"f")) return "TANK";
  if(has(c,"a")) return "MAGE";
  return "FIGHT";
}
var ITEMDEFS={
 heartsteel:{n:"Heartsteel",d:"Stacks infinite HP. Strong if you frontline for a long time.",v:function(s,m,e){return cnt(m,"f")>=2?[3,"Double frontline, you stack HP in peace."]:[2,"Decent HP scaling, but you hold the front alone."];}},
 thornmail:{n:"Thornmail",d:"Armor plus anti-heal on hit.",v:function(s,m,e){var ad=cnt(e,"d"),sus=cnt(e,"s")+cnt(e,"n");if(ad>=3&&sus>=2)return[5,"Enemy is AD heavy and heals a lot. Both halves of this item pay off."];if(ad>=3)return[4,"Plenty of enemy AD, the armor does real work."];if(sus>=2)return[3,"Anti-heal hits their sustain, armor matters less here."];return[1,"Little AD and little healing on their side."];}},
 kaenic:{n:"Kaenic Rookern",d:"Big magic shield against AP.",v:function(s,m,e){return cnt(e,"a")>=3?[5,"Three or more AP threats, this shield wins fights."]:cnt(e,"a")>=2?[3,"Reasonable AP threat to absorb."]:[1,"Barely any enemy AP, the shield stays empty."];}},
 randuin:{n:"Randuin's Omen",d:"Armor, anti-crit, slow active.",v:function(s,m,e){return cnt(e,"d")>=4?[4,"Full AD enemy team, Randuin's cuts their DPS hard."]:cnt(e,"d")>=3?[3,"Enough AD around to get value."]:[1,"Not enough auto-attackers on their side."];}},
 trinity:{n:"Trinity Force",d:"All-round fighter spike.",v:function(s,m,e){return[3,"Solid all-rounder, never a throw."];}},
 eclipse:{n:"Eclipse",d:"Percent max-HP damage.",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Their tanks melt to percent-HP damage."]:[2,"Few HP stackers to carve up."];}},
 maw:{n:"Maw of Malmortius",d:"Magic shield for AD champs.",v:function(s,m,e){return cnt(e,"a")>=3?[4,"Lots of AP burst, the shield saves your all-in."]:[1,"Enemy barely deals magic damage."];}},
 rabadon:{n:"Rabadon's Deathcap",d:"Raw AP amplification.",v:function(s,m,e){return has(s,"h")?[4,"You scale, Deathcap turns you into a raid boss."]:[3,"Always damage, you just peak earlier."];}},
 voidstaff:{n:"Void Staff",d:"Magic pen against MR stackers.",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Their tanks buy MR, you cut straight through it."]:[1,"Nobody stacks MR, the pen is wasted."];}},
 zhonya:{n:"Zhonya's Hourglass",d:"Stasis against dives and burst.",v:function(s,m,e){return cnt(e,"v")>=2?[5,"Two divers on you, stasis breaks their all-in."]:cnt(e,"v")>=1?[3,"One diver to stall out."]:[1,"Nobody dives you. Golden bracelet."];}},
 morello:{n:"Morellonomicon",d:"AP plus heavy anti-heal.",v:function(s,m,e){var sus=cnt(e,"s")+cnt(e,"n");return sus>=3?[5,"Their comp leans on healing, you shut the tap."]:sus>=2?[4,"Enough sustain around to cut."]:[1,"Enemy barely heals. Dead stats."];}},
 edge:{n:"Edge of Night",d:"Spellshield that blocks the next ability.",v:function(s,m,e){return cnt(e,"c")>=4?[4,"CC festival on their side, the shield blocks the first hook."]:cnt(e,"c")>=3?[3,"Fair amount of CC to block."]:[1,"Little CC around, the shield catches nothing."];}},
 serpent:{n:"Serpent's Fang",d:"Cuts through shields.",v:function(s,m,e){return cnt(e,"n")>=2?[5,"Double shield bots, you make them useless."]:cnt(e,"n")>=1?[4,"Their enchanter shields melt."]:[0,"Nobody shields. Completely wasted item."];}},
 youmuu:{n:"Youmuu's Ghostblade",d:"Lethality plus a move speed active for picks and roams.",v:function(s,m,e){if(cnt(e,"f")===0)return[4,"All squishies on their side, lethality hits like a truck."];if(has(s,"r")||cnt(m,"r")>=2)return[3,"Your comp wants to hit early, the roam speed helps."];return[2,"Fine damage into their frontline, not ideal."];}},
 bloodthirster:{n:"Bloodthirster",d:"Lifesteal and an overheal shield.",v:function(s,m,e){return cnt(e,"p")>=2?[4,"Lots of poke, you just heal it back."]:[2,"Decent sustain spike."];}},
 ldr:{n:"Lord Dominik's Regards",d:"Armor pen against tanks.",v:function(s,m,e){return cnt(e,"f")>=2?[5,"Tank frontline, you shred right through it."]:cnt(e,"f")>=1?[3,"One tank to take apart."]:[1,"Squishy enemies, the pen is overkill."];}},
 mercurial:{n:"Mercurial Scimitar",d:"Cleanse active against CC.",v:function(s,m,e){return cnt(e,"c")>=4?[5,"CC chain on their side, QSS saves every fight."]:cnt(e,"c")>=3?[3,"Useful against their lockdown."]:[1,"Too little CC to cleanse."];}},
 mortal:{n:"Mortal Reminder",d:"Armor pen plus anti-heal.",v:function(s,m,e){var sus=cnt(e,"s")+cnt(e,"n");return sus>=2&&cnt(e,"f")>=1?[5,"Tanks that heal. Double hit."]:sus>=2?[4,"Their healing gets cut in half."]:[1,"Nobody heals, buy something else."];}},
 moonstone:{n:"Moonstone Renewer",d:"Chain heal in fights (nerfed earlier this season).",v:function(s,m,e){return[2,"Still works, but the nerf shows."];}},
 mikael:{n:"Mikael's Blessing",d:"Cleanse an ally out of CC.",v:function(s,m,e){return cnt(e,"c")>=3?[5,"Their CC chain breaks on your cleanse."]:cnt(e,"e")>=2?[4,"Engage comp, you save the target."]:[1,"Little CC to cleanse."];}},
 locket:{n:"Locket of the Iron Solari",d:"Teamwide shield (buffed in 26.11).",v:function(s,m,e){return cnt(e,"v")>=2||cnt(e,"e")>=2?[4,"Against their burst engage this is gold."]:[3,"Always tidy teamfight value."];}},
 mandate:{n:"Imperial Mandate",d:"Your CC marks enemies, team deals 6 percent extra (reworked in 26.11).",v:function(s,m,e){return has(s,"c")&&cnt(m,"v")+cnt(m,"d")>=3?[5,"You CC, your team dumps damage into the Vulnerable window."]:has(s,"c")?[4,"Every hook or stun is now a team buff."]:[1,"Without CC the passive does nothing."];}},
 knights:{n:"Knight's Vow",d:"Redirect damage from your carry (buffed in 26.11).",v:function(s,m,e){return m[3]&&has(m[3],"h")?[5,"Your hypercarry survives fights it had no right surviving."]:[3,"Decent protection for your ADC."];}},
 zekes:{n:"Zeke's Convergence",d:"Buffs your carry after 5s of combat (buffed in 26.11).",v:function(s,m,e){return m[3]&&has(m[3],"d")?[4,"Free DPS boost on your ADC, every fight."]:[2,"It works, but your carry barely profits."];}}
};
var CLASSOPTS={
 TANK:["heartsteel","thornmail","kaenic","randuin"],
 FIGHT:["trinity","eclipse","maw"],
 MAGE:["rabadon","voidstaff","zhonya","morello"],
 ASSA:["edge","serpent","youmuu"],
 MARK:["bloodthirster","ldr","mercurial","mortal"],
 ENCH:["moonstone","mikael","locket"],
 ENGS:["mandate","knights","locket","zekes"]
};

