import { getTestimonialsPage } from '../../lib/testimonials';
import { rimg } from '../../lib/img';
import { Header, FullMenu, Cursor, Footer, Btn, Lines } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getTestimonialsPage();
  return { title: page.seo.title, description: page.seo.description };
}

const QuoteMark = ({ className }) => (
  <svg className={className} viewBox="0 0 64 48" aria-hidden="true">
    <path d="M0 48V30.6C0 13.7 7.4 3.5 22.1 0l3.4 6.1C17.6 8.9 13.5 14.3 13.2 22.3H26V48H0Zm38 0V30.6C38 13.7 45.4 3.5 60.1 0l3.4 6.1c-7.9 2.8-12 8.2-12.3 16.2H64V48H38Z" />
  </svg>
);

function Story({ t, big, i }) {
  const who = [t.name, t.role, t.company].filter(Boolean);
  return (
    <figure className={`ts-card rv${big ? ' big' : i % 2 ? ' d1' : ''}`}>
      <QuoteMark className="ts-q" />
      <blockquote>{t.quote}</blockquote>
      {who.length ? (
        <figcaption>
          {t.photo ? <img {...rimg(t.photo.url, { widths: [128, 256], sizes: '56px' })} alt="" loading="lazy" decoding="async" /> : null}
          <span>{who.join(' · ')}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

export default async function TestimonialsPage() {
  const { site, page: p } = await getTestimonialsPage();
  const { header: h, menus, footer: f } = site;
  const [first, ...rest] = p.stories.items;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control ts">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero dp-hero has-path ts-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <Lines items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            <aside className="ts-aside rv d2">
              <QuoteMark className="ts-bigq" />
              <span className="ts-tag">
                <Lines items={p.hero.tagline} />
              </span>
            </aside>
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- Client stories ---------- */}
        <section className={`ts-stories${p.stories.placeholder ? ' is-pending' : ''}`} id="stories" data-theme="light">
          <span className="pp-label rv">{p.stories.label}</span>
          <h2 className="split">{p.stories.title}</h2>
          {p.stories.note ? <p className="ts-note rv d1">{p.stories.note}</p> : null}
          {first ? <Story t={first} big /> : null}
          {rest.length ? (
            <div className="ts-grid">
              {rest.map((t, i) => (
                <Story key={i} t={t} i={i} />
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
