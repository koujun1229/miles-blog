import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://miles-blog.pages.dev';

  const cards    = await getCollection('cards',    ({ data }) => !data.draft);
  const hotels   = await getCollection('hotels',   ({ data }) => !data.draft);
  const strategy = await getCollection('strategy', ({ data }) => !data.draft);

  const staticPages = ['', '/blog', '/blog/cards', '/blog/hotels', '/blog/strategy'];

  const postUrls = [
    ...cards.map(e => `/blog/cards/${e.slug}`),
    ...hotels.map(e => `/blog/hotels/${e.slug}`),
    ...strategy.map(e => `/blog/strategy/${e.slug}`),
  ];

  const allUrls = [...staticPages, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${site}${url}/</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
