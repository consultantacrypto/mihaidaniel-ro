import { articles } from '@/lib/articles';

export async function GET() {
  const baseUrl = 'https://mihaidaniel.ro';
  
  // Construim Header-ul RSS
  const rssHeader = `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Mihai Daniel - Știri Crypto & Analize</title>
      <link>${baseUrl}</link>
      <description>Cele mai importante știri crypto, analize on-chain și educație financiară explicate de Mihai Daniel.</description>
      <language>ro</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  `;

  // Generăm itemii (articolele)
  const rssItems = articles.map((article) => {
    return `
      <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${baseUrl}/stiri/${article.slug}</link>
        <guid isPermaLink="true">${baseUrl}/stiri/${article.slug}</guid>
        <description><![CDATA[${article.summary}]]></description>
        <pubDate>${new Date(article.date).toUTCString()}</pubDate>
        <enclosure url="${article.image}" length="0" type="image/jpeg"/>
      </item>
    `;
  }).join('');

  const rssFooter = `
    </channel>
    </rss>
  `;

  // Asamblăm totul
  const xml = rssHeader + rssItems + rssFooter;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}