/** @type {import('next').NextConfig} */
const wpHost = (() => {
  try {
    return new URL(process.env.WP_URL || '').hostname;
  } catch {
    return '';
  }
})();

const nextConfig = {
  reactStrictMode: true,
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

