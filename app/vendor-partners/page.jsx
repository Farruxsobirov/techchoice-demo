import { Fragment } from 'react';
import { getPartnersPage } from '../../lib/partners';
import { rimg } from '../../lib/img';
import { LineIcon, ArrowDown } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getPartnersPage();
  return { title: page.seo.title, description: page.seo.description };
}

const Ico = ({ item }) => (item.custom_icon ? <img src={item.custom_icon.url} alt="" /> : <LineIcon name={item.icon} />);

/** Three per row; a short last row stretches to fill the width (2 → halves, 1 → full width). */
function span(i, n) {
  const rem = n % 3;
  if (!rem || i < n - rem) return 2;
  return rem === 1 ? 6 : 3;
}

export default async function VendorPartnersPage() {
  const { site, page: p } = await getPartnersPage();
  const { header: h, menus, footer: f } = site;
  const steps = p.hero.steps;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control vp">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero dp-hero has-path vp-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <Lines items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            <aside className="pc pc--plain rv d2" aria-label={p.hero.card_label}>
              <span className="pc-label">{p.hero.card_label}</span>
              <div className="pc-steps">
                {steps.map((s, i) => (
                  <Fragment key={i}>
                    <div className="pc-step">
                      <span className="pc-ico">
                        <Ico item={s} />
                      </span>
                      <span>{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="pc-arrow" aria-hidden="true">
                        <ArrowDown />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </aside>
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- How we work with vendors ---------- */}
        <section className="pp-intro dp-problem" id="how" data-theme="light">
          <span className="pp-label rv">{p.how.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.how.title} />
            </h2>
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.how.body }} />
          </div>
          {p.how.image ? (
            <figure className="dp-wide vp-wide rv">
              <img {...rimg(p.how.image.url, { widths: [828, 1200, 2048], sizes: '100vw' })} alt={p.how.image.alt} data-parallax="0.1" loading="lazy" decoding="async" />
            </figure>
          ) : null}
        </section>

        {/* ---------- Why not go direct ---------- */}
        <section className="dp-included vp-why" id="why" data-theme="dark">
          <span className="pp-label rv">{p.why.label}</span>
          <h2 className="split">{p.why.title}</h2>
          <div className="vp-grid">
            {p.why.items.map((it, i) => (
              <article key={i} className={`dp-card rv${i % 3 ? ` d${i % 3}` : ''}`} style={{ gridColumn: `span ${span(i, p.why.items.length)}` }}>
                <span className="dp-ico">
                  <Ico item={it} />
                </span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Vendor categories ---------- */}
        <section className="vp-cats" id="categories" data-theme="light">
          <span className="pp-label rv">{p.categories.label}</span>
          <h2 className="split">
            <Lines items={p.categories.title} />
          </h2>
          <div className="vp-grid">
            {p.categories.items.map((it, i) => (
              <article key={i} className={`vp-cat dp-card rv${i % 3 ? ` d${i % 3}` : ''}`} style={{ gridColumn: `span ${span(i, p.categories.items.length)}` }}>
                <span className="dp-ico">
                  <Ico item={it} />
                </span>
                <h3>{it.title}</h3>
              </article>
            ))}
          </div>
          {p.categories.button_label ? <Btn className="ink rv" href={p.categories.button_url} label={p.categories.button_label} /> : null}
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
