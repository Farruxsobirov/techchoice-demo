/** /robots.txt — everything may be crawled except the API; points search engines to the sitemap. */
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/aaset/demo'] }],
    sitemap: 'https://techchoice.com/sitemap.xml',
    host: 'https://techchoice.com',
  };
}
