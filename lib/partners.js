import { fetchSite, fetchPageBySlug, mapSite } from './content';
import { paras } from './phase';

/**
 * Vendor Partners page — WordPress page with slug PARTNERS_PAGE_SLUG (default "vendor-partners"),
 * ACF field group "Vendor Partners Page". Empty fields fall back to the text below (from Figma).
 */

export const PARTNERS_DEFAULTS = {
  title: 'Vendor Partners',
  hero: {
    breadcrumb: 'TechChoice / Vendor Partners',
    title: ['We Work With Every Vendor Worth Working With. We Answer to None of Them.'],
    lead: 'Here’s exactly why going through us beats going direct.',
    card_label: 'Partners',
    steps: [
      { icon: 'globe', label: 'The supplier marketplace' },
      { icon: 'scale', label: 'Independent evaluation' },
      { icon: 'goal', label: 'Your business comes first' },
    ],
    foot: 'Independent thinking. Accountable execution.',
  },
  how: {
    label: '01 / How we work with vendors',
    title: ['Market-wide reach.', 'Independent', 'advice.'],
    body: paras(
      'We maintain relationships across the entire technology provider landscape, from the household names to the specialists most procurement teams have never heard of and absolutely should have. Vendors compensate us for the business we bring them, which is the entire reason our services cost you nothing. What that arrangement doesn’t do is buy any single vendor a seat at the table over your interests. We negotiate with the leverage of a firm that works across the whole market, not the leverage of one rep trying to close before quarter-end.'
    ),
    image: '/images/partners/partners-wide.jpg',
  },
  why: {
    label: '02 / Why not go direct?',
    title: 'A Vendor Sales Rep’s Job Is to Sell You Their Product. Our Job Is to Tell You If They’re Wrong for You.',
    items: [
      { icon: 'scale', title: 'You get an unbiased comparison.', text: 'Go direct and you get one option, presented as the only option. Go through us and you get the actual field, including the vendors who don’t have a rep charming your team over steak dinners.' },
      { icon: 'file_check', title: 'You get better terms.', text: 'We negotiate across our entire client base, not your single deal, and we already know exactly where the give is in every contract, because we’ve read the fine print vendors hope nobody reads.' },
      { icon: 'contact', title: 'You get one point of contact.', text: 'Instead of juggling five reps from five vendors who all disappear the second the contract’s signed, you get one advisor who already knows what to ask each of them.' },
      { icon: 'lifebuoy', title: 'You get someone who stays after the sale.', text: 'Sign direct and you’re on your own the moment something breaks. Sign through us and Control keeps working the account long after the vendor’s stopped returning your calls.' },
      { icon: 'dollar', title: 'It costs you nothing.', text: 'We mean that literally, not as a marketing line. We’re paid by the vendor ecosystem. The only thing that changes is whether someone’s actually watching your interests instead of theirs.' },
    ],
  },
  categories: {
    label: '03 / Our vendor categories',
    title: ['The right fit.', 'Across every category.'],
    items: [
      { icon: 'network', title: 'Network & Connectivity' },
      { icon: 'video', title: 'Unified Communications & Collaboration (UCaaS)' },
      { icon: 'cloud', title: 'Cloud Infrastructure (IaaS / PaaS)' },
      { icon: 'shield_check', title: 'Cybersecurity' },
      { icon: 'server', title: 'Data Center & Colocation' },
      { icon: 'headset', title: 'Contact Center Solutions (CCaaS)' },
      { icon: 'phone', title: 'Mobility & Wireless' },
      { icon: 'wrench', title: 'Managed IT Services' },
      { icon: 'layers', title: 'Software & SaaS Platforms' },
      { icon: 'laptop', title: 'Hardware Procurement' },
    ],
    button_label: 'See If We Already Work With Your Vendor',
    button_url: '/contact',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const rows = (v, keep, map, fallback) => {
  const list = Array.isArray(v) ? v.filter((r) => r && keep(r)).map(map) : [];
  return list.length ? list : fallback;
};
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&amp;/g, '&')
    .trim();

export function mapPartners(page) {
  const D = PARTNERS_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const hw = a.how || {};
  const w = a.why || {};
  const c = a.categories || {};
  const [btnLabel, btnUrl] = link(c.button, D.categories.button_label, D.categories.button_url);
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;
  const withIcon = (r, def) => ({ icon: r.icon || def, custom_icon: media(r.custom_icon) });

  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(h.breadcrumb, D.hero.breadcrumb),
      title: lines(h.title, D.hero.title),
      lead: pick(h.lead, D.hero.lead),
      card_label: pick(h.card_label, D.hero.card_label),
      steps: rows(h.steps, (r) => !isEmpty(r.label), (r) => ({ ...withIcon(r, 'globe'), label: r.label }), D.hero.steps.map((s) => ({ ...s, custom_icon: null }))),
      foot: pick(h.foot, D.hero.foot),
    },
    how: {
      label: pick(hw.label, D.how.label),
      title: lines(hw.title, D.how.title),
      body: pick(hw.body, D.how.body),
      image: media(hw.image) || { url: D.how.image, alt: '' },
    },
    why: {
      label: pick(w.label, D.why.label),
      title: pick(w.title, D.why.title),
      items: rows(w.items, (r) => !isEmpty(r.title), (r) => ({ ...withIcon(r, 'scale'), title: r.title, text: pick(r.text, '') }), D.why.items.map((s) => ({ ...s, custom_icon: null }))),
    },
    categories: {
      label: pick(c.label, D.categories.label),
      title: lines(c.title, D.categories.title),
      items: rows(c.items, (r) => !isEmpty(r.title), (r) => ({ ...withIcon(r, 'network'), title: r.title }), D.categories.items.map((s) => ({ ...s, custom_icon: null }))),
      button_label: btnLabel,
      button_url: btnUrl,
    },
  };
}

export async function getPartnersPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.PARTNERS_PAGE_SLUG || 'vendor-partners')]);
  return { site: mapSite(site), page: mapPartners(page) };
}
