# CLAUDE.md

## Projectomschrijving

Rift Draft Arena is een standalone League of Legends draft- en strategiegame (patch 26.12, Summoner's Rift data). Het is een statische site die volledig in de browser draait: geen server, geen build-stap. Je bant, draft en itemizet tegen een AI-coach die terugdraft, en speelt daarna een gesimuleerde match met een analistenrapport en een ranked ladder van Iron tot Challenger.

## Mapstructuur en laadvolgorde

- `index.html`: het skelet. Alle vijf de schermen (menu, codex, draft, items, match, analyse) staan tegelijk in de HTML als secties; de engine toont er steeds een.
- `css/style.css`: het volledige League/hextech-thema. Puur cosmetisch.
- `js/data.js`: ALLE patch-data plus de helpers die ermee werken. De championlijst `C` (naam, rol, tier, tags), de `NOTES`, en de itempool `ITEMDEFS` / `CLASSOPTS`.
- `js/game.js`: de engine. Scoring, AI-tegenstander, ladder, draftvolgorde, item-fase, geanimeerde Rift-kaart, match en analyse.
- `audio/`: de twee muzieknummers (hoofdtrack en de easter egg). De geluidseffecten worden synthetisch gegenereerd in game.js en zijn dus geen bestanden.
- `roadmap.html` en `sr-item-importer.html`: twee losstaande hulptools. Ze worden niet door index.html ingeladen.

Laadvolgorde is belangrijk: in index.html wordt `js/data.js` ingeladen VOOR `js/game.js`. De engine gebruikt variabelen en helpers uit data.js (zoals `C`, `ITEMDEFS`, `cnt()`), dus die moeten eerst bestaan.

## Patch-updates

Een patch-update raakt ALLEEN `js/data.js`. Pas daar de tiers, tags, `NOTES` en eventueel de itempool aan, en houd `DATA_VERSION` bovenin gelijk aan de patch. De engine in game.js hoeft daarvoor nooit aangepast te worden.

## Setup en deploy

- GitHub repo: `manoridder/rift-draft-arena`.
- Netlify is gekoppeld aan die repo en deployt automatisch vanaf de `main` branch naar https://draft-arena.netlify.app. Een push naar main is dus een deploy.
- Lokaal testen: open de map in VS Code en gebruik de "Live Server" extensie (rechtsklik op `index.html`, "Open with Live Server"). De browser ververst dan automatisch bij elke codewijziging.

## Stijlregels

- Gebruik nooit em dashes, niet in code en niet in teksten. Gebruik in plaats daarvan een gewone komma, dubbele punt, haakjes of een nieuwe zin.
- Alle UI-teksten zijn in het Engels. Knoppen, labels, meldingen en analyseteksten die de speler ziet, zijn Engelstalig.
