// config.js: every key the page reads exists, both languages match, and no forbidden content slipped in.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript, read } = require('./helpers');

const C = loadBrowserScript('config.js').WEDDING_CONFIG;

test('has the couple, date, family, photo and music blocks', () => {
  for (const key of ['couple', 'date', 'family', 'photos', 'music']) {
    assert.ok(C[key], `missing block: ${key}`);
  }
  for (const key of ['names', 'first', 'second']) {
    assert.equal(typeof C.couple[key], 'string', `couple.${key}`);
  }
  assert.equal(typeof C.couple.monogram.left, 'string');
  assert.equal(typeof C.couple.monogram.right, 'string');
  for (const side of ['bride', 'groom']) {
    for (const key of ['father', 'mother', 'address']) {
      assert.equal(typeof C.family[side][key], 'string', `family.${side}.${key}`);
    }
  }
});

test('Vietnamese and English text have the same keys', () => {
  const vi = Object.keys(C.text.vi).sort();
  const en = Object.keys(C.text.en).sort();
  assert.deepEqual(en, vi);
});

test('no text value is empty', () => {
  for (const lang of ['vi', 'en']) {
    for (const [key, value] of Object.entries(C.text[lang])) {
      assert.ok(String(value).trim().length > 0, `${lang}.${key} is empty`);
    }
  }
});

test('the default guest name is set', () => {
  assert.ok(C.defaultGuest && C.defaultGuest.trim().length > 0);
});

test('music points to an mp3 under assets/music and has a sane volume', () => {
  assert.match(C.music.src, /^assets\/music\/.+\.mp3$/);
  assert.ok(C.music.volume > 0 && C.music.volume <= 1);
});

test('the solar date is set as YYYY-MM-DD, the parent names are filled in', () => {
  assert.match(C.date.iso, /^\d{4}-\d{2}-\d{2}$/);
  // Parents' names were given by the owner (2026-11-02); the addresses stay TODO
  assert.ok(C.family.bride.father && !/TODO/.test(C.family.bride.father), 'bride father is filled in');
  assert.ok(C.family.groom.father && !/TODO/.test(C.family.groom.father), 'groom father is filled in');
});

test('lunar date is typed by hand and the config flags it for a manual check', () => {
  // Changed 2026-11-02: the owner asked for the lunar date to be looked up, so it is filled in.
  // It must still be flagged in config.js as needing a manual check against a lunar calendar.
  const src = read('config.js');
  assert.ok(C.date.lunar && !/TODO/.test(C.date.lunar), 'lunar date is filled in');
  assert.match(src, /NEEDS MANUAL CHECK/);
});

test('no gift or bank section content (CLAUDE.md: never add one)', () => {
  const dump = JSON.stringify(C).toLowerCase();
  for (const word of ['bank', 'qr', 'ngân hàng', 'stk', 'số tài khoản', 'gift', 'quà']) {
    assert.ok(!dump.includes(word), `found forbidden word: ${word}`);
  }
});

test('no phone numbers in config (CLAUDE.md: never commit real phone numbers)', () => {
  assert.doesNotMatch(read('config.js'), /(\+?84|\b0)[ .-]?\d{2,3}[ .-]?\d{3}[ .-]?\d{3,4}\b/);
});
