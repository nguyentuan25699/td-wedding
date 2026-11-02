// Guest name from ?to=: text only, max 40 characters, falls back to the default name.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript } = require('./helpers');

const { sanitizeGuestName, MAX_CHARS } = loadBrowserScript('assets/js/guest.js').WeddingGuest;
const FALLBACK = 'bạn thân mến';

test('keeps a normal Vietnamese name as it is', () => {
  assert.equal(sanitizeGuestName('Nguyễn Thị Hồng', FALLBACK), 'Nguyễn Thị Hồng');
});

test('trims and collapses repeated spaces', () => {
  assert.equal(sanitizeGuestName('   Anh   Nam  ', FALLBACK), 'Anh Nam');
});

test('removes angle brackets so no HTML can be injected', () => {
  const out = sanitizeGuestName('<img src=x onerror=alert(1)>', FALLBACK);
  assert.ok(!out.includes('<'));
  assert.ok(!out.includes('>'));
});

test('removes control characters', () => {
  assert.equal(sanitizeGuestName('An\u0000h\u0007 Nam\u007F', FALLBACK), 'Anh Nam');
});

test('caps the length at 40 characters', () => {
  const out = sanitizeGuestName('a'.repeat(100), FALLBACK);
  assert.equal(out.length, MAX_CHARS);
  assert.equal(MAX_CHARS, 40);
});

test('counts characters, not UTF-16 units, when capping', () => {
  const out = sanitizeGuestName('😀'.repeat(50), FALLBACK);
  assert.equal(Array.from(out).length, 40);
  assert.equal(out, '😀'.repeat(40));
});

test('returns the fallback for missing, empty or whitespace input', () => {
  assert.equal(sanitizeGuestName(null, FALLBACK), FALLBACK);
  assert.equal(sanitizeGuestName(undefined, FALLBACK), FALLBACK);
  assert.equal(sanitizeGuestName('', FALLBACK), FALLBACK);
  assert.equal(sanitizeGuestName('   ', FALLBACK), FALLBACK);
});

test('returns the fallback when only removed characters are left', () => {
  assert.equal(sanitizeGuestName('<>< >', FALLBACK), FALLBACK);
});

test('returns an empty string when there is no fallback either', () => {
  assert.equal(sanitizeGuestName('', undefined), '');
});
