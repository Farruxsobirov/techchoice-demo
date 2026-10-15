import { Fragment } from 'react';
import { ArrowUpRight, ArrowUp } from './Icons';
import { FALLBACK, src } from '../lib/content';

/* Shared pieces used by every page: header, full-screen menu, cursor, footer. */

export const pad = (n) => String(n).padStart(2, '0');

/** Renders an array of lines with <br> between them. */
export function Lines({ items }) {
  return (items || []).map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export function Btn({ href, label, className = '' }) {
  return (
    <a className={`btn ${className}`.trim()} href={href || '#'}>
      {label} <ArrowUpRight />
    </a>
  );
}

/** "Design — Deliver — Control" made from a list of {title}. */
export function Phases({ items }) {
  return (
    <span className="phases">
      {(items || []).map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <> <i /> </>}
          {s.title}
        </Fragment>
      ))}
    </span>
  );
}

/** Sub-items (and their sub-items, indented) as one flat list for the dropdown. */
const flatten = (items, depth = 0) => (items || []).flatMap((c) => [{ ...c, depth }, ...flatten(c.children, depth + 1)]);

export function Header({ header: h, menus, homeHref = '#top' }) {
  const logoLight = src(h.logo_light, FALLBACK.logoLight);
  const logoDark = src(h.logo_dark, FALLBACK.logoDark);
  return (
    <header className="header" id="header">
      <a className="logo" href={homeHref} aria-label="Home">
        <img className="lg-light" src={logoLight} alt={h.logo_light?.alt || 'TechChoice'} decoding="async" />
        <img className="lg-dark" src={logoDark} alt="" aria-hidden="true" decoding="async" />
      </a>
      <nav className="nav">
        {menus.header.map((m, i) =>
          m.children && m.children.length ? (
            <div key={i} className="nav-item has-sub">
              <a className="link" href={m.url} target={m.target || undefined} aria-haspopup="true" aria-expanded="false">
                {m.title}
                <svg className="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M2.5 4.5 6 8l3.5-3.5" />
                </svg>
              </a>
              <div className="sub">
                <div className="sub-in">
                  {flatten(m.children).map((c, j) => (
                    <a key={j} href={c.url} target={c.target || undefined} className={c.depth ? 'deep' : undefined} style={{ '--j': j }}>
                      {c.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <a key={i} className="link" href={m.url} target={m.target || undefined}>
              {m.title}
            </a>
          )
        )}
        <Btn className="sm" href={h.cta_url} label={h.cta_label} />
        <button className="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
          <i />
          <i />
        </button>
      </nav>
    </header>
  );
}

export function FullMenu({ header: h, menus, footer: f, phases }) {
  return (
    <div className="menu" id="menu" aria-hidden="true">
      <div className="menu-bg" />
      <div className="menu-inner">
        <nav className="menu-nav" aria-label="Main" style={{ '--n': menus.fullscreen.length }}>
          {menus.fullscreen.map((m, i) => (
            <Fragment key={i}>
              <a href={m.url} target={m.target || undefined}>
                <small>{pad(i + 1)}</small>
                <span className="t">{m.title}</span>
              </a>
              {m.children && m.children.length ? (
                <div className="menu-sub">
                  {flatten(m.children).map((c, j) => (
                    <a key={j} href={c.url} target={c.target || undefined}>
                      <span className="t">{c.title}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </Fragment>
          ))}
        </nav>
        <div className="menu-side">
          <div>
            <b>{f.address_label}</b>
            <Lines items={f.address} />
          </div>
          {phases && phases.length ? (
            <div>
              <b>{h.menu_process_label}</b>
              <Phases items={phases} />
            </div>
          ) : null}
          <span className="menu-close-note">{h.menu_close_note}</span>
        </div>
      </div>
    </div>
  );
}

export function Cursor() {
  return (
    <div className="cursor" id="cursor" aria-hidden="true">
      <div className="ring">
        <em id="cursorTxt">Drag</em>
      </div>
      <div className="dot" />
    </div>
  );
}

/**
 * Footer. If the Footer Menu has sub-items, each top-level item becomes a column
 * (the item itself first, then its children) — as in the Process page design.
 * Otherwise it is one "Explore" column.
 */
export function Footer({ footer: f, header: h, menus, homeHref = '#top' }) {
  const logo = src(f.logo, src(h.logo_dark, FALLBACK.logoDark));
  const columns = menus.footer.some((m) => m.children && m.children.length);
  return (
    <footer className={`footer${columns ? ' has-cols' : ''}`}>
      <div className="f-grid">
        <div className="f-brand rv">
          <a href={homeHref} aria-label="Home">
            <img src={logo} alt={f.logo?.alt || 'TechChoice'} loading="lazy" decoding="async" />
          </a>
          <p>
            <Lines items={f.tagline} />
          </p>
        </div>
        {columns ? (
          <nav className="f-cols rv d1" aria-label="Footer">
            {menus.footer.map((m, i) => (
              <div key={i} className="f-nav">
                <a href={m.url} target={m.target || undefined}>
                  {m.title}
                </a>
                {m.children.map((c, j) => (
                  <a key={j} href={c.url} target={c.target || undefined}>
                    {c.title}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        ) : (
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
        )}
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
  );
}
