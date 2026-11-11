// Load test, run by .github/workflows/load-test.yml (not part of the site).
// Realistic guest visits: page + every local asset it references, the 10 album thumbnails,
// the hero, and for ~30% of guests 1 to 3 full-size viewer photos. Guests arrive spread over the stage.
const BASE = process.env.BASE || 'https://tuan-dung-wedding.com';
const GUESTS = Number(process.env.GUESTS || 25);
const SPREAD = Number(process.env.SPREAD || 60); // seconds over which guests arrive
const VIEWER_CHANCE = Number(process.env.VIEWER_CHANCE || 0.3);
const ALBUM = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(3, '0'));

// Browsers open about 6 connections per host, so a guest never has more than 6 requests in flight.
async function pool(items, limit, fn) {
  const out = [];
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (a, b) => a + Math.random() * (b - a);

async function get(path) {
  const res = await fetch(BASE + '/' + path, { cache: 'no-store', signal: AbortSignal.timeout(120000) });
  const body = await res.arrayBuffer();
  return { status: res.status, bytes: body.byteLength };
}

async function visit() {
  const t0 = performance.now();
  const html = await fetch(BASE + '/', { cache: 'no-store', signal: AbortSignal.timeout(30000) });
  const text = await html.text();
  const refs = new Set(['config.js', 'assets/images/web/hero.jpg']);
  for (const m of text.matchAll(/(?:src|href)="((?!https?:|\/\/|#|mailto:)[^"]+)"/g)) refs.add(m[1].split('?')[0]);
  ALBUM.forEach((n) => refs.add(`assets/images/web/album/${n}.jpg`));
  const list = [...refs];
  const results = await pool(list, 6, (p) => get(p).catch((e) => ({
    status: 'ERR:' + (e.name || 'Error') + (e.cause && e.cause.code ? ':' + e.cause.code : ''),
    bytes: 0,
  })));
  let bytes = text.length;
  let failed = results.filter((r) => r.status !== 200).length;
  results.forEach((r) => { if (r.status !== 200) statusCount[r.status] = (statusCount[r.status] || 0) + 1; });
  bytes += results.reduce((a, r) => a + r.bytes, 0);
  const viewerCount = Math.random() < VIEWER_CHANCE ? 1 + Math.floor(Math.random() * 3) : 0;
  for (let i = 0; i < viewerCount; i++) {
    const n = ALBUM[Math.floor(Math.random() * ALBUM.length)];
    const r = await get(`assets/images/web/full/${n}.jpg`).catch((e) => ({ status: 'ERR:' + (e.name || 'Error'), bytes: 0 }));
    if (r.status !== 200) { failed++; statusCount[r.status] = (statusCount[r.status] || 0) + 1; }
    bytes += r.bytes;
    await sleep(pick(800, 2000));
  }
  return { ms: performance.now() - t0, bytes, failed, viewers: viewerCount, assets: list.length };
}

const statusCount = {};
const visits = [];
const started = performance.now();
await Promise.all(Array.from({ length: GUESTS }, async (_, i) => {
  await sleep((i / GUESTS) * SPREAD * 1000);
  try {
    visits.push({ ok: true, ...(await visit()) });
  } catch (e) {
    visits.push({ ok: false, error: (e.name || 'Error') + (e.cause && e.cause.code ? ':' + e.cause.code : ''), ms: 0, bytes: 0 });
  }
}));
const wall = (performance.now() - started) / 1000;
// Raw rows for the summary job, which merges every runner
if (process.env.VISITS_FILE) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync(process.env.VISITS_FILE, JSON.stringify({ visits, statusCount, wallSec: wall }));
}
const ok = visits.filter((v) => v.ok && v.failed === 0);
const lat = visits.map((v) => v.ms).sort((a, b) => a - b);
const pct = (p) => lat[Math.min(lat.length - 1, Math.floor(lat.length * p))].toFixed(0);
const errors = {};
visits.filter((v) => !v.ok).forEach((v) => { errors[v.error] = (errors[v.error] || 0) + 1; });
console.log(JSON.stringify({
  guests: GUESTS, spreadSec: SPREAD, wallSec: +wall.toFixed(1),
  fullyLoaded: ok.length, withFailures: visits.filter((v) => v.ok && v.failed > 0).length, errors,
  visitMs: { p50: pct(0.5), p95: pct(0.95), p99: pct(0.99), max: lat[lat.length - 1].toFixed(0) },
  avgAssetsPerVisit: +(visits.reduce((a, v) => a + (v.assets || 0), 0) / visits.length).toFixed(1),
  viewerOpens: visits.reduce((a, v) => a + (v.viewers || 0), 0),
  badStatuses: statusCount,
  totalMB: +(visits.reduce((a, v) => a + v.bytes, 0) / 1048576).toFixed(0),
  avgMBPerGuest: +(visits.reduce((a, v) => a + v.bytes, 0) / 1048576 / visits.length).toFixed(2),
}));
