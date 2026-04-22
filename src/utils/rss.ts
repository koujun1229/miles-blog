/**
 * note.com RSS フェッチユーティリティ
 *
 * 使用方法:
 *   const posts = await fetchNoteRSS('your-note-account');
 *
 * note.com の RSS URL形式:
 *   https://note.com/{account_id}/rss
 */

export interface NotePost {
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  thumbnail?: string;
}

export async function fetchNoteRSS(accountId: string, limit = 5): Promise<NotePost[]> {
  const rssUrl = `https://note.com/${accountId}/rss`;

  try {
    const res = await fetch(rssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroBlog/1.0)' },
      // Cloudflare Pages のビルド時にはキャッシュを活用
      // @ts-ignore
      cf: { cacheEverything: true, cacheTtl: 3600 },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    return parseRSSItems(xml, limit);
  } catch (e) {
    console.warn('[NoteRSS] Failed to fetch:', e);
    return [];
  }
}

function parseRSSItems(xml: string, limit: number): NotePost[] {
  // シンプルなXMLパーサー（外部依存なし）
  const items: NotePost[] = [];
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  for (const match of itemMatches.slice(0, limit)) {
    const item = match[1];

    const title       = extractText(item, 'title');
    const link        = extractText(item, 'link') || extractCDATA(item, 'link');
    const pubDateStr  = extractText(item, 'pubDate');
    const description = stripHTML(extractCDATA(item, 'description') || extractText(item, 'description') || '');
    const thumbnail   = extractAttr(item, 'media:thumbnail', 'url') || extractAttr(item, 'enclosure', 'url');

    if (!title || !link) continue;

    items.push({
      title: stripCDATA(title),
      link,
      pubDate: pubDateStr ? new Date(pubDateStr) : new Date(),
      description: description.slice(0, 120) + (description.length > 120 ? '…' : ''),
      thumbnail: thumbnail || undefined,
    });
  }

  return items;
}

function extractText(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`));
  return m ? m[1].trim() : '';
}

function extractCDATA(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>`));
  return m ? m[1].trim() : '';
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`));
  return m ? m[1] : '';
}

function stripCDATA(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function stripHTML(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}
