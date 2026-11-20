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
