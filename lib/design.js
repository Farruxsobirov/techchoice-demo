import { fetchSite, fetchPageBySlug, mapSite } from './content';

/**
 * Design page.
 * WordPress: Pages → the page with slug DESIGN_PAGE_SLUG (default "design"),
 * ACF field group "Design Page" with groups hero / problem / included / value.
 * Empty fields fall back to the text below (from the Figma design).
 */

const p = (...paras) => paras.map((t) => `<p>${t}</p>`).join('');

export const DESIGN_DEFAULTS = {
  title: 'Design',
  hero: {
    breadcrumb: 'TechChoice / Design',
    title: ['Design: Where the Thinking Happens, Before You’re Locked Into Anything'],
    lead: 'Strategy, vendor selection, and contracts that don’t turn into a hostage situation.',
    image: '/images/design/design-hero.jpg',
    foot: 'Independent thinking. Accountable execution.',
  },
  problem: {
    label: '01 / The problem we solve',
    title: ['Replace guesswork', 'with process.'],
    body: p(
      'Tech decision-making used to be simple: you had a short list of known vendors, and you revisited it every so often. That’s gone. Now the list has to get rebuilt practically every week, because it’s not just existing vendors evolving anymore, entire categories are getting invented overnight, and a new market leader can emerge from an idea that didn’t exist last quarter. Somewhere out there is a supplier doing exactly what you need. You don’t know they exist. They don’t know you exist. That’s not a strategy gap, that’s a coin flip. And it gets worse: a process that worked fine last year can be obsolete by Tuesday, and a budget you locked in six months ago can balloon overnight because a vendor got acquired and decided your contract was a suggestion (Broadcom, anyone?). If that scenario sounds oddly specific, it’s because you’ve probably lived it.',
      'Design solves this by replacing guesswork with process. We start with a competitive analysis and an honest as-built assessment of where you stand today, then map the real, feasible path to where you want to be, built against everything actually available in the market right now, not just what a few reps happened to pitch you. Because of where we sit in this industry, we can research hundreds of suppliers against your specific requirements fast, cross-referenced against proprietary satisfaction scores, real project plans, go-to-market data, and backlog visibility most companies never get to see. The result: you walk into the market with a solution already in hand, instead of letting the market decide one for you.'
    ),
  },
  included: {
    label: '02 / What’s included',
    title: 'Here’s What Design Actually Looks Like',
    items: [
      { icon: 'scan', title: 'Current State Assessment', text: 'A full, honest audit of what you’re running today, including the things nobody remembers approving and definitely nobody’s used since 2023.' },
      { icon: 'chart', title: 'Market Analysis', text: 'A real-time read on what’s available across the marketplace right now, not a list of whoever happened to email your team last quarter. We benchmark options, pricing, and capability so you know where you stand before a single vendor conversation happens.' },
      { icon: 'users', title: 'Stakeholder Discovery', text: 'We talk to the people who actually touch the technology, not just the ones who signed off on the budget line.' },
      { icon: 'plug', title: 'Gap Analysis', text: 'Where your technology is failing, mapped against real business objectives instead of vendor talking points.' },
      { icon: 'compass', title: 'Solution Design', text: 'We architect exactly what the end state should look like, including how it fits with the systems, workflows, and staff you already have, before we ever bring a vendor into the conversation.' },
      { icon: 'filter', title: 'Strategic Sourcing', text: 'We run the RFP, evaluate the entire market, and hand you a shortlist that’s actually worth your time, not a pre-decided outcome dressed up as a competitive process.' },
      { icon: 'contract', title: 'Contract Management', text: 'We know exactly where vendors hide the bad clauses, because we’ve read more of their paper than their own legal departments have. Auto-renewals, asymmetrical cure periods, unilateral pricing changes: we catch it before you sign, not after you’re stuck.' },
      { icon: 'route', title: 'Strategic Roadmap', text: 'A clear, sequenced program for what gets fixed first, what waits, and what should’ve been killed two budget cycles ago.' },
    ],
  },
  value: {
    label: '03 / The value',
    title: 'Why this matters.',
    stat_number: '500+',
    stat_label: 'Supplier relationships',
    compare_from: '6 months',
    compare_to: '6 days',
    compare_label: 'Supplier evaluation, with diligence built in',
    body_left: p(
      'A bad Design phase costs you twice: once on a contract you shouldn’t have signed, and again unwinding it three years later. We’ve read the contracts other advisors let clients sign, and it is not pretty. But the cost isn’t just financial. A solution that looks great on paper can still fail if it doesn’t play well with the rest of your stack, if the integrations nobody thought to check turn into six months of support tickets, or if your team simply doesn’t have the bandwidth or expertise to run it once it’s live. We build all of that into the evaluation up front: compatibility, dependencies, and whether your staff actually has the knowledge and resources to support it, not just whether the demo looked good.'
    ),
    body_right: p(
      'That’s also where our position in the ecosystem does the real work. We maintain live relationships with over 500 suppliers, which means we’re not just comparing spec sheets, we’re pulling real data on project backlog, implementation timelines, and what actually happens after the sale. That’s the kind of intelligence most technology leaders never get to see until they’ve already signed. Because we have it in near real time, we can evaluate hundreds of suppliers against your specific requirements and compress an evaluation that normally takes six months down to six days, without skipping the diligence that actually matters. Design exists so you never have to be the technology leader explaining to the board why you’re stuck in a deal nobody actually reviewed, or why the “perfect” solution can’t talk to anything else you own.'
    ),
    button_label: 'Start with Design',
    button_url: '/#contact',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#183;|&middot;/g, '·')
    .replace(/&amp;/g, '&')
    .trim();

/** "500+" → { num: 500, pre: '', suf: '+' } so the number can count up. */
export function splitStat(s) {
  const m = String(s || '').match(/^(\D*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const num = Number(m[2].replace(/,/g, ''));
  return Number.isFinite(num) ? { pre: m[1], num, suf: m[3], grouped: m[2].includes(',') } : null;
}

export function mapDesign(page) {
  const d = DESIGN_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const hero = a.hero || {};
  const pr = a.problem || {};
  const inc = a.included || {};
  const v = a.value || {};

  const items =
    Array.isArray(inc.items) && inc.items.length
      ? inc.items
          .filter((it) => it && !isEmpty(it.title))
          .map((it) => ({ icon: it.icon || 'scan', custom_icon: media(it.custom_icon), title: it.title, text: pick(it.text, '') }))
      : d.included.items.map((x) => ({ ...x, custom_icon: null }));

  const btn = v.button && typeof v.button === 'object' && v.button.url ? [v.button.title || d.value.button_label, v.button.url] : [d.value.button_label, d.value.button_url];
  const pageTitle = decode(page && page.title && page.title.rendered) || d.title;

  return {
    title: pageTitle,
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || d.hero.lead,
    },
    hero: {
      breadcrumb: pick(hero.breadcrumb, d.hero.breadcrumb),
      title: lines(hero.title, d.hero.title),
      lead: pick(hero.lead, d.hero.lead),
      image: media(hero.image),
      foot: pick(hero.foot, d.hero.foot),
    },
    problem: {
      label: pick(pr.label, d.problem.label),
      title: lines(pr.title, d.problem.title),
      body: pick(pr.body, d.problem.body),
    },
    included: {
      label: pick(inc.label, d.included.label),
      title: pick(inc.title, d.included.title),
      items,
    },
    value: {
      label: pick(v.label, d.value.label),
      title: pick(v.title, d.value.title),
      stat_number: pick(v.stat_number, d.value.stat_number),
      stat_label: pick(v.stat_label, d.value.stat_label),
      compare_from: pick(v.compare_from, d.value.compare_from),
      compare_to: pick(v.compare_to, d.value.compare_to),
      compare_label: pick(v.compare_label, d.value.compare_label),
      body_left: pick(v.body_left, d.value.body_left),
      body_right: pick(v.body_right, d.value.body_right),
      button_label: btn[0],
      button_url: btn[1],
    },
  };
}

export async function getDesignPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.DESIGN_PAGE_SLUG || 'design')]);
  return { site: mapSite(site), page: mapDesign(page), source: site || page ? 'wordpress' : 'defaults' };
}
