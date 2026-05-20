import { dictionary } from '@/lib/dictionary';

export type SitemapRouteConfig = {
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
};

export const STATIC_ROUTES: SitemapRouteConfig[] = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/curs', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/consultanta-crypto', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/audit-portofoliu', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/strategie-exit', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/despre', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/academie', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/termeni', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/confidentialitate', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/partnerships', changeFrequency: 'monthly', priority: 0.9 },
];

export function getAcademySitemapEntries(baseUrl: string) {
  return dictionary.map((item) => ({
    url: `${baseUrl}/academie/${item.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}
