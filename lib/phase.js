import { fetchSite, fetchPageBySlug, mapSite } from './content';

/**
 * Shared mapping for the phase pages (Design, Deliver, …).
 * Each page has its own ACF field group with the same building blocks:
 *   hero     breadcrumb, title, lead, foot + either image (Design) or the critical-path card (Deliver)
 *   problem  label, title, body, optional image
 *   included label, title, items[] (icon, custom_icon, title, text)
 *   value    label, title, optional stats (Design), body or body_left/body_right, button
 * Every empty field falls back to that page's defaults (text from Figma).
 */

export const paras = (...list) => list.map((t) => `<p>${t}</p>`).join('');

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const fileUrl = (v) => (v && typeof v === 'object' && v.url ? v.url : typeof v === 'string' && /\.(mp4|webm)(\?|$)/i.test(v) ? v : '');
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

/** "500+" → { pre: '', num: 500, suf: '+' } so the number can count up. */
export function splitStat(s) {
  const m = String(s || '').match(/^(\D*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const num = Number(m[2].replace(/,/g, ''));
  return Number.isFinite(num) ? { pre: m[1], num, suf: m[3], grouped: m[2].includes(',') } : null;
}

export function mapPhase(page, D) {
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const hero = a.hero || {};
  const pr = a.problem || {};
  const inc = a.included || {};
  const v = a.value || {};
  const dv = D.value;

  const items =
    Array.isArray(inc.items) && inc.items.length
      ? inc.items
          .filter((it) => it && !isEmpty(it.title))
          .map((it) => ({ icon: it.icon || D.included.items[0].icon, custom_icon: media(it.custom_icon), title: it.title, text: pick(it.text, '') }))
      : D.included.items.map((x) => ({ ...x, custom_icon: null }));

  let path = null;
  if (D.hero.path) {
    const steps = Array.isArray(hero.path_steps) ? hero.path_steps.map((s) => (s && s.label ? String(s.label) : '')).filter(Boolean) : [];
    path = {
      label: pick(hero.path_label, D.hero.path.label),
      steps: steps.length ? steps : D.hero.path.steps,
      foot: pick(hero.path_foot, D.hero.path.foot),
    };
  }

  const btn = v.button && typeof v.button === 'object' && v.button.url ? [v.button.title || dv.button_label, v.button.url] : [dv.button_label, dv.button_url];
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;

  return {
    title: pageTitle,
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(hero.breadcrumb, D.hero.breadcrumb),
      title: lines(hero.title, D.hero.title),
      lead: pick(hero.lead, D.hero.lead),
      image: media(hero.image) || (D.hero.image ? { url: D.hero.image, alt: '' } : null),
      video: fileUrl(hero.video),
      path,
      foot: pick(hero.foot, D.hero.foot),
    },
    problem: {
      label: pick(pr.label, D.problem.label),
      title: lines(pr.title, D.problem.title),
      body: pick(pr.body, D.problem.body),
      image: media(pr.image) || (D.problem.image ? { url: D.problem.image, alt: '' } : null),
      video: fileUrl(pr.video),
    },
    included: {
      label: pick(inc.label, D.included.label),
      title: pick(inc.title, D.included.title),
      items,
    },
    value: {
      label: pick(v.label, dv.label),
      title: pick(v.title, dv.title),
      stats: dv.stat_number
        ? {
            number: pick(v.stat_number, dv.stat_number),
            label: pick(v.stat_label, dv.stat_label),
            from: pick(v.compare_from, dv.compare_from),
            to: pick(v.compare_to, dv.compare_to),
            caption: pick(v.compare_label, dv.compare_label),
          }
        : null,
      cycle: dv.cycle
        ? (() => {
            const steps = Array.isArray(v.cycle_steps)
              ? v.cycle_steps.filter((s) => s && !isEmpty(s.title)).map((s) => ({ title: String(s.title), text: pick(s.text, '') }))
              : [];
            return {
              label: pick(v.cycle_label, dv.cycle.label),
              steps: (steps.length ? steps : dv.cycle.steps).slice(0, 4),
              foot: pick(v.cycle_foot, dv.cycle.foot),
            };
          })()
        : null,
      body: dv.body !== undefined ? pick(v.body, dv.body) : null,
      body_left: dv.body_left !== undefined ? pick(v.body_left, dv.body_left) : null,
      body_right: dv.body_right !== undefined ? pick(v.body_right, dv.body_right) : null,
      button_label: btn[0],
      button_url: btn[1],
    },
  };
}

export async function getPhasePage(slug, D) {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(slug)]);
  return { site: mapSite(site), page: mapPhase(page, D), source: site || page ? 'wordpress' : 'defaults' };
}
