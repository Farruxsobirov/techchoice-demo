import { getControlPlusPage } from '../../../lib/controlPlus';

/**
 * The aaSet platform demo, served as its own document so its code is not part of the aaSet page source.
 * Only this site may frame it; search engines are told not to index it.
 */
export async function GET() {
  const { page } = await getControlPlusPage();
  const html = page.demo && page.demo.show ? page.demo.html : '';
  if (!html) return new Response('Not found', { status: 404 });
  const head = '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>aaSet — live demo · TechChoice</title>';
  const wrap = (body) => `<!doctype html><html style="background:#0a0a0c"><head>${head}</head><body style="margin:0;background:#0a0a0c;color:#fff">${body}</body></html>`;
  // The usual case: the field holds an <iframe> pointing at the demo file (with a sized wrapper around it).
  // As its own page the demo then fills the whole window — the wrapper's width/height limits are dropped.
  const frame = !/<html[\s>]/i.test(html) && html.match(/<iframe\b[^>]*>/i);
  let doc;
  if (frame) {
    const tag = frame[0]
      .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/i, '')
      .replace(/\sloading\s*=\s*("[^"]*"|'[^']*'|\S+)/i, '')
      .replace(/<iframe\b/i, '<iframe style="position:fixed;inset:0;width:100%;height:100%;border:0;display:block;background:#0a0a0c"');
    doc = wrap(`${tag}</iframe>`);
  } else {
    doc = /<html[\s>]/i.test(html) ? html : wrap(html);
  }
  // Opened as its own page (not inside the aaSet frame): a small "Back to aaSet" link in the corner.
  const back =
    '<a href="/aaset" id="tc-demo-back" style="position:fixed;right:20px;bottom:20px;z-index:2147483647;display:inline-flex;align-items:center;height:46px;padding:0 24px;border-radius:999px;background:#fff;color:#0a0a0a;font:600 14px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.01em;text-decoration:none;border:1px solid rgba(0,0,0,.08);box-shadow:0 0 0 4px rgba(236,1,160,.35),0 12px 32px rgba(0,0,0,.45);transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">Back to aaSet</a>' +
    '<script>if(window.top!==window.self){var b=document.getElementById("tc-demo-back");if(b)b.remove()}</script>';
  doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${back}</body>`) : doc + back;
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
