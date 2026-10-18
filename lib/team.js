import { fetchSite, fetchPageBySlug, mapSite, fetchOpts } from './content';

/**
 * Team.
 *  - People are a custom post type "Team Members" (post type team_member, REST base "team").
 *    Title = name, Page Attributes → Order = order on the page, "Featured" = shown on top, separated (Paul).
 *    Each person gets their own page at /team/<slug> with bio, Spotify playlist and (optional) video.
 *  - The /team page texts (hero, section title, CTA) are the ACF group "Team Page" on the page with slug "team".
 * Until people exist in WordPress the names, titles and photos from the current techchoice.com/team page are shown.
 */

const PHOTO = 'https://techchoice.com/wp-content/uploads';
const P = (slug, name, role, group, photo, featured = false) => ({
  slug,
  name,
  role,
  group,
  featured,
  photo: { url: `${PHOTO}/${photo}`, alt: name },
  tagline: '',
  bio: '',
  email: '',
  linkedin: '',
  spotify: '',
  video: null,
  video_url: '',
});

export const TEAM_FALLBACK = [
  P('paul-storella', 'Paul Storella', 'President and Founder', 'Leadership Team', '2025/07/PaulStorella23_800x650.webp', true),
  P('geniece-mccolgan', 'Geniece McColgan', 'VP, General Manager', 'Leadership Team', '2025/07/GenieceMcColgan07_800x650.webp'),
  P('eric-harvey', 'Eric Harvey', 'Sr Director', 'Advisory Team', '2025/07/EricHarvey12_800x650.webp'),
  P('scott-gagnon', 'Scott Gagnon', 'Solutions Architect', 'Client Support Team', '2026/02/ScottGagnon15_800x650.webp'),
  P('sara-vray', 'Sara Vray', 'Client Operations Manager', 'Operations Team', '2025/07/SaraVray25_800x650.webp'),
  P('eduardo-umana', 'Eduardo Umaña', 'Business Operations Manager', 'Operations Team', '2025/07/EduardoUmanSa22_800x650.webp'),
  P('charles-kellum', 'Charles Kellum', 'Technical Project Manager', 'Client Support Team', '2025/07/CharlesKellum05_800x650.webp'),
  P('paola-patino', 'Paola Patiño', 'Client Account Manager', 'Client Support Team', '2025/07/PaolaPatino11_800x650.webp'),
  P('alejandro-perez', 'Alejandro Perez', 'Strategic Account Advisor', 'Advisory Team', '2025/07/AlejandroPerez23_800x650.webp'),
  P('alexis-keller', 'Alexis Keller, MBA', 'Strategic Account Advisor', 'Advisory Team', '2025/07/AlexisKeller34_800x650.webp'),
];

export const TEAM_PAGE_DEFAULTS = {
  hero: {
    breadcrumb: 'TechChoice / Team',
    title: ['The People Who Show Up'],
    lead: 'No outsourced call center. No rotating cast of account reps. Just the people who know your environment and answer their phones.',
    image: '/images/team/team-hero.jpg',
    foot: 'Independent thinking. Accountable execution.',
  },
  people: {
    label: 'The people behind the follow-through',
    title: 'People, not handoffs.',
    note: '',
  },
  cta: {
    label: 'The next move is yours',
    title: ['The people who know your environment.'],
    button_label: 'Let’s talk',
    button_url: '/#contact',
  },
  profile: {
    back_label: 'All team',
    spotify_label: 'On their playlist',
    video_label: 'Meet them',
    bio_label: 'About',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const fileUrl = (v) => (v && typeof v === 'object' && v.url ? v.url : typeof v === 'string' && /\.(mp4|webm)(\?|$)/i.test(v) ? v : '');
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '', mime: v.mime_type || '' } : null);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const decode = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .trim();

/** Any open.spotify.com link (playlist, album, track, artist, show, episode) → embed URL. */
export function spotifyEmbed(url) {
  const m = String(url || '').match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : '';
}

