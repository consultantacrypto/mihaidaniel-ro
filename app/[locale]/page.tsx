import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildCourseSchema } from '@/lib/seo/schemas/course';
import { routing, type Locale } from '@/i18n/routing';
import JsonLd from '@/components/JsonLd';
import HomeClient from './home-client';

function localePath(locale: Locale): string {
  return locale === routing.defaultLocale ? '/' : '/en';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.metadata' });
  const path = localePath(locale as Locale);
  const isEn = locale === 'en';

  const canonicalPath = path === '/' ? '' : path;

  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    path: canonicalPath || '/',
    locale: isEn ? 'en_US' : 'ro_RO',
    image: isEn ? '/mihai-daniel-icon.jpg' : '/mihai-daniel-consultanta.jpg',
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: {
        ro: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/`,
      },
    },
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={buildCourseSchema(locale === 'en' ? 'en' : 'ro')} />
      <HomeClient />
    </>
  );
}
