# CLAUDE.md

## Projectomschrijving

Rift Draft Arena is een standalone League of Legends draft- en strategiegame (patch 26.12, Summoner's Rift data). Het is een statische site die volledig in de browser draait: geen server, geen build-stap. Je bant, draft en itemizet tegen een AI-coach die terugdraft, en speelt daarna een gesimuleerde match met een analistenrapport en een ranked ladder van Iron tot Challenger.

## Mapstructuur en laadvolgorde

- `index.html`: het skelet. Alle vijf de schermen (menu, codex, draft, items, match, analyse) staan tegelijk in de HTML als secties; de engine toont er steeds een.
- `css/style.css`: het volledige League/hextech-thema. Puur cosmetisch.
- `js/items-data.js`: definieert de globale `SR_ITEMS` (echte SR-itemdata: goud, statsText). Gegenereerd uit `sr-items.json` en geladen VOOR data.js.
- `js/data.js`: ALLE patch-data plus de helpers. De championlijst `C` (naam, rol, tier, tags), de `NOTES`, en de itempool `ITEMDEFS` (elk item met verdict-functie plus `cat`/`dmg` shop-metadata). `CLASSOPTS`/`classOf` bestaan niet meer: de itemfase is een open shop.
- `js/game.js`: de engine. Scoring (incl. de open shop en de `applyFit` fit-laag), AI-tegenstander, ladder, draftvolgorde, item-fase, geanimeerde Rift-kaart, match, analyse en de "What's new"/Roadmap-overlays.
- `sr-items.json`: geverifieerde Summoner's Rift itemdata (Riot Data Dragon). Bron voor items-data.js; regenereer items-data.js hieruit.
- `audio/`: de twee muzieknummers. Geluidseffecten worden synthetisch in game.js gegenereerd (geen bestanden).
- `tools/sim.js`: headless balans-simulatie (`node tools/sim.js`); laadt de game-scripts in een stubbed-DOM en speelt potjes door.
- `roadmap.html` en `sr-item-importer.html`: losstaande hulptools, niet door index.html ingeladen. `roadmap.html` is read-only voor bezoekers; bewerken kan via `roadmap.html?edit`.

Laadvolgorde is belangrijk: in index.html is de volgorde `js/items-data.js` → `js/data.js` → `js/game.js`. data.js gebruikt `SR_ITEMS` uit items-data.js, en game.js gebruikt `C`, `ITEMDEFS`, `cnt()` enz. uit data.js, dus die moeten in die volgorde bestaan.

## Patch-updates

Een patch-update raakt ALLEEN `js/data.js`. Pas daar de tiers, tags, `NOTES` en eventueel de itempool aan, en houd `DATA_VERSION` bovenin gelijk aan de patch. De engine in game.js hoeft daarvoor nooit aangepast te worden.

Itemgoud en stats komen uit `SR_ITEMS` (uit sr-items.json), gematcht op naam: een nieuw item in `ITEMDEFS` moet een `n` hebben die exact overeenkomt met een naam in sr-items.json, en velden `cat` ("Tank"/"Damage"/"Magic"/"Support") en `dmg` ("ad"/"ap"/"none"). Een console-check in data.js rapporteert ongematchte namen.

## Setup en deploy

- GitHub repo: `manoridder/rift-draft-arena`.
- Netlify is gekoppeld aan die repo en deployt automatisch vanaf de `main` branch naar https://draft-arena.netlify.app. Een push naar main is dus een deploy.
- Lokaal testen: open de map in VS Code en gebruik de "Live Server" extensie (rechtsklik op `index.html`, "Open with Live Server"). De browser ververst dan automatisch bij elke codewijziging.

## Versies en roadmap

- Versies staan in `VERSION` + `CHANGELOG` bovenin de "What's new"-sectie in `js/game.js`. Schema is klein: `0.0.x` pre-release met een naam per versie, `1.0` gereserveerd voor het afgemaakte spel. Nieuwe release: bump `VERSION` en zet een blok bovenin `CHANGELOG`.
- De roadmap is `roadmap-data.json` (de opgeslagen bordstaat). Onderhoud die door `roadmap.html?edit` te openen, te bewerken en "Save to file" te doen, en dat bestand te committen. Zowel de in-game Roadmap-popup als roadmap.html lezen het.

## Stijlregels

- Gebruik nooit em dashes, niet in code en niet in teksten. Gebruik in plaats daarvan een gewone komma, dubbele punt, haakjes of een nieuwe zin.
- Alle UI-teksten zijn in het Engels. Knoppen, labels, meldingen en analyseteksten die de speler ziet, zijn Engelstalig.
