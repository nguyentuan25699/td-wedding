// album.js: index wrapping for the full-screen viewer. Pure function, no DOM.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserScript } = require('./helpers');

const { wrapIndex } = loadBrowserScript('assets/js/album.js').WeddingAlbum;

test('wrapIndex moves forward and back and wraps at both ends', () => {
  assert.equal(wrapIndex(0, 1, 5), 1);
  assert.equal(wrapIndex(4, 1, 5), 0);
  assert.equal(wrapIndex(0, -1, 5), 4);
  assert.equal(wrapIndex(2, -1, 5), 1);
});
