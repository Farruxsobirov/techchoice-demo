// Cloudflare build: takes the "vars" from wrangler.jsonc (WP_URL, TC_TARGET) so pages are
// pre-rendered with real WordPress content at build time, then runs the OpenNext build.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const src = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
  .replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str || '')
  .replace(/,(\s*[}\]])/g, '$1');
const vars = JSON.parse(src).vars || {};
const env = { ...process.env };
// wrangler.jsonc is the source of truth (the build machine may still carry old values).
for (const [k, v] of Object.entries(vars)) env[k] = String(v);

// Next.js 15 left the Next.js team's 2-year support window on 2026-10-21 and OpenNext now refuses it
// unless told otherwise. Follow-up: move the site to Next.js 16.
const r = spawnSync('npx', ['opennextjs-cloudflare', 'build', '--dangerouslyUseUnsupportedNextVersion', ...process.argv.slice(2)], { stdio: 'inherit', env, shell: process.platform === 'win32' });
process.exit(r.status ?? 1);
