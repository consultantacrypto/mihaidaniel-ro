import { MetadataRoute } from 'next';
import { getAcademySitemapEntries, STATIC_ROUTES } from '@/lib/sitemap-routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mihaidaniel.ro';
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const academyEntries = getAcademySitemapEntries(baseUrl).map(
    ({ url, changeFrequency, priority }) => ({
      url,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  return [...staticEntries, ...academyEntries];
}
