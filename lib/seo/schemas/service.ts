import { PERSON_ID, SITE_URL } from '@/lib/seo/constants';

export function buildConsultancyServiceSchema(
  pageUrl = `${SITE_URL}/consultanta-crypto`
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: 'Consultanță VIP Crypto 1 la 1',
    description:
      'Sesiune privată de o oră cu Mihai Daniel: audit portofoliu crypto, corecție greșeli și strategie de exit personalizată.',
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
      availability: 'https://schema.org/LimitedAvailability',
      url: pageUrl,
    },
    inLanguage: 'ro-RO',
  };
}
