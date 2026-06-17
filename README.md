# Rift Draft Arena

Een standalone League of Legends draft- en strategiegame (patch 26.12, Summoner's Rift data). Geen installatie, geen server: openen en spelen.

## Snel starten

Optie 1: dubbelklik op `index.html`, de game opent in je browser.

Optie 2 (aanrader in VS Code): installeer de extensie "Live Server", rechtsklik op `index.html` en kies "Open with Live Server". De browser ververst dan automatisch bij elke codewijziging.

## Mapstructuur

- `index.html`: de opmaak van alle schermen (menu, draft, items, match, analyse).
- `css/style.css`: het volledige League/hextech-thema.
- `js/data.js`: ALLE patch-data. Tiers, de 171 champions met rollen en tags, de codex-notes per champion, en de itempool met verdicts. Dit is het enige bestand dat per patch wordt bijgewerkt.
- `js/game.js`: de engine. Draft-volgorde, AI-tegenstander, scoring, de gesimuleerde match, analyse en geluid. Hier hoef je voor een patch-update nooit in.
- `audio/`: de twee muzieknummers (hoofdtrack en de easter egg).
- `roadmap.html`: het interactieve projectbord. Sleep kaarten, bewerk ze, sla op via "Save to file".
- `sr-item-importer.html`: haalt live de itemdatabase van Riot op, filtert op Classic Summoner's Rift en exporteert sr-items.json (de basis voor de geplande item-overhaul).

