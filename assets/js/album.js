/* Album: gallery grid and a full-screen viewer with swipe, keys and focus trap.
   Builds its own elements with textContent and createElement only. Exposes window.WeddingAlbum.
   Items come from config.photos.album; placeholder tiles show while the album is empty. */
(function (root) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var PLACEHOLDER_LAYOUT = ['portrait', 'portrait', 'landscape', 'portrait', 'portrait', 'landscape', 'portrait', 'portrait', 'portrait', 'portrait'];
  var ICON_PATHS = {
    close: 'M5 5l14 14M19 5L5 19',
    prev: 'M15 4l-8 8 8 8',
    next: 'M9 4l8 8-8 8'
  };

  var state = { items: [], config: null, text: null, index: 0, box: null, lastFocus: null };

  function el(tag, className, value) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function icon(name) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', ICON_PATHS[name]);
    svg.appendChild(path);
    return svg;
  }

  // Next index in a loop of n items; d is 1 or -1
  function wrapIndex(i, d, n) {
    return (i + d + n) % n;
  }

  function orientationOf(item) {
    return item.w && item.h && item.w < item.h ? 'portrait' : 'landscape';
  }

  // The burgundy monogram logo on the ivory placeholder (see logo() in main.js)
  function logo() {
    var span = el('span', 'logo ph__logo');
    span.setAttribute('role', 'img');
    span.setAttribute('aria-label', state.config.couple.monogram.left + ' & ' + state.config.couple.monogram.right);
    span.style.setProperty('--logo-src', 'url("' + new URL(state.config.couple.monogram.imageOnLight, document.baseURI).href + '")');
    return span;
  }

  // One tile: the photo, or a designed placeholder that alternates the logo and the seal mark
  function placeholder(i, label) {
    var box = el('div', 'ph');
    if (i % 3 === 1) {
      box.appendChild(logo());
    } else {
      box.appendChild(el('span', 'hy', '囍')).setAttribute('aria-hidden', 'true');
    }
    if (label) box.appendChild(el('span', 'ph__label', state.text.albumSoon));
    return box;
  }

  function tileLabel(item, i, total) {
    return (item.alt || (state.text.albumPhoto || 'Ảnh')) + ' ' + (i + 1) + '/' + total;
  }

  function mount(config, text) {
    var container = document.getElementById('album');
    if (!container) return;
    state.config = config;
    state.text = text;
    var real = (config.photos && config.photos.album || []).filter(function (x) { return x && x.src; });
    state.items = real.length
      ? real
      : PLACEHOLDER_LAYOUT.map(function (o) { return { src: '', w: o === 'portrait' ? 3 : 4, h: o === 'portrait' ? 4 : 3, placeholder: true }; });

    state.items.forEach(function (item, i) {
      var kind = orientationOf(item);
      var button = el('button', 'album__item album__item--' + kind);
      button.type = 'button';
      button.setAttribute('aria-label', tileLabel(item, i, state.items.length));
      if (item.placeholder) {
        button.appendChild(placeholder(i, false));
      } else {
        var img = el('img', 'is-loading');
        img.src = item.src;
        img.alt = item.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('load', function () { img.classList.remove('is-loading'); });
        img.addEventListener('error', function () { button.replaceChildren(placeholder(i, false)); });
        button.appendChild(img);
      }
      button.addEventListener('click', function () { open(i); });
      container.appendChild(button);
    });
  }

  /* ---------- Viewer ---------- */

  function navButton(act, label) {
    var b = el('button', 'lightbox__btn lightbox__nav lightbox__nav--' + act);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.appendChild(icon(act));
    return b;
  }

  function build() {
    var t = state.text;
    var box = el('div', 'lightbox');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.hidden = true;

    var bar = el('div', 'lightbox__bar');
    bar.appendChild(el('span', 'lightbox__count'));
    var close = el('button', 'lightbox__btn lightbox__close');
    close.type = 'button';
    close.setAttribute('aria-label', t.albumClose);
    close.appendChild(icon('close'));
    bar.appendChild(close);
    box.appendChild(bar);

    var stage = el('div', 'lightbox__stage');
    stage.appendChild(navButton('prev', t.albumPrev));
    stage.appendChild(el('figure', 'lightbox__figure'));
    stage.appendChild(navButton('next', t.albumNext));
    box.appendChild(stage);
    box.appendChild(el('p', 'lightbox__caption'));
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      if (e.target.closest('.lightbox__close')) close_();
      else if (e.target.closest('.lightbox__nav--next')) go(1);
      else if (e.target.closest('.lightbox__nav--prev')) go(-1);
      else if (e.target.classList.contains('lightbox__stage')) close_();
    });

    var x0 = null, y0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close_();
      x0 = y0 = null;
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close_();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') keepFocus(e, box);
    });
    return box;
  }

  // Keeps Tab inside the viewer while it is open
  function keepFocus(e, box) {
    var f = box.querySelectorAll('button:not([hidden])');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function render() {
    var box = state.box, item = state.items[state.index];
    var fig = box.querySelector('.lightbox__figure');
    fig.textContent = '';
    if (item.placeholder) {
      fig.appendChild(placeholder(state.index, true));
    } else {
      var img = el('img');
      img.src = item.full || item.src; // the viewer shows the large copy
      img.alt = item.alt || '';
      fig.appendChild(img);
    }
    box.querySelector('.lightbox__caption').textContent = item.alt || '';
    box.querySelector('.lightbox__count').textContent = (state.index + 1) + ' / ' + state.items.length;
    var single = state.items.length < 2;
    box.querySelector('.lightbox__nav--prev').hidden = single;
    box.querySelector('.lightbox__nav--next').hidden = single;
    // Warm the neighbours so swiping feels instant
    [1, -1].forEach(function (d) {
      var n = state.items[(state.index + d + state.items.length) % state.items.length];
      if (n && n.src) { var im = new Image(); im.src = n.full || n.src; }
    });
  }

  function open(i) {
    if (!state.box) state.box = build();
    state.lastFocus = document.activeElement;
    state.index = i;
    render();
    state.box.hidden = false;
    document.body.classList.add('is-locked');
    void state.box.offsetHeight; // apply the hidden state first so the fade runs
    state.box.classList.add('is-open');
    state.box.querySelector('.lightbox__close').focus();
  }

  function close_() {
    var box = state.box;
    box.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    root.setTimeout(function () { box.hidden = true; }, 450);
    if (state.lastFocus) state.lastFocus.focus({ preventScroll: true });
  }

  function go(d) {
    var fig = state.box.querySelector('.lightbox__figure');
    state.index = wrapIndex(state.index, d, state.items.length);
    fig.style.opacity = '0';
    fig.style.transform = 'translateX(' + (d * 12) + 'px)';
    root.setTimeout(function () {
      render();
      fig.style.transform = 'translateX(' + (-d * 12) + 'px)';
      requestAnimationFrame(function () { fig.style.opacity = '1'; fig.style.transform = 'none'; });
    }, 180);
  }

  root.WeddingAlbum = { mount: mount, orientationOf: orientationOf, wrapIndex: wrapIndex };
})(window);
