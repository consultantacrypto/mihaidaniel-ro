import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; 
import "./globals.css";
import Script from "next/script";
import GlobalJsonLd from '@/components/GlobalJsonLd';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap', 
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap', 
});

// ✅ METADATA OPTIMIZATĂ (Tier 1 SEO)
export const metadata: Metadata = {
  metadataBase: new URL('https://www.mihaidaniel.ro'),
  title: {
    default: "Mihai Daniel | Consultanță Crypto & Mentorat",
    template: "%s | Mihai Daniel"
  },
  description: "Mihai Daniel — consultanță crypto premium, mentorat 1-la-1 și cursuri de trading. Strategii validate pentru investitori serioși. 280K+ urmăritori.",
  keywords: [
    "mihai daniel",
    "consultanta crypto",
    "mentor crypto romania",
    "curs trading crypto",
    "curs bitcoin",
    "investitii crypto",
    "educatie financiara",
    "trading crypto",
  ],
  
  authors: [{ name: "Mihai Daniel", url: "https://www.mihaidaniel.ro" }],
  creator: "Mihai Daniel",
  publisher: "Mihai Daniel",
  
  verification: {
    google: 'vHIFda0TK5EKXwxKHpAN_eJr2vG6fbPR6uIGvFOZn6o',
  },

  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },

  // ✅ OPEN GRAPH (Facebook/LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://www.mihaidaniel.ro',
    siteName: 'Mihai Daniel — Consultanță Crypto & Mentorat',
    title: 'Mihai Daniel | Consultanță Crypto & Mentorat',
    description: 'Consultanță crypto premium, mentorat 1-la-1 și cursuri de trading. Strategii validate pentru investitori serioși.',
    images: [
      {
        url: '/mihai-daniel-consultanta.jpg', // Folosim imaginea existentă
        width: 1200,
        height: 630,
        alt: 'Mihai Daniel - Crypto Expert',
      },
    ],
  },

  // ✅ TWITTER CARD (Critic pentru share-uri pe X)
  twitter: {
    card: 'summary_large_image',
    site: '@MIhaiDanielWeb3',
    creator: '@MIhaiDanielWeb3',
    title: 'Mihai Daniel | Consultanță Crypto & Mentorat',
    description: 'Consultanță crypto, mentorat și cursuri premium. 280K+ urmăritori pe social media.',
    images: ['/mihai-daniel-consultanta.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        
        <GlobalJsonLd />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZYYJ251HYH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZYYJ251HYH');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}