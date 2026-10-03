import defaults from './defaults.json';

/**
 * Where the content comes from (all on WP_URL):
 *   /wp-json/techchoice/v1/site              Site Settings plugin: header, footer, menus, front page id
 *   /wp-json/wp/v2/pages/<id>?acf_format=standard   Home page ACF fields (hero, about, process, contact)
 *   /wp-json/wp/v2/process-slides?...        Process Slides post type (slider)
 * Anything missing or empty falls back to lib/defaults.json and the files in /public.
 */

export const CONTENT_TAG = 'wp-home';

export const FALLBACK = {
  video: '/hero-flow.mp4',
  poster: '/images/hero-poster.jpg',
  logoLight: '/images/logo-light.png',
  logoDark: '/images/logo-dark.png',
  about: '/images/about-boston.jpg',
  slides: ['/images/slide-design.jpg', '/images/slide-deliver.jpg', '/images/slide-control.jpg'],
  contact: '/images/contact-parachute.jpg',
};

const DEFAULT_MENUS = {
  header: [
    { title: 'Who we are', url: '#about' },
    { title: 'How we work', url: '#process' },
  ],
  fullscreen: [
    { title: 'Home', url: '#top' },
    { title: 'Who we are', url: '#about' },
    { title: 'How we work', url: '#process' },
    { title: 'Let’s talk', url: '#contact' },
  ],
  footer: [
    { title: 'Who we are', url: '#about' },
    { title: 'How we work', url: '#process' },
    { title: 'Let’s talk', url: '#contact' },
  ],
};

/* ---------- small helpers ---------- */

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, fallback) => (isEmpty(v) ? fallback : v);
/** Textarea with one item per line → array of lines. */
const lines = (v, fallback) => {
  if (Array.isArray(v)) return v.length ? v : fallback;
  if (typeof v !== 'string' || !v.trim()) return fallback;
  return v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
};
/** ACF image / file (return format array) → { url, alt, mime } or null. */
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '', mime: v.mime_type || v.mime || '' } : null);
/** ACF link → [label, url]. */
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
const menu = (items, fallback) =>
  Array.isArray(items) && items.length ? items.map((i) => ({ title: decode(i.title), url: i.url || '#', target: i.target || '' })) : fallback;

/* ---------- fetching ---------- */

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 300, tags: [CONTENT_TAG] } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function safe(promise, label) {
  try {
    return await promise;
  } catch (err) {
    console.error(`[content] ${label}: ${err.message}`);
    return null;
  }
}

/* ---------- mapping WordPress → page props ---------- */

