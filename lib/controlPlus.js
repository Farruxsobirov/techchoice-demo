import { fetchSite, fetchPageBySlug, mapSite } from './content';
import { paras } from './phase';

/**
 * aaSet page (formerly CONTROL+) at /aaset — WordPress page with slug CONTROL_PLUS_PAGE_SLUG (default "aaset", old "control-plus" also works),
 * ACF field group "Control+ Page". Empty fields fall back to the text below (from Figma).
 */

export const CONTROL_PLUS_DEFAULTS = {
  title: 'aaSet',
  hero: {
    breadcrumb: 'TechChoice / aaSet',
    title: ['aaSet: The Platform That Makes Sure Nothing Slides Past You Again'],
    lead: 'Total visibility into your tech spend, built by TechChoice, backed by TechChoice, accountable to you.',
    panel_title: 'aaSet',
    modules: [
      { icon: 'boxes', title: 'Service inventory', tags: 'Network · Cloud · Mobility · Software' },
      { icon: 'pie', title: 'Spend visibility', tags: 'Invoices · Budgets · Cost allocation' },
      { icon: 'calendar_range', title: 'Contract oversight', tags: 'Renewals · SLAs · Disputes' },
    ],
    flow: [
      { icon: 'file_in', label: 'Ingest' },
      { icon: 'scan', label: 'Audit' },
      { icon: 'badge', label: 'Resolve' },
      { icon: 'sliders', label: 'Optimize' },
    ],
    panel_note: 'Platform concept / Features shown for design direction; not a live product screenshot.',
    foot: 'Independent thinking. Accountable execution.',
  },
  intro: {
    label: '01 / What is aaSet?',
    title: ['One clean view', 'of the truth.'],
    body: paras(
      'aaSet is the engine behind Control. It’s a single, centralized platform that gives your IT, procurement, and finance teams total visibility into every service, every invoice, and every dollar across telecom, mobility, cloud, and software. No more logging into five different vendor portals to piece together what you’re actually paying for. No more discovering a canceled service still on the books eighteen months later. Just one clean view of the truth, audited and maintained by a team that’s actually incentivized to find you money, not hide it.'
    ),
  },
  capabilities: {
    label: '02 / Platform capabilities',
    title: 'One Platform. Nowhere for Anything to Hide.',
    items: [
      { icon: 'file_in', title: 'Invoice Auditing & Ingestion', text: 'Every invoice, every vendor, reconciled and audited line by line. If something’s wrong, we find it before it becomes a habit.' },
      { icon: 'boxes', title: 'Inventory & Lifecycle Management', text: 'A real-time, searchable inventory of every circuit, line, and device you actually have, including the ones your team forgot existed.' },
      { icon: 'macd', title: 'MACD Processing', text: 'Moves, adds, changes, and disconnects tracked and enforced through the platform instead of vanishing into a vendor’s ticket queue for eight weeks.' },
      { icon: 'messages', title: 'Dispute Management', text: 'Overcharges get filed, tracked, and resolved. They don’t quietly die in an inbox because nobody had the bandwidth to follow up.' },
      { icon: 'pie', title: 'Budget & Spend Visualization', text: 'Store-by-store or department-by-department breakdowns of projected versus actual spend, so budget surprises stop being a quarterly tradition.' },
      { icon: 'pin', title: 'Serviceability & Market Analysis', text: 'Real data on what’s available at every one of your locations, so expansion decisions are based on facts instead of a sales rep’s optimism.' },
      { icon: 'trend', title: 'Five-Year ROI Projection', text: 'Long-range visibility into what your technology is actually returning, not just what it’s costing you this month.' },
      { icon: 'workflow', title: 'Integrated Project Management', text: 'Every active implementation, visible in one dashboard, instead of scattered across a dozen inboxes.' },
    ],
  },
  why: {
    label: '03 / Why aaSet, why TechChoice',
    title: ['The software does', 'the heavy lifting.', 'We follow through.'],
    body: paras(
      'Plenty of platforms exist to generate a report nobody opens. aaSet is different because there’s a team behind it actually reading the data every month, looking for the overcharge, the forgotten auto-renewal, and the service sitting unused since your last reorg. The software does the heavy lifting. We do the follow-through. That combination is the entire reason Control actually works instead of just looking good in a sales deck.'
    ),
  },
  guarantee: {
    label: 'Performance guarantee',
    title: 'We Put Our Money Where Our Platform Is',
    body: 'TechChoice stands behind aaSet with a performance guarantee on the savings we identify. If we say it’s there, we find it, or we make it right.',
    note: 'DRAFT — Exact guarantee terms and percentage to be confirmed.',
  },
  pricing: {
    label: 'Access & investment',
    title: 'What It Costs You',
    lead: 'Pricing scales down as your footprint scales up, based on the monthly recurring revenue of the services running through aaSet:',
    tiers: [
      { label: 'Up to $100K MRR', value: '5%', caption: 'of services MRR', highlight: false },
      { label: 'Up to $250K MRR', value: '4%', caption: 'of services MRR', highlight: false },
      { label: 'Up to $500K MRR', value: '3%', caption: 'of services MRR', highlight: false },
      { label: 'Up to $1M MRR', value: '2%', caption: 'of services MRR', highlight: false },
      { label: '$1M+ MRR', value: 'No cost', caption: 'of services MRR', highlight: true },
    ],
    note: 'The bigger your environment gets, the less you pay to keep it accountable, and past a certain point, you don’t pay at all. That’s not a typo. It’s what happens when your advisor’s incentive is to keep you growing with them instead of nickel-and-diming you on the way there.',
  },
  cta: {
    label: 'The next move is yours',
    title: ['See What’s Been Hiding in Your Tech Spend'],
    text: 'Most technology leaders are surprised by the first aaSet audit. Their vendors are a lot less thrilled about it.',
    button_label: 'Request an aaSet Walkthrough',
    button_url: '/#contact',
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
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .trim();

export function mapControlPlus(page) {
  const D = CONTROL_PLUS_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const it = a.intro || {};
  const cap = a.capabilities || {};
  const w = a.why || {};
  const g = a.guarantee || {};
  const pr = a.pricing || {};
  const c = a.cta || {};
  const [btnLabel, btnUrl] = link(c.button, D.cta.button_label, D.cta.button_url);
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;

  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(h.breadcrumb, D.hero.breadcrumb),
      title: lines(h.title, D.hero.title),
      lead: pick(h.lead, D.hero.lead),
      panel_title: pick(h.panel_title, D.hero.panel_title),
      modules: rows(h.modules, (r) => !isEmpty(r.title), (r) => ({ icon: r.icon || 'boxes', custom_icon: media(r.custom_icon), title: r.title, tags: pick(r.tags, '') }), D.hero.modules.map((m) => ({ ...m, custom_icon: null }))),
      flow: rows(h.flow, (r) => !isEmpty(r.label), (r) => ({ icon: r.icon || 'scan', custom_icon: media(r.custom_icon), label: r.label }), D.hero.flow.map((m) => ({ ...m, custom_icon: null }))),
      panel_note: pick(h.panel_note, D.hero.panel_note),
      foot: pick(h.foot, D.hero.foot),
    },
    intro: { label: pick(it.label, D.intro.label), title: lines(it.title, D.intro.title), body: pick(it.body, D.intro.body) },
    capabilities: {
      label: pick(cap.label, D.capabilities.label),
      title: pick(cap.title, D.capabilities.title),
      items: rows(cap.items, (r) => !isEmpty(r.title), (r) => ({ icon: r.icon || 'scan', custom_icon: media(r.custom_icon), title: r.title, text: pick(r.text, '') }), D.capabilities.items.map((m) => ({ ...m, custom_icon: null }))),
    },
    why: { label: pick(w.label, D.why.label), title: lines(w.title, D.why.title), body: pick(w.body, D.why.body) },
    // Once the section exists in WordPress, an emptied field stays empty (no built-in text comes back).
    guarantee: (() => {
      const wp = Object.keys(g).length > 0;
      const val = (v, f) => (wp ? (isEmpty(v) ? '' : v) : f);
      const out = { label: val(g.label, D.guarantee.label), title: val(g.title, D.guarantee.title), body: val(g.body, D.guarantee.body), note: val(g.note, D.guarantee.note) };
      out.show = !(g.show === false || g.show === 0 || g.show === '0') && !!(out.title || out.body);
      return out;
    })(),
    pricing: (() => {
      const wp = Object.keys(pr).length > 0;
      const val = (v, f) => (wp ? (isEmpty(v) ? '' : v) : f);
      const tiers = Array.isArray(pr.tiers)
        ? pr.tiers.filter((r) => r && !isEmpty(r.value)).map((r) => ({ label: pick(r.label, ''), value: r.value, caption: pick(r.caption, ''), highlight: !!r.highlight }))
        : wp
          ? []
          : D.pricing.tiers;
      return {
        // "Show this section" switch in WordPress; missing (fields not imported yet) = visible.
        show: pr.show === undefined || pr.show === null ? true : !!pr.show && pr.show !== '0',
        label: val(pr.label, D.pricing.label),
        title: val(pr.title, D.pricing.title),
        lead: val(pr.lead, D.pricing.lead),
        image: media(pr.image),
        tiers,
        note: val(pr.note, D.pricing.note),
      };
    })(),
    cta: { label: pick(c.label, D.cta.label), title: lines(c.title, D.cta.title), text: pick(c.text, D.cta.text), button_label: btnLabel, button_url: btnUrl },
  };
}

export async function getControlPlusPage() {
  // New slug "aaset"; the old "control-plus" is still accepted until the page is renamed in WordPress.
  const slugs = [process.env.CONTROL_PLUS_PAGE_SLUG || 'aaset', 'control-plus'];
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(slugs)]);
  return { site: mapSite(site), page: mapControlPlus(page) };
}
