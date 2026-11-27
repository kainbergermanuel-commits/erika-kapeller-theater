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
      // Jahrgangs-Marke nur zeigen, wenn darunter noch ein Stück sichtbar ist
      document.querySelectorAll('.jahrgang').forEach(function (j) {
        var n = j.nextElementSibling, da = false;
        while (n && !n.classList.contains('jahrgang')) { if (!n.hidden) da = true; n = n.nextElementSibling; }
        j.hidden = !da;
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

  // Kontaktformular: sendet direkt über formular.erikakapeller.com
  var form = document.querySelector('.formular');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    var knopf = form.querySelector('button[type="submit"]');
    var knopfHtml = knopf ? knopf.innerHTML : '';
    var tFeld = form.querySelector('input[name="t"]');
    if (tFeld) tFeld.value = Date.now();
    var texte = {
      ok: 'Danke, Ihre Nachricht ist angekommen. Ich melde mich bald.',
      angaben: 'Bitte Name, eine gültige E-Mail-Adresse und Ihre Nachricht angeben.',
      zuviel: 'Es wurden gerade sehr viele Nachrichten gesendet. Bitte später noch einmal versuchen oder direkt an mail@erikakapeller.com schreiben.',
      standard: 'Das Senden hat leider nicht geklappt. Bitte direkt an mail@erikakapeller.com schreiben.'
    };
    var zeige = function (art, text) { if (status) { status.textContent = text; status.className = 'formular-hinweis ' + art; } };
    var q = /[?&](gesendet|fehler)=([^&#]*)/.exec(location.search);
    if (q) zeige(q[1] === 'gesendet' ? 'ok' : 'fehler', q[1] === 'gesendet' ? texte.ok : (texte[decodeURIComponent(q[2])] || texte.standard));
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { zeige('fehler', texte.angaben); return; }
      var sel = form.querySelector('select[name="anliegen"]');
      form.querySelector('input[name="thema"]').value = sel ? sel.options[sel.selectedIndex].text : '';
      if (knopf) { knopf.disabled = true; knopf.textContent = 'Wird gesendet …'; }
      fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (d) {
          if (d.ok) { form.reset(); if (tFeld) tFeld.value = Date.now(); zeige('ok', texte.ok); }
          else zeige('fehler', texte[d.grund] || texte.standard);
        })
        .catch(function () { zeige('fehler', texte.standard); })
        .then(function () { if (knopf) { knopf.disabled = false; knopf.innerHTML = knopfHtml; } });
    });
  }

  // Anliegen aus der Adresse vorwählen (?anliegen=workshop)
  var sel = document.querySelector('select[name="anliegen"]');
  var m = /[?&]anliegen=([^&]+)/.exec(location.search);
  if (sel && m) { var w = decodeURIComponent(m[1]); [].forEach.call(sel.options, function (o) { if (o.value === w) sel.value = w; }); }
})();

