import { getServicesPage } from '../../lib/services';
import HeroMedia from '../../components/HeroMedia';
import { rimg } from '../../lib/img';
import { LineIcon } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines, HeroTitle } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getServicesPage();
  return { title: page.seo.title, description: page.seo.description };
}

const Ico = ({ item }) => (item.custom_icon ? <img src={item.custom_icon.url} alt="" /> : <LineIcon name={item.icon} />);

export default async function ServicesPage() {
  const { site, page: p } = await getServicesPage();
  const { header: h, menus, footer: f } = site;
  const items = p.directory.items;
  const lastFull = items.length % 2 === 1; // an odd last card spans the full width

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control sv">
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
            <HeroMedia className="dp-hero-img rv d1" image={p.hero.image} video={p.hero.video} sizes="(max-width: 1000px) 100vw, 40vw" parallax="0.12" priority />
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- Your full technology environment ---------- */}
        <section className="pp-intro" id="environment" data-theme="light">
          <span className="pp-label rv">{p.intro.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.intro.title} />
            </h2>
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.intro.body }} />
          </div>
        </section>

        {/* ---------- Full services directory ---------- */}
        <section className="dp-included" id="directory" data-theme="dark">
          <span className="pp-label rv">{p.directory.label}</span>
          <h2 className="split">
            <Lines items={p.directory.title} />
          </h2>
          <div className="dp-cards" style={{ '--cols': 2 }}>
            {items.map((it, i) => (
              <article key={i} className={`dp-card rv${i % 2 ? ' d1' : ''}`} style={lastFull && i === items.length - 1 ? { gridColumn: '1 / -1' } : undefined}>
                <span className="dp-ico">
                  <Ico item={it} />
                </span>
                <h3>{it.title}</h3>
                {it.text ? <p>{it.text}</p> : null}
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="cx-cta sv-cta" id="start" data-theme="light">
          <span className="pp-label rv">{p.cta.label}</span>
          <div className="cx-cta-grid">
            <h2 className="split">
              <Lines items={p.cta.title} />
            </h2>
            <div className="cx-cta-side">
              <p className="rv d1">{p.cta.text}</p>
              {p.cta.button_label ? <Btn className="ink rv d2" href={p.cta.button_url} label={p.cta.button_label} /> : null}
            </div>
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
