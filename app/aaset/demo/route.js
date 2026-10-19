import { getControlPlusPage } from '../../../lib/controlPlus';

/**
 * The aaSet platform demo, served as its own document so its code is not part of the aaSet page source.
 * Only this site may frame it; search engines are told not to index it.
 */
export async function GET() {
  const { page } = await getControlPlusPage();
  const html = page.demo && page.demo.show ? page.demo.html : '';
  if (!html) return new Response('Not found', { status: 404 });
  const doc = /<html[\s>]/i.test(html) ? html : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">${html}</body></html>`;
  return new Response(doc, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
      'content-security-policy': "frame-ancestors 'self'",
      'x-frame-options': 'SAMEORIGIN',
      'cache-control': 'private, max-age=60',
    },
  });
}
