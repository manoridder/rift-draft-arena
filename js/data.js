/* =====================================================================
   RIFT DRAFT ARENA: DATA (patch 26.12)
   Everything you edit per patch lives in this file:
   - TIERPTS / champion list C (name, role, tier, tags)
   - NOTES (patch notes per champion shown in the codex)
   - ITEMDEFS (the item pool, verdicts and shop metadata)
   The engine never needs touching for a data update.
   ===================================================================== */
var DATA_VERSION="26.12";

"use strict";
/* tags: f frontline, e engage, c cc, a AP, d AD, h scaling, r early, p poke, n enchanter, v dive, g global, s sustain/heal, m manahungry */
var TIERPTS={S:9,A:8,B:7,C:6,D:5};
var TIERCOL={S:"var(--tS)",A:"var(--tA)",B:"var(--tB)",C:"var(--tC)",D:"var(--tD)"};
var ROLES=["TOP","JGL","MID","ADC","SUP"];
var ROLENL={TOP:"Top",JGL:"Jgl",MID:"Mid",ADC:"ADC",SUP:"Sup"};
var TAGNAMES={f:"Frontline",e:"Engage",c:"Crowd control",a:"AP damage",d:"AD damage",h:"Scaling",r:"Early game",p:"Poke",n:"Enchanter",v:"Diver",g:"Global",s:"Sustain",m:"Mana"};

