import { revalidateTag, revalidatePath } from 'next/cache';
import { CONTENT_TAG } from '../../../lib/content';

/**
 * Called by the WordPress plugin after every save.
 * Header `x-revalidate-secret` must equal the REVALIDATE_SECRET environment variable.
 */
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get('x-revalidate-secret') || new URL(request.url).searchParams.get('secret');
  if (!secret) {
    return Response.json({ ok: false, error: 'REVALIDATE_SECRET is not set on the site.' }, { status: 500 });
  }
  if (given !== secret) {
    return Response.json({ ok: false, error: 'Wrong secret.' }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG);
  revalidatePath('/');
  return Response.json({ ok: true, revalidated: true, at: new Date().toISOString() });
}

/** Manual refresh from a browser: /api/revalidate?secret=... */
export const GET = POST;
