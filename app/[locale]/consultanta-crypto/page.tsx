import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqSection from '@/components/landing/FaqSection';
import JsonLd from '@/components/JsonLd';
import PaymentFeedback from '@/components/PaymentFeedback';
import ConsultancyPageHero from '@/components/consultancy/ConsultancyPageHero';
import ConsultancyTopics from '@/components/consultancy/ConsultancyTopics';
import ConsultancyProcess from '@/components/consultancy/ConsultancyProcess';
import { buildConsultancyServiceSchema } from '@/lib/seo/schemas/service';
import { buildFaqPageSchema, getConsultancyFaq } from '@/lib/seo/schemas/faq';
import { buildBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb';
import { SITE_URL, type SchemaLocale } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { routing, type Locale } from '@/i18n/routing';

const PAGE_PATH = '/consultanta-crypto';

function localePath(locale: Locale): string {
  return locale === routing.defaultLocale
    ? PAGE_PATH
    : `/en${PAGE_PATH}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'consultancyPage.metadata' });
  const isEn = locale === 'en';
  const path = localePath(locale as Locale);

  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    path,
    locale: isEn ? 'en_US' : 'ro_RO',
    image: '/mihai-daniel-consultanta.jpg',
    keywords: isEn
      ? [
          'crypto consulting',
          '1 on 1 crypto mentor',
          'portfolio discussion',
          'bitcoin consulting',
        ]
      : [
          'consultanta crypto',
          'mentor crypto romania',
          'discutie portofoliu',
          'consultanta bitcoin',
        ],
    alternates: {
      canonical: `${SITE_URL}${path === PAGE_PATH ? PAGE_PATH : path}`,
      languages: {
        ro: `${SITE_URL}${PAGE_PATH}`,
        en: `${SITE_URL}/en${PAGE_PATH}`,
        'x-default': `${SITE_URL}${PAGE_PATH}`,
      },
    },
  });
}

export default async function ConsultantaCryptoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const schemaLocale: SchemaLocale = locale === 'en' ? 'en' : 'ro';
  const t = await getTranslations({ locale, namespace: 'consultancyPage' });
  const faqItems = getConsultancyFaq(schemaLocale);
  const pageUrl =
    schemaLocale === 'en'
      ? `${SITE_URL}/en${PAGE_PATH}`
      : `${SITE_URL}${PAGE_PATH}`;

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-yellow-500/30">
      <JsonLd
        data={[
          buildConsultancyServiceSchema(pageUrl, schemaLocale),
          buildFaqPageSchema(faqItems, pageUrl, schemaLocale),
          buildBreadcrumbSchema(
            [
              {
                name: schemaLocale === 'en' ? 'Consulting' : 'Consultanță',
                path: PAGE_PATH,
              },
            ],
            schemaLocale
          ),
        ]}
      />

      <Suspense fallback={null}>
        <PaymentFeedback />
      </Suspense>

      <Navbar />
      <ConsultancyPageHero />
      <ConsultancyTopics />
      <ConsultancyProcess />
      <FaqSection title={t('faqTitle')} items={faqItems} />
      <Footer />
    </main>
  );
}
