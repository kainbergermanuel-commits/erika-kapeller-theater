# Theater-Website Erika Kapeller – Bestandsaufnahme

Stand: 20.11.2026 · Quelle: https://ekk.jimdoweb.com (Jimdo, alter Baukasten)

## Wer und was
Erika Kapeller als **Autorin, Regisseurin und Akteurin**. Kernangebot:
- Theaterstücke (Komödien, Krimödien, Dramödie, Märchen), erschienen bei den Bühnenverlagen **Plausus** und **Adspecta**; Auftragsstücke „maßgeschneidert“; Hilfe bei Stückauswahl, Dramaturgie, Regie
- Fachbuch **„Gel(i)ebtes Theater“** (Pro Business Verlag, ISBN 978-3-86805-016-5, 19 €)
- **Workshops**, Seminare, Beratung für Theatergruppen, Schüler:innen, Senioren (5 PDFs)
- Moderation von **Krimi-Mitspiel-Partys**
- Vertritt den Adspecta-Verlag in Österreich

## Seiten (15)
| Seite | Inhalt | Umfang |
|---|---|---|
| home | Begrüßung, eigenes Zitat („emotionaler Jungbrunnen“), Hinweis Kontaktformular | kurz |
| werke | Überblick Verlage + Buch | kurz |
| werke/theaterstücke | Stückekatalog-PDF (1,6 MB) + Liste von ~35 Stücken mit Uraufführung (Jahr, Ort) | Herzstück |
| werke/buch | Buchbeschreibung, Inhalts-PDF, 3 Rezensionen (Fachzeitschriften, Amazon) | mittel |
| vita | Lebenslauf in Jahrzehnten (Kärnten, Salzburg, „Mischkulanz“, „Melange“, Filmserie „Schicksale“) | mittel |
| presse | ~45 Zeitungsartikel als JPG-Downloads, nach Stück gruppiert | groß |
| links | Plausus, Adspecta, Theaterbuch | kurz |
| workshops | 5 PDF-Angebote, Verweis auf theaterworkshops.jimdo.com | kurz |
| videogalerie | 3–4 YouTube-Videos (Blind Date mit einer Leiche, Liebe Zuckerbrot & Peitsche, Pension Schöller, Filous in Dessous) | mittel |
| fotogalerie | ~150 Fotos: Szenenfotos + Gruppenfotos aufführender Theatergruppen | groß |
| aktuell | Verlagsvertretung, Übersetzungen, Plattdeutsch-Versionen, Neuerscheinungen Adspecta | mittel |
| kontakt | Jimdo-Formular mit Captcha | – |
| gästebuch | viele Einträge (ca. 4.900 Zeichen) | mittel |
| agb / impressum | Jimdo-Standard; Impressum praktisch leer | – |

## Auffälligkeiten
- **Optik**: altes Jimdo-Layout, Seitenleiste links, Weinrot, kleine Schrift, Zitate in Großbuchstaben auf jeder Seite.
- **Seitenkopf zeigt „impressum“** statt eines Namens oder Logos (wohl ein Fehler im Baukasten).
- **Impressum leer**: rechtlich problematisch (ECG/MedienG verlangen Name, Anschrift, Kontakt).
- **Presse und Rezensionen** nur als Downloads, man sieht nichts ohne Klick.
- **Workshops** und **Buch** haben eigene Jimdo-Seiten (theaterworkshops.jimdo.com, theaterbuch.jimdo.com), also drei Websites für eine Person.
- **YouTube** wird hinter dem Cookie-Banner geblockt.
- **Navigation**: 13 Menüpunkte, Kleinschreibung.
- Inhalt ist **reich und belegt** (35 Stücke mit Uraufführungen in AT/DE/CH/FR, viel Presse): starke Basis.

## Offen / zu klären
- Neue Domain oder bleibt es bei Jimdo? Gemeinsamer Auftritt mit erikakapeller.com (Coaching) oder getrennt?
- Sollen die beiden Neben-Jimdo-Seiten (Workshops, Buch) eingegliedert werden?
- Fotos und Presse-JPGs in Originalqualität besorgen (Jimdo-Export oder von ihr direkt).
- Ist die Stückeliste aktuell (zuletzt UA 2025)?
- Gästebuch: übernehmen (als Stimmen) oder weglassen?

