import { fetchSite, fetchPageBySlug, mapSite } from './content';
import { paras } from './phase';

/**
 * Services page — WordPress page with slug SERVICES_PAGE_SLUG (default "services"),
 * ACF field group "Services Page". Empty fields fall back to the text below (from Figma).
 */

export const SERVICES_DEFAULTS = {
  title: 'Services',
  hero: {
    breadcrumb: 'TechChoice / Services',
    title: ['If It’s In Your Stack, We Already Know It Better Than the Vendor Selling It to You'],
    lead: 'Every category. Every layer. Nothing here is outside our lane.',
    image: '/images/services/services-hero.jpg',
    foot: 'Independent thinking. Accountable execution.',
  },
  intro: {
    label: '01 / Your full technology environment',
    title: ['Every category.', 'Every layer.'],
    body: paras(
      'Most advisors know one corner of your technology environment and call it expertise. That doesn’t cut it anymore. Modern environments span network, cloud, security, collaboration, and a dozen SaaS tools your finance team is still trying to find in the budget. We work across all of it, which means you get one team instead of five specialists who’ve never spoken to each other.'
    ),
  },
  directory: {
    label: '02 / Full services directory',
    title: ['If it’s in your stack,', 'it’s in our lane.'],
    items: [
      { icon: 'network', title: 'Network & Connectivity', text: 'SD-WAN, MPLS, broadband, fiber, wireless WAN, network design and architecture.' },
      { icon: 'shield', title: 'Secure WAN', text: 'SASE, SSE, ZTNA Endpoints.' },
      { icon: 'video', title: 'Unified Communications & Collaboration (UCaaS)', text: 'VoIP, business phone systems, video conferencing, team messaging platforms.' },
      { icon: 'headset', title: 'Contact Center Solutions (CCaaS)', text: 'Cloud contact center platforms, IVR, omnichannel routing, workforce optimization.' },
      { icon: 'messages', title: 'Customer Experience AI (CX-AI)', text: 'AI for Chat, Email, SMS, Social, Voice.' },
      { icon: 'cloud', title: 'Cloud Infrastructure (IaaS / PaaS)', text: 'Public, private, and hybrid cloud, cloud migration, cloud cost management.' },
      { icon: 'app_window', title: 'Software as a Service (SaaS)', text: 'Business applications, ERP, CRM, productivity suites, and platform integrations.' },
      { icon: 'shield_check', title: 'Cybersecurity', text: 'Endpoint protection, network security, SOC services, identity and access management, security audits, compliance support.' },
      { icon: 'file_check', title: 'Risk and Compliance', text: 'GRCaaS, Risk Assessments, Compliance Assessments.' },
      { icon: 'server', title: 'Data Center & Colocation', text: 'Colocation services, data center infrastructure, disaster recovery and business continuity.' },
      { icon: 'phone', title: 'Mobility & Wireless', text: 'Mobile device management, enterprise wireless plans, IoT connectivity.' },
      { icon: 'wrench', title: 'Managed IT Services', text: 'Help desk, managed network operations, managed security, co-managed IT support.' },
      { icon: 'laptop', title: 'Hardware & Procurement', text: 'Servers, end-user devices, networking equipment, lifecycle management.' },
      { icon: 'dollar', title: 'Technology Expense Management (ETM)', text: 'Invoice auditing, contract tracking, telecom and cloud spend optimization, powered by our proprietary ETM platform.' },
      { icon: 'printer', title: 'Print & Document Management', text: 'Managed print services, document workflow solutions.' },
      { icon: 'cpu', title: 'Emerging Technology & AI', text: 'AI and automation tooling, intelligent process automation, emerging platform evaluation.' },
    ],
  },
  cta: {
    label: 'The next move is yours',
    title: ['Don’t See Your Exact Problem Listed? Ask Anyway.'],
    text: 'If it touches your tech environment, we’ve already got a vendor relationship and a strong opinion about whether it’s worth your money.',
    button_label: 'Talk to an Advisor',
    button_url: '/contact',
  },
};

const isEmpty = (v) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const pick = (v, f) => (isEmpty(v) ? f : v);
const lines = (v, f) => (typeof v === 'string' && v.trim() ? v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : f);
const fileUrl = (v) => (v && typeof v === 'object' && v.url ? v.url : typeof v === 'string' && /\.(mp4|webm)(\?|$)/i.test(v) ? v : '');
const media = (v) => (v && typeof v === 'object' && v.url ? { url: v.url, alt: v.alt || '' } : null);
const link = (v, label, url) => (v && typeof v === 'object' && v.url ? [v.title || label, v.url] : [label, url]);
const decode = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/&#8217;|&rsquo;/g, '’').replace(/&amp;/g, '&').trim();

export function mapServices(page) {
  const D = SERVICES_DEFAULTS;
  const a = (page && page.acf && typeof page.acf === 'object' && page.acf) || {};
  const h = a.hero || {};
  const it = a.intro || {};
  const dir = a.directory || {};
  const c = a.cta || {};
  const [btnLabel, btnUrl] = link(c.button, D.cta.button_label, D.cta.button_url);
  const pageTitle = decode(page && page.title && page.title.rendered) || D.title;
  const items = Array.isArray(dir.items)
    ? dir.items.filter((r) => r && !isEmpty(r.title)).map((r) => ({ icon: r.icon || 'network', custom_icon: media(r.custom_icon), title: r.title, text: pick(r.text, '') }))
    : [];

  return {
    seo: {
      title: (page && page.yoast_head_json && page.yoast_head_json.title) || `${pageTitle} — TechChoice`,
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
    intro: { label: pick(it.label, D.intro.label), title: lines(it.title, D.intro.title), body: pick(it.body, D.intro.body) },
    directory: {
      label: pick(dir.label, D.directory.label),
      title: lines(dir.title, D.directory.title),
      items: items.length ? items : D.directory.items.map((x) => ({ ...x, custom_icon: null })),
    },
    cta: { label: pick(c.label, D.cta.label), title: lines(c.title, D.cta.title), text: pick(c.text, D.cta.text), button_label: btnLabel, button_url: btnUrl },
  };
}

export async function getServicesPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPageBySlug(process.env.SERVICES_PAGE_SLUG || 'services')]);
  return { site: mapSite(site), page: mapServices(page) };
}
