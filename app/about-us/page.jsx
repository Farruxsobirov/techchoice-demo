import { getAboutPage } from '../../lib/about';
import HeroMedia from '../../components/HeroMedia';
import { rimg } from '../../lib/img';
import { Header, FullMenu, Cursor, Footer, Btn, Lines, HeroTitle, rich } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getAboutPage();
  return { title: page.seo.title, description: page.seo.description };
}

/** The year is always shown in the TechChoice gradient; stars typed around it are ignored. */
const yearText = (v) => String(v || '').replace(/\*/g, '').trim();

/** "2014" counts up from a few years earlier; anything that isn't a plain number is shown as is. */
function yearAttrs(v) {
  const n = /^\d{3,4}$/.test(yearText(v)) ? Number(yearText(v)) : null;
  return n ? { 'data-count': n, 'data-from': Math.max(0, n - 24) } : {};
}

export default async function AboutPage() {
  const { site, page: p } = await getAboutPage();
  const { header: h, menus, footer: f } = site;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control ab">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero dp-hero has-path ab-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <HeroTitle items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{rich(p.hero.lead)}</p>
            </div>
            <aside className="ab-year rv d2">
              <b className="ab-num tg" {...yearAttrs(p.hero.year)}>
                {yearText(p.hero.year)}
              </b>
              <span className="ab-tag">
                <Lines items={p.hero.tagline} />
              </span>
              <span className="ab-motto">
                {p.hero.motto.map((l, i) => (
                  <span key={i} className="ab-line" style={{ '--i': i }}>
                    {l}
                  </span>
                ))}
              </span>
            </aside>
          </div>
          <p className="pp-foot rv d3">{rich(p.hero.foot)}</p>
        </section>

        {/* ---------- Our story ---------- */}
        <section className="pp-intro" id="story" data-theme="light">
          <span className="pp-label rv">{p.story.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.story.title} />
            </h2>
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.story.body }} />
          </div>
        </section>

        {/* ---------- What we believe ---------- */}
        <section className="pp-intro ab-dark" id="believe" data-theme="dark">
          <span className="pp-label rv">{p.believe.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.believe.title} />
            </h2>
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.believe.body }} />
          </div>
        </section>

        {/* ---------- Boston ---------- */}
        <section className="ab-boston" id="boston" data-theme="light">
          <span className="pp-label rv">{p.boston.label}</span>
          <div className="ab-boston-grid">
            <HeroMedia className="ab-img rv" image={p.boston.image} video={p.boston.video} sizes="(max-width: 1000px) 100vw, 45vw" parallax="0.1" />
            <div className="ab-boston-copy">
              <h2 className="split">{p.boston.title}</h2>
              <p className="ab-text rv d1">{rich(p.boston.text)}</p>
              {p.boston.address ? <p className="ab-addr rv d1">{p.boston.address}</p> : null}
              {p.boston.note ? <p className="ab-note rv d2">{rich(p.boston.note)}</p> : null}
              {p.boston.button_label ? <Btn className="ink rv d2" href={p.boston.button_url} label={p.boston.button_label} /> : null}
            </div>
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
