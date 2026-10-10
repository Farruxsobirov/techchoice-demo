import { getContent, src, FALLBACK } from '../lib/content';
import { rimg } from '../lib/img';
import { ArrowUpRight, ArrowDown, Asterisk, TileIcon } from '../components/Icons';
import { Header, FullMenu, Cursor, Footer, Lines, Btn, Phases, pad } from '../components/Chrome';

// Rebuild at most every 5 minutes on its own; WordPress triggers an instant rebuild on save.
export const revalidate = 300;

export async function generateMetadata() {
  const { seo, hero } = await getContent();
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, images: hero.poster?.url ? [hero.poster.url] : [] },
  };
}

const delay = (i) => (i > 0 ? ` d${Math.min(i, 3)}` : '');

export default async function Home() {
  const c = await getContent();
  const { header: h, menus, hero, about, process: pr, contact: ct, footer: f } = c;
  const slides = pr.slides && pr.slides.length ? pr.slides : [];

  return (
    <>
      {/* Fixed background video — every section scrolls over it */}
      <div className="bg" aria-hidden="true">
        {/* The file is attached by site.js after the page has loaded (keeps first paint fast) */}
        <video id="bgVideo" muted loop playsInline preload="none" poster={rimg(src(hero.poster, FALLBACK.poster), { widths: [1200], q: 70 }).src} data-src={src(hero.video, FALLBACK.video)} />
      </div>

      <Header header={h} menus={menus} />
      <FullMenu header={h} menus={menus} footer={f} phases={slides} />
      <Cursor />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="hero" id="top">
          <div className="hero-inner" id="heroInner">
            <div className="eyebrow rv">
              <Asterisk />
              {hero.eyebrow}
            </div>
            <h1 className="split chars" data-delay="250">
              {hero.title_1}
              <br className="br" /> {hero.title_2}
            </h1>
            <p className="hero-lead rv d2">{hero.lead}</p>
            <div className="hero-row rv d3">
              <Btn href={hero.button_link} label={hero.button_label} />
              <div className="hero-aside">
                <span>
                  <Lines items={hero.aside} />
                </span>
                <button className="pause" id="pauseBtn" type="button" aria-label="Pause background video">
                  <svg id="icoPause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="7" y="5" width="3.2" height="14" rx="1" />
                    <rect x="13.8" y="5" width="3.2" height="14" rx="1" />
                  </svg>
                  <svg id="icoPlay" viewBox="0 0 24 24" fill="currentColor" hidden aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>{hero.foot_left}</span>
            <span>
              {hero.foot_right} <ArrowDown />
            </span>
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section className="about" id="about" data-bg="white">
          <div className="about-img rv">
            <img {...rimg(src(about.image, FALLBACK.about), { widths: [640, 1080, 1920], sizes: '(max-width: 900px) 100vw, 50vw' })} alt={about.image?.alt || ''} loading="lazy" decoding="async" />
          </div>
          <div>
            <h2 className="split">{about.title}</h2>
            {/* WYSIWYG from ACF: may contain its own <p> tags */}
            <div className="about-body rv d1" dangerouslySetInnerHTML={{ __html: about.body }} />
            <p className="strong rv d2">{about.strong}</p>
            <Btn className="ink rv d3" href={about.button_link} label={about.button_label} />
          </div>
        </section>

        {/* ---------- How we work ---------- */}
        <section className="process" id="process" data-bg="dark" aria-roledescription="carousel" aria-label={pr.title}>
          <div className="p-top rv">
            <span>{pr.label}</span>
            <span className="cyaas">
              <b>
                {pr.badge}
                <sup>®</sup>
              </b>
              <small>{pr.badge_sub}</small>
            </span>
          </div>
          <div className="p-head">
            <h2 className="split">{pr.title}</h2>
            <p className="rv d2">
              <Lines items={pr.note} />
            </p>
          </div>

          <div className="slider rv d2" id="slider" data-cursor="Drag" data-autoplay={pr.autoplay_seconds}>
            {slides.map((s, i) => (
              <div key={i} className={`slide${s.original_colors ? ' keep' : ''}`} data-i={i} role="group" aria-label={`${i + 1} of ${slides.length}: ${s.title}`}>
                <img {...rimg(src(s.image, FALLBACK.slides[i] || FALLBACK.slides[0]), { widths: [640, 1080, 1920], sizes: '(max-width: 900px) 100vw, 60vw' })} alt={s.image?.alt || ''} loading="lazy" decoding="async" />
              </div>
            ))}
            <button className="arrow prev" id="prev" type="button" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <button className="arrow next" id="next" type="button" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="p-copy" aria-live="polite">
            {slides.map((s, i) => (
              <div key={i} className="item" data-i={i}>
                <h3 className="split chars live">{s.title}</h3>
                <p>{s.text}</p>
                {s.link_label ? (
                  <a className="explore" href={s.link_url || '#process'}>
                    {s.link_label} <ArrowUpRight />
                  </a>
                ) : null}
              </div>
            ))}
          </div>

          <div className="p-foot">
            <span>{pr.foot}</span>
            <div className="bars" id="bars">
              {slides.map((s, i) => (
                <button key={i} type="button" aria-label={`Go to ${s.title}`}>
                  <i />
                </button>
              ))}
            </div>
            <span className="count" id="count">
              01 — {pad(slides.length)}
            </span>
          </div>
        </section>

        {/* ---------- Let's get to work ---------- */}
        <section className="contact" id="contact" data-bg="white">
          <div className="c-top rv">
            <span>{ct.label}</span>
            <span>{ct.right_label}</span>
          </div>
          <div className="c-grid">
            <div className="c-left">
              <h2 className="c-title">
                {ct.title.map((line, i) => (
                  <span key={i} className="ln">
                    <span>{line}</span>
                  </span>
                ))}
              </h2>
              {ct.tiles && ct.tiles.length ? (
                <div className="tiles">
                  {ct.tiles.map((t, i) => (
                    <div key={i} className={`tile rv${delay(i)}`}>
                      {t.custom_icon ? <img className="tile-icon" src={t.custom_icon.url} alt="" /> : <TileIcon name={t.icon} />}
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="c-lead rv">
                <Lines items={ct.lead} />
              </p>
              <Btn className="ink rv d1" href={ct.button_link} label={ct.button_label} />
            </div>
            <figure className="c-visual" id="cVisual">
              <img {...rimg(src(ct.image, FALLBACK.contact), { widths: [640, 1080, 1920], sizes: '(max-width: 900px) 100vw, 50vw' })} alt={ct.image?.alt || ''} loading="lazy" decoding="async" />
              <figcaption>
                {ct.caption.map((line, i) => (
                  <span key={i} className="ln">
                    <span>{line}</span>
                  </span>
                ))}
              </figcaption>
              <i className="spectrum" />
            </figure>
          </div>
          <div className="c-foot rv">
            <span>{ct.foot_left}</span>
            <Phases items={slides} />
          </div>
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} />
    </>
  );
}
