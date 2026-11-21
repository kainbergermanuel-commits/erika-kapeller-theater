#!/usr/bin/env python3
"""Baut die Theater-Website aus seiten/*.html.

Jede Datei in seiten/ beginnt mit einem Kopfblock:
<!--
titel: Seitentitel
beschreibung: Ein Satz für Suchmaschinen
aktiv: stuecke
-->
Danach folgt der Seiteninhalt (alles zwischen Kopf und Fuß).
Kopf, Menü, Eintrittskarte und Fuß kommen von hier, damit alle Seiten gleich bleiben.

Aufruf: python3 bauen.py
"""
import re, pathlib, datetime

HIER = pathlib.Path(__file__).parent
QUELLE = HIER / 'seiten'
ZIEL = HIER / 'site'
VERSION = datetime.datetime.now().strftime('%Y%m%d%H%M')

MENUE = [
    ('stuecke', 'stuecke.html', 'Stücke', 'I'),
    ('buch', 'buch.html', 'Buch', 'II'),
    ('workshops', 'workshops.html', 'Workshops', 'III'),
    ('buehne', 'buehne.html', 'Bühne &amp; Presse', 'IV'),
    ('ueber', 'ueber-mich.html', 'Über mich', 'V'),
]

KOPF = '''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titel}</title>
<meta name="description" content="{beschreibung}">
<meta name="theme-color" content="#0d0a09">
<meta name="robots" content="noindex, nofollow"><!-- Entwurf: vor dem Livegang entfernen -->
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css?v={version}">
<link rel="stylesheet" href="assets/galerie.css?v={version}">
<script>try{{if(localStorage.getItem('design')==='galerie'){{document.documentElement.dataset.design='galerie';document.write('<link id="galerie-schrift" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">')}}}}catch(e){{}}</script>
</head>
<body class="seite-{aktiv}">
{vorhang}<a class="sr" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle">
    <a class="marke" href="index.html" aria-label="Erika Kapeller, zur Startseite">
      <span class="marke-name">Erika <em>Kapeller</em></span>
      <span class="marke-zeile">Autorin · Regie · Bühne</span>
    </a>
    <nav class="navi" aria-label="Hauptmenü">
{navi}
      <a class="knopf knopf-rand knopf-klein" href="ueber-mich.html#kontakt">Anfragen</a>
    </nav>
    <button class="navi-knopf" type="button" aria-expanded="false" aria-controls="vorhang-menue"><span class="knopf-text">Menü</span><span class="striche" aria-hidden="true"><i></i><i></i></span></button>
  </div>
</header>
<nav class="vorhang-menue" id="vorhang-menue" aria-label="Menü">
  <a href="index.html"{start_aktiv}><small>0</small>Start</a>
{vorhang_navi}
  <a class="knopf" href="ueber-mich.html#kontakt">Anfrage stellen <span class="pfeil" aria-hidden="true">→</span></a>
</nav>
<main id="inhalt">
'''

TICKET = '''
<section class="karte-ticket">
  <div class="huelle">
    <div class="ticket erscheint">
      <div>
        <span class="etikett">{ticket_etikett}</span>
        <h2>{ticket_titel}</h2>
        <p>{ticket_text}</p>
      </div>
      <div class="ticket-abriss">
        <span>Eintritt · Reihe 1 · Platz 1</span>
        <a class="knopf" href="ueber-mich.html?anliegen={ticket_anliegen}#kontakt">{ticket_knopf} <span class="pfeil" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>
'''

