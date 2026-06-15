import {
  PERSON_ID,
  SITE_URL,
  inLanguageFor,
  type SchemaLocale,
} from '@/lib/seo/constants';
import { buildConsultancyReviews } from '@/lib/seo/schemas/reviews';

const COPY: Record<
  SchemaLocale,
  { name: string; description: string }
> = {
  ro: {
    name: 'Consultanță VIP Crypto 1 la 1',
    description:
      'Sesiune privată de o oră cu Mihai Daniel: audit portofoliu crypto, corecție greșeli și strategie de exit personalizată.',
  },
  en: {
    name: 'VIP 1-on-1 Crypto Consulting',
    description:
      'A private one-hour session with Mihai Daniel: crypto portfolio audit, mistake correction and a personalized exit strategy.',
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
      availability: 'https://schema.org/LimitedAvailability',
      url: pageUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '38',
      bestRating: '5',
      worstRating: '1',
    },
    review: buildConsultancyReviews(locale),
    inLanguage: inLanguageFor(locale),
  };
}
