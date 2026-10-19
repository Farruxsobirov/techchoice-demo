import { fetchSite, fetchPageBySlug, mapSite } from './content';

/**
 * Testimonials page — WordPress page with slug TESTIMONIALS_PAGE_SLUG (default "testimonials"),
 * ACF field group "Testimonials Page".
 * Client quotes are never invented: until approved quotes are entered in WordPress the page shows the
 * bracketed placeholders from the design, clearly marked as pending.
 */

export const TESTIMONIALS_DEFAULTS = {
  title: 'Testimonials',
  hero: {
    breadcrumb: 'TechChoice / Testimonials',
    title: ['Don’t Take Our Word For It. Ask the Technology Leaders Who Stopped Losing Sleep.'],
    lead: 'Here’s what happens when someone finally executes instead of just recommending.',
    tagline: ['The difference is', 'in the follow-through.'],
    foot: 'Independent thinking. Accountable execution.',
  },
  stories: {
    label: 'Client stories',
    title: 'The work. The difference.',
    note: 'Content pending — Approved client quotes, names and company permissions.',
    placeholder: true,
    items: [
      { quote: '[Approved testimonial describing the problem, what changed, and the measurable result.]', name: '[Client name]', role: '[Title]', company: '[Company]', photo: null },
      { quote: '[Approved client testimonial]', name: '[Client name]', role: '[Title]', company: '[Company]', photo: null },
      { quote: '[Approved client testimonial]', name: '[Client name]', role: '[Title]', company: '[Company]', photo: null },
    ],
  },
  cta: {
    label: 'The next move is yours',
    title: ['Ready to Stop Finding Out the Hard Way?'],
    button_label: 'Talk to Us',
    button_url: '/contact',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const decode = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/&#8217;|&rsquo;/g, '’').replace(/&amp;/g, '&').trim();

export function mapTestimonials(page) {
  const D = TESTIMONIALS_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const s = a.stories || {};
  const c = a.cta || {};
  const [btnLabel, btnUrl] = link(c.button, D.cta.button_label, D.cta.button_url);
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;

  const real = Array.isArray(s.items)
    ? s.items
        .filter((r) => r && !isEmpty(r.quote))
        .map((r) => ({ quote: r.quote, name: pick(r.name, ''), role: pick(r.role, ''), company: pick(r.company, ''), photo: media(r.photo) }))
    : [];
  const placeholder = real.length === 0;

  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(h.breadcrumb, D.hero.breadcrumb),
      title: lines(h.title, D.hero.title),
      lead: pick(h.lead, D.hero.lead),
      tagline: lines(h.tagline, D.hero.tagline),
      foot: pick(h.foot, D.hero.foot),
    },
    stories: {
      label: pick(s.label, D.stories.label),
      title: pick(s.title, D.stories.title),
      // Without real quotes the design's "content pending" note is shown; otherwise only what is typed in WordPress.
      note: pick(s.note, placeholder ? D.stories.note : ''),
      placeholder,
      items: placeholder ? D.stories.items : real,
    },
    cta: { label: pick(c.label, D.cta.label), title: lines(c.title, D.cta.title), button_label: btnLabel, button_url: btnUrl },
  };
}

export async function getTestimonialsPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.TESTIMONIALS_PAGE_SLUG || 'testimonials')]);
  return { site: mapSite(site), page: mapTestimonials(page) };
}
