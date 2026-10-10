import { getDesignPage, splitStat, DESIGN_DEFAULTS } from '../../lib/design';
import { src } from '../../lib/content';
import { LineIcon } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines } from '../../components/Chrome';

// Same refresh rules as the other pages: instant on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getDesignPage();
  return { title: page.seo.title, description: page.seo.description };
}

const delay = (i) => (i % 2 ? ' d1' : '');

export default async function DesignPage() {
  const { site, page: p } = await getDesignPage();
  const { header: h, menus, footer: f } = site;
  const stat = splitStat(p.value.stat_number);

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero dp-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <Lines items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            <figure className="dp-hero-img rv d1">
              <img src={src(p.hero.image, DESIGN_DEFAULTS.hero.image)} alt={p.hero.image?.alt || ''} data-parallax="0.12" />
            </figure>
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- The problem we solve ---------- */}
        <section className="pp-intro" id="problem" data-theme="light">
          <span className="pp-label rv">{p.problem.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.problem.title} />
            </h2>
            {/* WYSIWYG from ACF: may contain its own <p> tags */}
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.problem.body }} />
          </div>
        </section>

        {/* ---------- What's included ---------- */}
        <section className="dp-included" id="included" data-theme="dark">
          <span className="pp-label rv">{p.included.label}</span>
          <h2 className="split">{p.included.title}</h2>
          <div className="dp-cards">
            {p.included.items.map((it, i) => (
              <article key={i} className={`dp-card rv${delay(i)}`}>
                <span className="dp-ico">{it.custom_icon ? <img src={it.custom_icon.url} alt="" /> : <LineIcon name={it.icon} />}</span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- The value ---------- */}
        <section className="dp-value" id="value" data-theme="light">
          <span className="pp-label rv">{p.value.label}</span>
          <h2 className="split">{p.value.title}</h2>

          <div className="dv-stats">
            <div className="dv-stat rv">
              <b className="dv-num" {...(stat ? { 'data-count': stat.num, 'data-pre': stat.pre, 'data-suf': stat.suf, 'data-grouped': stat.grouped ? '1' : undefined } : {})}>
                {p.value.stat_number}
              </b>
              <span className="dv-cap">{p.value.stat_label}</span>
            </div>
            <div className="dv-compare rv d1">
              <div className="dv-row">
                <s className="dv-from">{p.value.compare_from}</s>
                <svg className="dv-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
                <b className="dv-to">{p.value.compare_to}</b>
              </div>
              <i className="dv-bar" aria-hidden="true" />
              <span className="dv-cap">{p.value.compare_label}</span>
            </div>
          </div>

          <div className="dv-body">
            <div className="pp-body rv" dangerouslySetInnerHTML={{ __html: p.value.body_left }} />
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.value.body_right }} />
          </div>
          {p.value.button_label ? <Btn className="ink rv" href={p.value.button_url} label={p.value.button_label} /> : null}
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
