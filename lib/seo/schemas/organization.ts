import {
  CONTACT_EMAIL,
  ORGANIZATION_ID,
  PERSON_ID,
  SAME_AS,
  SITE_URL,
} from '@/lib/seo/constants';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Mihai Daniel',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      'Brand personal de consultanță crypto, mentorat și cursuri premium pentru investitori din România.',
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
