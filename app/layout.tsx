import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./providers";

// Configuram fontul "Space Grotesk" pentru aspectul Tech/Crypto
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: "Mihai Daniel | Web3 Investor & Crypto Mentor",
  description: "Învață trading și investiții crypto de la Mihai Daniel. Cursuri premium, consultanță 1-la-1 și analiză de piață cu AI.",
  keywords: ["crypto", "bitcoin", "curs trading", "mihai daniel", "investitii", "blockchain", "binance cto", "mmcrypto"],
  icons: {
    icon: '/icon.jpg', // Asigura-te ca ai poza asta in folderul app sau public
  },
  openGraph: {
    title: "Mihai Daniel - Expert Crypto",
    description: "Educație financiară de top. Scapă de mentalitatea de parior.",
    type: "website",
    locale: "ro_RO",
  },
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