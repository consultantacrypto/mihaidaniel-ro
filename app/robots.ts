import { MetadataRoute } from 'next';

const BASE = 'https://www.mihaidaniel.ro';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/r/' },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: '/r/' },
      { userAgent: 'Google-Extended', allow: '/', disallow: '/r/' },
      { userAgent: 'ClaudeBot', allow: '/', disallow: '/r/' },
      { userAgent: 'anthropic-ai', allow: '/', disallow: '/r/' },
      { userAgent: 'PerplexityBot', allow: '/', disallow: '/r/' },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/r/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
