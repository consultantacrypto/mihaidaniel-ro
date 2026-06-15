import {
  ORGANIZATION_ID,
  PERSON_ID,
  SITE_URL,
} from '@/lib/seo/constants';
import { buildCourseReviews } from '@/lib/seo/schemas/reviews';

const COURSE_ID = `${SITE_URL}/#course`;

type CourseLocale = 'ro' | 'en';

const COPY: Record<
  CourseLocale,
  { name: string; description: string; inLanguage: string; teaches: string[] }
> = {
  ro: {
    name: 'Curs Complet Investiții Crypto & Management de Risc',
    description:
      'Sistem complet de investiții în crypto: analiză tehnică, management de risc, dimensionarea pozițiilor și strategii de exit validate. Acces pe viață, lecții video premium și suport pentru investitori serioși.',
    inLanguage: 'ro-RO',
    teaches: [
      'Analiză tehnică crypto',
      'Management de risc',
      'Dimensionarea pozițiilor',
      'Strategii de exit',
      'Psihologia tradingului',
    ],
  },
  en: {
    name: 'Complete Crypto Investing & Risk Management Course',
    description:
      'A complete crypto investing system: technical analysis, risk management, position sizing and proven exit strategies. Lifetime access, premium video lessons and support for serious investors.',
    inLanguage: 'en-US',
    teaches: [
      'Crypto technical analysis',
      'Risk management',
      'Position sizing',
      'Exit strategies',
      'Trading psychology',
    ],
  },
};

/**
 * Schema educațională premium (Course + Offer + AggregateRating).
 * Folosește @id-urile globale (Person/Organization) pentru a întări entitatea,
 * fără a crea entități concurente.
 */
export function buildCourseSchema(locale: CourseLocale = 'ro') {
  const copy = COPY[locale];
  const courseUrl = `${SITE_URL}${locale === 'en' ? '/en' : ''}/#curs`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': COURSE_ID,
    name: copy.name,
    description: copy.description,
    url: courseUrl,
    inLanguage: copy.inLanguage,
    provider: {
      '@id': ORGANIZATION_ID,
    },
    author: {
      '@id': PERSON_ID,
    },
    educationalLevel: 'Beginner to Advanced',
    teaches: copy.teaches,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT10H',
      inLanguage: copy.inLanguage,
      instructor: {
        '@id': PERSON_ID,
      },
    },
    offers: {
      '@type': 'Offer',
      price: '250',
      priceCurrency: 'EUR',
      category: 'Paid',
      availability: 'https://schema.org/InStock',
      url: courseUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
    review: buildCourseReviews(locale),
  };
}
