/* Calendar maths for the date card. Pure functions, no DOM, so they can be unit tested.
   Exposes window.WeddingCalendar. */
(function (root) {
  'use strict';

  // Splits 'YYYY-MM-DD' into [year, monthIndex, day] for Date.UTC
  function parseIso(iso) {
    var p = String(iso).split('-').map(Number);
    return [p[0], p[1] - 1, p[2]];
  }

  // Monday-first weeks for one month (month is 1–12). Days outside the month are null.
  function monthWeeks(year, month) {
    var first = new Date(Date.UTC(year, month - 1, 1));
    var offset = (first.getUTCDay() + 6) % 7;
    var total = new Date(Date.UTC(year, month, 0)).getUTCDate();
    var cells = [];
    for (var i = 0; i < offset; i++) cells.push(null);
    for (var d = 1; d <= total; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    var weeks = [];
    for (var w = 0; w < cells.length; w += 7) weeks.push(cells.slice(w, w + 7));
    return weeks;
  }

  // Whole days from one ISO date to another. Positive when `to` is later.
  function daysBetween(fromIso, toIso) {
    var a = Date.UTC.apply(null, parseIso(fromIso));
    var b = Date.UTC.apply(null, parseIso(toIso));
    return Math.round((b - a) / 86400000);
  }

  // Local calendar day as 'YYYY-MM-DD', so the countdown flips at local midnight
  function todayIso(now) {
    var d = now || new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // Text for a calendar file (.ics). start is 'YYYY-MM-DDTHH:MM', the event lasts `hours` hours.
  function buildIcs(event) {
    var start = event.start.split('T');
    var t = start[1].split(':').map(Number);
    var p = parseIso(start[0]);
    var endMs = Date.UTC(p[0], p[1], p[2], t[0] + event.hours, t[1]);
    var end = new Date(endMs);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var stamp = function (y, mo, d, h, mi) { return y + pad(mo) + pad(d) + 'T' + pad(h) + pad(mi) + '00'; };
    var esc = function (s) { return String(s).replace(/[\\;,]/g, function (c) { return '\\' + c; }).replace(/\n/g, '\\n'); };
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//wedding-card//VI',
      'BEGIN:VEVENT',
      'DTSTART:' + stamp(p[0], p[1] + 1, p[2], t[0], t[1]),
      'DTEND:' + stamp(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate(), end.getUTCHours(), end.getUTCMinutes()),
      'SUMMARY:' + esc(event.title),
      'LOCATION:' + esc(event.location),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  root.WeddingCalendar = {
    monthWeeks: monthWeeks,
    daysBetween: daysBetween,
    todayIso: todayIso,
    buildIcs: buildIcs
  };
})(window);
