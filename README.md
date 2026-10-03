# TechChoice — home page (Next.js + headless WordPress)

Content comes from WordPress (WP_URL):

| What | Where in WordPress | Endpoint |
|---|---|---|
| Hero, About, How we work (texts), Let's get to work | **Pages → Home** (ACF field group "Home Page", Show in REST API = Yes) | `/wp/v2/pages/<front page id>?acf_format=standard` |
| Slider | **Process Slides** post type (`process_slide`, REST base `process-slides`) — ACF fields `image`, `text`, `link`, `original_colors`; order = Page Attributes → Order | `/wp/v2/process-slides` |
| Header, footer, logos | **Site Settings** (plugin *TechChoice Site Settings*) | `/techchoice/v1/site` |
| Menus | **Appearance → Menus**, locations `header`, `fullscreen`, `footer` | `/techchoice/v1/site` |

Anything empty or unreachable falls back to `lib/defaults.json` and the files in `public/`, so the page never goes blank.

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Value |
|---|---|
| `WP_URL` | `https://wordpress-1606055-6708565.cloudwaysapps.com` (no trailing slash) |
| `REVALIDATE_SECRET` | the **Refresh secret** from WordPress → Site Settings → Connection |
| `WP_SLIDES_REST_BASE` | optional, default `process-slides` |
| `WP_HOME_SLUG` | optional, only used if no static homepage is set; default `home` |

## Updates
Saving Site Settings, a menu, the Home page or a slide makes WordPress call `POST /api/revalidate`;
the page rebuilds within seconds. Without that call it still refreshes every 5 minutes.
Manual refresh: `https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>`

## Files
- `lib/content.js` — reads WordPress and maps it to the page (with fallbacks)
- `app/page.jsx` — page markup
- `app/globals.css` — styles
- `public/site.js` — animations, slider, menu, cursor, smooth scroll
- `app/api/revalidate/route.js` — refresh endpoint

## Local development
```
npm install
cp .env.example .env.local   # then edit
npm run dev
```
