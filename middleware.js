import { NextResponse } from 'next/server';

/**
 * One secure address for visitors and search engines:
 *   http://…            → https://…          (301)
 *   www.techchoice.com  → techchoice.com      (308)
 * Cloudflare tells us the visitor's scheme in cf-visitor / x-forwarded-proto.
 */
function visitorScheme(request) {
  const cf = request.headers.get('cf-visitor');
  if (cf) {
    try {
      const s = JSON.parse(cf).scheme;
      if (s) return s;
    } catch {}
  }
  const xf = (request.headers.get('x-forwarded-proto') || '').split(',')[0].trim();
  if (xf) return xf;
  return new URL(request.url).protocol.replace(':', '');
}

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const insecure = !local && visitorScheme(request) === 'http';
  const www = host.startsWith('www.');
  if (insecure || www) {
    const url = new URL(request.url);
    url.host = www ? host.slice(4) : host;
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, insecure ? 301 : 308);
  }
  return NextResponse.next();
}

// Skip static files so they are served without running the middleware.
export const config = {
  matcher: ['/((?!_next/static|_next/image|fonts/|images/|vendor/|favicon|.*\\.(?:js|css|png|jpg|jpeg|webp|avif|svg|mp4|woff2?)$).*)'],
};