/* Design-Umschalter: Bühne (dunkel) ↔ Goldene Stunde */
(function () {
  var knopf = document.querySelector('.design-wahl');
  if (!knopf) return;
  var root = document.documentElement;
  var folge = ['buehne', 'gold'];
  var namen = { buehne: 'Bühne', gold: 'Goldene Stunde' };
  function aktuell() { return root.dataset.design === 'gold' ? 'gold' : 'buehne'; }
  function schrift() {
    if (document.getElementById('galerie-schrift')) return;
    var l = document.createElement('link');
    l.id = 'galerie-schrift'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap';
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
  var knoten = Array.prototype.slice.call(document.querySelectorAll('.akt-nr'));
  knoten.forEach(function (k) { var w = document.createElement('span'); w.className = 'welle'; w.setAttribute('aria-hidden', 'true'); k.appendChild(w); });
  function fortschritt() {
    var r = faden.getBoundingClientRect();
    var p = r.height ? (window.innerHeight * 0.62 - r.top) / r.height : 0;
    p = Math.max(0, Math.min(1, p));
    var spitze = r.top + p * r.height;
    // erst alles messen, dann schreiben (sonst rechnet der Browser bei jedem Scrollbild das Layout neu)
    var lagen = knoten.map(function (k) { return k.getBoundingClientRect().top + 20; });
    faden.style.setProperty('--fortschritt', p.toFixed(4));
    knoten.forEach(function (k, i) { k.classList.toggle('erreicht', spitze >= lagen[i] && p > 0); });
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

/* Tooltips nie über den Bildschirmrand hinaus */
(function () {
  function ausrichten(e) {
    var t = e.currentTarget, r = t.getBoundingClientRect(), halb = Math.min(140, window.innerWidth * .36) + 16;
    t.classList.toggle('links', r.left + r.width / 2 - halb < 0);
    t.classList.toggle('rechts', r.left + r.width / 2 + halb > window.innerWidth);
  }
  document.querySelectorAll('.tipp').forEach(function (t) {
    t.addEventListener('mouseenter', ausrichten);
    t.addEventListener('focus', ausrichten);
  });
})();

/* „So sieht Spielfreude aus“: die Galerie entfaltet sich beim Scrollen in 3D
   (nur am Computer und ohne Wunsch nach reduzierter Bewegung; sonst bleibt die normale Galerie) */
(function () {
  var galerie = document.querySelector('.galerie.entfaltbar');
  if (!galerie) return;
  if (window.innerWidth < 760) return;
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var links = Array.prototype.slice.call(galerie.querySelectorAll('a'));
  if (links.length < 8) return;

  var entfalt = document.createElement('div'); entfalt.className = 'entfalt';
  entfalt.innerHTML = '<div class="entfalt-buehne"><div class="entfalt-rahmen"><div class="entfalt-perspektive"><div class="entfalt-matrix"></div></div>' +
    '<p class="entfalt-titel">Weiterscrollen, der Vorhang geht auf</p></div></div>';
  var matrix = entfalt.querySelector('.entfalt-matrix');
  var spalten = [];
  for (var s = 0; s < 4; s++) { var sp = document.createElement('div'); sp.className = 'entfalt-spalte'; matrix.appendChild(sp); spalten.push(sp); }
  // Originale (mit Lichtkasten) verteilen, danach Kopien zum Auffüllen; Kopien leiten den Klick ans Original weiter
  links.forEach(function (a, i) { a.querySelector('img').loading = 'eager'; spalten[i % 4].appendChild(a); });
  links.forEach(function (a, i) {
    var k = a.cloneNode(true); k.removeAttribute('data-licht'); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1;
    k.addEventListener('click', function (e) { e.preventDefault(); a.click(); });
    spalten[(i + 2) % 4].appendChild(k);
  });
  galerie.replaceWith(entfalt);

  var rahmen = entfalt.querySelector('.entfalt-rahmen'), titel = entfalt.querySelector('.entfalt-titel');
  var ziel = 0, ist = 0, laeuft = false;
  function mix(a, b, t) { return a + (b - a) * t; }
  function abschnitt(p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); }
  function zeichnen() {
    ist += (ziel - ist) * 0.12;
    var b = abschnitt(ist, 0, 0.15), m = abschnitt(ist, 0.15, 1);
    rahmen.style.width = mix(90, 100, b) + 'vw';
    rahmen.style.height = mix(80, 100, b) + 'vh';
    rahmen.style.borderRadius = mix(32, 0, b) + 'px';
    matrix.style.transform = 'translateZ(' + mix(-800, 0, m) + 'px) rotateX(' + mix(25, 4, m) + 'deg) rotateY(' + mix(-45, -8, m) + 'deg) rotateZ(' + mix(15, 2, m) + 'deg)';
    var wege = [[0, -40], [-40, 10], [0, -40], [-30, 20]];
    spalten.forEach(function (sp, i) { sp.style.transform = 'translateY(' + mix(wege[i][0], wege[i][1], m) + '%)'; });
    titel.style.opacity = 1 - abschnitt(ist, 0, 0.12);
    if (Math.abs(ziel - ist) > 0.0005) requestAnimationFrame(zeichnen); else laeuft = false;
  }
  function messen() {
    var r = entfalt.getBoundingClientRect(), weg = r.height - window.innerHeight;
    ziel = weg > 0 ? Math.max(0, Math.min(1, -r.top / weg)) : 0;
    if (!laeuft) { laeuft = true; requestAnimationFrame(zeichnen); }
  }
  if (ruhig) {
    // Reduzierte Bewegung: ruhende, leicht gekippte Fotowand ohne Scroll-Animation
    entfalt.classList.add('ruhig'); ist = ziel = 0.75; zeichnen(); titel.style.opacity = 0;
    rahmen.style.width = '100vw'; rahmen.style.height = '100vh'; rahmen.style.borderRadius = '0';
    return;
  }
  window.addEventListener('scroll', messen, { passive: true });
  window.addEventListener('resize', messen);
  messen(); ist = ziel; zeichnen();
})();


/* Logo auf der Startseite: sanft nach oben statt neu laden */
(function () {
  var m = document.querySelector('.kopf .marke');
  if (!m || !document.body.classList.contains('seite-start')) return;
  m.addEventListener('click', function (e) {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
})();
