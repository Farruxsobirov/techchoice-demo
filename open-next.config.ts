import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';

/**
 * Production cache on Cloudflare (same behaviour as ISR on Vercel):
 *  - rendered pages are stored in the R2 bucket "techchoice-cache" (+ a regional copy near each visitor),
 *  - pages older than 5 minutes are refreshed in the background (Durable Object queue),
 *  - /api/revalidate (called by WordPress on every save) marks pages stale instantly (Durable Object tag cache).
 * Bindings are declared in wrangler.jsonc.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: 'long-lived' }),
  queue: doQueue,
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
  enableCacheInterception: true,
});
