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

## Werken met Claude Code

Open deze map in VS Code (File, Open Folder), klik rechtsboven op het oranje Claude-icoon of druk Ctrl+Escape, en typ wat je wilt. Goede eerste prompts:

1. "Lees README.md en js/data.js en geef me een rondleiding door dit project."
2. "Maak de gouden hover-gloed op knoppen in css/style.css iets sterker."
3. "Zet in js/data.js de tier van Yuumi op C en pas de note aan."

Claude Code laat elke wijziging eerst als diff zien; jij keurt goed of af. Test daarna direct in Live Server.

## Data updaten per patch

1. Lees de officiële patch notes en let op de kopjes: alleen wijzigingen onder champion-secties en SR-systemen tellen, alles onder Arena of ARAM negeren.
2. Pas tiers en NOTES aan in `js/data.js` (of laat Claude Code dat doen met de notes ernaast).
3. Draai `sr-item-importer.html` voor de actuele itemlijst als itemstats relevant zijn.
4. Hou `DATA_VERSION` bovenin data.js gelijk aan de patch.

## Disclaimer

Rift Draft Arena was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
