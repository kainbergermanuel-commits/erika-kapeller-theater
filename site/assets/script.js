/* Erika Kapeller · Theater · gemeinsames Skript */
(function () {
  var doc = document.documentElement, body = document.body;

  // Eröffnungs-Vorhang: nur auf der Startseite und nur einmal pro Besuch
  var vorhang = document.querySelector('.vorhang');
  if (vorhang) {
    var schonOffen = false;
    try { schonOffen = sessionStorage.getItem('vorhang') === 'offen'; } catch (e) {}
    if (schonOffen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      vorhang.classList.add('weg'); body.classList.add('ohne-vorhang');
    } else {
      requestAnimationFrame(function () { requestAnimationFrame(function () { vorhang.classList.add('auf'); }); });
      setTimeout(function () { vorhang.classList.add('weg'); }, 2100);
      try { sessionStorage.setItem('vorhang', 'offen'); } catch (e) {}
    }
  } else {
    body.classList.add('ohne-vorhang');
  }

  // Kopfzeile beim Scrollen verdichten
  var kopf = document.querySelector('.kopf');
  function rollen() { if (kopf) kopf.classList.toggle('ist-gerollt', scrollY > 30); }
  addEventListener('scroll', rollen, { passive: true }); rollen();

  // Menü als Vorhang
  var knopf = document.querySelector('.navi-knopf');
  if (knopf) {
    knopf.addEventListener('click', function () {
      var offen = body.classList.toggle('navi-offen');
      knopf.setAttribute('aria-expanded', offen ? 'true' : 'false');
      knopf.querySelector('.knopf-text').textContent = offen ? 'Schließen' : 'Menü';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('navi-offen')) knopf.click();
    });
  }

  // Scheinwerfer folgt der Maus auf Karten und Spielplan-Zeilen
  document.querySelectorAll('.karte, .stueck').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Auftritte beim Scrollen
  var auftritte = document.querySelectorAll('.erscheint');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('sichtbar'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    auftritte.forEach(function (el) { io.observe(el); });
  } else { auftritte.forEach(function (el) { el.classList.add('sichtbar'); }); }

  // Spielplan-Filter
  var filter = document.querySelector('.filter');
  if (filter) {
    var zeilen = document.querySelectorAll('.stueck');
    filter.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var g = b.getAttribute('data-gattung');
      filter.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      zeilen.forEach(function (z) {
        var passt = g === 'alle' || z.getAttribute('data-gattung') === g || (g === 'frei' && z.classList.contains('ist-frei'));
        z.hidden = !passt;
      });
    });
  }

  // Lichtkasten für Plakate, Fotos und Zeitungsartikel
  var gruppen = {};
  document.querySelectorAll('[data-licht]').forEach(function (a) {
    var g = a.getAttribute('data-licht');
    (gruppen[g] = gruppen[g] || []).push(a);
  });
  if (Object.keys(gruppen).length) {
    var lk = document.createElement('div');
    lk.className = 'lichtkasten'; lk.setAttribute('role', 'dialog'); lk.setAttribute('aria-modal', 'true'); lk.setAttribute('aria-label', 'Bildansicht');
    lk.innerHTML = '<figure><img alt=""><p></p></figure><button class="lk-zu" aria-label="Schließen">×</button><button class="lk-zurueck" aria-label="Vorheriges Bild">‹</button><button class="lk-weiter" aria-label="Nächstes Bild">›</button>';
    body.appendChild(lk);
    var bild = lk.querySelector('img'), text = lk.querySelector('p'), liste = [], pos = 0, vorher = null;
    function zeigen(i) {
      pos = (i + liste.length) % liste.length;
      var a = liste[pos];
      bild.src = a.getAttribute('href');
      bild.alt = a.querySelector('img') ? a.querySelector('img').alt : '';
      text.textContent = a.getAttribute('data-titel') || bild.alt;
      var mehr = liste.length > 1;
      lk.querySelector('.lk-zurueck').hidden = !mehr; lk.querySelector('.lk-weiter').hidden = !mehr;
    }
    function zu() { lk.classList.remove('offen'); body.style.overflow = ''; if (vorher) vorher.focus(); }
    Object.keys(gruppen).forEach(function (g) {
      gruppen[g].forEach(function (a, i) {
        a.addEventListener('click', function (e) {
          e.preventDefault(); vorher = a; liste = gruppen[g]; zeigen(i);
          lk.classList.add('offen'); body.style.overflow = 'hidden'; lk.querySelector('.lk-zu').focus();
        });
      });
    });
    lk.querySelector('.lk-zu').addEventListener('click', zu);
    lk.querySelector('.lk-zurueck').addEventListener('click', function () { zeigen(pos - 1); });
    lk.querySelector('.lk-weiter').addEventListener('click', function () { zeigen(pos + 1); });
    lk.addEventListener('click', function (e) { if (e.target === lk) zu(); });
    document.addEventListener('keydown', function (e) {
      if (!lk.classList.contains('offen')) return;
      if (e.key === 'Escape') zu();
      if (e.key === 'ArrowRight') zeigen(pos + 1);
      if (e.key === 'ArrowLeft') zeigen(pos - 1);
    });
  }

  // Videos erst auf Klick laden (kein YouTube-Kontakt vorher)
  document.querySelectorAll('.video-flaeche button[data-video]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-video') + '?autoplay=1&rel=0';
      f.title = b.getAttribute('aria-label') || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      b.parentNode.replaceChild(f, b);
    });
  });

  // Kontaktformular öffnet das Mailprogramm
  var form = document.querySelector('.formular');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var betreff = 'Anfrage: ' + (d.get('anliegen') || 'Theater');
      var text = (d.get('nachricht') || '') + '\n\n' + (d.get('name') || '') + (d.get('verein') ? '\n' + d.get('verein') : '') + '\n' + (d.get('email') || '');
      location.href = 'mailto:mail@erikakapeller.com?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(text);
    });
  }

  // Anliegen aus der Adresse vorwählen (?anliegen=workshop)
  var sel = document.querySelector('select[name="anliegen"]');
  var m = /[?&]anliegen=([^&]+)/.exec(location.search);
  if (sel && m) { var w = decodeURIComponent(m[1]); [].forEach.call(sel.options, function (o) { if (o.value === w) sel.value = w; }); }
})();