export function mapContent({ site, page, slides }) {
  const d = defaults;
  const s = (site && site.settings) || {};
  const sh = s.header || {};
  const sf = s.footer || {};
  const acf = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const hero = acf.hero || {};
  const about = acf.about || {};
  const pr = acf.process || {};
  const ct = acf.contact || {};

  const [heroBtnLabel, heroBtnUrl] = link(hero.button, d.hero.button_label, d.hero.button_link);
  const [aboutBtnLabel, aboutBtnUrl] = link(about.button, d.about.button_label, d.about.button_link);
  const [ctBtnLabel, ctBtnUrl] = link(ct.button, d.contact.button_label, d.contact.button_link);

  const slideList =
    Array.isArray(slides) && slides.length
      ? slides.map((p) => {
          const a = (p.acf && typeof p.acf === 'object' && p.acf) || {};
          const [label, url] = link(a.link, '', '#process');
          return {
            title: decode(p.title && p.title.rendered),
            text: pick(a.text, ''),
            link_label: label,
            link_url: url,
            image: media(a.image),
            original_colors: !!a.original_colors,
          };
        })
      : d.process.slides.map((x) => ({ ...x, image: null }));

  const tiles = Array.isArray(ct.tiles)
    ? ct.tiles.filter((t) => t && !isEmpty(t.label)).map((t) => ({ icon: t.icon || 'chip', label: t.label, custom_icon: media(t.custom_icon) }))
    : d.contact.tiles.map((t) => ({ ...t, custom_icon: null }));

  return {
    seo: {
      title: pick(page && page.yoast_head_json && page.yoast_head_json.title, d.seo.title),
      description: pick(page && page.yoast_head_json && page.yoast_head_json.description, d.seo.description),
    },
    header: {
      logo_light: media(sh.logo_light),
      logo_dark: media(sh.logo_dark),
      cta_label: pick(sh.cta_label, d.header.cta_label),
      cta_url: pick(sh.cta_url, '#contact'),
      menu_process_label: pick(sh.menu_process_label, d.header.menu_process_label),
      menu_close_note: pick(sh.menu_close_note, d.header.menu_close_note),
    },
    menus: {
      header: menu(site && site.menus && site.menus.header, DEFAULT_MENUS.header),
      fullscreen: menu(site && site.menus && site.menus.fullscreen, DEFAULT_MENUS.fullscreen),
      footer: menu(site && site.menus && site.menus.footer, DEFAULT_MENUS.footer),
    },
    hero: {
      video: media(hero.video),
      poster: media(hero.poster),
      eyebrow: pick(hero.eyebrow, d.hero.eyebrow),
      title_1: pick(hero.title_1, d.hero.title_1),
      title_2: pick(hero.title_2, d.hero.title_2),
      lead: pick(hero.lead, d.hero.lead),
      button_label: heroBtnLabel,
      button_link: heroBtnUrl,
      aside: lines(hero.aside, d.hero.aside),
      foot_left: pick(hero.foot_left, d.hero.foot_left),
      foot_right: pick(hero.foot_right, d.hero.foot_right),
    },
    about: {
      image: media(about.image),
      title: pick(about.title, d.about.title),
      body: pick(about.body, d.about.body),
      strong: pick(about.strong, d.about.strong),
      button_label: aboutBtnLabel,
      button_link: aboutBtnUrl,
    },
    process: {
      label: pick(pr.label, d.process.label),
      badge: pick(pr.badge, d.process.badge),
      badge_sub: pick(pr.badge_sub, d.process.badge_sub),
      title: pick(pr.title, d.process.title),
      note: lines(pr.note, d.process.note),
      foot: pick(pr.foot, d.process.foot),
      autoplay_seconds: Number(pick(pr.autoplay_seconds, d.process.autoplay_seconds)) || 6,
      slides: slideList,
    },
    contact: {
      label: pick(ct.label, d.contact.label),
      right_label: pick(ct.right_label, d.contact.right_label),
      title: lines(ct.title, d.contact.title),
      tiles,
      lead: lines(ct.lead, d.contact.lead),
      button_label: ctBtnLabel,
      button_link: ctBtnUrl,
      image: media(ct.image),
      caption: lines(ct.caption, d.contact.caption),
      foot_left: pick(ct.foot_left, d.contact.foot_left),
    },
    footer: {
      logo: media(sf.logo),
      tagline: lines(sf.tagline, d.footer.tagline),
      explore_label: pick(sf.explore_label, d.footer.explore_label),
      address_label: pick(sf.address_label, d.footer.address_label),
      address: lines(sf.address, d.footer.address),
      copyright: pick(sf.copyright, d.footer.copyright),
      back_to_top: pick(sf.back_to_top, d.footer.back_to_top),
    },
  };
}

export async function getContent() {
  const base = (process.env.WP_URL || '').replace(/\/+$/, '');
  if (!base) return { ...mapContent({}), source: 'defaults' };
  const api = `${base}/wp-json`;
  // Cache-buster keeps page caches in front of WordPress (Varnish on Cloudways) from replaying old JSON.
  const t = `_=${Math.floor(Date.now() / 1000)}`;
  const slidesBase = process.env.WP_SLIDES_REST_BASE || 'process-slides';

  const site = await safe(getJSON(`${api}/techchoice/v1/site?${t}`), 'site settings');
  const frontId = site && site.front_page && site.front_page.id;
  const pagePromise = frontId
    ? getJSON(`${api}/wp/v2/pages/${frontId}?acf_format=standard&_fields=id,acf,yoast_head_json&${t}`)
    : getJSON(`${api}/wp/v2/pages?slug=${encodeURIComponent(process.env.WP_HOME_SLUG || 'home')}&acf_format=standard&_fields=id,acf,yoast_head_json&${t}`).then((r) => (Array.isArray(r) ? r[0] : null));
  const [page, slides] = await Promise.all([
    safe(pagePromise, 'home page'),
    safe(getJSON(`${api}/wp/v2/${slidesBase}?per_page=50&orderby=menu_order&order=asc&acf_format=standard&_fields=id,title,menu_order,acf&${t}`), 'process slides'),
  ]);

  const source = site || page || slides ? 'wordpress' : 'defaults';
  return { ...mapContent({ site, page, slides }), source };
}

/** URL of a WordPress image/video, or the bundled fallback. */
export function src(m, fallback) {
  return m && m.url ? m.url : fallback;
}
