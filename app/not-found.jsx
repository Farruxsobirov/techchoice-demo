import { fetchSite, mapSite } from '../lib/content';
import { Header, FullMenu, Cursor, Footer, Btn } from '../components/Chrome';

export const metadata = { title: 'Page not found — TechChoice', robots: { index: false } };

/** Shown for any URL that doesn't exist, and for pages that are trashed / unpublished in WordPress. */
export default async function NotFound() {
  const { header: h, menus, footer: f } = mapSite(await fetchSite());
  return (
    <>
      <Header header={h} menus={menus} homeHref="/" />
      <FullMenu header={h} menus={menus} footer={f} />
      <Cursor />
      <main className="pp nf">
        <section className="pp-hero nf-hero" id="top" data-theme="dark" data-hero>
          <p className="crumb rv">TechChoice / 404</p>
          <b className="nf-num rv d1" aria-hidden="true">404</b>
          <h1 className="split chars" data-delay="200">
            This page isn’t here anymore.
          </h1>
          <p className="pp-lead rv d2">It may have been moved or taken down. Everything else is still where you left it.</p>
          <div className="nf-actions rv d3">
            <Btn href="/" label="Back to home" />
          </div>
        </section>
      </main>
      <Footer footer={f} header={h} menus={menus} homeHref="/" />
    </>
  );
}
