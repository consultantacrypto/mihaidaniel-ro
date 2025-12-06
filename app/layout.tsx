import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

// 1. Configurare Fonturi
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

// 2. Metadata completă (SEO + Social + Verificare + Favicon)
export const metadata: Metadata = {
  title: "Mihai Daniel | Web3 Investor & Crypto Mentor",
  description: "Învață trading și investiții crypto de la Mihai Daniel. Cursuri premium, consultanță 1-la-1 și analiză de piață cu AI.",
  keywords: ["crypto", "bitcoin", "curs trading", "mihai daniel", "investitii", "blockchain", "binance cto", "mmcrypto"],
  
  // Codul de verificare Google (Păstrat)
  verification: {
    google: 'vHIFda0TK5EKXwxKHpAN_eJr2vG6fbPR6uIGvFOZn6o',
  },

  // ✅ AICI AM ADĂUGAT FAVICON-UL NOU
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },

  openGraph: {
    title: "Mihai Daniel - Expert Crypto",
    description: "Educație financiară de top. Scapă de mentalitatea de parior.",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: '/mihai-daniel-icon.jpg',
        width: 800,
        height: 800,
        alt: 'Mihai Daniel',
      },
    ],
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
        
        {/* Google Analytics */}
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

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}