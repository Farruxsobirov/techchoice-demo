import { fetchSite, fetchPageBySlug, mapSite } from './content';

/**
 * Events page (Gartner IT Symposium landing) — WordPress page with slug EVENTS_PAGE_SLUG (default "events"),
 * ACF field group "Events Page". Empty fields fall back to the text below.
 * Titles have two parts: `title` (plain lines) and `accent` (the gradient line under it).
 */

export const EVENTS_DEFAULTS = {
  title: 'Events',
  hero: {
    eyebrow: 'You found us / Orlando 2026',
    title: ['You scanned.'],
    accent: 'Good instincts.',
    lead: 'Technology should work for your business. Not the other way around. Meet the independent team that designs, delivers, and keeps your vendors accountable — at no cost to you.',
    button_label: 'Book 10 minutes',
    button_url: '#meet',
    button2_label: 'Find booth 140',
    button2_url: '#booth',
    event_start: '2026-10-19T17:45:00-04:00',
    facts: [
      { label: '01 / Where', value: 'Orlando, Florida' },
      { label: '02 / When', value: 'October 19–21, 2026' },
      { label: '03 / Find us', value: 'Booth 140' },
    ],
  },
  services: {
    label: '01 / What we do',
    title: ['One partner.'],
    accent: 'Every angle covered.',
    text: 'CYaaS: Cover Your aaS. Three independent engagements. Take one, take all three, mix and match. No prerequisites.',
    items: [
      { title: 'Design', tagline: 'Requirements first. Regrets never.', text: 'Define your needs, scope the solution, source technology, and create efficient deployment programs.', url: '/design' },
      { title: 'Deliver', tagline: 'Your corner, fully staffed.', text: 'Implementation with an independent partner holding vendors to timelines, contracts, and promises.', url: '/deliver' },
      { title: 'Control', tagline: 'You run your tech. Not your vendors.', text: 'Live inventory, monthly billing audits, ticket escalation, MACD management, and annual reviews.', url: '/control' },
    ],
  },
  after: {
    label: '02 / Booth 140 after hours',
    title: ['Good conversations.'],
    accent: 'Better prizes.',
    text: 'Darts. Roulette. Chips you can trade for seriously good prizes. Two evenings of networking with no vendor pitch required.',
    dates: [
      { day: 'Monday', date: 'Oct 19', time: '5:45–7:15 PM · Booth 140' },
      { day: 'Wednesday', date: 'Oct 21', time: '5:45–7:15 PM · Booth 140' },
    ],
    steps: [
      { title: 'Play the games', text: 'Darts and roulette, both evenings. Aim well. Spin boldly.' },
      { title: 'Meet for 10 minutes', text: 'Ten minutes of good conversation, paid in chips.' },
      { title: 'Bring a friend', text: 'You both get bonus chips. Friendship has never been this lucrative.' },
    ],
    prize_title: ['What can your'],
    prize_accent: 'chips win?',
    prizes: 'Nintendo Switch 2 · Bose headphones · Gift cards · And much more',
  },
  why: {
    label: '03 / Why TechChoice',
    title: ['Independent.'],
    accent: 'On your side.',
    text: 'Vendors compensate us, so you never see a TechChoice invoice. Our loyalty is to your outcomes.',
    stats: [
      { value: '2014', label: 'Independent since 2014' },
      { value: 'Boston', label: 'Based in Boston, serving clients nationwide' },
      { value: 'Inc. 5000', label: '2026 fastest-growing companies list' },
      { value: 'Real humans', label: 'Still answering our own phones' },
    ],
  },
  faq: {
    label: '04 / Straight answers',
    title: ['No fine print.'],
    accent: 'No runaround.',
    items: [
      { q: 'Wait, it’s really free?', a: 'Yes. Vendors compensate us. You get cleaner bills, faster tickets, and contracts that say what you thought they said.' },
      { q: 'Whose side are you on?', a: 'Yours. We’re independently owned and vendor-agnostic. We don’t have favorite vendors. We have favorite outcomes.' },
    ],
  },
  booth: {
    label: '05 / Find us',
    title: ['See you at'],
    accent: 'Booth 140.',
    text: 'Head to the Marketplace, in the IT Infrastructure, Operations and Cloud Strategies neighborhood. First row along the wall, between booths 142 and 138.',
    button_label: 'Book a quick chat',
    button_url: '#meet',
    map_label: 'Simplified booth locator',
    booth: '140',
    map_tag: 'TechChoice is here',
    map_note: 'Booth 140 is between 142 and 138. Floor plan subject to change.',
  },
  cta: {
    label: 'Your next move',
    title: ['Your vendors have account teams.'],
    accent: 'Now you do too.',
    text: 'Grab 10 minutes, or swing by Booth 140 and ask us anything. We love a hard question.',
    button_label: 'Request a 10-minute meeting',
    button_url: 'mailto:info@techchoice.com?subject=Gartner%202026%20-%20Meet%20at%20Booth%20140',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const rows = (v, keep, map, fallback) => {
  const list = Array.isArray(v) ? v.filter((r) => r && keep(r)).map(map) : [];
  return list.length ? list : fallback;
};
const decode = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/&#8217;|&rsquo;/g, '’').replace(/&amp;/g, '&').trim();
/** Two-part heading: plain lines + gradient line. */
const head = (g, d) => ({ label: pick(g.label, d.label), title: lines(g.title, d.title), accent: pick(g.accent, d.accent) });

export function mapEvents(page) {
  const D = EVENTS_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const s = a.services || {};
  const af = a.after || {};
  const w = a.why || {};
  const fq = a.faq || {};
  const b = a.booth || {};
  const c = a.cta || {};
  const [b1l, b1u] = link(h.button, D.hero.button_label, D.hero.button_url);
  const [b2l, b2u] = link(h.button2, D.hero.button2_label, D.hero.button2_url);
  const [bbl, bbu] = link(b.button, D.booth.button_label, D.booth.button_url);
  const [cbl, cbu] = link(c.button, D.cta.button_label, D.cta.button_url);
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;
  const booth = String(pick(b.booth, D.booth.booth)).trim();

  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      eyebrow: pick(h.eyebrow, D.hero.eyebrow),
      title: lines(h.title, D.hero.title),
      accent: pick(h.accent, D.hero.accent),
      lead: pick(h.lead, D.hero.lead),
      button_label: b1l,
      button_url: b1u,
      button2_label: b2l,
      button2_url: b2u,
      // ACF date_time_picker returns "Y-m-d H:i:s" (site time); an empty field hides the countdown once fields exist.
      event_start: pick(h.event_start, Object.keys(h).length ? '' : D.hero.event_start),
      facts: rows(h.facts, (r) => !isEmpty(r.value), (r) => ({ label: pick(r.label, ''), value: r.value }), D.hero.facts),
    },
    services: {
      ...head(s, D.services),
      text: pick(s.text, D.services.text),
      items: rows(
        s.items,
        (r) => !isEmpty(r.title),
        (r) => {
          const [, url] = link(r.link, '', '');
          return { title: r.title, tagline: pick(r.tagline, ''), text: pick(r.text, ''), url };
        },
        D.services.items
      ),
    },
    after: {
      ...head(af, D.after),
      text: pick(af.text, D.after.text),
      dates: rows(af.dates, (r) => !isEmpty(r.date), (r) => ({ day: pick(r.day, ''), date: r.date, time: pick(r.time, '') }), D.after.dates),
      steps: rows(af.steps, (r) => !isEmpty(r.title), (r) => ({ title: r.title, text: pick(r.text, '') }), D.after.steps),
      prize_title: lines(af.prize_title, D.after.prize_title),
      prize_accent: pick(af.prize_accent, D.after.prize_accent),
      prizes: pick(af.prizes, D.after.prizes),
    },
    why: {
      ...head(w, D.why),
      text: pick(w.text, D.why.text),
      stats: rows(w.stats, (r) => !isEmpty(r.value), (r) => ({ value: r.value, label: pick(r.label, '') }), D.why.stats),
    },
    faq: {
      ...head(fq, D.faq),
      items: rows(fq.items, (r) => !isEmpty(r.question), (r) => ({ q: r.question, a: pick(r.answer, '') }), D.faq.items),
    },
    booth: {
      ...head(b, D.booth),
      text: pick(b.text, D.booth.text),
      button_label: bbl,
      button_url: bbu,
      map_label: pick(b.map_label, D.booth.map_label),
      booth,
      map_tag: pick(b.map_tag, D.booth.map_tag),
      // Optional uploaded floor plan; replaces the drawn map when set.
      map_image: media(b.map_image),
      map_note: pick(b.map_note, D.booth.map_note),
    },
    cta: { ...head(c, D.cta), text: pick(c.text, D.cta.text), button_label: cbl, button_url: cbu },
  };
}

export async function getEventsPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug([process.env.EVENTS_PAGE_SLUG || 'gartner', 'events'])]);
  return { site: mapSite(site), page: mapEvents(page) };
}
