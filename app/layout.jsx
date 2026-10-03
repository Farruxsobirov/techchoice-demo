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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: earlyJs }} />
      </head>
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" strategy="beforeInteractive" />
        <Script src="/site.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
