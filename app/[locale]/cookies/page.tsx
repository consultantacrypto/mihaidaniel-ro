'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { Cookie } from 'lucide-react';
import { useLocale } from 'next-intl';

const COPY = {
  ro: {
    title: 'Politica de Cookies',
    intro: 'Ce salvăm pe dispozitivul tău și când pornește analiza traficului.',
    s1: '1. Ce sunt cookie-urile?',
    s1p: 'Un cookie este un fișier mic de text salvat pe dispozitivul tău când vizitezi un site. Îl folosim ca să reținem o alegere sau ca să putem încasa o plată.',
    s2: '2. Ce cookie-uri folosim?',
    necessary: 'Strict necesare.',
    necessaryBody:
      'md_consent reține Accept sau Refuz timp de 12 luni (cookie și localStorage). Stripe setează cookie-uri doar pe pagina de plată, ca să proceseze checkout-ul. Nu folosim alte cookie-uri necesare.',
    optional: 'Statistici, doar după Accept.',
    optionalBody:
      'Google Analytics 4 este oprit implicit. Nu încărcăm scriptul și nu trimitem evenimente, inclusiv evenimentul de achiziție, până nu apeși Accept. Dacă refuzi, analiza rămâne oprită. După Accept putem salva și sursa campaniei (md_utm), ca să o asociem unei comenzi.',
    s3: '3. Cum schimbi alegerea?',
    s3p: 'Din „Setări cookie” în footer deschizi din nou panoul. Poți șterge cookie-urile și din browser; dacă alegerea nu mai este salvată, bannerul apare din nou.',
    privacy: 'Vezi și Politica de confidențialitate.',
  },
  en: {
    title: 'Cookie Policy',
    intro: 'What we store on your device, and when traffic measurement starts.',
    s1: '1. What are cookies?',
    s1p: 'A cookie is a small text file stored on your device when you visit a site. We use one to remember a choice, or so a payment can be processed.',
    s2: '2. Which cookies do we use?',
    necessary: 'Strictly necessary.',
    necessaryBody:
      'md_consent remembers Accept or Refuse for 12 months (cookie and localStorage). Stripe sets cookies only on the payment page, to process checkout. We do not use other necessary cookies.',
    optional: 'Analytics, only after Accept.',
    optionalBody:
      'Google Analytics 4 is off by default. We do not load the script and we do not send events, including the purchase event, until you press Accept. If you refuse, analytics stays off. After Accept we may also store the campaign source (md_utm) so it can be attached to an order.',
    s3: '3. How do you change your choice?',
    s3p: '“Cookie settings” in the footer opens the panel again. You can also clear cookies in your browser; if the choice is no longer stored, the banner comes back.',
    privacy: 'See also the privacy policy.',
  },
} as const;

export default function CookiesPage() {
  const locale = useLocale() === 'en' ? 'en' : 'ro';
  const copy = COPY[locale];

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
            <Cookie className="text-yellow-500" /> {copy.title}
          </h1>
          <p className="text-gray-400">{copy.intro}</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          <h3>{copy.s1}</h3>
          <p>{copy.s1p}</p>

          <h3>{copy.s2}</h3>
          <p>
            <strong>{copy.necessary}</strong> {copy.necessaryBody}
          </p>
          <p>
            <strong>{copy.optional}</strong> {copy.optionalBody}
          </p>

          <h3>{copy.s3}</h3>
          <p>{copy.s3p}</p>
          <p>
            <Link href="/confidentialitate#cookie-uri" className="text-blue-300 underline underline-offset-2">
              {copy.privacy}
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
