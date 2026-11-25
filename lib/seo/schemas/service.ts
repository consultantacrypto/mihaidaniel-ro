import {
  CONSULTANCY_PACKAGE_ORDER,
  CONSULTANCY_PACKAGES,
  consultancyOfferDescription,
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
      `Consultanță crypto online cu Mihai Daniel: sesiune 1:1, 200 EUR, cu ${CONSULTANCY_PACKAGES.sesiune.includedAnalyses} analize tehnice; pachet 3 sesiuni, 540 EUR, cu ${CONSULTANCY_PACKAGES['pachet-3'].includedAnalyses} analize; mentorat 6 săptămâni, 1500 EUR, cu chat și ${CONSULTANCY_PACKAGES['mentorat-6'].includedAnalyses} analize. Nu este sfat financiar.`,
  },
  en: {
    name: 'Crypto consulting',
    description:
      `Online crypto consulting with Mihai Daniel: 1:1 session, €200, with ${CONSULTANCY_PACKAGES.sesiune.includedAnalyses} technical analyses; 3-session pack, €540, with ${CONSULTANCY_PACKAGES['pachet-3'].includedAnalyses} analyses; 6-week mentoring, €1500, with chat and ${CONSULTANCY_PACKAGES['mentorat-6'].includedAnalyses} analyses. Not financial advice.`,
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
        description: consultancyOfferDescription(id, locale),
        price: String(pkg.unitAmount / 100),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      };
    }),
    inLanguage: inLanguageFor(locale),
  };
}