## Entscheidung 20.11.
**Eigene Website**, getrennt von erikakapeller.com (Coaching). Domain noch offen.

## Neben-Seiten (geprüft 20.11.)
- **theaterbuch.jimdofree.com** (alte Adresse .jimdo.com geht nicht mehr): Home, Autorin, Inhalt, Rezensionen, Bezugsquellen, Kontakt. Autorinnenname dort „Erika Kainberger-Kapeller“.
- **theaterworkshops.jimdofree.com** (ebenso): Home, Referentin, Programm, **Preise**, Galerie, Aktuell, Linktipps, Gästebuch, Kontakt. Motto „Staunen – Spielen – Lachen“, Zielgruppe auch Menschen, die ihre berufliche Präsenz stärken wollen.
- ⚠️ Die Links auf der Hauptseite zeigen auf die alten `.jimdo.com`-Adressen und sind damit **tot**.

## Vorschlag Aufbau (Entwurf, nicht besprochen)
Aus 13 Menüpunkten + 2 Neben-Seiten werden 6:
1. **Start**: Bühne frei, Zitat, drei Wege (Stücke · Buch · Workshops), neueste Uraufführung
2. **Stücke**: filterbarer Katalog nach Genre (Komödie, Krimödie, Dramödie, Märchen), je Stück UA-Jahr/Ort, Verlag, Link; Auftragsstücke & Regie-Hilfe
3. **Buch**: „Gel(i)ebtes Theater“ mit Inhalt, Rezensionen als Zitate, Bezugsquellen
4. **Workshops**: Programm, Zielgruppen, Preise (aus der Neben-Seite), Krimi-Mitspiel-Partys
5. **Bühne & Presse**: Fotos, Videos (mit Klick-zum-Laden statt Cookie-Sperre), Presse als Zitate mit Zeitung und Jahr, Gästebuch-Stimmen
6. **Über mich & Kontakt**: Vita als Zeitleiste, Formular, vollständiges Impressum

## Erster Entwurf (20.11.)
Gebaut in `site/` (statisches HTML, kein Framework). **Nicht die HTML-Dateien in `site/` bearbeiten**, sondern `seiten/*.html` und dann `python3 bauen.py`: Kopf, Menü, Abschluss-Ticket und Fuß kommen aus `bauen.py`, damit alle Seiten gleich bleiben. CSS/JS liegen direkt in `site/assets/`.

**Gestaltung „Bühne“** (bewusst anders als die Coaching-Seite): dunkle Bühne, Messing-Licht, Samtrot; Cormorant Garamond + Jost; Scheinwerferkegel, Filmkorn, Akt-Nummerierung (I., II. …) als roter Faden, Programmheft-Liste, Eintrittskarte als Abschluss jeder Seite, Vorhang beim ersten Besuch und als Handy-Menü, Scheinwerfer folgt der Maus auf Karten.

Seiten: Start · Stücke (31 Stücke, Filter, Plakatwand) · Buch · Workshops · Bühne & Presse (5 Videos, Szenenfotos, Ensembles, 49 Presseartikel) · Über mich & Kontakt · Impressum · Datenschutz.

**Zur Prüfung (im Entwurf markiert oder offen):**
- Workshop-Preise (80 € / 140 €) stammen von der alten Seite
- Zuordnung der Videos „Pension Schöller“ / „Filous in Dessous“
- Impressum: Anschrift fehlt
- Kontakt-Mail: mail@erikakapeller.com (von der alten Aktuell-Seite); alte PDFs nennen ekk1@gmx.at
- Bilder sind alt und klein (viele unter 500 px); neue Fotos würden viel bringen
- Domain offen; alte Domains erika-kk.com / alles-theater.com tauchen in PDFs auf

Quelle der alten Seite (Bilder, PDFs, HTML) liegt in `_quelle/` und ist nicht im Repo.
