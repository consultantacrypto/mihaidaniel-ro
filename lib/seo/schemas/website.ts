import {
  ORGANIZATION_ID,
  PERSON_ID,
  SITE_URL,
  WEBSITE_ID,
} from '@/lib/seo/constants';

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Mihai Daniel — Consultanță Crypto & Mentorat',
    url: SITE_URL,
    description:
      'Consultanță crypto premium, cursuri de trading și educație financiară pentru investitori serioși din România.',
    inLanguage: 'ro-RO',
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    author: {
      '@id': PERSON_ID,
    },
  };
}
