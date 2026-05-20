import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_URL } from '@/lib/seo/constants';
import { routing, type Locale } from '@/i18n/routing';
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

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}${path === '/' ? '' : path}`,
      languages: {
        ro: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      locale: isEn ? 'en_US' : 'ro_RO',
      type: 'website',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeClient />;
}
