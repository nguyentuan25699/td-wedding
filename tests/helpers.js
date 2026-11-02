// Shared helpers for the test suite. Node built-ins only, no npm packages.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

// Runs a browser script in a sandbox that only has `window`, so its globals can be read back
function loadBrowserScript(relPath, windowStub) {
  const win = windowStub || {};
  const sandbox = { window: win, globalThis: win, console };
  vm.runInNewContext(read(relPath), sandbox, { filename: relPath });
  return win;
}

module.exports = { ROOT, read, loadBrowserScript };
