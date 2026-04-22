import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const cards    = await getCollection('cards',    ({ data }) => !data.draft);
  const hotels   = await getCollection('hotels',   ({ data }) => !data.draft);
  const strategy = await getCollection('strategy', ({ data }) => !data.draft);

  const allPosts = [
    ...cards.map(e => ({ ...e, category: 'cards' })),
    ...hotels.map(e => ({ ...e, category: 'hotels' })),
    ...strategy.map(e => ({ ...e, category: 'strategy' })),
  ].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const siteUrl = context.site?.toString() ?? 'https://miles-blog.pages.dev';

  return rss({
    title: '【週6勤務の限界旅行好き】ホテル・マイル活用法',
    description: '忙しい30代のためのマイル・ホテルポイント・クレジットカード活用術。',
    site: siteUrl,
    items: allPosts.map(post => ({
      title:       post.data.title,
      pubDate:     post.data.pubDate,
      description: post.data.description,
      link:        `/blog/${post.category}/${post.slug}/`,
    })),
    customData: `<language>ja</language>`,
  });
}