/* Design-Umschalter: Bühne (dunkel) → Galerie (hell) → Goldene Stunde */
(function () {
  var knopf = document.querySelector('.design-wahl');
  if (!knopf) return;
  var root = document.documentElement;
  var folge = ['buehne', 'galerie', 'gold'];
  var namen = { buehne: 'Bühne', galerie: 'Galerie', gold: 'Goldene Stunde' };
  function aktuell() { return root.dataset.design || 'buehne'; }
  function schrift() {
    if (document.getElementById('galerie-schrift')) return;
    var l = document.createElement('link');
    l.id = 'galerie-schrift'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(l);
  }
  function zeigen() { knopf.querySelector('b').textContent = namen[aktuell()]; }
  zeigen();
  knopf.addEventListener('click', function () {
    var neu = folge[(folge.indexOf(aktuell()) + 1) % folge.length];
    if (neu === 'buehne') { delete root.dataset.design; } else { schrift(); root.dataset.design = neu; }
    try { localStorage.setItem('design', neu); } catch (e) {}
    zeigen();
  });
})();

/* Roter Faden: Linie neben den Akt-Nummern, füllt sich beim Scrollen */
(function () {
  var faden = document.querySelector('.faden');
  if (!faden) return;
  var main = document.querySelector('main');
  function lage() {
    var nr = document.querySelector('.akt-nr');
    var erster = main.querySelector(':scope > section');
    if (!nr || !erster) { faden.style.display = 'none'; return; }
    var mainOben = main.getBoundingClientRect().top + window.scrollY;
    var letzter = Array.prototype.slice.call(main.querySelectorAll(':scope > section.akt')).pop();
    var oben = erster.offsetHeight;
    var unten = letzter ? (letzter.getBoundingClientRect().bottom + window.scrollY - mainOben) : main.offsetHeight;
    faden.style.left = (nr.getBoundingClientRect().left + window.scrollX - main.getBoundingClientRect().left - 35) + 'px';
    faden.style.top = oben + 'px';
    faden.style.height = Math.max(0, unten - oben) + 'px';
    fortschritt();
  }
  function fortschritt() {
    var r = faden.getBoundingClientRect();
    var p = r.height ? (window.innerHeight * 0.62 - r.top) / r.height : 0;
    faden.style.setProperty('--fortschritt', Math.max(0, Math.min(1, p)).toFixed(4));
  }
  var wartet = false;
  window.addEventListener('scroll', function () {
    if (wartet) return; wartet = true;
    requestAnimationFrame(function () { fortschritt(); wartet = false; });
  }, { passive: true });
  window.addEventListener('resize', lage);
  window.addEventListener('load', lage);
  lage();
})();

/* Hervorhebungen zeichnen sich, sobald sie ins Bild kommen */
(function () {
  var marken = document.querySelectorAll('.vorspann strong, .text strong');
  if (!('IntersectionObserver' in window)) { marken.forEach(function (m) { m.classList.add('gezeichnet'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('gezeichnet'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  marken.forEach(function (m) { io.observe(m); });
})();