var C=[
["Aatrox","TOP","A","f d r s"],["Ambessa","TOP","A","d v r"],["Camille","TOP","B","d v"],
["Cho'Gath","TOP","B","f a h c"],["Darius","TOP","A","f d r"],["Dr. Mundo","TOP","B","f h s"],
["Fiora","TOP","A","d h s"],["Gangplank","TOP","B","d h p"],["Garen","TOP","S","f d"],
["Gnar","TOP","B","f c d e"],["Gragas","TOP","B","f e c a"],["Gwen","TOP","B","a h"],
["Illaoi","TOP","A","f d s"],["Irelia","TOP","B","d v r"],["Jax","TOP","S","d h"],
["Jayce","TOP","B","d p r m"],["K'Sante","TOP","A","f c"],["Kayle","TOP","B","a h"],
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
["Karthus","JGL","B","a h g m"],["Kayn","JGL","B","d v s"],["Kha'Zix","JGL","B","d v"],
["Kindred","JGL","B","d h"],["Lee Sin","JGL","B","d r v"],["Lillia","JGL","B","a c h"],
["Master Yi","JGL","S","d h"],["Nidalee","JGL","C","a p r s m"],["Nocturne","JGL","B","d v g"],
["Nunu & Willump","JGL","B","f e c a g s"],["Rammus","JGL","B","f e c"],["Rek'Sai","JGL","B","d r e"],
["Rengar","JGL","B","d v r"],["Sejuani","JGL","A","f e c a"],["Shaco","JGL","C","d r"],
["Shyvana","JGL","C","a d h"],["Skarner","JGL","A","f e c"],["Taliyah","JGL","B","a c g m"],
["Udyr","JGL","B","f d r s"],["Vi","JGL","A","e c d"],["Viego","JGL","A","d v h s"],
["Warwick","JGL","B","f d r s"],["Xin Zhao","JGL","B","d e r"],["Zac","JGL","A","f e c a s"],
["Ahri","MID","A","a c m"],["Akali","MID","B","a v"],["Akshan","MID","B","d v g"],
["Anivia","MID","B","a c h m"],["Annie","MID","B","a e c m"],["Aurelion Sol","MID","A","a h m"],
["Aurora","MID","A","a c"],["Azir","MID","A","a h m"],["Cassiopeia","MID","B","a h m"],
["Corki","MID","C","d p h"],["Fizz","MID","B","a v"],["Galio","MID","B","f a c e g"],
["Heimerdinger","MID","C","a p"],["Hwei","MID","A","a p c m"],["Kassadin","MID","S","a h m"],
["Katarina","MID","B","a v"],["LeBlanc","MID","B","a v"],["Lissandra","MID","B","a e c m"],
["Malzahar","MID","B","a c h"],["Mel","MID","A","a p"],
["Naafiri","MID","B","d v"],["Neeko","MID","B","a e c"],["Orianna","MID","A","a c e m"],
["Qiyana","MID","B","d v r"],["Ryze","MID","B","a h g m"],["Swain","MID","A","a f c e s m"],
["Sylas","MID","A","a v c s"],["Syndra","MID","A","a c p m"],["Talon","MID","B","d v g"],
["Twisted Fate","MID","B","a c g m"],["Veigar","MID","B","a h c"],["Vel'Koz","MID","B","a p c m"],
["Vex","MID","A","a e c"],["Viktor","MID","A","a h c m"],["Xerath","MID","B","a p c m"],
["Yasuo","MID","S","d h c"],["Yone","MID","A","d h v c"],["Zed","MID","S","d v"],
["Ziggs","MID","B","a p h"],["Zoe","MID","B","a p c m"],
["Aphelios","ADC","B","d h"],["Ashe","ADC","S","d c p g"],["Caitlyn","ADC","S","d p h"],
["Draven","ADC","B","d r"],["Ezreal","ADC","B","d p v m"],["Jhin","ADC","A","d p c"],
["Jinx","ADC","A","d h"],["Kai'Sa","ADC","A","d h v"],["Kalista","ADC","B","d v r"],
["Kog'Maw","ADC","B","d h p"],["Lucian","ADC","A","d r v"],["Miss Fortune","ADC","B","d p"],
["Nilah","ADC","B","d h v s"],["Samira","ADC","A","d v r s"],["Sivir","ADC","B","d h"],
["Smolder","ADC","D","d h"],["Tristana","ADC","B","d r v"],["Twitch","ADC","B","d h v"],
["Varus","ADC","B","d p c"],["Vayne","ADC","A","d h"],["Xayah","ADC","A","d c h"],
["Yunara","ADC","B","d h"],["Zeri","ADC","B","d h"],
["Alistar","SUP","A","f e c s"],["Bard","SUP","A","c g s"],["Blitzcrank","SUP","S","e c"],
["Brand","SUP","B","a p"],["Braum","SUP","A","f c"],["Janna","SUP","B","n c"],
["Karma","SUP","A","n p c"],["Leona","SUP","S","f e c"],["Lulu","SUP","C","n c"],
["Lux","SUP","A","a p c m"],["Maokai","SUP","B","f e c a s"],["Milio","SUP","B","n s"],
["Morgana","SUP","S","a c p"],["Nami","SUP","B","n c s"],["Nautilus","SUP","S","f e c"],
["Pyke","SUP","S","e c v r"],["Rakan","SUP","A","e c n"],["Rell","SUP","A","f e c"],
["Renata Glasc","SUP","B","n c e"],["Senna","SUP","A","d n p h s"],["Seraphine","SUP","S","a n c s m"],
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
/* Each entry carries shop metadata (added for the Phase 2 item overhaul):
   cat = shop tab grouping (Tank, Damage, Magic, Support); dmg = damage profile (ad, ap, none) for the fit rule.
   Verdicts stay v(s,m,e); the scoring pipeline may pass a fourth plan argument later, which JS ignores here. */
var ITEMDEFS={
 heartsteel:{n:"Heartsteel",cat:"Tank",dmg:"none",d:"Stacks infinite HP. Strong if you frontline for a long time.",v:function(s,m,e){return cnt(m,"f")>=2?[3,"Double frontline, you stack HP in peace."]:[2,"Decent HP scaling, but you hold the front alone."];}},
 thornmail:{n:"Thornmail",cat:"Tank",dmg:"none",d:"Armor plus anti-heal on hit.",v:function(s,m,e){var ad=cnt(e,"d"),sus=cnt(e,"s")+cnt(e,"n");if(ad>=3&&sus>=2)return[5,"Enemy is AD heavy and heals a lot. Both halves of this item pay off."];if(ad>=3)return[4,"Plenty of enemy AD, the armor does real work."];if(sus>=2)return[3,"Anti-heal hits their sustain, armor matters less here."];return[1,"Little AD and little healing on their side."];}},
 kaenic:{n:"Kaenic Rookern",cat:"Tank",dmg:"none",d:"Big magic shield against AP.",v:function(s,m,e){return cnt(e,"a")>=3?[5,"Three or more AP threats, this shield wins fights."]:cnt(e,"a")>=2?[3,"Reasonable AP threat to absorb."]:[1,"Barely any enemy AP, the shield stays empty."];}},
 randuin:{n:"Randuin's Omen",cat:"Tank",dmg:"none",d:"Armor, anti-crit, slow active.",v:function(s,m,e){return cnt(e,"d")>=4?[4,"Full AD enemy team, Randuin's cuts their DPS hard."]:cnt(e,"d")>=3?[3,"Enough AD around to get value."]:[1,"Not enough auto-attackers on their side."];}},
 trinity:{n:"Trinity Force",cat:"Damage",dmg:"ad",d:"All-round fighter spike.",v:function(s,m,e){return[3,"Solid all-rounder, never a throw."];}},
 eclipse:{n:"Eclipse",cat:"Damage",dmg:"ad",d:"Percent max-HP damage.",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Their tanks melt to percent-HP damage."]:[2,"Few HP stackers to carve up."];}},
 maw:{n:"Maw of Malmortius",cat:"Damage",dmg:"ad",d:"Magic shield for AD champs.",v:function(s,m,e){return cnt(e,"a")>=3?[4,"Lots of AP burst, the shield saves your all-in."]:[1,"Enemy barely deals magic damage."];}},
 rabadon:{n:"Rabadon's Deathcap",cat:"Magic",dmg:"ap",d:"Raw AP amplification.",v:function(s,m,e){return has(s,"h")?[4,"You scale, Deathcap turns you into a raid boss."]:[3,"Always damage, you just peak earlier."];}},
 voidstaff:{n:"Void Staff",cat:"Magic",dmg:"ap",d:"Magic pen against MR stackers.",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Their tanks buy MR, you cut straight through it."]:[1,"Nobody stacks MR, the pen is wasted."];}},
 zhonya:{n:"Zhonya's Hourglass",cat:"Magic",dmg:"ap",d:"Stasis against dives and burst.",v:function(s,m,e){return cnt(e,"v")>=2?[5,"Two divers on you, stasis breaks their all-in."]:cnt(e,"v")>=1?[3,"One diver to stall out."]:[1,"Nobody dives you. Golden bracelet."];}},
 morello:{n:"Morellonomicon",cat:"Magic",dmg:"ap",d:"AP plus heavy anti-heal.",v:function(s,m,e){var sus=cnt(e,"s")+cnt(e,"n");return sus>=3?[5,"Their comp leans on healing, you shut the tap."]:sus>=2?[4,"Enough sustain around to cut."]:[1,"Enemy barely heals. Dead stats."];}},
 edge:{n:"Edge of Night",cat:"Damage",dmg:"ad",d:"Spellshield that blocks the next ability.",v:function(s,m,e){return cnt(e,"c")>=4?[4,"CC festival on their side, the shield blocks the first hook."]:cnt(e,"c")>=3?[3,"Fair amount of CC to block."]:[1,"Little CC around, the shield catches nothing."];}},
 serpent:{n:"Serpent's Fang",cat:"Damage",dmg:"ad",d:"Cuts through shields.",v:function(s,m,e){return cnt(e,"n")>=2?[5,"Double shield bots, you make them useless."]:cnt(e,"n")>=1?[4,"Their enchanter shields melt."]:[0,"Nobody shields. Completely wasted item."];}},
 youmuu:{n:"Youmuu's Ghostblade",cat:"Damage",dmg:"ad",d:"Lethality plus a move speed active for picks and roams.",v:function(s,m,e){if(cnt(e,"f")===0)return[4,"All squishies on their side, lethality hits like a truck."];if(has(s,"r")||cnt(m,"r")>=2)return[3,"Your comp wants to hit early, the roam speed helps."];return[2,"Fine damage into their frontline, not ideal."];}},
 bloodthirster:{n:"Bloodthirster",cat:"Damage",dmg:"ad",d:"Lifesteal and an overheal shield.",v:function(s,m,e){return cnt(e,"p")>=2?[4,"Lots of poke, you just heal it back."]:[2,"Decent sustain spike."];}},
 ldr:{n:"Lord Dominik's Regards",cat:"Damage",dmg:"ad",d:"Armor pen against tanks.",v:function(s,m,e){return cnt(e,"f")>=2?[5,"Tank frontline, you shred right through it."]:cnt(e,"f")>=1?[3,"One tank to take apart."]:[1,"Squishy enemies, the pen is overkill."];}},
 mercurial:{n:"Mercurial Scimitar",cat:"Damage",dmg:"ad",d:"Cleanse active against CC.",v:function(s,m,e){return cnt(e,"c")>=4?[5,"CC chain on their side, QSS saves every fight."]:cnt(e,"c")>=3?[3,"Useful against their lockdown."]:[1,"Too little CC to cleanse."];}},
 mortal:{n:"Mortal Reminder",cat:"Damage",dmg:"ad",d:"Armor pen plus anti-heal.",v:function(s,m,e){var sus=cnt(e,"s")+cnt(e,"n");return sus>=2&&cnt(e,"f")>=1?[5,"Tanks that heal. Double hit."]:sus>=2?[4,"Their healing gets cut in half."]:[1,"Nobody heals, buy something else."];}},
 moonstone:{n:"Moonstone Renewer",cat:"Support",dmg:"none",d:"Chain heal in fights (nerfed earlier this season).",v:function(s,m,e){return[2,"Still works, but the nerf shows."];}},
 mikael:{n:"Mikael's Blessing",cat:"Support",dmg:"none",d:"Cleanse an ally out of CC.",v:function(s,m,e){return cnt(e,"c")>=3?[5,"Their CC chain breaks on your cleanse."]:cnt(e,"e")>=2?[4,"Engage comp, you save the target."]:[1,"Little CC to cleanse."];}},
 locket:{n:"Locket of the Iron Solari",cat:"Support",dmg:"none",d:"Teamwide shield (buffed in 26.11).",v:function(s,m,e){return cnt(e,"v")>=2||cnt(e,"e")>=2?[4,"Against their burst engage this is gold."]:[3,"Always tidy teamfight value."];}},
 mandate:{n:"Imperial Mandate",cat:"Support",dmg:"none",d:"Your CC marks enemies, team deals 6 percent extra (reworked in 26.11).",v:function(s,m,e){return has(s,"c")&&cnt(m,"v")+cnt(m,"d")>=3?[5,"You CC, your team dumps damage into the Vulnerable window."]:has(s,"c")?[4,"Every hook or stun is now a team buff."]:[1,"Without CC the passive does nothing."];}},
 knights:{n:"Knight's Vow",cat:"Support",dmg:"none",d:"Redirect damage from your carry (buffed in 26.11).",v:function(s,m,e){return m[3]&&has(m[3],"h")?[5,"Your hypercarry survives fights it had no right surviving."]:[3,"Decent protection for your ADC."];}},
 zekes:{n:"Zeke's Convergence",cat:"Support",dmg:"none",d:"Buffs your carry after 5s of combat (buffed in 26.11).",v:function(s,m,e){return m[3]&&has(m[3],"d")?[4,"Free DPS boost on your ADC, every fight."]:[2,"It works, but your carry barely profits."];}},
 sunfire:{n:"Sunfire Aegis",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(e,"v")+cnt(e,"f")>=3?[4,"Long brawls, the burn adds up."]:[3,"Steady area damage up front."];}},
 warmogs:{n:"Warmog's Armor",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(m,"n")>=1?[4,"With a healer behind you, you never leave the map."]:[2,"Lots of health, but you regen alone."];}},
 unending:{n:"Unending Despair",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(m,"f")===1?[4,"You soak alone, the drain keeps you standing."]:[3,"Solid drain in extended fights."];}},
 abyssal:{n:"Abyssal Mask",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(e,"a")>=2&&cnt(m,"a")>=2?[5,"Resists for you, amplification for your AP."]:cnt(e,"a")>=2?[3,"Magic resist into their AP."]:[1,"Little enemy AP to resist."];}},
 cleaver:{n:"Black Cleaver",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(m,"d")>=3&&cnt(e,"f")>=2?[5,"You shred armor for the whole AD team."]:cnt(e,"f")>=2?[4,"Armor shred into their tanks."]:[2,"Few tanks to shred."];}},
 steraks:{n:"Sterak's Gage",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"v")>=2?[4,"The shield survives their all-in."]:[2,"Modest bruiser shield."];}},
 deathsdance:{n:"Death's Dance",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"d")>=3?[4,"Bleeds their AD burst into a slow drain."]:cnt(e,"v")>=1?[3,"Eases their dive damage."]:[2,"Little physical damage to defer."];}},
 titanic:{n:"Titanic Hydra",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"h")?[4,"Your HP scaling becomes damage."]:[3,"Health and cleave for the frontline."];}},
 banshee:{n:"Banshee's Veil",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"e")>=2||cnt(e,"v")>=2?[4,"The spellshield eats their engage."]:[1,"Little burst engage to block."];}},
 blackfire:{n:"Blackfire Torch",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")>=2?[4,"The burn spreads across their tanks."]:[3,"Steady burn and penetration."];}},
 shadowflame:{n:"Shadowflame",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")===0?[4,"All squishies, your burst executes."]:[2,"Their health blunts the crit burst."];}},
 cryptbloom:{n:"Cryptbloom",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Pen through their resists plus a team heal on kills."]:[2,"Few resists to pierce."];}},
 lichbane:{n:"Lich Bane",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")===0?[4,"Squishy targets, every proc hurts."]:[3,"Reliable spellblade burst."];}},
 stormsurge:{n:"Stormsurge",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")<=1?[4,"Squishy targets, the storm finishes them."]:[2,"Their frontline soaks the proc."];}},
 hubris:{n:"Hubris",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"r")||cnt(m,"r")>=2?[4,"Snowball plan, statue stacks early."]:[2,"Needs kills you may not get."];}},
 profane:{n:"Profane Hydra",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")===0?[4,"Cleave bursts their squishy lineup."]:[3,"Cleave and an execute window."];}},
 axiom:{n:"Axiom Arc",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")===0?[4,"Squishy targets refund your ultimate fast."]:[3,"More ultimates is never wrong."];}},
 voltaic:{n:"Voltaic Cyclosword",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"p")>=2?[4,"The slow lets you reach their poke."]:[3,"Energized burst and a slow."];}},
 collector:{n:"The Collector",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")===0?[4,"Executes plus gold on their squishies."]:[3,"Lethality with an execute."];}},
 infinity:{n:"Infinity Edge",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"h")?[4,"The crit spike caps your scaling."]:[3,"The core crit power spike."];}},
 kraken:{n:"Kraken Slayer",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")>=2?[5,"True damage melts their tanks."]:cnt(e,"f")===1?[3,"True damage into their one tank."]:[2,"No tanks to carve with true damage."];}},
 ga:{n:"Guardian Angel",cat:"Damage",dmg:"none",v:function(s,m,e){return cnt(e,"v")>=2?[5,"The revive beats their dive."]:cnt(e,"v")===1?[3,"A revive against their diver."]:[2,"A safety revive in a pinch."];}},
 ardent:{n:"Ardent Censer",cat:"Support",dmg:"none",v:function(s,m,e){return cnt(m,"d")>=2?[4,"Your auto attackers spike hard."]:[2,"Few carries to empower."];}},
 redemption:{n:"Redemption",cat:"Support",dmg:"none",v:function(s,m,e){return cnt(e,"v")>=2?[4,"The big heal lands under their burst."]:[3,"Teamwide heal in every fight."];}},
 helia:{n:"Echoes of Helia",cat:"Support",dmg:"none",v:function(s,m,e){return cnt(m,"p")>=2?[4,"Poke wars, the echoes sustain you."]:[3,"Chip healing and a slow."];}},
 flowingwater:{n:"Staff of Flowing Water",cat:"Support",dmg:"none",v:function(s,m,e){return cnt(m,"a")>=3?[4,"Your AP team loves the buff."]:[2,"Few AP allies to boost."];}},
 dawncore:{n:"Dawncore",cat:"Support",dmg:"none",v:function(s,m,e){return has(s,"h")||cnt(m,"h")>=3?[4,"Scaling heal and shield power."]:[3,"Steady mana and heal power."];}},
 spiritvisage:{n:"Spirit Visage",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(m,"n")>=1||cnt(m,"s")>=2?[5,"Amplifies every heal and shield your team has."]:cnt(e,"a")>=2?[3,"Magic resist and regen into their AP."]:[2,"Some bonus regen, little to amplify."];}},
 forceofnature:{n:"Force of Nature",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(e,"a")>=3?[5,"A wall of magic resist against their AP."]:cnt(e,"a")>=2?[4,"Strong magic resist into their AP."]:[1,"Barely any enemy AP to wall off."];}},
 frozenheart:{n:"Frozen Heart",cat:"Tank",dmg:"mana",v:function(s,m,e){return cnt(e,"d")>=3?[5,"Their AD carries lose a chunk of attack speed."]:cnt(e,"d")>=2?[4,"Armor and an attack speed cut on their AD."]:[2,"Few auto-attackers to slow down."];}},
 deadmans:{n:"Dead Man's Plate",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(e,"d")>=2?[4,"Armor and a slow to stick onto their AD threats."]:has(s,"e")?[4,"The momentum sets up your engage."]:[3,"Solid armor and roam speed."];}},
 jaksho:{n:"Jak'Sho, The Protean",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(m,"f")===1?[5,"Solo frontline scaling into both damage types."]:cnt(e,"a")>=2&&cnt(e,"d")>=2?[4,"Mixed enemy damage, you scale into both."]:[3,"Steady dual resist scaling."];}},
 iceborn:{n:"Iceborn Gauntlet",cat:"Tank",dmg:"mana",v:function(s,m,e){return cnt(e,"d")>=2?[4,"Armor plus a slow field to lock their AD down."]:[3,"Armor and a slow on your spells."];}},
 witsend:{n:"Wit's End",cat:"Damage",dmg:"none",v:function(s,m,e){return cnt(e,"a")>=2?[5,"Attack speed bruiser answer to their AP."]:cnt(e,"a")>=1?[3,"Some magic resist and on-hit value."]:[2,"Little enemy AP to punish."];}},
 hollowradiance:{n:"Hollow Radiance",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(e,"a")>=2&&cnt(e,"f")>=2?[4,"Magic resist that burns their grouped frontline."]:[3,"Health, magic resist and a burn aura."];}},
 shojin:{n:"Spear of Shojin",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"h")?[4,"Your ability based carry scales harder every fight."]:[3,"Steady ability damage and haste."];}},
 serylda:{n:"Serylda's Grudge",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")>=2?[5,"Armor pen plus a slow to cut through their tanks."]:cnt(e,"f")===1?[3,"Armor pen into their one tank."]:[2,"Squishy enemies, the pen is overkill."];}},
 liandry:{n:"Liandry's Torment",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")>=2?[5,"Percent health burn melts their stacked health."]:cnt(e,"f")===1?[3,"Burn into their one big body."]:[2,"Few health stackers to burn."];}},
 botrk:{n:"Blade of The Ruined King",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")>=2?[5,"Percent health on-hit shreds their big bodies."]:cnt(e,"v")>=1?[3,"On-hit and a slow against their dive."]:[2,"Little health to chunk on-hit."];}},
 ravenous:{n:"Ravenous Hydra",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(m,"v")>=1||has(s,"v")?[4,"Cleave and lifesteal for your divers."]:[3,"Cleave and sustain on the frontline."];}},
 riftmaker:{n:"Riftmaker",cat:"Magic",dmg:"ap",v:function(s,m,e){return has(s,"v")||(has(s,"a")&&has(s,"f"))?[4,"Sustained AP bruiser damage in long fights."]:[3,"Omnivamp and true damage over time."];}},
 stridebreaker:{n:"Stridebreaker",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(m,"e")<=1?[4,"Gives your bruiser the engage tool the team lacks."]:[3,"Cleave damage with a built-in dash."];}},
 nashors:{n:"Nashor's Tooth",cat:"Magic",dmg:"ap",v:function(s,m,e){return has(s,"a")?[4,"On-hit AP spike for your ability carry."]:[2,"Little AP here to power the on-hit."];}},
 cosmicdrive:{n:"Cosmic Drive",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(m,"p")>=2?[4,"Speed to kite in your poke and spread comp."]:[3,"Haste and move speed on your mage."];}},
 chempunk:{n:"Chempunk Chainsword",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"n")>=1||cnt(e,"s")>=2?[5,"AD grievous wounds against their healing."]:[2,"Little enemy healing to cut."];}},
 essencereaver:{n:"Essence Reaver",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"h")?[4,"Crit and haste keep your carry casting."]:[3,"Crit with ability haste."];}},
 shieldbow:{n:"Immortal Shieldbow",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"v")>=2||cnt(e,"e")>=2?[5,"The shield saves your carry from their all-in."]:cnt(e,"v")===1?[3,"A lifeline against their one diver."]:[2,"Little burst to shield against."];}},
 phantomdancer:{n:"Phantom Dancer",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"v")>=2?[4,"Move speed and a ghost to slip their dive."]:[3,"Attack speed and survivability."];}},
 runaans:{n:"Runaan's Hurricane",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Multiple targets means your auto carry cleaves the frontline."]:[2,"Few clustered targets to hit."];}},
 firecannon:{n:"Rapid Firecannon",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"p")>=2?[4,"Extra range to answer their poke first."]:[3,"Range and an energized first hit."];}},
 navori:{n:"Navori Flickerblade",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"h")?[4,"Crit that refunds your carry's abilities."]:[3,"Crit and cooldowns on hit."];}},
 statikk:{n:"Statikk Shiv",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Chain lightning clears their grouped frontline and waves."]:[3,"Energized waveclear and chip."];}},
 yuntal:{n:"Yun Tal Wildarrows",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"h")?[4,"Early crit spike for your scaling carry."]:[3,"An early crit power spike."];}},
 stormrazor:{n:"Stormrazor",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"r")||cnt(m,"r")>=2?[4,"An energized burst to open fights on your tempo."]:[3,"An energized opening hit."];}},
 rodofages:{n:"Rod of Ages",cat:"Magic",dmg:"mana",v:function(s,m,e){return has(s,"h")?[5,"A scaling stat stack your late game mage dreams of."]:[3,"Slow but steady stat scaling."];}},
 ludens:{n:"Luden's Echo",cat:"Magic",dmg:"mana",v:function(s,m,e){return cnt(e,"f")<=1?[4,"Burst and waveclear into their squishy lineup."]:[3,"Burst damage and waveclear."];}},
 malignance:{n:"Malignance",cat:"Magic",dmg:"mana",v:function(s,m,e){return has(s,"h")?[4,"Ultimate focused mage scaling and burn."]:[3,"Ultimate haste and a burn field."];}},
 horizon:{n:"Horizon Focus",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(m,"p")>=2?[4,"Reveals and amps damage in your poke war."]:[3,"Bonus damage on long range hits."];}},
 rylais:{n:"Rylai's Crystal Scepter",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(m,"p")>=2||cnt(m,"v")===0?[4,"Every spell slows, locking targets for your team."]:[3,"Health and a slow on your spells."];}},
 rocketbelt:{n:"Hextech Rocketbelt",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(m,"e")<=1?[4,"A dash to give your mage the engage the team lacks."]:[3,"A dash and a burst of magic damage."];}},
 archangels:{n:"Archangel's Staff",cat:"Magic",dmg:"mana",v:function(s,m,e){return has(s,"h")?[5,"Mana stacking into a massive late game shield and AP."]:[3,"Mana and ability haste to scale."];}},
 manamune:{n:"Manamune",cat:"Damage",dmg:"mana",v:function(s,m,e){return has(s,"h")?[4,"Mana stacking AD for your scaling caster carry."]:[3,"Mana and AD for a caster."];}},
 guinsoos:{n:"Guinsoo's Rageblade",cat:"Damage",dmg:"none",v:function(s,m,e){return has(s,"a")&&has(s,"d")?[5,"On-hit hybrid scaling for an attack based fighter."]:has(s,"a")?[3,"On-hit AP for an ability carry."]:[2,"On-hit value without the hybrid stats."];}},
 mejais:{n:"Mejai's Soulstealer",cat:"Magic",dmg:"ap",v:function(s,m,e){return has(s,"r")&&cnt(m,"r")>=2?[4,"Snowball comp, the stacks turn a lead into a landslide."]:[1,"Without a snowball plan the stacks fall off."];}},
 terminus:{n:"Terminus",cat:"Damage",dmg:"none",v:function(s,m,e){return cnt(e,"a")>=2&&cnt(e,"d")>=1?[4,"On-hit that punches through mixed resists."]:[3,"On-hit with adaptive resists."];}},
 gunblade:{n:"Hextech Gunblade",cat:"Magic",dmg:"ap",v:function(s,m,e){return has(s,"v")?[4,"Hybrid damage and healing for an AP diver."]:[2,"Bursty AP without a dive to use it."];}},
 sunderedsky:{n:"Sundered Sky",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(m,"v")>=1||has(s,"v")?[4,"A guaranteed crit and a heal to win bruiser duels."]:[3,"A crit and a heal on a cooldown."];}},
 bastionbreaker:{n:"Bastionbreaker",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Built to break the bigger bodies in front of you."]:[3,"Steady bruiser damage and durability."];}},
 endlesshunger:{n:"Endless Hunger",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"e")>=2||cnt(e,"v")>=2?[4,"Omnivamp and tenacity to grind out their all-in."]:[3,"Sustain and tenacity in a brawl."];}},
 bloodmail:{n:"Overlord's Bloodmail",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"v")||has(s,"f")?[4,"Health that becomes damage for a frontline bruiser."]:[2,"Health into AD without a brawler to use it."];}},
 actualizer:{n:"Actualizer",cat:"Magic",dmg:"mana",v:function(s,m,e){return has(s,"h")?[4,"Cheap mana and scaling for your caster's mid game."]:[3,"Cheap mana and ability haste."];}},
 bandlepipes:{n:"Bandlepipes",cat:"Support",dmg:"none",v:function(s,m,e){return cnt(e,"a")>=1&&cnt(e,"d")>=1?[4,"Resists both ways plus utility for an enchanter."]:[3,"Dual resists and team utility."];}},
 bloodletter:{n:"Bloodletter's Curse",cat:"Magic",dmg:"ap",v:function(s,m,e){return cnt(e,"f")>=2?[4,"Magic pen that scales against their stacked health."]:[3,"Magic pen and burst."];}},
 protoplasm:{n:"Protoplasm Harness",cat:"Tank",dmg:"none",v:function(s,m,e){return cnt(m,"a")>=2||cnt(m,"p")>=2?[4,"A tanky battery for a backline caster under pressure."]:[3,"Durable utility for the backline."];}},
 hexoptics:{n:"Hexoptics C44",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"f")===0?[4,"Crit and tempo to delete their squishy lineup."]:[3,"Crit and attack tempo."];}},
 fiendhunter:{n:"Fiendhunter Bolts",cat:"Damage",dmg:"ad",v:function(s,m,e){return cnt(e,"v")>=2?[4,"Attack speed and crit that punish their divers."]:[3,"Attack speed and crit tempo."];}},
 hexplate:{n:"Experimental Hexplate",cat:"Damage",dmg:"ad",v:function(s,m,e){return has(s,"v")?[4,"Ultimate haste and attack speed for a fighter who dives."]:[3,"Ultimate haste and attack speed."];}},
 duskdawn:{n:"Dusk and Dawn",cat:"Damage",dmg:"none",v:function(s,m,e){return has(s,"a")&&has(s,"d")?[4,"Hybrid stats for a champion that wants both."]:has(s,"a")?[3,"Some hybrid value for an ability carry."]:[2,"Hybrid stats only half used here."];}},
 wintersapproach:{n:"Winter's Approach",cat:"Tank",dmg:"mana",v:function(s,m,e){return cnt(e,"e")>=2?[4,"Mana, health and a slow shield against their engage."]:[3,"Mana and health with a shield."];}},
 shurelyas:{n:"Shurelya's Battlesong",cat:"Support",dmg:"none",v:function(s,m,e){return cnt(m,"e")>=2||cnt(m,"v")>=2?[5,"The team speed turns your engage into a coordinated wave."]:[3,"A team speed active for picks and roams."];}}
};

/* Acceptance check (Phase 2, step 1): every ITEMDEFS name must exist in SR_ITEMS, matched by name. */
(function(){
  if(typeof SR_ITEMS==="undefined"||!SR_ITEMS||!SR_ITEMS.items)return;
  var names={}; SR_ITEMS.items.forEach(function(it){names[it.name]=true;});
  var ids=Object.keys(ITEMDEFS);
  var missing=ids.filter(function(k){return !names[ITEMDEFS[k].n];}).map(function(k){return ITEMDEFS[k].n;});
  if(missing.length) console.warn("ITEMDEFS names not found in SR_ITEMS ("+missing.length+"): "+missing.join(", "));
  else console.log("ITEMDEFS: all "+ids.length+" item names matched in SR_ITEMS.");
})();

