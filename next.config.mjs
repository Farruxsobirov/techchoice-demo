/** @type {import('next').NextConfig} */
const wpHost = (() => {
  try {
    return new URL(process.env.WP_URL || '').hostname;
  } catch {
    return '';
  }
})();

// Security headers on every page (the security scan asked for these).
// CSP stays practical: Next.js needs inline scripts/styles; pictures, videos and embeds (Spotify, YouTube, Vimeo)
// may come from any https source because editors paste them in WordPress.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src 'self' https:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      // The aaSet demo is the client's own HTML (it may load its own scripts), so it keeps only its own rules.
      { source: '/((?!aaset/demo).*)', headers: [{ key: 'Content-Security-Policy', value: CSP }] },
    ];
  },
  // CONTROL+ was renamed to aaSet: old links keep working.
  async redirects() {
    return [
      { source: '/control-plus', destination: '/aaset', permanent: true },
      { source: '/events', destination: '/gartner', permanent: true },
    ];
  },
  images: {
    unoptimized: process.env.TC_TARGET === 'cloudflare',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudwaysapps.com', pathname: '/wp-content/uploads/**' },
      { protocol: 'https', hostname: 'techchoice.com', pathname: '/wp-content/uploads/**' },
      ...(wpHost ? [{ protocol: 'https', hostname: wpHost, pathname: '/wp-content/uploads/**' }] : []),
    ],
  },
};
export default nextConfig;

