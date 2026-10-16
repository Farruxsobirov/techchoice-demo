/**
 * Responsive image attributes through Next's built-in optimizer (/_next/image):
 * WordPress uploads are resized to the width the browser needs and served as AVIF/WebP.
 * Plain <img> is kept (instead of next/image) so the existing CSS and animations stay as they are.
 */
const SKIP = /\.(svg|gif)(\?|$)/i;

export function rimg(url, { widths = [640, 1080, 1920], sizes = '100vw', q = 75 } = {}) {
  if (!url) return {};
  // Cloudflare test setup has no image optimizer: serve the original file.
  if (process.env.TC_TARGET === 'cloudflare') return { src: url };
  if (SKIP.test(url) || !(url.startsWith('/') || /^https?:\/\//.test(url))) return { src: url };
  const at = (w) => `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}`;
  return { src: at(widths[widths.length - 1]), srcSet: widths.map((w) => `${at(w)} ${w}w`).join(', '), sizes };
}
