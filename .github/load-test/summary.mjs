// Merges the visit rows of every runner into one table for the workflow summary.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const files = readdirSync(dir, { recursive: true }).filter((f) => String(f).endsWith('.json'));
const runs = files.map((f) => JSON.parse(readFileSync(join(dir, String(f)), 'utf8')));
const visits = runs.flatMap((r) => r.visits);
const statuses = {};
runs.forEach((r) => Object.entries(r.statusCount).forEach(([k, n]) => { statuses[k] = (statuses[k] || 0) + n; }));
const done = visits.filter((v) => v.ok);
const ms = done.map((v) => v.ms).sort((a, b) => a - b);
const pct = (p) => (ms.length ? (ms[Math.min(ms.length - 1, Math.floor(ms.length * p))] / 1000).toFixed(1) + ' s' : 'n/a');
const mb = visits.reduce((a, v) => a + v.bytes, 0) / 1048576;

console.log([
  '## Load test',
  '',
  '| | |',
  '|---|---|',
  `| Runners | ${runs.length} |`,
  `| Guests | ${visits.length} |`,
  `| Loaded everything | ${done.filter((v) => v.failed === 0).length} |`,
  `| Loaded with a failed file | ${done.filter((v) => v.failed > 0).length} |`,
  `| Could not open the page | ${visits.length - done.length} |`,
  `| Full visit time p50 / p95 / p99 / max | ${pct(0.5)} / ${pct(0.95)} / ${pct(0.99)} / ${pct(1)} |`,
  `| Data | ${mb.toFixed(0)} MB (${(mb / Math.max(1, visits.length)).toFixed(2)} MB per guest) |`,
  `| Longest runner | ${Math.max(...runs.map((r) => r.wallSec)).toFixed(0)} s |`,
  `| Failed responses | ${Object.keys(statuses).length ? JSON.stringify(statuses) : 'none'} |`,
].join('\n'));