/** YouTube / Vimeo page link → embed URL (for the optional video). */
export function videoEmbed(url) {
  const s = String(url || '');
  let m = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`;
  m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  return '';
}

export function mapMember(post) {
  const a = (post && post.acf && typeof post.acf === 'object' && post.acf) || {};
  const name = decode(post && post.title && post.title.rendered);
  return {
    slug: post.slug,
    name,
    role: pick(a.role, ''),
    group: pick(a.group, ''),
    featured: !!a.featured,
    photo: media(a.photo) ? { ...media(a.photo), alt: media(a.photo).alt || name } : null,
    tagline: pick(a.tagline, ''),
    bio: pick(a.bio, ''),
    email: pick(a.email, ''),
    linkedin: pick(a.linkedin, ''),
    spotify: spotifyEmbed(a.spotify),
    video: media(a.video_file),
    video_url: videoEmbed(a.video_url),
  };
}

/* ---------- fetching ---------- */

const wpBase = () => (process.env.WP_URL || '').replace(/\/+$/, '');
const restBase = () => process.env.WP_TEAM_REST_BASE || 'team';

async function getJSON(url) {
  try {
    const res = await fetch(url, fetchOpts());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[team] ${url}: ${err.message}`);
    return null;
  }
}

/** All team members in order; the featured one(s) first. Falls back to the current site's list. */
export async function fetchTeam() {
  const base = wpBase();
  let list = [];
  if (base) {
    const r = await getJSON(`${base}/wp-json/wp/v2/${restBase()}?per_page=100&orderby=menu_order&order=asc&acf_format=standard&_fields=id,slug,title,menu_order,acf&_=${Math.floor(Date.now() / 1000)}`);
    if (Array.isArray(r)) list = r.map(mapMember).filter((m) => m.name);
  }
  const source = list.length ? 'wordpress' : 'fallback';
  if (!list.length) list = TEAM_FALLBACK;
  if (!list.some((m) => m.featured) && list.length) list = [{ ...list[0], featured: true }, ...list.slice(1)];
  return { members: list, source };
}

export function mapTeamPage(page) {
  const D = TEAM_PAGE_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const pe = a.people || {};
  const c = a.cta || {};
  const pr = a.profile || {};
  const [bl, bu] = link(c.button, D.cta.button_label, D.cta.button_url);
  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || 'Team — TechChoice',
      description: (page && page.yoast_head_json && page.yoast_head_json.description) || D.hero.lead,
    },
    hero: {
      breadcrumb: pick(h.breadcrumb, D.hero.breadcrumb),
      title: lines(h.title, D.hero.title),
      lead: pick(h.lead, D.hero.lead),
      image: media(h.image) || { url: D.hero.image, alt: '' },
      video: fileUrl(h.video),
      foot: pick(h.foot, D.hero.foot),
    },
    people: { label: pick(pe.label, D.people.label), title: pick(pe.title, D.people.title), note: pick(pe.note, D.people.note) },
    cta: { label: pick(c.label, D.cta.label), title: lines(c.title, D.cta.title), button_label: bl, button_url: bu },
    profile: {
      back_label: pick(pr.back_label, D.profile.back_label),
      spotify_label: pick(pr.spotify_label, D.profile.spotify_label),
      video_label: pick(pr.video_label, D.profile.video_label),
      bio_label: pick(pr.bio_label, D.profile.bio_label),
    },
  };
}

export async function getTeamPage() {
  const [site, page, team] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.TEAM_PAGE_SLUG || 'team'), fetchTeam()]);
  return { site: mapSite(site), page: mapTeamPage(page), ...team };
}

export async function getMember(slug) {
  const [site, page, team] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.TEAM_PAGE_SLUG || 'team'), fetchTeam()]);
  const i = team.members.findIndex((m) => m.slug === slug);
  return {
    site: mapSite(site),
    page: mapTeamPage(page),
    member: i >= 0 ? team.members[i] : null,
    next: i >= 0 && team.members.length > 1 ? team.members[(i + 1) % team.members.length] : null,
    source: team.source,
  };
}
