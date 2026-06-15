export const SITE_URL = 'https://www.mihaidaniel.ro';

export const PERSON_ID = `${SITE_URL}/#person`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const CONTACT_EMAIL = 'consultantacrypto.ro@gmail.com';

export const SAME_AS = [
  'https://www.youtube.com/@DanielMihaiCrypto',
  'https://x.com/MIhaiDanielWeb3',
  'https://www.tiktok.com/@mihaidanielmarius',
  'https://www.linkedin.com/in/mihaidanielmarius/',
] as const;

export const AUDIENCE_STATS = {
  totalReach: 280000,
  youtube: 96600,
  tiktok: 118000,
  twitter: 56700,
  linkedin: 13200,
} as const;

export type SchemaLocale = 'ro' | 'en';

/** Mapează locale-ul aplicației la codul BCP-47 folosit în schemele JSON-LD. */
export function inLanguageFor(locale: SchemaLocale = 'ro'): 'ro-RO' | 'en-US' {
  return locale === 'en' ? 'en-US' : 'ro-RO';
}
