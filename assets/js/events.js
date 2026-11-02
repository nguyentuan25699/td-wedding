/* Ceremony card, programme rows and the date section (tear-off calendar or month page).
   Builds its own elements with textContent and createElement only. Exposes window.WeddingEvents. */
(function (root) {
  'use strict';

  var DAY_MS = 864e5;
  var HEART = 'M34 53 C 14 41, 3 29, 8 17 C 13 5, 28 5, 32 18 C 36 5, 51 5, 56 17 C 61 29, 50 41, 28 55';

  function el(tag, className, value) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Calendar date from a YYYY-MM-DD string, as UTC midnight so day arithmetic stays exact
  function utcOf(iso) {
    var p = iso.split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2]));
  }

  function monthLabel(text, d) {
    return text.monthLabel.replace('{m}', String(d.getUTCMonth() + 1)).replace('{y}', String(d.getUTCFullYear()));
  }

  // The ceremony card: sketch, name, venue, three facts, address, and two buttons
  function eventCard(config, text) {
    var ev = config.event;
    var iso = config.date.iso;
    var d = utcOf(iso);
    var card = el('article', 'event reveal');
    card.setAttribute('aria-label', text.eventTitle);
    for (var i = 0; i < 4; i++) card.appendChild(el('span', 'event__corner'));

    var art = root.Sketches && root.Sketches.element(ev.sketch);
    if (art) card.appendChild(el('div', 'event__art')).appendChild(art);

    card.appendChild(el('p', 'kicker event__name', text.eventTitle));
    card.appendChild(el('h3', 'event__venue', ev.venue));

    var facts = el('div', 'event__facts');
    facts.appendChild(fact(text.factTime, ev.time, ''));
    facts.appendChild(fact(text.factDate, pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1),
      text.weekdays[d.getUTCDay()] + ' · ' + d.getUTCFullYear()));
    facts.appendChild(fact(text.factLunar, '', config.date.lunar));
    card.appendChild(facts);

    var where = el('div', 'event__where');
    where.appendChild(el('span', 'event__label', text.factWhere));
    where.appendChild(el('p', 'event__addr', ev.address));
    card.appendChild(where);

    var actions = el('div', 'event__actions');
    if (ev.map) {
      var link = el('a', 'btn btn--solid', text.directions);
      link.href = ev.map;
      link.target = '_blank';
      link.rel = 'noopener';
      actions.appendChild(link);
    }
    var toggle = el('button', 'btn btn--ghost', text.addCalendar);
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'event-cal');
    actions.appendChild(toggle);
    card.appendChild(actions);

    var cal = el('div', 'event__cal');
    cal.id = 'event-cal';
    cal.hidden = true;
    cal.appendChild(icsButton(config, text));
    var google = el('a', '', text.calendarGoogle);
    google.href = googleHref(config, text);
    google.target = '_blank';
    google.rel = 'noopener';
    cal.appendChild(google);
    card.appendChild(cal);

    toggle.addEventListener('click', function () {
      cal.hidden = !cal.hidden;
      toggle.setAttribute('aria-expanded', String(!cal.hidden));
    });
    return card;
  }

  function fact(label, big, sub) {
    var box = el('div', 'event__fact');
    box.appendChild(el('span', 'event__label', label));
    if (big) box.appendChild(el('span', 'event__big', big));
    box.appendChild(el('span', 'event__sub', sub));
    return box;
  }

  // Builds the .ics text from fixed fields (our own config and copy only)
  function icsText(config, text) {
    var ev = config.event;
    var start = config.date.iso.replace(/-/g, '') + 'T' + ev.time.replace(':', '') + '00';
    var end = addHours(config.date.iso, ev.time, ev.hours);
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//wedding-card//VI',
      'BEGIN:VEVENT',
      'DTSTART:' + start,
      'DTEND:' + end,
      'SUMMARY:' + icsEscape(text.eventTitle + ' ' + config.couple.names),
      'LOCATION:' + icsEscape(ev.venue + ', ' + ev.address),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function addHours(iso, time, hours) {
    var p = iso.split('-').map(Number);
    var t = time.split(':').map(Number);
    var end = new Date(Date.UTC(p[0], p[1] - 1, p[2], t[0] + hours, t[1]));
    return end.getUTCFullYear() + pad(end.getUTCMonth() + 1) + pad(end.getUTCDate()) + 'T' +
      pad(end.getUTCHours()) + pad(end.getUTCMinutes()) + '00';
  }

  function icsEscape(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
  }

  // Downloads the .ics file on click (a Blob, so no page navigation)
  function icsButton(config, text) {
    var button = el('button', 'event__ics', text.calendarIcs);
    button.type = 'button';
    button.addEventListener('click', function () {
      var url = URL.createObjectURL(new Blob([icsText(config, text)], { type: 'text/calendar;charset=utf-8' }));
      var a = el('a');
      a.href = url;
      a.download = 'wedding.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
    return button;
  }

  function googleHref(config, text) {
    var ev = config.event;
    var start = config.date.iso.replace(/-/g, '') + 'T' + ev.time.replace(':', '') + '00';
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(text.eventTitle + ' ' + config.couple.names) +
      '&dates=' + start + '/' + addHours(config.date.iso, ev.time, ev.hours) +
      '&location=' + encodeURIComponent(ev.venue + ', ' + ev.address) +
      '&ctz=Asia/Ho_Chi_Minh';
  }

  function renderEvents(config, text) {
    var box = document.getElementById('events');
    if (!config.event || !config.date.iso) {
      box.hidden = true;
      return;
    }
    box.appendChild(eventCard(config, text));
  }

  // Programme rows, each with its sketch drawn on when the row is revealed
  function renderProgramme(config, text) {
    var list = document.getElementById('program');
    var section = document.getElementById('program-section');
    section.hidden = !config.program || !config.program.length;
    if (section.hidden) return;
    document.getElementById('program-date').textContent = config.date.solar;
    config.program.forEach(function (row, i) {
      var item = el('li', 'program__item reveal reveal--' + (i % 2 ? 'right' : 'left'));
      var art = root.Sketches && root.Sketches.element(row.sketch);
      if (art) item.appendChild(el('div', 'program__art')).appendChild(art);
      var body = el('div', 'program__text');
      body.appendChild(el('p', 'program__time', row.time));
      body.appendChild(el('h3', 'program__title', text[row.key]));
      if (row.note) body.appendChild(el('p', 'program__note', row.note));
      item.appendChild(body);
      list.appendChild(item);
    });
  }

  /* ---------- Month page: the day circled with a hand-drawn heart ---------- */
  function monthPage(config, text, d, endIso) {
    var box = el('div', 'mcal');
    box.appendChild(el('p', 'mcal__month', monthLabel(text, d)));
    var grid = el('div', 'mcal__grid');
    var wd = text.weekdaysShort;
    for (var w = 1; w <= 7; w++) {
      var label = wd[w % 7];
      grid.appendChild(el('span', 'mcal__wd' + (w % 7 === 0 ? ' is-sun' : ''), label));
    }
    var year = d.getUTCFullYear(), month = d.getUTCMonth();
    var first = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
    var length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    var target = utcOf(endIso).getUTCDate();
    for (var i = 0; i < first; i++) grid.appendChild(el('span'));
    for (var n = 1; n <= length; n++) {
      var cell = el('span', (first + n - 1) % 7 === 6 ? 'is-sun' : '', String(n));
      if (n === target) cell = dayWithHeart(n);
      grid.appendChild(cell);
    }
    box.appendChild(grid);
    box.appendChild(el('p', 'mcal__lunar', config.date.lunar));
    return box;
  }

  function dayWithHeart(n) {
    var cell = el('span', 'mcal__day');
    cell.appendChild(el('b', '', String(n)));
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sketch mcal__heart');
    svg.setAttribute('viewBox', '0 0 64 60');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('filter', 'url(#hand)');
    g.setAttribute('fill', 'none');
    g.setAttribute('stroke', 'currentColor');
    g.setAttribute('stroke-width', '1.7');
    g.setAttribute('stroke-linecap', 'round');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', HEART);
    path.setAttribute('pathLength', '1');
    path.setAttribute('class', 'ln');
    g.appendChild(path);
    svg.appendChild(g);
    cell.appendChild(svg);
    return cell;
  }

  /* ---------- Tear-off calendar: one page per day left, torn off when scrolled into view ---------- */
  // The monogram logo stamp on the last page: the burgundy PNG, as in the closing mark
  function stampOf(config) {
    var stamp = el('span', 'bloc__stamp');
    stamp.setAttribute('aria-hidden', 'true');
    var mark = el('span', 'logo');
    mark.style.setProperty('--logo-src', 'url("' + new URL(config.couple.monogram.imageOnLight, document.baseURI).href + '")');
    stamp.appendChild(mark);
    return stamp;
  }

  function blocPage(config, text, d, isFinal) {
    var page = el('div', 'bloc__page' + (isFinal ? ' bloc__page--final' : ' bloc__page--tear') + (d.getUTCDay() === 0 ? ' is-sun' : ''));
    if (isFinal) page.appendChild(stampOf(config));
    page.appendChild(el('p', 'bloc__month', monthLabel(text, d)));
    page.appendChild(el('p', 'bloc__day', String(d.getUTCDate())));
    page.appendChild(el('p', 'bloc__wd', text.weekdays[d.getUTCDay()]));
    if (isFinal) {
      page.appendChild(el('p', 'bloc__names script', config.couple.names));
      var lunar = el('p', 'bloc__lunar');
      lunar.appendChild(el('span', '', text.lunarLabel));
      lunar.appendChild(document.createTextNode(' ' + config.date.lunar));
      page.appendChild(lunar);
    }
    return page;
  }

  function renderBloc(box, config, text, end, left, reduced) {
    box.classList.add('bloc');
    var head = el('div', 'bloc__head');
    head.appendChild(el('span', 'hy', '囍')).setAttribute('aria-hidden', 'true');
    box.appendChild(head);
    var stack = el('div', 'bloc__stack');
    stack.appendChild(blocPage(config, text, end, true));
    var tear = [];
    if (!reduced && left > 0 && 'IntersectionObserver' in root) {
      var n = Math.min(left, 6);
      for (var i = n - 1; i >= 0; i--) {
        tear.push(blocPage(config, text, new Date(end.getTime() - Math.round(left * (n - i) / n) * DAY_MS), false));
      }
    }
    tear.forEach(function (page) { stack.appendChild(page); });
    box.appendChild(stack);
    if (!tear.length) return;
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      playTear(stack);
    }, { threshold: 0.6 });
    io.observe(box);
  }

  // Tears the top page first, then the rest with a short gap
  function playTear(stack) {
    var pages = Array.prototype.slice.call(stack.querySelectorAll('.bloc__page--tear')).reverse();
    var at = 450;
    pages.forEach(function (page, i) {
      at += i ? Math.max(230, 640 - i * 100) : 0;
      root.setTimeout(function () { page.classList.add('is-torn'); }, at);
    });
  }

  function renderWhen(config, text, reduced) {
    var section = document.querySelector('section.when');
    var box = document.getElementById('when');
    var left = root.WeddingCalendar.daysBetween(root.WeddingCalendar.todayIso(), config.date.iso);
    var end = utcOf(config.date.iso);
    var style = (root.location.search.match(/[?&]cal=(bloc|page)/) || [])[1] || (config.calendar && config.calendar.style) || 'bloc';
    var note = document.getElementById('when-left');
    if (!config.date.iso) {
      section.hidden = true;
      return;
    }
    if (left > 0) {
      note.textContent = (left === 1 ? text.dayLeft : text.daysLeft).replace('{n}', String(left));
    } else {
      note.textContent = text.countdownDone;
    }
    box.classList.add('when--' + style);
    if (style === 'page') {
      box.appendChild(monthPage(config, text, end, config.date.iso));
      return;
    }
    renderBloc(box, config, text, end, left, reduced);
  }

  // Called by main.js once the text language is known
  function mount(config, text, reduced) {
    renderEvents(config, text);
    renderProgramme(config, text);
    renderWhen(config, text, reduced);
  }

  root.WeddingEvents = { mount: mount, icsText: icsText, addHours: addHours };
})(window);
