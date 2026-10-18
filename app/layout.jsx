import Script from 'next/script';
import './globals.css';

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

// Hides animated elements until the interaction script runs; shows everything anyway after 4 s
// if that script fails to load, so content is never stuck invisible.
const earlyJs = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__tcReady)document.documentElement.classList.remove('js')},4000);`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Self-hosted Inter Tight (public/fonts): no third-party, render-blocking stylesheet */}
        <link rel="preload" href="/fonts/inter-tight-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: earlyJs }} />
      </head>
      <body>
        {children}
        <Script src="/site.js" strategy="afterInteractive" />
        {/* Cloudflare Web Analytics (cookie-free visitor stats) — live site only */}
        {process.env.TC_TARGET === 'cloudflare' ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="lazyOnload"
            data-cf-beacon='{"token": "d06f3cc5057246d08c10ab0e180e6d1e"}'
          />
        ) : null}
      </body>
    </html>
  );
}
