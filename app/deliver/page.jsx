import { getDeliverPage } from '../../lib/deliver';
import PhasePage from '../../components/PhasePage';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getDeliverPage();
  return { title: page.seo.title, description: page.seo.description };
}

export default async function DeliverPage() {
  const { site, page } = await getDeliverPage();
  return <PhasePage site={site} page={page} variant="deliver" cols={3} />;
}
