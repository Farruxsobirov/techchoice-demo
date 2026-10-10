import { splitStat } from '../lib/phase';
import { LineIcon } from './Icons';
import { Header, FullMenu, Cursor, Footer, Btn, Lines } from './Chrome';

/* Shared layout of the phase pages (Design, Deliver, …). */

/** Staircase Gantt card: each step starts where the previous one is mostly done. */
function CriticalPath({ path }) {
  const n = path.steps.length;
  const w = n > 1 ? Math.min(42, Math.max(24, 100 / (n * 0.7))) : 60; // bar width, % of the track
  const step = n > 1 ? (100 - w) / (n - 1) : 0;
  // Elbow connector from the previous bar (near its end) down to the start of this bar.
  const link = (i) => {
    const from = (i - 1) * step + w * 0.82;
    const to = i * step;
    return { left: `${Math.min(from, to)}%`, width: `${Math.max(Math.abs(from - to), 0.6)}%`, flip: from < to };
  };
  return (
    <aside className="cp rv d2" aria-label={path.label} style={{ '--n': n }}>
      <span className="pc-label">{path.label}</span>
      <div className="cp-chart">
        {path.steps.map((s, i) => (
          <div key={i} className="cp-row" style={{ '--i': i }}>
            <span className="cp-name">{s}</span>
            <span className="cp-track">
              {i > 0 ? (() => {
                const l = link(i);
                return <i className={`cp-link${l.flip ? ' flip' : ''}`} style={{ left: l.left, width: l.width }} aria-hidden="true" />;
              })() : null}
              <i className="cp-bar" style={{ left: `${i * step}%`, width: `${w}%` }} />
            </span>
          </div>
        ))}
      </div>
      <p className="cp-foot">{path.foot}</p>
    </aside>
  );
}

export default function PhasePage({ site, page: p, variant, cols = 2 }) {
  const { header: h, menus, footer: f } = site;
  const st = p.value.stats;
  const stat = st ? splitStat(st.number) : null;

  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />

      <main className={`pp dp dp--${variant}`}>
        {/* ---------- Hero ---------- */}
        <section className={`pp-hero dp-hero${p.hero.path ? ' has-path' : ''}`} id="top" data-theme="dark" data-hero>
          <p className="crumb rv">{p.hero.breadcrumb}</p>
          <div className="dp-hero-grid">
            <div className="dp-hero-copy">
              <h1 className="split chars" data-delay="200">
                <Lines items={p.hero.title} />
              </h1>
              <p className="pp-lead rv d2">{p.hero.lead}</p>
            </div>
            {p.hero.path ? (
              <CriticalPath path={p.hero.path} />
            ) : p.hero.image ? (
              <figure className="dp-hero-img rv d1">
                <img src={p.hero.image.url} alt={p.hero.image.alt} data-parallax="0.12" />
              </figure>
            ) : null}
          </div>
          <p className="pp-foot rv d3">{p.hero.foot}</p>
        </section>

        {/* ---------- The problem we solve ---------- */}
        <section className="pp-intro dp-problem" id="problem" data-theme="light">
          <span className="pp-label rv">{p.problem.label}</span>
          <div className="pp-intro-grid dp-problem-grid">
            <h2 className="split">
              <Lines items={p.problem.title} />
            </h2>
            {/* WYSIWYG from ACF: may contain its own <p> tags */}
            <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.problem.body }} />
          </div>
          {p.problem.image ? (
            <figure className="dp-wide rv">
              <img src={p.problem.image.url} alt={p.problem.image.alt} data-parallax="0.1" />
            </figure>
          ) : null}
        </section>

        {/* ---------- What's included ---------- */}
        <section className="dp-included" id="included" data-theme="dark">
          <span className="pp-label rv">{p.included.label}</span>
          <h2 className="split">{p.included.title}</h2>
          <div className="dp-cards" style={{ '--cols': cols }}>
            {p.included.items.map((it, i) => (
              <article key={i} className={`dp-card rv${i % cols ? ` d${Math.min(i % cols, 3)}` : ''}`}>
                <span className="dp-ico">{it.custom_icon ? <img src={it.custom_icon.url} alt="" /> : <LineIcon name={it.icon} />}</span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- The value ---------- */}
        <section className={`dp-value${st ? ' has-stats' : ''}`} id="value" data-theme="light">
          <span className="pp-label rv">{p.value.label}</span>
          {st ? (
            <>
              <h2 className="split">{p.value.title}</h2>
              <div className="dv-stats">
                <div className="dv-stat rv">
                  <b className="dv-num" {...(stat ? { 'data-count': stat.num, 'data-pre': stat.pre, 'data-suf': stat.suf, 'data-grouped': stat.grouped ? '1' : undefined } : {})}>
                    {st.number}
                  </b>
                  <span className="dv-cap">{st.label}</span>
                </div>
                <div className="dv-compare rv d1">
                  <div className="dv-row">
                    <s className="dv-from">{st.from}</s>
                    <svg className="dv-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
                    <b className="dv-to">{st.to}</b>
                  </div>
                  <i className="dv-bar" aria-hidden="true" />
                  <span className="dv-cap">{st.caption}</span>
                </div>
              </div>
            </>
          ) : null}

          {p.value.body_left !== null || p.value.body_right !== null ? (
            <div className="dv-body">
              <div className="pp-body rv" dangerouslySetInnerHTML={{ __html: p.value.body_left || '' }} />
              <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.value.body_right || '' }} />
            </div>
          ) : (
            <div className="pp-intro-grid dv-split">
              <h2 className="split">{p.value.title}</h2>
              <div className="pp-body rv d1" dangerouslySetInnerHTML={{ __html: p.value.body || '' }} />
            </div>
          )}
          {p.value.button_label ? <Btn className="ink rv" href={p.value.button_url} label={p.value.button_label} /> : null}
        </section>
      </main>

      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}

