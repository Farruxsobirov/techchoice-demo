import { getControlPlusPage } from '../../lib/controlPlus';
import { LineIcon } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines, HeroTitle, rich } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getControlPlusPage();
  return { title: page.seo.title, description: page.seo.description };
}

const Ico = ({ item }) => (item.custom_icon ? <img src={item.custom_icon.url} alt="" /> : <LineIcon name={item.icon} />);

/** "5%" → count-up attributes; text like "No cost" stays as it is. */
function countAttrs(v) {
  const m = String(v || '').match(/^(\D*)(\d+)(\D*)$/);
  return m ? { 'data-count': m[2], 'data-pre': m[1], 'data-suf': m[3] } : {};
}

export default async function ControlPlusPage() {
  const { site, page: p } = await getControlPlusPage();
  const { header: h, menus, footer: f } = site;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control cx">
        {/* ---------- Hero with the platform panel ---------- */}
        <section className="pp-hero cx-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <h1 className="split chars" data-delay="200">
            <HeroTitle items={p.hero.title} />
          </h1>
          <p className="pp-lead rv d2">{rich(p.hero.lead)}</p>

          <div className="cx-panel rv d3" aria-label={p.hero.panel_title}>
            <span className="cx-panel-title">{p.hero.panel_title}</span>
            <div className="cx-mods" style={{ '--cols': Math.min(p.hero.modules.length, 4) }}>
              {p.hero.modules.map((m, i) => (
                <div key={i} className="cx-mod" style={{ '--i': i }}>
                  <span className="dp-ico">
                    <Ico item={m} />
                  </span>
                  <b>{m.title}</b>
                  {m.tags ? <span className="cx-tags">{m.tags}</span> : null}
                </div>
              ))}
            </div>
            <ol className="cx-flow" style={{ '--n': p.hero.flow.length }}>
              {p.hero.flow.map((s, i) => (
                <li key={i} className="cx-step">
                  <span className="cx-step-ico">
                    <Ico item={s} />
                  </span>
                  <span>{s.label}</span>
                </li>
              ))}
              <i className="cx-flow-line" aria-hidden="true" />
            </ol>
            {p.hero.panel_note ? <p className="cx-note">{p.hero.panel_note}</p> : null}
          </div>
          <p className="pp-foot rv">{rich(p.hero.foot)}</p>
        </section>

        {/* ---------- What is CONTROL+ ---------- */}
        <section className="pp-intro" id="what" data-theme="light">
          <span className="pp-label rv">{p.intro.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.intro.title} />
            </h2>
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.intro.body }} />
          </div>
        </section>

        {/* ---------- Platform capabilities ---------- */}
        <section className="dp-included" id="capabilities" data-theme="dark">
          <span className="pp-label rv">{p.capabilities.label}</span>
          <h2 className="split">{p.capabilities.title}</h2>
          <div className="dp-cards" style={{ '--cols': 2 }}>
            {p.capabilities.items.map((it, i) => (
              <article key={i} className={`dp-card rv${i % 2 ? ' d1' : ''}`}>
                <span className="dp-ico">
                  <Ico item={it} />
                </span>
                <h3>{it.title}</h3>
                <p>{rich(it.text)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Platform demo (HTML from WordPress, served in its own frame) ---------- */}
        {p.demo.show ? (
          <section className="cx-demo" id="demo" data-theme="dark">
            {p.demo.label ? <span className="pp-label rv">{p.demo.label}</span> : null}
            {p.demo.title ? <h2 className="split">{p.demo.title}</h2> : null}
            <div className="cx-demo-frame rv d1">
              <iframe src="/aaset/demo" title={p.demo.title || 'Platform demo'} loading="lazy" style={{ height: p.demo.height }} />
            </div>
          </section>
        ) : null}

        {/* ---------- Why CONTROL+ ---------- */}
        <section className="pp-intro" id="why" data-theme="light">
          <span className="pp-label rv">{p.why.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.why.title} />
            </h2>
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.why.body }} />
          </div>
        </section>

        {/* ---------- Performance guarantee ---------- */}
        {p.guarantee.show ? (
          <section className="cx-guarantee" id="guarantee" data-theme="dark">
            {p.guarantee.label ? <span className="pp-label rv">{p.guarantee.label}</span> : null}
            {p.guarantee.title ? <h2 className="split">{p.guarantee.title}</h2> : null}
            {p.guarantee.body ? <p className="cx-g-body rv d1">{rich(p.guarantee.body)}</p> : null}
            {p.guarantee.note ? <p className="cx-g-note rv d2">{rich(p.guarantee.note)}</p> : null}
          </section>
        ) : null}

        {/* ---------- Pricing ---------- */}
        {p.pricing.show ? (
          <section className={`cx-pricing${p.pricing.image ? ` has-img img-${p.pricing.image_position}` : ''}`} id="pricing" data-theme="light">
            <div className="cx-p-grid">
              <div className="cx-p-main">
                {p.pricing.label ? <span className="pp-label rv">{p.pricing.label}</span> : null}
                {p.pricing.title ? <h2 className="split">{p.pricing.title}</h2> : null}
                {p.pricing.lead ? <div className="cx-p-lead cx-rich rv d1" dangerouslySetInnerHTML={{ __html: p.pricing.lead }} /> : null}
                {p.pricing.tiers.length ? (
                  <div className="cx-tiers" style={{ '--n': p.pricing.tiers.length }}>
                    {p.pricing.tiers.map((t, i) => (
                      <div key={i} className={`cx-tier rv${t.highlight ? ' hl' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                        <span className="cx-t-label">{t.label}</span>
                        <b className="cx-t-value" {...countAttrs(t.value)}>
                          {t.value}
                        </b>
                        <span className="cx-t-cap">{rich(t.caption)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {p.pricing.note ? <div className="cx-p-note cx-rich rv" dangerouslySetInnerHTML={{ __html: p.pricing.note }} /> : null}
              </div>
              {p.pricing.image ? (
                <figure className="cx-p-img rv d1">
                  <img src={p.pricing.image.url} alt={p.pricing.image.alt} loading="lazy" decoding="async" />
                </figure>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ---------- Call to action ---------- */}
        <section className="cx-cta" id="start" data-theme="dark">
          <span className="pp-label rv">{p.cta.label}</span>
          <div className="cx-cta-grid">
            <h2 className="split">
              <Lines items={p.cta.title} />
            </h2>
            <div className="cx-cta-side">
              <p className="rv d1">{rich(p.cta.text)}</p>
              {p.cta.button_label ? <Btn className="rv d2" href={p.cta.button_url} label={p.cta.button_label} /> : null}
            </div>
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
