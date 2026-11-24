import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Course from '@/components/Course';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { routing, type Locale } from '@/i18n/routing';

const PAGE_PATH = '/curs';

function localePath(locale: Locale): string {
  return locale === routing.defaultLocale ? PAGE_PATH : `/en${PAGE_PATH}`;
}

const COPY = {
  ro: {
    title: 'Curs de trading crypto',
    description:
      'Curs de trading crypto cu Mihai Daniel: masterclass 4K, 20+ strategii și acces pe viață.',
    keywords: ['curs trading crypto', 'curs bitcoin', 'masterclass trading'],
  },
  en: {
    title: 'Crypto Trading Course',
    description:
      'Crypto trading course with Mihai Daniel: 4K masterclass, 20+ strategies, and lifetime access.',
    keywords: ['crypto trading course', 'bitcoin course', 'trading masterclass'],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = localePath(isEn ? 'en' : 'ro');
  const copy = isEn ? COPY.en : COPY.ro;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path,
    locale: isEn ? 'en_US' : 'ro_RO',
    image: '/mihai-daniel-icon.jpg',
    keywords: [...copy.keywords],
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        ro: `${SITE_URL}${PAGE_PATH}`,
        en: `${SITE_URL}/en${PAGE_PATH}`,
        'x-default': `${SITE_URL}${PAGE_PATH}`,
      },
    },
  });
}

export default async function CursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === 'en';

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <div className="pt-20">
        <h1 className="container mx-auto px-6 pt-6 text-center text-4xl font-black tracking-tight text-white md:text-5xl">
          {isEn ? 'Crypto Trading Course' : 'Curs de trading crypto'}
        </h1>
        <Course stripeTrackingLabel="curs_page_stripe" />
      </div>
      <Footer />
    </main>
  );
}
