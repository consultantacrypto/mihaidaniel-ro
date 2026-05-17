import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mihaidaniel.ro';
  const now = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/curs', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/despre', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/academie', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/termeni', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/confidentialitate', changeFrequency: 'yearly', priority: 0.3 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
