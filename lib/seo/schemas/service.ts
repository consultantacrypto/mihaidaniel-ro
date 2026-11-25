import {
  CONSULTANCY_PACKAGE_ORDER,
  CONSULTANCY_PACKAGES,
} from '@/lib/consultancy-packages';
import {
  PERSON_ID,
  SITE_URL,
  inLanguageFor,
  type SchemaLocale,
} from '@/lib/seo/constants';

const COPY: Record<SchemaLocale, { name: string; description: string }> = {
  ro: {
    name: 'Consultanță crypto',
    description:
      'Consultanță crypto online cu Mihai Daniel: sesiune 1:1 de 60 de minute (200 EUR, cu 2 analize tehnice), pachet de 3 sesiuni (540 EUR) sau mentorat de 6 săptămâni (1500 EUR). Nu este sfat financiar.',
  },
  en: {
    name: 'Crypto consulting',
    description:
      'Online crypto consulting with Mihai Daniel: a 60-minute 1:1 session (€200, with 2 technical analyses), a 3-session pack (€540), or 6-week mentoring (€1500). Not financial advice.',
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
    serviceType: 'Educational Consulting',
    provider: {
      '@id': PERSON_ID,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Romania',
    },
    offers: CONSULTANCY_PACKAGE_ORDER.map((id) => {
      const pkg = CONSULTANCY_PACKAGES[id];
      return {
        '@type': 'Offer' as const,
        name: pkg.offerName[locale],
        price: String(pkg.unitAmount / 100),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      };
    }),
    inLanguage: inLanguageFor(locale),
  };
}
