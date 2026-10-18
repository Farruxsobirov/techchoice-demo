import { getEventsPage } from '../../lib/events';
import BoothMap from '../../components/BoothMap';
import { ArrowUpRight } from '../../components/Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines, pad } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getEventsPage();
  return { title: page.seo.title, description: page.seo.description };
}

/** Plain lines + the gradient line underneath. */
function Title({ as: Tag = 'h2', t, className = 'split' }) {
  return (
    <Tag className={className}>
      <Lines items={t.title} />
      {t.accent ? (
        <>
          <br />
          <span className="ev-grad ev-acc" data-nosplit="">{t.accent}</span>
        </>
      ) : null}
    </Tag>
  );
}

function Head({ t, text }) {
  return (
    <div className="ev-head">
      <div>
        <span className="pp-label rv">{t.label}</span>
        <Title t={t} />
      </div>
      {text ? <p className="ev-side rv d1">{text}</p> : null}
    </div>
  );
}

export default async function EventsPage() {
  const { site, page: p } = await getEventsPage();
  const { header: h, menus, footer: f } = site;
  const { hero, services, after, why, faq, booth, cta } = p;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp ev">
        {/* ---------- Hero ---------- */}
        <section className="pp-hero ev-hero" id="top" data-theme="dark" data-hero>
          <i className="ev-orbit" aria-hidden="true" />
          <p className="crumb rv">{hero.eyebrow}</p>
          <h1 className="split chars" data-delay="200">
            <Lines items={hero.title} />
            {hero.accent ? (
              <>
                <br />
                <span className="ev-grad ev-acc" data-nosplit="">{hero.accent}</span>
              </>
            ) : null}
          </h1>
          <p className="pp-lead rv d2">{hero.lead}</p>
          <div className="ev-actions rv d3">
            {hero.button_label ? <Btn className="ev-white" href={hero.button_url} label={hero.button_label} /> : null}
            {hero.button2_label ? <Btn href={hero.button2_url} label={hero.button2_label} /> : null}
          </div>
          <div className="ev-facts">
            {hero.facts.map((x, i) => (
              <div key={i} className="rv" style={{ transitionDelay: `${0.35 + i * 0.1}s` }}>
                <b>{x.label}</b>
                <span>{x.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- What we do ---------- */}
        <section className="ev-sec ev-light" id="services" data-theme="light">
          <Head t={services} text={services.text} />
          <div className="ev-services">
            {services.items.map((s, i) => {
              const Row = s.url ? 'a' : 'div';
              return (
                <Row key={i} className="ev-svc rv" {...(s.url ? { href: s.url } : {})}>
                  <span className="ev-svc-n">{pad(i + 1)} /</span>
                  <h3>{s.title}</h3>
                  <p>
                    {s.tagline ? <b>{s.tagline}</b> : null}
                    {s.tagline && s.text ? <br /> : null}
                    {s.text}
                  </p>
                  {s.url ? (
                    <span className="ev-circle" aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  ) : (
                    <span />
                  )}
                </Row>
              );
            })}
          </div>
        </section>

        {/* ---------- After hours ---------- */}
        <section className="ev-sec ev-dark" id="after-hours" data-theme="dark">
          <Head t={after} text={after.text} />
          <div className="ev-dates">
            {after.dates.map((d, i) => (
              <div key={i} className={`ev-date rv${i ? ' d1' : ''}`}>
                <span className="pp-label">{d.day}</span>
                <h3>
                  {d.date} <ArrowUpRight />
                </h3>
                <p>{d.time}</p>
              </div>
            ))}
          </div>
          <div className="ev-steps">
            {after.steps.map((s, i) => (
              <article key={i} className={`rv${i ? ` d${Math.min(i, 3)}` : ''}`}>
                <h3>
                  {pad(i + 1)} / {s.title}
                </h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <div className="ev-prize">
            <Title as="h3" t={{ title: after.prize_title, accent: after.prize_accent }} />
            <p className="rv d1">{after.prizes}</p>
          </div>
        </section>

        {/* ---------- Why TechChoice ---------- */}
        <section className="ev-sec ev-grey" id="why" data-theme="light">
          <Head t={why} text={why.text} />
          <div className="ev-stats">
            {why.stats.map((s, i) => (
              <div key={i} className={`ev-stat rv${i ? ` d${Math.min(i, 3)}` : ''}`}>
                <strong {...(/^\d{4}$/.test(s.value) ? { 'data-count': s.value, 'data-from': Number(s.value) - 24 } : {})}>{s.value}</strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Straight answers ---------- */}
        <section className="ev-sec ev-light" id="faq" data-theme="light">
          <Head t={faq} />
          <div className="ev-faq">
            {faq.items.map((x, i) => (
              <div key={i} className="ev-faq-row rv">
                <h3>{x.q}</h3>
                <p>{x.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Find us ---------- */}
        <section className="ev-sec ev-grey" id="booth" data-theme="light">
          <div className="ev-booth">
            <div>
              <span className="pp-label rv">{booth.label}</span>
              <Title t={booth} />
              <p className="ev-booth-text rv d1">{booth.text}</p>
              {booth.button_label ? <Btn className="ink rv d2" href={booth.button_url} label={booth.button_label} /> : null}
            </div>
            <div className="ev-map rv d1">
              <span className="pp-label">{booth.map_label}</span>
              {booth.map_image ? (
                <img className="ev-plan" src={booth.map_image.url} alt={booth.map_image.alt || booth.map_label} loading="lazy" decoding="async" />
              ) : (
                <BoothMap booth={booth.booth} tag={booth.map_tag} label={booth.map_label} />
              )}
              <p>{booth.map_note}</p>
            </div>
          </div>
        </section>

        {/* ---------- Your next move ---------- */}
        <section className="ev-sec ev-dark ev-end" id="meet" data-theme="dark">
          <span className="pp-label rv">{cta.label}</span>
          <Title t={cta} />
          <p className="ev-end-text rv d1">{cta.text}</p>
          {cta.button_label ? <Btn className="ev-white rv d2" href={cta.button_url} label={cta.button_label} /> : null}
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
