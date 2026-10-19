import { fetchSite, fetchPageBySlug, mapSite } from './content';

/**
 * Contact page — WordPress page with slug CONTACT_PAGE_SLUG (default "contact"), ACF group "Contact Page".
 * The form is a Contact Form 7 form: its shortcode goes into the page content (Shortcode block);
 * the site shows the form in its own design and sends it through /api/contact → Contact Form 7.
 */

export const CONTACT_DEFAULTS = {
  title: 'Contact',
  hero: {
    breadcrumb: 'TechChoice / Contact',
    title: ['Let’s talk.'],
    lead: 'Tell us what’s eating your calendar. A real person on our team reads every message and gets back to you within one business day.',
    foot: 'Independent thinking. Accountable execution.',
  },
  details: {
    label: 'Get in touch',
    title: 'Talk to the people who’ll actually do the work.',
    email: 'contact@techchoice.com',
    phone: '',
    hours: '',
  },
  form: {
    label: 'Send us a message',
    title: '',
    fallback: 'The form is being set up. In the meantime, email us and we’ll reply within one business day.',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const fileUrl = (v) => (v && typeof v === 'object' && v.url ? v.url : typeof v === 'string' && /\.(mp4|webm)(\?|$)/i.test(v) ? v : '');
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .trim();

/** The Contact Form 7 block (<div class="wpcf7">…</form></div>) out of the rendered page content. */
export function extractCf7(html) {
  const s = String(html || '');
  const start = s.search(/<div[^>]+class="[^"]*\bwpcf7\b/);
  if (start < 0) return '';
  const formEnd = s.indexOf('</form>', start);
  if (formEnd < 0) return '';
  const divEnd = s.indexOf('</div>', formEnd);
  return s.slice(start, divEnd < 0 ? formEnd + 7 : divEnd + 6);
}

export function mapContact(page, site) {
  const D = CONTACT_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const d = a.details || {};
  const f = a.form || {};
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;
  const formHtml = extractCf7(page && page.content && page.content.rendered);
  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(h.breadcrumb, D.hero.breadcrumb),
      title: lines(h.title, D.hero.title),
      lead: pick(h.lead, D.hero.lead),
      image: media(h.image),
      video: fileUrl(h.video),
      foot: pick(h.foot, D.hero.foot),
    },
    details: {
      label: pick(d.label, D.details.label),
      title: pick(d.title, D.details.title),
      email: pick(d.email, D.details.email),
      phone: pick(d.phone, D.details.phone),
      address: lines(d.address, (site && site.footer && site.footer.address) || []),
      hours: pick(d.hours, D.details.hours),
    },
    form: {
      label: pick(f.label, D.form.label),
      title: pick(f.title, D.form.title),
      html: formHtml,
      fallback: pick(f.fallback, D.form.fallback),
    },
  };
}

export async function getContactPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.CONTACT_PAGE_SLUG || 'contact', { content: true, allowMissing: true })]);
  const s = mapSite(site);
  return { site: s, page: mapContact(page, s) };
}
