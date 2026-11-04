// flora.js: seeded branch generator. Repeatable, bounded, grows from the root in order, asymmetric.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript } = require('./helpers');

const { buildBranch, fallingPetals, maiShapes, MAI_TOP, fallingBloomShapes } = loadBrowserScript('assets/js/flora.js').WeddingFlora;
const LEFT = { root: [14, 150], dir: 'up', lean: 1 };
const RIGHT = { root: [150, 152], dir: 'up', lean: -1 };

function numbers(shape) {
  if (shape.attrs.d) return shape.attrs.d.match(/-?\d+(\.\d+)?/g).map(Number);
  return [shape.attrs.cx, shape.attrs.cy].map(Number);
}

test('the same seed gives the same drawing', () => {
  assert.deepEqual(buildBranch(11, LEFT), buildBranch(11, LEFT));
});

test('different seeds give different drawings', () => {
  assert.notDeepEqual(buildBranch(11, LEFT), buildBranch(27, LEFT));
});

test('left and right florals are not mirror copies', () => {
  const a = buildBranch(11, LEFT).map((s) => JSON.stringify(s.attrs));
  const b = buildBranch(27, RIGHT).map((s) => JSON.stringify(s.attrs));
  assert.notDeepEqual(a, b);
});

test('every shape is a line or a petal, so the draw-on CSS applies', () => {
  for (const s of buildBranch(11, LEFT)) {
    assert.ok(s.cls.split(' ').includes('ln'), `missing ln class: ${s.cls}`);
    assert.ok(['path', 'circle', 'ellipse'].includes(s.tag));
  }
});

test('the stem comes first, and the blossoms come last (root outward)', () => {
  const shapes = buildBranch(11, LEFT);
  assert.equal(shapes[0].tag, 'path');
  const firstPetal = shapes.findIndex((s) => s.cls.includes('petal'));
  assert.ok(firstPetal > 0, 'blossoms exist');
  assert.ok(shapes.slice(firstPetal).every((s) => s.cls.includes('petal')), 'nothing but petals after the first blossom');
});

test('every blossom is five petals and a centre dot (six shapes)', () => {
  const petals = buildBranch(11, LEFT).filter((s) => s.cls.includes('petal'));
  assert.ok(petals.length > 0);
  assert.equal(petals.length % 6, 0);
});

test('all coordinates stay inside the 160 viewBox', () => {
  for (const seed of [5, 11, 19, 27, 41, 63]) {
    for (const s of buildBranch(seed, LEFT)) {
      for (const n of numbers(s)) {
        assert.ok(n >= 0 && n <= 160, `coordinate out of view: ${n} (seed ${seed})`);
      }
    }
  }
});

test('the root is where the drawing starts', () => {
  const first = buildBranch(11, LEFT)[0];
  assert.match(first.attrs.d, /^M14\.0 150\.0/);
});

test('falling petals: the count is as asked, and each one stays in its range', () => {
  const petals = fallingPetals(21, 7);
  assert.equal(petals.length, 7);
  for (const p of petals) {
    assert.ok(p.left >= 0 && p.left <= 100, 'left in the cover');
    assert.ok(p.delay <= 0 && -p.delay <= p.duration, 'starts part-way down the fall, spread over the whole fall');
    assert.ok(p.duration >= 28000 && p.duration <= 36000, 'a very slow fall, about 28 to 36 seconds');
    assert.ok(p.size >= 12 && p.size <= 20, 'petal size');
    assert.ok(p.period >= 4000 && p.period <= 6000, 'a gentle sway period, 4 to 6 seconds');
    assert.ok(p.amp >= 24 && p.amp <= 58, 'sway amplitude');
  }
  assert.ok(new Set(petals.map((p) => p.period)).size > 1, 'petals do not all sway the same way');
});

test('falling petals are repeatable from the seed', () => {
  assert.deepEqual(fallingPetals(21, 7), fallingPetals(21, 7));
});

test('the two top corners are different branches, not copies', () => {
  const left = MAI_TOP['top-left'];
  const right = MAI_TOP['top-right'];
  assert.notEqual(left.branches.length, right.branches.length);
  assert.notEqual(left.box, right.box);
  assert.notDeepEqual(maiShapes(left.branches, left.blossoms), maiShapes(right.branches, right.blossoms));
});

test('a falling blossom is five petal outlines and a centre, so it reads as a flower', () => {
  const shapes = fallingBloomShapes();
  assert.equal(shapes.filter((s) => s.tag === 'path').length, 5);
  assert.equal(shapes.filter((s) => s.tag === 'circle').length, 1);
});
