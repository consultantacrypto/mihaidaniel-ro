import {
  CONTACT_EMAIL,
  ORGANIZATION_ID,
  PERSON_ID,
  SAME_AS,
  SITE_URL,
  type SchemaLocale,
} from '@/lib/seo/constants';

const DESCRIPTION: Record<SchemaLocale, string> = {
  ro: 'Brand personal de consultanță crypto, mentorat și cursuri premium pentru investitori din România.',
  en: 'Personal brand for crypto consulting, mentorship and premium courses for investors.',
};

export function buildOrganizationSchema(locale: SchemaLocale = 'ro') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Mihai Daniel',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: DESCRIPTION[locale],
    founder: {
      '@id': PERSON_ID,
    },
    sameAs: [...SAME_AS],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'sales',
      areaServed: 'RO',
      availableLanguage: ['Romanian', 'English'],
    },
  };
}
