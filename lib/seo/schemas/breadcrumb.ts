import { SITE_URL, type SchemaLocale } from '@/lib/seo/constants';

export type BreadcrumbItem = {
  name: string;
  /** Path relativ (ex: `/consultanta-crypto`) sau URL absolut. */
  path: string;
};

function toAbsolute(path: string): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized === '/' ? '' : normalized}`;
}

/**
 * Generează o schemă BreadcrumbList. Primul element ("Home"/"Acasă") este
 * adăugat automat în funcție de locale.
 */
export function buildBreadcrumbSchema(
  trail: BreadcrumbItem[],
  locale: SchemaLocale = 'ro'
) {
  const home: BreadcrumbItem = {
    name: locale === 'en' ? 'Home' : 'Acasă',
    path: locale === 'en' ? '/en' : '/',
  };

  const items = [home, ...trail];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsolute(item.path),
    })),
  };
}
