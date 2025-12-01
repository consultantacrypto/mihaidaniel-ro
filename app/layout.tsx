import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; // Fontul viitorului
import "./globals.css";
import { Providers } from "./providers";

// Configuram fontul
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: "Mihai Daniel | Future Finance",
  description: "Investitii, Crypto si Educatie Financiara 2026",
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