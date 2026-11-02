// index.html and the scripts it loads: ids exist, i18n keys exist, script order, no unsafe patterns.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript, read } = require('./helpers');

const html = read('index.html');
const JS_FILES = [
  'assets/js/main.js', 'assets/js/guest.js', 'assets/js/flora.js', 'assets/js/calendar.js',
  'assets/js/sketches.js', 'assets/js/album.js', 'assets/js/events.js', 'assets/js/rsvp.js',
];
const pageJs = JS_FILES.map(read);
const mainJs = read('assets/js/main.js');
const jsAll = pageJs.join('\n');
const C = loadBrowserScript('config.js').WEDDING_CONFIG;

test('every id that a page script looks up exists in index.html', () => {
  const lookups = [...jsAll.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]);
  assert.ok(lookups.length > 0);
  for (const id of lookups) {
    assert.match(html, new RegExp(`id="${id}"`), `missing id: ${id}`);
  }
});

test('every data-i18n and data-i18n-label key exists in both languages', () => {
  const keys = new Set([
    ...[...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/data-i18n-label="([^"]+)"/g)].map((m) => m[1]),
  ]);
  assert.ok(keys.size > 0);
  for (const key of keys) {
    assert.ok(key in C.text.vi, `vi missing: ${key}`);
    assert.ok(key in C.text.en, `en missing: ${key}`);
  }
});

test('every data-* hook that a page script fills has a matching element', () => {
  const hooks = [...jsAll.matchAll(/\[(data-[a-z-]+)\]/g)].map((m) => m[1]);
  for (const hook of new Set(hooks)) {
    assert.match(html, new RegExp(`${hook}[\\s>=]`), `no element with ${hook}`);
  }
});

test('scripts load in order config, guest, flora, calendar, sketches, album, events, rsvp, main, all deferred', () => {
  const tags = [...html.matchAll(/<script (defer )?src="([^"]+)"/g)];
  const srcs = tags.map((m) => m[2]);
  assert.deepEqual(srcs, ['config.js', 'assets/js/guest.js', 'assets/js/flora.js', 'assets/js/calendar.js', 'assets/js/sketches.js', 'assets/js/album.js', 'assets/js/events.js', 'assets/js/rsvp.js', 'assets/js/main.js']);
  for (const tag of tags) assert.ok(tag[1], `not deferred: ${tag[2]}`);
});

test('only the js-flag snippet is an inline script', () => {
  const inline = [...html.matchAll(/<script>([^<]*)<\/script>/g)].map((m) => m[1]);
  assert.equal(inline.length, 1);
  assert.match(inline[0], /classList\.add\('js'\)/);
});

test('no inline event handler attributes', () => {
  assert.doesNotMatch(html, /\son[a-z]+="/i);
});

test('the page starts locked until the opening finishes', () => {
  assert.match(html, /<body class="is-locked">/);
});

test('no innerHTML or document.write in page scripts (text only)', () => {
  for (const src of pageJs) {
    assert.doesNotMatch(src, /innerHTML|insertAdjacentHTML|document\.write/);
  }
});

test('no alert, confirm or prompt dialogs', () => {
  for (const src of pageJs) {
    assert.doesNotMatch(src, /\b(alert|confirm|prompt)\(/);
  }
});

test('console output only in the attempt() error handler', () => {
  const calls = [...mainJs.matchAll(/console\.\w+/g)];
  assert.equal(calls.length, 1);
  assert.match(mainJs, /function attempt[\s\S]*console\.warn/);
});

test('the music element has preload none and loops', () => {
  assert.match(html, /<audio id="bgm" preload="none" loop>/);
});

test('the music toggle is hidden until the file works', () => {
  assert.match(html, /id="music"[^>]*\shidden/);
});
