import { getContactPage } from '../../lib/contact';
import HeroMedia from '../../components/HeroMedia';
import ContactForm from '../../components/ContactForm';
import { Header, FullMenu, Cursor, Footer, HeroTitle } from '../../components/Chrome';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getContactPage();
  return { title: page.seo.title, description: page.seo.description };
}

export default async function ContactPage() {
  const { site, page: p } = await getContactPage();
  const { header: h, menus, footer: f } = site;
  const tel = p.details.phone ? `tel:${p.details.phone.replace(/[^\d+]/g, '')}` : '';
  const hasMedia = !!(p.hero.image || p.hero.video);

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className="pp dp dp--control ct">
        {/* ---------- Hero ---------- */}
        <section className={`pp-hero dp-hero${hasMedia ? '' : ' ct-hero-plain'}`} id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <HeroTitle items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            {hasMedia ? <HeroMedia className="dp-hero-img rv d1" image={p.hero.image} video={p.hero.video} sizes="(max-width: 1000px) 100vw, 40vw" parallax="0.12" priority /> : null}
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- Details + form ---------- */}
        <section className="ct-main" id="form" data-theme="light">
          <div className="ct-grid">
            <div className="ct-info">
              <span className="pp-label rv">{p.details.label}</span>
              {p.details.title ? <h2 className="split">{p.details.title}</h2> : null}
              <dl className="ct-list rv d1">
                {p.details.email ? (
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${p.details.email}`}>{p.details.email}</a>
                    </dd>
                  </div>
                ) : null}
                {p.details.phone ? (
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={tel}>{p.details.phone}</a>
                    </dd>
                  </div>
                ) : null}
                {p.details.address.length ? (
                  <div>
                    <dt>Office</dt>
                    <dd>
                      {p.details.address.map((l, i) => (
                        <span key={i} className="ct-line">
                          {l}
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
                {p.details.hours ? (
                  <div>
                    <dt>Hours</dt>
                    <dd>{p.details.hours}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="ct-card rv d1">
              <span className="pp-label">{p.form.label}</span>
              {p.form.title ? <h3 className="ct-card-title">{p.form.title}</h3> : null}
              {p.form.html ? (
                <ContactForm html={p.form.html} />
              ) : (
                <p className="ct-fallback">
                  {p.form.fallback}{' '}
                  {p.details.email ? <a href={`mailto:${p.details.email}`}>{p.details.email}</a> : null}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
