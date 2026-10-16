import { Fragment } from 'react';
import { getProcessPage, PHASE_FALLBACK_IMAGES } from '../../lib/process';
import { src } from '../../lib/content';
import { rimg } from '../../lib/img';
import { ArrowDown } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines, pad, HeroTitle } from '../../components/Chrome';

// Same refresh rules as the home page: instant on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getProcessPage();
  return { title: page.seo.title, description: page.seo.description };
}

/** Built-in phase icons for the hero card (used when no icon is uploaded in WordPress). */
const PHASE_ICONS = [
  // Design — compass
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="#ff2d55" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="5" r="2" />
    <path d="M11 6.8 5.5 20M13 6.8 18.5 20M7.6 14.6c2.8 1.3 6 1.3 8.8 0" />
  </svg>,
  // Deliver — linked blocks
  <svg key="v" viewBox="0 0 24 24" fill="none" stroke="#b03cff" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
    <path d="M11 7h3.5a2.5 2.5 0 0 1 2.5 2.5V13" />
  </svg>,
  // Control — target
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="#4d5bff" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 3v3M21 12h-3" />
  </svg>,
];

export default async function ProcessPage() {
  const { site, page: p } = await getProcessPage();
  const { header: h, menus, footer: f } = site;
  const items = p.phases.items;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} phases={items} />
      <Cursor />

      <main className="pp">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero" id="top" data-theme="dark" data-hero>
          <div className="pp-hero-grid">
            <div className="pp-hero-copy">
              <p className="crumb rv">{p.hero.breadcrumb}</p>
              <h1 className="split chars" data-delay="200">
                <HeroTitle items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            <aside className="pc rv d2" aria-label={p.hero.process_label}>
              <span className="pc-label">{p.hero.process_label}</span>
              <div className="pc-steps">
                {items.map((it, i) => (
                  <Fragment key={i}>
                    <div className="pc-step">
                      <span className="pc-ico">{it.icon ? <img src={it.icon.url} alt="" /> : PHASE_ICONS[i % PHASE_ICONS.length]}</span>
                      <span>
                        {pad(i + 1)} / {it.title}
                      </span>
                    </div>
                    {i < items.length - 1 && (
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

        {/* ---------- What is CYaaS ---------- */}
        <section className="pp-intro" id="what" data-theme="light">
          <span className="pp-label rv">{p.intro.label}</span>
          <div className="pp-intro-grid">
            <h2 className="split">
              <Lines items={p.intro.title} />
            </h2>
            {/* WYSIWYG from ACF: may contain its own <p> tags */}
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.intro.body }} />
          </div>
        </section>

        {/* ---------- Design. Deliver. Control. ---------- */}
        <section className="pp-phases" id="phases" data-theme="dark">
          <span className="pp-label rv">{p.phases.label}</span>
          <h2 className="split">{p.phases.title}</h2>
          <div className="ph-grid">
            {items.map((it, i) => (
              <article key={i} className={`ph-card rv${i ? ` d${Math.min(i, 3)}` : ''}`}>
                <div className="ph-img">
                  <img {...rimg(src(it.image, PHASE_FALLBACK_IMAGES[i % PHASE_FALLBACK_IMAGES.length]), { widths: [640, 1080], sizes: '(max-width: 1000px) 100vw, 33vw' })} alt={it.image?.alt || ''} loading="lazy" decoding="async" />
                </div>
                <span className="ph-num">{pad(i + 1)}</span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
                {it.button_label ? <Btn href={it.button_url} label={it.button_label} /> : null}
              </article>
            ))}
          </div>
          <p className="ph-foot rv">{p.phases.foot}</p>
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="pp-cta" id="start" data-theme="light">
          <span className="pp-label rv">{p.cta.label}</span>
          <div className="pp-cta-row">
            <h2 className="split">
              <Lines items={p.cta.title} />
            </h2>
            {p.cta.button_label ? <Btn className="ink rv d2" href={p.cta.button_url} label={p.cta.button_label} /> : null}
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
