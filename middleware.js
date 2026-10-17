import { NextResponse } from 'next/server';

/** www.techchoice.com → techchoice.com (one address for visitors and search engines). */
export function middleware(request) {
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = new URL(request.url);
    url.host = host.slice(4);
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

// Skip static files so they are served without running the middleware.
export const config = {
  matcher: ['/((?!_next/static|_next/image|fonts/|images/|vendor/|favicon|.*\\.(?:js|css|png|jpg|jpeg|webp|avif|svg|mp4|woff2?)$).*)'],
};
