import type { AcademyItem } from '@/lib/dictionary';
import {
  PERSON_ID,
  SITE_URL,
  inLanguageFor,
  type SchemaLocale,
} from '@/lib/seo/constants';

export function buildArticleSchema(
  term: AcademyItem,
  locale: SchemaLocale = 'ro'
) {
  const pageUrl = `${SITE_URL}/academie/${term.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: term.term,
    name: term.term,
    description: term.definition,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    image: term.image.startsWith('http')
      ? term.image
      : `${SITE_URL}${term.image.startsWith('/') ? term.image : `/${term.image}`}`,
    author: {
      '@id': PERSON_ID,
    },
    publisher: {
      '@id': PERSON_ID,
    },
    articleSection: term.category,
    inLanguage: inLanguageFor(locale),
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2'],
    },
  };
}
