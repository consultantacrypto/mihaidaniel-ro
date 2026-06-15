import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Space_Grotesk, Inter } from 'next/font/google';
import Script from 'next/script';
import GlobalJsonLd from '@/components/GlobalJsonLd';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo/constants';
import { DEFAULT_OG_IMAGE, TWITTER_SITE } from '@/lib/seo/metadata';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function localePath(locale: Locale, path = ''): string {
  const suffix = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  if (locale === routing.defaultLocale) {
    return suffix || '/';
  }
  return `/en${suffix}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isEn
        ? 'Mihai Daniel | Crypto KOL & Educator'
        : 'Mihai Daniel | Consultanță Crypto & Mentorat',
      template: '%s | Mihai Daniel',
    },
    description: isEn
      ? 'Mihai Daniel — crypto KOL, educator, and premium consulting. 280K+ audience across YouTube, TikTok, and X.'
      : 'Mihai Daniel — consultanță crypto premium, mentorat 1-la-1 și cursuri de trading. Strategii validate pentru investitori serioși. 280K+ urmăritori.',
    alternates: {
      canonical: `${SITE_URL}${localePath(locale as Locale)}`,
      languages: {
        ro: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'ro_RO',
      url: `${SITE_URL}${localePath(locale as Locale)}`,
      siteName: 'Mihai Daniel',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_SITE,
      creator: TWITTER_SITE,
      images: [DEFAULT_OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: 'vHIFda0TK5EKXwxKHpAN_eJr2vG6fbPR6uIGvFOZn6o',
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}
      >
        <GlobalJsonLd locale={locale === 'en' ? 'en' : 'ro'} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZYYJ251HYH"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZYYJ251HYH');
          `}
        </Script>
      </body>
    </html>
  );
}
