import { fetchTeam } from '../lib/team';

/** /sitemap.xml — every public page + each team member's page. */
const SITE = 'https://techchoice.com';
const PAGES = ['', '/about-us', '/process', '/design', '/deliver', '/control', '/aaset', '/services', '/team', '/testimonials', '/vendor-partners', '/gartner', '/contact'];

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();
  let team = [];
  try {
    team = ((await fetchTeam()) || {}).members || [];
  } catch {
    team = [];
  }
  return [
    ...PAGES.map((p) => ({ url: `${SITE}${p}`, lastModified: now, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.8 })),
    ...team.filter((m) => m && m.slug).map((m) => ({ url: `${SITE}/team/${m.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })),
  ];
}
