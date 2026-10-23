import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { publicCheckerConfig } from '@/lib/verifica-adresa/config';
import { OPERATOR } from '@/lib/verifica-adresa/sources';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '@/lib/verifica-adresa/copy';
import { VerificaAdresaChecker } from './checker';

type Search = Record<string, string | string[] | undefined>;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function queryString(search: Search): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    const item = first(value);
    if (item) query.set(key, item);
  }
  return query.toString();
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const search = await searchParams;
  const embed = first(search.embed) === '1';
  return {
    ...buildPageMetadata({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: '/verifica-adresa',
      locale: 'ro_RO',
      keywords: [
        'verificare adresă crypto',
        'sancțiuni OFAC',
        'adresă wallet',
        'TRON',
        'ETH',
        'BTC',
        'Solana',
      ],
    }),
    robots: embed ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/verifica-adresa`,
      languages: {
        ro: `${SITE_URL}/verifica-adresa`,
        'x-default': `${SITE_URL}/verifica-adresa`,
      },
    },
  };
}

export default async function VerificaAdresaPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const search = await searchParams;
  if (locale !== 'ro') {
    const qs = queryString(search);
    redirect(qs ? `/verifica-adresa?${qs}` : '/verifica-adresa');
  }

  const embed = first(search.embed) === '1';
  const payment = first(search.plata);
  const paymentNotice = payment === 'succes' ? 'success' : payment === 'anulata' ? 'cancelled' : null;
  const config = publicCheckerConfig();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: PAGE_TITLE,
    url: `${SITE_URL}/verifica-adresa`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'ro-RO',
    description: PAGE_DESCRIPTION,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: OPERATOR.legalName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: OPERATOR.street,
        addressLocality: OPERATOR.city,
        addressRegion: OPERATOR.region,
        postalCode: OPERATOR.postalCode,
        addressCountry: OPERATOR.country,
      },
    },
  };

  return (
    <div className={embed ? 'bg-[#02050a] text-white' : 'min-h-screen bg-[#02050a] text-white'}>
      {embed ? (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: "document.documentElement.classList.add('verifica-embed')",
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html:
                'html.verifica-embed .cookie-banner{display:none!important}html.verifica-embed body{padding-bottom:0!important}',
            }}
          />
        </>
      ) : (
        <Navbar />
      )}
      <main className={embed ? 'px-4 py-6' : 'px-4 pb-20 pt-28 md:px-8'}>
        <VerificaAdresaChecker config={config} embed={embed} paymentNotice={paymentNotice} />
      </main>
      {embed ? null : <Footer />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
