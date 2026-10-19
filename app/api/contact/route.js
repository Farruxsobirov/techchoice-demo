/**
 * Contact form → Contact Form 7 (on the WordPress site).
 * Receives the form fields from the Contact page and forwards them to CF7's REST endpoint,
 * which validates them, runs its spam checks and sends the email (through the SMTP plugin).
 */
export async function POST(request) {
  const base = (process.env.WP_URL || '').replace(/\/+$/, '');
  let data;
  try {
    data = await request.formData();
  } catch {
    return Response.json({ status: 'failed', message: 'Invalid request.' }, { status: 400 });
  }
  const id = String(data.get('_wpcf7') || '');
  if (!base || !/^\d+$/.test(id)) {
    return Response.json({ status: 'failed', message: 'The form is not set up yet. Please email us directly.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/wp-json/contact-form-7/v1/contact-forms/${id}/feedback`, {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'TechChoice site',
        'X-Forwarded-For': request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '',
        Referer: request.headers.get('referer') || '',
      },
      cache: 'no-store',
    });
    const json = await res.json().catch(() => null);
    if (!json || typeof json !== 'object') {
      return Response.json({ status: 'failed', message: 'The message could not be sent. Please email us directly.' }, { status: 502 });
    }
    return Response.json(
      { status: json.status, message: json.message, invalid_fields: json.invalid_fields || [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return Response.json({ status: 'failed', message: 'The message could not be sent. Please email us directly.' }, { status: 502 });
  }
}
