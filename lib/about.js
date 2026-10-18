import { fetchSite, fetchPageBySlug, mapSite } from './content';
import { paras } from './phase';

/**
 * About Us page — WordPress page with slug ABOUT_PAGE_SLUG (default "about-us"),
 * ACF field group "About Us Page". Empty fields fall back to the text below (from Figma).
 */

export const ABOUT_DEFAULTS = {
  title: 'About Us',
  hero: {
    breadcrumb: 'TechChoice / About Us',
    title: ['We Started TechChoice Because the Industry Had a Conflict of Interest Problem Nobody Wanted to Admit'],
    lead: 'Founded 2014. Still vendor-agnostic. Still not interested in your vendor’s spiff.',
    year: '2014',
    tagline: ['Boston-born.', 'Independently owned.'],
    motto: ['Honest advice.', 'Real follow-through.'],
    foot: 'Independent thinking. Accountable execution.',
  },
  story: {
    label: '01 / Our story',
    title: ['Honest advice.', 'Real follow-through.'],
    body: paras(
      'TechChoice was built to close a gap the rest of this industry pretends doesn’t exist. Most advisors are good for one of two things: a strategy deck that never gets executed, or a vendor recommendation that conveniently favors whoever’s paying the biggest commission. We do neither. Since 2014, we’ve built our business around owning the entire arc, from the first honest assessment through vendor selection through the implementation itself, so a technology leader isn’t stuck translating someone else’s slide deck into reality alone, chasing five different vendors to hit one deadline. Being genuinely independent and vendor-agnostic matters, and we are. But independence alone doesn’t get a project delivered on time. What actually sets us apart is that the same team that builds the strategy also runs the execution, start to finish, with one throat to choke if something slips. Honest advice plus real follow-through: that’s the combination the rest of this industry still hasn’t figured out how to offer.'
    ),
  },
  believe: {
    label: '02 / What we believe',
    title: ['Vendors Are', 'Interchangeable.', 'Your Operational', 'Success Is Not.'],
    body: paras(
      'That line runs through every decision we make. We don’t get attached to a vendor’s roadmap. We get attached to yours, and we hold everyone, including ourselves, to the deadline.'
    ),
  },
  boston: {
    label: 'Boston-born. Independently owned.',
    image: '/images/about/about-boston-street.jpg',
    title: 'Boston, Massachusetts',
    text: 'TechChoice is headquartered in the south end of Boston, where we’ve built our team, our process, and a reputation for saying the thing everyone else in this industry is too polite to say.',
    address: '500 Harrison Avenue, Suite 3R, Boston, MA 02118',
    note: 'Boston brand illustration · Office photograph to be supplied',
    button_label: 'Meet the Team',
    button_url: '/team',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const fileUrl = (v) => (v && typeof v === 'object' && v.url ? v.url : typeof v === 'string' && /\.(mp4|webm)(\?|$)/i.test(v) ? v : '');
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&amp;/g, '&')
    .trim();

export function mapAbout(page) {
  const D = ABOUT_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const s = a.story || {};
  const b = a.believe || {};
  const bo = a.boston || {};
  const [btnLabel, btnUrl] = link(bo.button, D.boston.button_label, D.boston.button_url);
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;
  const hasBoston = Object.keys(bo).length > 0;

  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(h.breadcrumb, D.hero.breadcrumb),
      title: lines(h.title, D.hero.title),
      lead: pick(h.lead, D.hero.lead),
      year: pick(h.year, D.hero.year),
      tagline: lines(h.tagline, D.hero.tagline),
      motto: lines(h.motto, D.hero.motto),
      foot: pick(h.foot, D.hero.foot),
    },
    story: { label: pick(s.label, D.story.label), title: lines(s.title, D.story.title), body: pick(s.body, D.story.body) },
    believe: { label: pick(b.label, D.believe.label), title: lines(b.title, D.believe.title), body: pick(b.body, D.believe.body) },
    boston: {
      label: pick(bo.label, D.boston.label),
      image: media(bo.image) || { url: D.boston.image, alt: '' },
      video: fileUrl(bo.video),
      title: pick(bo.title, D.boston.title),
      text: pick(bo.text, D.boston.text),
      address: pick(bo.address, D.boston.address),
      // The grey note is a placeholder from the design: it only shows until the WordPress fields exist.
      note: pick(bo.note, hasBoston ? '' : D.boston.note),
      button_label: btnLabel,
      button_url: btnUrl,
    },
  };
}

export async function getAboutPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.ABOUT_PAGE_SLUG || 'about-us')]);
  return { site: mapSite(site), page: mapAbout(page) };
}
