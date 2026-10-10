import { fetchSite, fetchPageBySlug, mapSite } from './content';

/**
 * Process · CYaaS page.
 * WordPress: Pages → the page with slug PROCESS_PAGE_SLUG (default "process"),
 * ACF field group "Process Page (CYaaS)" with groups hero / intro / phases / cta.
 * Empty fields fall back to the text below (from the Figma design).
 */

export const PROCESS_DEFAULTS = {
  title: 'Process · CYaaS',
  hero: {
    breadcrumb: 'TechChoice / Process / CYaaS',
    title: ['CYaaS: Cover Your as a Service'],
    lead: 'Every vendor has an “aaS” acronym. This is the only one that’s actually about covering yours.',
    process_label: 'Process',
    foot: 'Independent thinking. Accountable execution.',
  },
  intro: {
    label: '01 / What is CYaaS?',
    title: ['Three phases.', 'One accountable', 'team.'],
    body:
      'You’ve been pitched IaaS, PaaS, SaaS, and at least four more acronyms this quarter alone. CYaaS is different because it’s not a product, it’s the discipline we run every engagement through. Three phases, zero ambiguity about who owns what. Design is the thinking and the decision-making. Deliver is the execution. Control is what keeps it from falling apart six months after all of the resources are reallocated. Most firms are good at one of these. We built the entire company around integrating all three, logically.',
  },
  phases: {
    label: 'One continuous process',
    title: 'Design. Deliver. Control.',
    foot: 'One continuous process. Zero handoff gaps.',
    items: [
      {
        title: 'Design',
        text: 'Assessment, strategy, strategic sourcing, and program development. This is where we make sure you’re solving the right problem with the right supplier, on terms that don’t come back to bite you.',
        button_label: 'Explore Design',
        button_url: '#phases',
      },
      {
        title: 'Deliver',
        text: 'Decisions were made. Now we make it actually work. Full execution. Project management, vendor coordination, fiscal oversight, and adoption.',
        button_label: 'Explore Deliver',
        button_url: '#phases',
      },
      {
        title: 'Control',
        text: 'We stay after everyone else has moved on to their next commission check. Ongoing governance, invoice audits, SLA enforcement, optimization, and marketplace awareness.',
        button_label: 'Explore Control',
        button_url: '#phases',
      },
    ],
  },
  cta: {
    label: 'The next move is yours',
    title: ['Ready to Run This the Right Way?'],
    button_label: 'Start with Design',
    button_url: '#phases',
  },
};

/** Card images shipped in /public, used when a phase has no image in WordPress. */
export const PHASE_FALLBACK_IMAGES = ['/images/process/phase-design.jpg', '/images/process/phase-deliver.jpg', '/images/process/phase-control.jpg'];

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;/g, '’')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#183;|&middot;/g, '·')
    .replace(/&amp;/g, '&')
    .trim();

export function mapProcess(page) {
  const d = PROCESS_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const hero = a.hero || {};
  const intro = a.intro || {};
  const ph = a.phases || {};
  const cta = a.cta || {};

  const items =
    Array.isArray(ph.items) && ph.items.length
      ? ph.items
          .filter((it) => it && !isEmpty(it.title))
          .map((it) => {
            const [bl, bu] = link(it.button, '', '');
            return { title: it.title, text: pick(it.text, ''), icon: media(it.icon), image: media(it.image), button_label: bl, button_url: bu };
          })
      : d.phases.items.map((x) => ({ ...x, icon: null, image: null }));
  const [ctaLabel, ctaUrl] = link(cta.button, d.cta.button_label, d.cta.button_url);

  return {
    title: decode(page && page.title && page.title.rendered) || d.title,
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${decode(page && page.title && page.title.rendered) || d.title} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || d.hero.lead,
    },
    hero: {
      breadcrumb: pick(hero.breadcrumb, d.hero.breadcrumb),
      title: lines(hero.title, d.hero.title),
      lead: pick(hero.lead, d.hero.lead),
      process_label: pick(hero.process_label, d.hero.process_label),
      foot: pick(hero.foot, d.hero.foot),
    },
    intro: {
      label: pick(intro.label, d.intro.label),
      title: lines(intro.title, d.intro.title),
      body: pick(intro.body, d.intro.body),
    },
    phases: {
      label: pick(ph.label, d.phases.label),
      title: pick(ph.title, d.phases.title),
      foot: pick(ph.foot, d.phases.foot),
      items,
    },
    cta: {
      label: pick(cta.label, d.cta.label),
      title: lines(cta.title, d.cta.title),
      button_label: ctaLabel,
      button_url: ctaUrl,
    },
  };
}

export async function getProcessPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.PROCESS_PAGE_SLUG || 'process')]);
  return { site: mapSite(site), page: mapProcess(page), source: site || page ? 'wordpress' : 'defaults' };
}
