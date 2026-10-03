import {
  PERSON_ID,
  SITE_URL,
  inLanguageFor,
  type SchemaLocale,
} from '@/lib/seo/constants';

const COPY: Record<
  SchemaLocale,
  { name: string; description: string }
> = {
  ro: {
    name: 'Consultanță crypto 1 la 1',
    description:
      'Sesiune privată online de 60 de minute cu Mihai Daniel: întrebări despre portofoliu crypto, riscuri și deciziile pe care le ai de luat — 200 EUR.',
  },
  en: {
    name: '1-on-1 crypto consulting',
    description:
      'A private 60-minute online session with Mihai Daniel: your questions about crypto portfolio, risks, and the decisions you need to make — €200.',
  },
};

export function buildConsultancyServiceSchema(
  pageUrl = `${SITE_URL}/consultanta-crypto`,
  locale: SchemaLocale = 'ro'
) {
  const copy = COPY[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: copy.name,
    description: copy.description,
    url: pageUrl,
    serviceType: 'Financial Consulting',
    provider: {
      '@id': PERSON_ID,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Romania',
    },
    offers: {
      '@type': 'Offer',
      price: '200',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    },
    inLanguage: inLanguageFor(locale),
  };
}
