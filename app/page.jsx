import { Fragment } from 'react';
import { getContent, src, FALLBACK } from '../lib/content';
import { ArrowUpRight, ArrowDown, ArrowUp, Asterisk, TileIcon } from '../components/Icons';

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

/** Renders an array of lines with <br> between them. */
function Lines({ items }) {
  return (items || []).map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function Btn({ href, label, className = '' }) {
  return (
    <a className={`btn ${className}`.trim()} href={href || '#'}>
      {label} <ArrowUpRight />
    </a>
  );
}

function Phases({ slides }) {
  return (
    <span className="phases">
      {slides.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <> <i /> </>}
          {s.title}
        </Fragment>
      ))}
    </span>
  );
}

const pad = (n) => String(n).padStart(2, '0');
const delay = (i) => (i > 0 ? ` d${Math.min(i, 3)}` : '');

export default async function Home() {
  const c = await getContent();
  const { header: h, menus, hero, about, process: pr, contact: ct, footer: f } = c;
  const slides = pr.slides && pr.slides.length ? pr.slides : [];
  const logoLight = src(h.logo_light, FALLBACK.logoLight);
  const logoDark = src(h.logo_dark, FALLBACK.logoDark);

  return (
    <>
      {/* Fixed background video — every section scrolls over it */}
      <div className="bg" aria-hidden="true">
        <video id="bgVideo" autoPlay muted loop playsInline preload="auto" poster={src(hero.poster, FALLBACK.poster)}>
          <source src={src(hero.video, FALLBACK.video)} type={hero.video?.mime || 'video/mp4'} />
        </video>
        <canvas id="bgCanvas" hidden />
      </div>

      <header className="header" id="header">
        <a className="logo" href="#top" aria-label="Home">
          <img className="lg-light" src={logoLight} alt={h.logo_light?.alt || 'TechChoice'} />
          <img className="lg-dark" src={logoDark} alt="" aria-hidden="true" />
        </a>
        <nav className="nav">
          {menus.header.map((m, i) => (
            <a key={i} className="link" href={m.url} target={m.target || undefined}>
              {m.title}
            </a>
          ))}
          <Btn className="sm" href={h.cta_url} label={h.cta_label} />
          <button className="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
            <i />
            <i />
          </button>
        </nav>
      </header>

      <div className="menu" id="menu" aria-hidden="true">
        <div className="menu-bg" />
        <div className="menu-inner">
          <nav className="menu-nav" aria-label="Main">
            {menus.fullscreen.map((m, i) => (
              <a key={i} href={m.url} target={m.target || undefined}>
                <small>{pad(i + 1)}</small>
                <span className="t">{m.title}</span>
              </a>
            ))}
          </nav>
          <div className="menu-side">
            <div>
              <b>{f.address_label}</b>
              <Lines items={f.address} />
            </div>
            <div>
              <b>{h.menu_process_label}</b>
              <Phases slides={slides} />
            </div>
            <span className="menu-close-note">{h.menu_close_note}</span>
          </div>
        </div>
      </div>

      <div className="cursor" id="cursor" aria-hidden="true">
        <div className="ring">
          <em id="cursorTxt">Drag</em>
        </div>
        <div className="dot" />
      </div>

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
            <img src={src(about.image, FALLBACK.about)} alt={about.image?.alt || ''} />
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
                <img src={src(s.image, FALLBACK.slides[i] || FALLBACK.slides[0])} alt={s.image?.alt || ''} />
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
              <img src={src(ct.image, FALLBACK.contact)} alt={ct.image?.alt || ''} />
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
            <Phases slides={slides} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="f-grid">
          <div className="f-brand rv">
            <a href="#top" aria-label="Home">
              <img src={src(f.logo, logoDark)} alt={f.logo?.alt || 'TechChoice'} />
            </a>
            <p>
              <Lines items={f.tagline} />
            </p>
          </div>
          <nav className="rv d1" aria-label="Footer">
            <span className="f-label">{f.explore_label}</span>
            <div className="f-nav">
              {menus.footer.map((m, i) => (
                <a key={i} href={m.url} target={m.target || undefined}>
                  {m.title}
                </a>
              ))}
            </div>
          </nav>
          <div className="rv d2">
            <span className="f-label">{f.address_label}</span>
            <address className="f-addr">
              <Lines items={f.address} />
            </address>
          </div>
        </div>
        <div className="f-bottom">
          <span>{f.copyright}</span>
          <button className="totop" id="toTop" type="button">
            {f.back_to_top} <ArrowUp />
          </button>
        </div>
      </footer>
    </>
  );
}
