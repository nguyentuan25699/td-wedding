/* Page logic: text and names, the envelope opening, the invitation sections, reveals and music.
   Each feature runs through attempt(), so one failure leaves the rest of the page working. */
(function () {
  'use strict';

  var root = document.documentElement;
  var C = window.WEDDING_CONFIG || {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'vi';
  var text = (C.text && C.text[lang]) || {};

  // Start times in ms from the tap (design-brief.md section B).
  // With reduced motion the same steps run as one short crossfade.
  var TIMING = reduced
    ? { leave: 0, invite: 300, unlock: 300, zoom: 0 }
    : { leave: 1250, invite: 1900, unlock: 2400, zoom: 650 };

  var cover = document.getElementById('cover');
  var invite = document.getElementById('invite');
  var openBtn = document.getElementById('open');
  var seal = document.getElementById('seal');
  var audio = document.getElementById('bgm');
  var musicBtn = document.getElementById('music');
  var musicOk = !!(C.music && C.music.src);
  var wasPlaying = false;
  var opened = false;

  function attempt(name, fn) {
    try {
      fn();
    } catch (err) {
      if (window.console) console.warn('[wedding] ' + name + ' failed', err);
    }
  }

  function setAll(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value || '';
    });
  }

  /* ---------- Text, names and the hero date ---------- */

  function applyText() {
    var couple = C.couple || {};
    var family = C.family || {};
    var date = C.date || {};
    root.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = text[el.getAttribute('data-i18n')] || '';
    });
    document.querySelectorAll('[data-i18n-label]').forEach(function (el) {
      el.setAttribute('aria-label', text[el.getAttribute('data-i18n-label')] || '');
    });
    setAll('[data-names]', couple.names);
    stackNames(couple);
    setAll('[data-bride-name]', couple.bride);
    setAll('[data-groom-name]', couple.groom);
    document.querySelectorAll('[data-monogram]').forEach(function (el) {
      el.textContent = '';
      el.appendChild(logo(el.closest('.cover') ? couple.monogram.image : couple.monogram.imageOnLight));
    });
    setAll('[data-deadline]', C.rsvp && C.rsvp.deadline ? C.rsvp.deadline[lang] : '');
    setAll('[data-bride-father]', family.bride && family.bride.father);
    setAll('[data-bride-mother]', family.bride && family.bride.mother);
    setAll('[data-groom-father]', family.groom && family.groom.father);
    setAll('[data-groom-mother]', family.groom && family.groom.mother);
    showAddress('[data-bride-address]', family.bride && family.bride.address);
    showAddress('[data-groom-address]', family.groom && family.groom.address);
    setAll('#hero-lunar', date.lunar);
    renderHeroDate(date.iso);
  }

  // Hero names: first name, a gold &, second name, each on its own line
  function stackNames(couple) {
    var box = document.querySelector('[data-stack-names]');
    if (!box) return;
    box.textContent = '';
    box.appendChild(spanWith(couple.first));
    box.appendChild(spanWith('&', 'amp'));
    box.appendChild(spanWith(couple.second));
  }

  function showAddress(selector, value) {
    var el = document.querySelector(selector);
    el.textContent = value || '';
    el.hidden = !value;
  }

  // Weekday, day.month and year in three spans, like the reference hero
  function renderHeroDate(iso) {
    var box = document.getElementById('hero-date');
    if (!iso) {
      box.hidden = true;
      return;
    }
    var p = iso.split('-').map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    box.textContent = '';
    box.appendChild(spanWith(text.weekdays[d.getUTCDay()]));
    box.appendChild(spanWith(pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1), 'date__big'));
    box.appendChild(spanWith(String(d.getUTCFullYear())));
  }

  // The monogram logo as a background image (no CORS needed, unlike a CSS mask). src is one of the two PNGs in config.
  function logo(src, className) {
    var span = document.createElement('span');
    span.className = 'logo' + (className ? ' ' + className : '');
    span.setAttribute('role', 'img');
    span.setAttribute('aria-label', C.couple.monogram.left + ' & ' + C.couple.monogram.right);
    // Absolute URL: a url() inside a custom property would otherwise resolve against the stylesheet
    span.style.setProperty('--logo-src', 'url("' + new URL(src, document.baseURI).href + '")');
    return span;
  }

  function spanWith(value, className) {
    var span = document.createElement('span');
    if (className) span.className = className;
    span.textContent = value;
    return span;
  }

  // Shows the configured hero photo. Without one, or if the file fails to load, a designed placeholder shows.
  function applyPhoto() {
    var src = C.photos && C.photos.hero;
    var box = document.getElementById('hero-photo');
    if (!src) {
      box.appendChild(placeholder());
      return;
    }
    var img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('error', function () { img.replaceWith(placeholder()); });
    img.src = src;
    box.appendChild(img);
  }

  function placeholder() {
    var box = document.createElement('div');
    box.className = 'ph';
    var seal = spanWith('囍', 'hy');
    seal.setAttribute('aria-hidden', 'true');
    box.appendChild(seal);
    box.appendChild(logo(C.couple.monogram.imageOnLight, 'ph__logo'));
    box.appendChild(spanWith(text.photoLabel, 'ph__label'));
    return box;
  }

  // Text only: the name is set with textContent, never as HTML
  function applyGuest() {
    var raw = new URLSearchParams(window.location.search).get('to');
    var name = window.WeddingGuest.sanitizeGuestName(raw, C.defaultGuest);
    document.getElementById('guest').textContent = name;
  }

  /* ---------- Line drawings and florals ---------- */

  // Draws every floral from its data-seed and root (flora.js). Runs before prepDraw.
  function mountFloras() {
    document.querySelectorAll('svg.flora').forEach(function (svg) {
      window.WeddingFlora.mountFlora(svg);
    });
  }

  // Leaves and blossoms fall on the cover and inside the invitation. Skipped with reduced motion.
  // Fewer petals on phones: the invitation layer covers a small screen, so 18 looks crowded there
  function mountFalls() {
    if (reduced) return;
    var phone = window.matchMedia('(max-width: 767px)').matches;
    document.querySelectorAll('.fall').forEach(function (layer, i) {
      var count = i ? (phone ? 5 : 18) : (phone ? 3 : 10);
      window.WeddingFlora.mountPetalFall(layer, 21 + i * 13, count);
    });
  }

  // Family houses and the red thread between them (sketches.js), named by data-house in index.html
  function mountFamilyArt() {
    document.querySelectorAll('[data-house]').forEach(function (box) {
      var art = window.Sketches.element(box.getAttribute('data-house'));
      if (art) box.appendChild(art);
    });
    var thread = document.getElementById('family-thread');
    var art = window.Sketches.element('thread');
    if (art) thread.appendChild(art);
  }

  // Every stroke of the cover florals gets pathLength=1 so CSS can draw it from 0 to 1.
  // Inside each floral, `--i` sets the stroke order: roots and stems first, then leaves and petals.
  function prepDraw() {
    document.querySelectorAll('.flora').forEach(function (group) {
      group.querySelectorAll('.ln').forEach(function (el, i) {
        el.setAttribute('pathLength', '1');
        el.style.setProperty('--i', i);
      });
    });
  }

  /* ---------- Load ---------- */

  function markReady() {
    requestAnimationFrame(function () {
      root.classList.add('is-ready');
    });
  }

  // Reveals fire once, when the element is 20% on screen. No observer: show at once.
  function setupReveal() {
    var targets = document.querySelectorAll('.invite .reveal');
    if (!('IntersectionObserver' in window) || reduced) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Music ---------- */

  function setMusicState(playing) {
    musicBtn.setAttribute('aria-pressed', String(playing));
    musicBtn.querySelector('[data-music-label]').textContent = text[playing ? 'musicStop' : 'musicStart'] || '';
  }

  function hideMusic() {
    musicOk = false;
    musicBtn.hidden = true;
  }

  // Ramps volume from 0 to the target over the given time
  function fadeVolumeIn(target, duration) {
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      audio.volume = target * t;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Called from the tap handler: browsers only allow sound after a user gesture
  function startMusic(fadeIn) {
    if (!musicOk) return;
    if (!audio.src) audio.src = C.music.src;
    if (fadeIn) audio.volume = 0;
    var playing = audio.play();
    if (!playing || !playing.then) return;
    playing.then(function () {
      setMusicState(true);
      if (fadeIn) fadeVolumeIn(C.music.volume || 0.6, 1500);
    }, hideMusic);
  }

  function toggleMusic() {
    if (!audio.paused) {
      audio.pause();
      setMusicState(false);
      return;
    }
    startMusic(false);
  }

  // Pause when the guest leaves the tab, resume only if it was playing
  function onVisibilityChange() {
    if (document.hidden) {
      wasPlaying = !audio.paused;
      audio.pause();
      return;
    }
    if (wasPlaying) {
      audio.play().catch(function () {});
    }
  }

  function showMusicToggle() {
    if (!musicOk) return;
    musicBtn.hidden = false;
    setMusicState(!audio.paused);
    requestAnimationFrame(function () {
      musicBtn.classList.add('is-in');
    });
  }

  /* ---------- Opening sequence ---------- */

  // The letter grows from where the guest sees it until it covers the screen. Only transform moves.
  // Start and end are measured from the card's resting box (transform-origin 0 0), so the zoom begins exactly where the card is.
  function zoomLetter() {
    var card = cover.querySelector('.envelope__card');
    var seen = card.getBoundingClientRect();
    card.style.transition = 'none';
    card.style.transform = 'none';
    var rest = card.getBoundingClientRect();
    var to = Math.max(window.innerWidth / rest.width, window.innerHeight / rest.height) * 1.02;
    card.style.transformOrigin = '0 0';
    card.style.transform = placeCard(seen.left - rest.left, seen.top - rest.top, seen.width / rest.width);
    card.getBoundingClientRect(); // flush, so the next change animates from here
    card.style.transition = 'transform ' + TIMING.zoom + 'ms var(--ease-in-out)';
    card.style.transform = placeCard(
      (window.innerWidth - rest.width * to) / 2 - rest.left,
      (window.innerHeight - rest.height * to) / 2 - rest.top,
      to
    );
  }

  function placeCard(x, y, scale) {
    return 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    startMusic(true);
    cover.classList.add('is-opening');
    window.setTimeout(function () {
      cover.classList.add('is-leaving');
      if (!reduced) zoomLetter();
    }, TIMING.leave);
    window.setTimeout(function () {
      cover.classList.add('is-done');
      invite.classList.add('is-in');
    }, TIMING.invite);
    window.setTimeout(function () {
      document.body.classList.remove('is-locked');
      showMusicToggle();
    }, TIMING.unlock);
  }

  /* ---------- Bind once ---------- */

  function bindEvents() {
    openBtn.addEventListener('click', openInvitation);
    seal.addEventListener('click', openInvitation);
    musicBtn.addEventListener('click', toggleMusic);
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  // Reloading must start at the cover, not at the scroll position of the invitation
  function startAtTop() {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  markReady();
  attempt('scroll', startAtTop);
  attempt('text', applyText);
  attempt('photo', applyPhoto);
  attempt('guest', applyGuest);
  attempt('flora', mountFloras);
  attempt('fall', mountFalls);
  attempt('families', mountFamilyArt);
  attempt('draw', prepDraw);
  attempt('events', function () { window.WeddingEvents.mount(C, text, reduced); });
  attempt('album', function () { window.WeddingAlbum.mount(C, text); });
  attempt('rsvp', function () { window.WeddingRsvp.mount(C, text); });
  attempt('reveal', setupReveal);
  attempt('bind', bindEvents);
})();
