import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: "Mihai Daniel | Web3 Investor & Crypto Mentor",
  description: "Învață trading și investiții crypto de la Mihai Daniel. Cursuri premium, consultanță 1-la-1 și analiză de piață cu AI.",
  keywords: ["crypto", "bitcoin", "curs trading", "mihai daniel", "investitii", "blockchain", "binance cto", "mmcrypto"],
  openGraph: {
    title: "Mihai Daniel - Expert Crypto",
    description: "Educație financiară de top. Scapă de mentalitatea de parior.",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: '/mihai-daniel-icon.jpg', // Asta rămâne pentru share pe Facebook/WhatsApp
        width: 800,
        height: 800,
        alt: 'Mihai Daniel',
      },
    ],
  },
  // AM SCOS SECȚIUNEA 'icons' PENTRU CĂ FIȘIERUL app/icon.jpg O FACE AUTOMAT
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}