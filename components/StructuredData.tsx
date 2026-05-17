export default function StructuredData() {
  const baseUrl = 'https://www.mihaidaniel.ro';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mihai Daniel',
    alternateName: 'Mihai Daniel Marius',
    url: baseUrl,
    image: `${baseUrl}/mihai-daniel-consultanta.jpg`,
    jobTitle: 'Consultant Crypto & Mentor în Investiții',
    description:
      'Antreprenor și KOL crypto din România. Mentorat 1-la-1, consultanță premium și educație financiară pentru investitori serioși.',
    nationality: { '@type': 'Country', name: 'Romania' },
    knowsAbout: [
      'Cryptocurrency',
      'Trading',
      'Blockchain',
      'Financial Education',
      'Investment Strategy',
    ],
    sameAs: [
      'https://www.youtube.com/@DanielMihaiCrypto',
      'https://x.com/MIhaiDanielWeb3',
      'https://www.tiktok.com/@mihaidanielmarius',
      'https://www.linkedin.com/in/mihaidanielmarius/',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mihai Daniel',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description:
      'Brand personal de consultanță crypto, mentorat și cursuri premium pentru investitori.',
    founder: { '@type': 'Person', name: 'Mihai Daniel' },
    sameAs: personSchema.sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'consultantacrypto.ro@gmail.com',
      contactType: 'sales',
      areaServed: 'RO',
      availableLanguage: ['Romanian', 'English'],
    },
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Curs Complet Trading Crypto',
    description:
      'Program intensiv de trading: analiză tehnică, strategii validate și disciplină instituțională. 4+ ore de conținut premium.',
    provider: { '@type': 'Person', name: 'Mihai Daniel', url: baseUrl },
    url: `${baseUrl}/curs`,
    offers: {
      '@type': 'Offer',
      price: '300',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/curs`,
    },
    educationalLevel: 'Intermediate',
    inLanguage: 'ro',
  };

  const consultancySchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Consultanță VIP Crypto 1 la 1',
    description:
      'Sesiune privată de o oră: audit portofoliu, strategie de exit și plan de acțiune personalizat cu Mihai Daniel.',
    provider: { '@type': 'Person', name: 'Mihai Daniel', url: baseUrl },
    url: `${baseUrl}/#consultanta`,
    areaServed: { '@type': 'Country', name: 'Romania' },
    offers: {
      '@type': 'Offer',
      price: '250',
      priceCurrency: 'USD',
      availability: 'https://schema.org/LimitedAvailability',
      url: `${baseUrl}/#consultanta`,
    },
    serviceType: 'Financial Consulting',
  };

  const schemas = [personSchema, organizationSchema, courseSchema, consultancySchema];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
