import { notFound } from 'next/navigation';
import { getMember, fetchTeam } from '../../../lib/team';
import { rimg } from '../../../lib/img';
import { ArrowUpRight } from '../../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn } from '../../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes. New people get their page on first visit.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { members } = await fetchTeam();
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { member } = await getMember(slug);
  if (!member) return { title: 'Team — TechChoice' };
  return { title: `${member.name} — ${member.role ? `${member.role}, ` : ''}TechChoice`, description: member.tagline || `${member.name}, ${member.role} at TechChoice.` };
}

const first = (name) => String(name || '').split(/\s+/)[0];

export default async function MemberPage({ params }) {
  const { slug } = await params;
  const { site, page: p, member: m, next } = await getMember(slug);
  if (!m) notFound();
  const { header: h, menus, footer: f } = site;
  const hasMedia = m.spotify || m.video || m.video_url;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control tm tm-profile">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero dp-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">
            <a href="/team">TechChoice / Team</a> / {m.name}
          </p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              {m.group ? <span className="tm-group rv">{m.group}</span> : null}
              <h1 className="split chars" data-delay="200">
                {m.name}
              </h1>
              <p className="tm-hero-role rv d1">{m.role}</p>
              {m.tagline ? <p className="pp-lead rv d2">“{m.tagline}”</p> : null}
              {m.email || m.linkedin ? (
                <div className="tm-contact rv d3">
                  {m.email ? <Btn href={`mailto:${m.email}`} label={m.email} /> : null}
                  {m.linkedin ? <Btn href={m.linkedin} label="LinkedIn" /> : null}
                </div>
              ) : null}
            </div>
            <figure className="dp-hero-img tm-hero-photo rv d1">
              {m.photo ? (
                <img {...rimg(m.photo.url, { widths: [640, 1080], sizes: '(max-width: 1000px) 100vw, 40vw' })} alt={m.photo.alt || m.name} data-parallax="0.08" fetchPriority="high" decoding="async" />
              ) : null}
            </figure>
          </div>
        </section>

        {/* ---------- Bio ---------- */}
        {m.bio ? (
          <section className="pp-intro" id="about" data-theme="light">
            <div className="pp-intro-grid dp-problem-grid">
              <h2 className="split">
                {p.profile.bio_label} {first(m.name)}
              </h2>
              <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: m.bio }} />
            </div>
          </section>
        ) : null}

        {/* ---------- Playlist + video ---------- */}
        {hasMedia ? (
          <section className={`tm-media${m.spotify && (m.video || m.video_url) ? ' two' : ''}`} id="media" data-theme="dark">
            {m.video || m.video_url ? (
              <div className="tm-video rv">
                <span className="pp-label">{p.profile.video_label}</span>
                <div className="tm-frame">
                  {m.video ? (
                    <video src={m.video.url} controls playsInline preload="metadata" />
                  ) : (
                    <iframe src={m.video_url} title={`${m.name} — video`} loading="lazy" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
                  )}
                </div>
              </div>
            ) : null}
            {m.spotify ? (
              <div className="tm-spotify rv d1">
                <span className="pp-label">{p.profile.spotify_label}</span>
                <iframe src={m.spotify} title={`${m.name} — Spotify`} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ---------- Next person ---------- */}
        <section className="tm-next" data-theme="light">
          <a className="tm-back rv" href="/team">
            ← {p.profile.back_label}
          </a>
          {next ? (
            <a className="tm-next-link rv d1" href={`/team/${next.slug}`}>
              <span className="pp-label">Next</span>
              <b>
                {next.name} <ArrowUpRight />
              </b>
              <span className="tm-role">{next.role}</span>
            </a>
          ) : null}
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
