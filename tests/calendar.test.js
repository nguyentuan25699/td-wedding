// calendar.js: Monday-first month grid and day counting. Pure functions, no DOM.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript } = require('./helpers');

const { monthWeeks, daysBetween, todayIso, buildIcs } = loadBrowserScript('assets/js/calendar.js').WeddingCalendar;

test('December 2026 starts on a Tuesday (Monday-first grid)', () => {
  const first = monthWeeks(2026, 12)[0];
  assert.equal(first[0], null, 'Monday cell is empty');
  assert.equal(first[1], 1, 'the 1st is on Tuesday');
});

test('every week has seven cells and every day of the month appears once', () => {
  const weeks = monthWeeks(2026, 2);
  weeks.forEach((w) => assert.equal(w.length, 7));
  const days = weeks.flat().filter((d) => d !== null);
  assert.deepEqual([...days], Array.from({ length: 28 }, (_, i) => i + 1));
});

test('leap February has 29 days', () => {
  const days = monthWeeks(2028, 2).flat().filter((d) => d !== null);
  assert.equal(days.length, 29);
});

test('daysBetween counts whole days, negative when the date has passed', () => {
  assert.equal(daysBetween('2026-11-02', '2026-11-03'), 1);
  assert.equal(daysBetween('2026-11-02', '2027-01-17'), 76);
  assert.equal(daysBetween('2026-11-02', '2026-11-01'), -1);
  assert.equal(daysBetween('2026-11-02', '2026-11-02'), 0);
});

test('todayIso formats the local date as YYYY-MM-DD', () => {
  assert.equal(todayIso(new Date(2027, 0, 5, 23, 30)), '2027-01-05');
});

test('buildIcs writes one event with the start, end and escaped text', () => {
  const ics = buildIcs({ title: 'Lễ thành hôn, Bảo Phi', start: '2027-01-17T10:00', hours: 3, location: 'Trống đồng palace' });
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /DTSTART:20270117T100000/);
  assert.match(ics, /DTEND:20270117T130000/);
  assert.match(ics, /SUMMARY:Lễ thành hôn\\, Bảo Phi/);
  assert.match(ics, /END:VCALENDAR$/);
});
