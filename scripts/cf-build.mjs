// Cloudflare build: takes the "vars" from wrangler.jsonc (WP_URL, TC_TARGET) so pages are
// pre-rendered with real WordPress content at build time, then runs the OpenNext build.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const src = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
  .replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str || '')
  .replace(/,(\s*[}\]])/g, '$1');
const vars = JSON.parse(src).vars || {};
const env = { ...process.env };
for (const [k, v] of Object.entries(vars)) if (env[k] === undefined) env[k] = String(v);

const r = spawnSync('npx', ['opennextjs-cloudflare', 'build', ...process.argv.slice(2)], { stdio: 'inherit', env, shell: process.platform === 'win32' });
process.exit(r.status ?? 1);
