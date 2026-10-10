import { getControlPage } from '../../lib/control';
import PhasePage from '../../components/PhasePage';

// Instant refresh on WordPress save, otherwise every 5 minutes.
export const revalidate = 300;

export async function generateMetadata() {
  const { page } = await getControlPage();
  return { title: page.seo.title, description: page.seo.description };
}

export default async function ControlPage() {
  const { site, page } = await getControlPage();
  return <PhasePage site={site} page={page} variant="control" cols={2} />;
}
