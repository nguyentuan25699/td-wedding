// style.css: tokens only in :root, allowed transitions, no unsafe rules (CLAUDE.md guardrails).
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { read } = require('./helpers');

const raw = read('assets/css/style.css');
const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');
const rootBlock = css.match(/:root\s*\{[^}]*\}/);
const rest = css.replace(rootBlock[0], '');

test(':root defines the repo palette (user choice, 2026-11-02)', () => {
  const expected = {
    '--page': '#EDE5D8',
    '--paper': '#FCFAF6',
    '--shade': '#F2EBDF',
    '--burgundy': '#6B1D2A',
    '--gold': '#B39869',
    '--ink': '#2F2522',
    '--ink-soft': '#66574F',
  };
  for (const [name, hex] of Object.entries(expected)) {
    assert.match(rootBlock[0], new RegExp(`${name}:\\s*${hex}`, 'i'), name);
  }
});

test('no raw hex colours outside :root', () => {
  assert.doesNotMatch(rest, /#[0-9a-fA-F]{3,8}\b/);
});

test('every var(--token) used is defined in :root', () => {
  const defined = new Set([...rootBlock[0].matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  // Set per element by the scripts, so they are not defined in :root:
  // --i by main.js (prepDraw); --x, --dx, --d, --t, --s, --p, --amp, --turn by flora.js (mountPetalFall)
  const setByScript = new Set(['--i', '--x', '--dx', '--d', '--t', '--s', '--p', '--amp', '--turn']);
  const used = [...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]);
  assert.ok(used.length > 0);
  for (const token of new Set(used)) {
    assert.ok(defined.has(token) || setByScript.has(token), `undefined token: ${token}`);
  }
});

test('no !important (CLAUDE.md: never)', () => {
  assert.doesNotMatch(css, /!important/);
});

test('no 100vh; use dvh instead (CLAUDE.md)', () => {
  assert.doesNotMatch(css, /100vh/);
});

test('only transform and opacity (or stroke-dashoffset) are transitioned', () => {
  const transitions = [...css.matchAll(/(?<![-\w])transition:\s*([^;]+);/g)].map((m) => m[1]);
  assert.ok(transitions.length > 0);
  const allowed = new Set(['transform', 'opacity', 'stroke-dashoffset', 'none']);
  for (const value of transitions) {
    for (const part of value.split(',')) {
      const prop = part.trim().split(/\s+/)[0];
      assert.ok(allowed.has(prop), `transition of ${prop} is not in the motion spec: ${value}`);
    }
  }
});

test('only the approved loops are infinite: breathe, pulse, and the falling petals (fall and sway)', () => {
  const infinite = [...css.matchAll(/animation:[^;]*infinite[^;]*;/g)].map((m) => m[0]);
  assert.equal(infinite.length, 4);
  for (const name of ['breathe', 'pulse', 'petal-fall', 'petal-sway']) {
    assert.ok(infinite.some((r) => r.includes(name)), `missing loop: ${name}`);
  }
});

test('every keyframes name used is defined', () => {
  const defined = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
  const used = [...css.matchAll(/animation:\s*([\w-]+)\s/g)].map((m) => m[1]);
  for (const name of used) {
    assert.ok(defined.has(name), `keyframes not defined: ${name}`);
  }
});

test('reduced-motion block exists', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('uses the chosen font stacks (repo set, decided 2026-11-02)', () => {
  assert.match(rootBlock[0], /--font-script:\s*'Great Vibes'/);
  assert.match(rootBlock[0], /--font-display:\s*'Cormorant Garamond'/);
  assert.match(rootBlock[0], /--font-body:\s*'Be Vietnam Pro'/);
  assert.match(rootBlock[0], /--font-mark:\s*'Noto Serif TC'/);
});
