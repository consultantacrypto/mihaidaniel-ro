import {
  AUDIENCE_STATS,
  CONTACT_EMAIL,
  ORGANIZATION_ID,
  PERSON_ID,
  SAME_AS,
  SITE_URL,
} from '@/lib/seo/constants';

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Mihai Daniel',
    alternateName: 'Mihai Daniel Marius',
    url: SITE_URL,
    image: `${SITE_URL}/mihai-daniel-consultanta.jpg`,
    jobTitle: [
      'Consultant Crypto',
      'Crypto Educator',
      'KOL',
      'Investment Mentor',
    ],
    description:
      'Antreprenor și KOL crypto din România. Consultanță premium, mentorat 1-la-1 și educație financiară pentru investitori serioși.',
    nationality: {
      '@type': 'Country',
      name: 'Romania',
    },
    knowsAbout: [
      'Cryptocurrency',
      'Bitcoin',
      'Trading',
      'Blockchain',
      'Portfolio Strategy',
      'Financial Education',
    ],
    worksFor: {
      '@id': ORGANIZATION_ID,
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Expertise',
        name: 'Expert în analiză tehnică crypto',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Expertise',
        name: 'Expert în management de risc',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Expertise',
        name: 'Expert în strategii de exit',
      },
    ],
    sameAs: [...SAME_AS],
    email: CONTACT_EMAIL,
    audience: {
      '@type': 'Audience',
      audienceType: 'Crypto investors and traders',
      geographicArea: {
        '@type': 'Country',
        name: 'Romania',
      },
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/FollowAction',
        userInteractionCount: AUDIENCE_STATS.youtube,
        name: 'YouTube Subscribers',
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/FollowAction',
        userInteractionCount: AUDIENCE_STATS.tiktok,
        name: 'TikTok Followers',
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/FollowAction',
        userInteractionCount: AUDIENCE_STATS.twitter,
        name: 'X (Twitter) Followers',
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/FollowAction',
        userInteractionCount: AUDIENCE_STATS.linkedin,
        name: 'LinkedIn Followers',
      },
    ],
  };
}
