import { getDesignPage } from '../../lib/design';
import PhasePage from '../../components/PhasePage';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getDesignPage();
  return { title: page.seo.title, description: page.seo.description };
}

export default async function DesignPage() {
  const { site, page } = await getDesignPage();
  return <PhasePage site={site} page={page} variant="design" cols={2} />;
}
