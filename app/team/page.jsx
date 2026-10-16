import { getTeamPage } from '../../lib/team';
import { rimg } from '../../lib/img';
import { ArrowUpRight } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines, pad, HeroTitle } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getTeamPage();
  return { title: page.seo.title, description: page.seo.description };
}

const initials = (name) =>
  String(name || 'TC')
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'TC';

function Photo({ m, sizes }) {
  return (
    <span className="tm-photo">
      {m.photo ? (
        <img {...rimg(m.photo.url, { widths: [640, 1080], sizes })} alt={m.photo.alt || m.name} loading="lazy" decoding="async" />
      ) : (
        <span className="tm-mono" aria-hidden="true">
          {initials(m.name)}
        </span>
      )}
    </span>
  );
}

export default async function TeamPage() {
  const { site, page: p, members } = await getTeamPage();
  const { header: h, menus, footer: f } = site;
  const lead = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control tm">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero dp-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <HeroTitle items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            <figure className="dp-hero-img rv d1">
              <img {...rimg(p.hero.image.url, { widths: [640, 1080, 1920], sizes: '(max-width: 1000px) 100vw, 40vw' })} alt={p.hero.image.alt} data-parallax="0.12" fetchPriority="high" decoding="async" />
            </figure>
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- People ---------- */}
        <section className="tm-people" id="people" data-theme="light">
          <span className="pp-label rv">{p.people.label}</span>
          <h2 className="split">{p.people.title}</h2>
          {p.people.note ? <p className="ts-note rv d1">{p.people.note}</p> : null}

          {/* Featured (Paul): on top, separated from everyone else */}
          {lead.map((m) => (
            <a key={m.slug} className="tm-lead rv" href={`/team/${m.slug}`} data-cursor="View">
              <Photo m={m} sizes="(max-width: 1000px) 100vw, 45vw" />
              <span className="tm-lead-copy">
                {m.group ? <span className="tm-group">{m.group}</span> : null}
                <b className="tm-lead-name">{m.name}</b>
                <span className="tm-role">{m.role}</span>
                {m.tagline ? <span className="tm-tagline">“{m.tagline}”</span> : null}
                <span className="tm-more">
                  View profile <ArrowUpRight />
                </span>
              </span>
            </a>
          ))}

          {rest.length ? (
            <div className="tm-grid">
              {rest.map((m, i) => (
                <a key={m.slug} className={`tm-card rv${i % 3 ? ` d${i % 3}` : ''}`} href={`/team/${m.slug}`} data-cursor="View">
                  <Photo m={m} sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 30vw" />
                  <span className="tm-group">
                    {m.group || 'Team'} / {pad(i + 1)}
                  </span>
                  <b className="tm-name">{m.name}</b>
                  <span className="tm-role">{m.role}</span>
                  <span className="tm-arrow" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </a>
              ))}
            </div>
          ) : null}
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="cx-cta ts-cta" id="start" data-theme="dark">
          <span className="pp-label rv">{p.cta.label}</span>
          <div className="ts-cta-row">
            <h2 className="split">
              <Lines items={p.cta.title} />
            </h2>
            {p.cta.button_label ? <Btn className="rv d2" href={p.cta.button_url} label={p.cta.button_label} /> : null}
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
