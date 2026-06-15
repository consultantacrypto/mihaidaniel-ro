import {
  ORGANIZATION_ID,
  PERSON_ID,
  SITE_URL,
  WEBSITE_ID,
  inLanguageFor,
  type SchemaLocale,
} from '@/lib/seo/constants';

const COPY: Record<SchemaLocale, { name: string; description: string }> = {
  ro: {
    name: 'Mihai Daniel — Consultanță Crypto & Mentorat',
    description:
      'Consultanță crypto premium, cursuri de trading și educație financiară pentru investitori serioși din România.',
  },
  en: {
    name: 'Mihai Daniel — Crypto Consulting & Mentorship',
    description:
      'Premium crypto consulting, trading courses and financial education for serious investors.',
  },
};

export function buildWebSiteSchema(locale: SchemaLocale = 'ro') {
  const copy = COPY[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: copy.name,
    url: SITE_URL,
    description: copy.description,
    inLanguage: inLanguageFor(locale),
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    author: {
      '@id': PERSON_ID,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/academie?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2'],
    },
  };
}
