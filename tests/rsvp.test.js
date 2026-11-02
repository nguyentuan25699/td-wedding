// rsvp.js: cleaning and checks of the RSVP form. Pure functions, no DOM.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript, read } = require('./helpers');

const { cleanRsvp, isPhone, firstProblem } = loadBrowserScript('assets/js/rsvp.js').WeddingRsvp;

test('cleanRsvp trims text and caps every field', () => {
  const c = cleanRsvp({ name: '  Anh Nam  ', phone: '0900 000 000 000 000', message: 'x'.repeat(1500) });
  assert.equal(c.name, 'Anh Nam');
  assert.equal(c.phone.length, 15);
  assert.equal(c.message.length, 1000);
});

test('cleanRsvp falls back to safe values for unexpected input', () => {
  const c = cleanRsvp({ attend: 'maybe', count: '99', guestOf: 'other' });
  assert.equal(c.attend, 'yes');
  assert.equal(c.count, 10);
  assert.equal(c.guestOf, 'bride');
  assert.equal(cleanRsvp({ count: '-4' }).count, 1);
});

test('isPhone accepts 9 to 15 digit numbers and rejects letters or short numbers', () => {
  assert.ok(isPhone('0912 345 678'));
  assert.ok(isPhone('+84 912-345-678'));
  assert.ok(!isPhone('12345'));
  assert.ok(!isPhone('09123abc78'));
});

test('firstProblem asks for a name, then a phone number', () => {
  assert.equal(firstProblem(cleanRsvp({ name: '', phone: '0912345678' })), 'rsvpNameRequired');
  assert.equal(firstProblem(cleanRsvp({ name: 'Anh Nam', phone: '12' })), 'rsvpPhoneRequired');
  assert.equal(firstProblem(cleanRsvp({ name: 'Anh Nam', phone: '0912345678' })), null);
});

test('the RSVP endpoint is never hard-coded in the script', () => {
  assert.doesNotMatch(read('assets/js/rsvp.js'), /https?:\/\/script\.google/);
});