FUSS = '''</main>
<footer class="fuss">
  <div class="huelle">
    <div class="fuss-kopf">
      <p class="fuss-gross" aria-hidden="true">Vorhang auf.</p>
      <p class="fuss-licht"><span class="geisterlicht" aria-hidden="true"></span><span>Das Geisterlicht bleibt an.<small>So heißt die Lampe, die nachts auf jeder leeren Bühne brennt.</small></span></p>
    </div>
    <div class="fuss-raster">
      <div>
        <a class="marke" href="index.html"><span class="marke-name">Erika <em>Kapeller</em></span><span class="marke-zeile">Autorin · Regie · Bühne</span></a>
        <p style="margin-top:22px">Komödien, Krimödien und ein Praxisbuch für alle, die vom Theaterfieber angesteckt sind. Dazu Workshops für Ensembles, Schulen und Senior:innen.</p>
      </div>
      <div>
        <h4>Werk</h4>
        <ul><li><a href="stuecke.html">Stücke</a></li><li><a href="buch.html">Buch</a></li><li><a href="workshops.html">Workshops</a></li></ul>
      </div>
      <div>
        <h4>Bühne</h4>
        <ul><li><a href="buehne.html">Fotos &amp; Videos</a></li><li><a href="buehne.html#presse">Presse</a></li><li><a href="ueber-mich.html">Über mich</a></li></ul>
      </div>
      <div>
        <h4>Kontakt</h4>
        <ul><li><a href="mailto:mail@erikakapeller.com">mail@erikakapeller.com</a></li><li><a href="ueber-mich.html#kontakt">Anfrage stellen</a></li></ul>
      </div>
    </div>
    <div class="fuss-unten">
      <span>© {jahr} Erika Kapeller · Toi, toi, toi</span>
      <span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span>
    </div>
  </div>
</footer>
<button class="design-wahl" type="button" aria-label="Design wechseln"><i aria-hidden="true"></i>Design: <b>Bühne</b></button>
<script src="assets/script.js?v={version}"></script>
</body>
</html>
'''

TICKET_STANDARD = dict(
    ticket_etikett='Ihre Anfrage',
    ticket_titel='Der Vorhang hebt sich <em>für Ihr Projekt</em>.',
    ticket_text='Ein Stück für Ihre Gruppe, ein maßgeschneidertes Auftragswerk, Regie-Begleitung oder ein Workshop: Schreiben Sie mir, wir finden gemeinsam den passenden Auftritt.',
    ticket_anliegen='stueck',
    ticket_knopf='Anfrage stellen',
)


def lesen(datei):
    roh = datei.read_text(encoding='utf-8')
    m = re.match(r'\s*<!--(.*?)-->\s*', roh, re.S)
    meta = {}
    for zeile in m.group(1).strip().splitlines():
        k, _, v = zeile.partition(':')
        meta[k.strip()] = v.strip()
    return meta, roh[m.end():]


def bauen():
    for datei in sorted(QUELLE.glob('*.html')):
        meta, inhalt = lesen(datei)
        aktiv = meta.get('aktiv', '')
        navi = '\n'.join(
            f'      <a href="{href}"' + (' aria-current="page"' if key == aktiv else '') + f'>{name}</a>'
            for key, href, name, _ in MENUE)
        vorhang_navi = '\n'.join(
            f'  <a href="{href}"' + (' aria-current="page"' if key == aktiv else '') + f'><small>{nr}</small>{name}</a>'
            for key, href, name, nr in MENUE)
        ticket = ''
        if meta.get('ticket', 'ja') != 'nein':
            t = dict(TICKET_STANDARD)
            for k in t:
                if k in meta:
                    t[k] = meta[k]
            ticket = TICKET.format(**t)
        html = KOPF.format(
            titel=meta['titel'], beschreibung=meta['beschreibung'], aktiv=aktiv or 'start', version=VERSION,
            navi=navi, vorhang_navi=vorhang_navi,
            start_aktiv=' aria-current="page"' if aktiv == 'start' else '',
            vorhang='<div class="vorhang" aria-hidden="true"><i></i><i></i></div>\n' if aktiv == 'start' else '',
        ) + inhalt.rstrip() + '\n' + ticket + FUSS.format(jahr=datetime.date.today().year, version=VERSION)
        (ZIEL / datei.name).write_text(html, encoding='utf-8')
        print('gebaut:', datei.name)


if __name__ == '__main__':
    bauen()
