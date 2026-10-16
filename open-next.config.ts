import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Test setup: no R2 / D1 needed. Pages render on each request (TC_TARGET=cloudflare), so there is no
// incremental cache to keep in sync with WordPress. For production on Cloudflare, add the R2 incremental
// cache + DO queue + D1 tag cache described at https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({});
