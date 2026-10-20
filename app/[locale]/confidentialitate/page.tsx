'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { ShieldCheck } from 'lucide-react';
import { useLocale } from 'next-intl';

const COOKIES = {
  ro: {
    title: '5. Cookie-uri',
    body: 'Cookie-urile necesare sunt doar cele pentru plată și cel care reține alegerea ta. Stripe setează cookie-uri doar în timpul checkout-ului, ca să proceseze tranzacția. Cookie-ul md_consent (și o copie în localStorage) ține minte Accept sau Refuz timp de 12 luni.',
    analytics:
      'Google Analytics este oprit implicit. Nu încărcăm scriptul și nu trimitem evenimente — inclusiv evenimentul de achiziție — până nu apeși Accept. Poți schimba alegerea oricând din „Setări cookie” în footer.',
    more: 'Detalii în Politica de cookies.',
  },
  en: {
    title: '5. Cookies',
    body: 'Necessary cookies are only those used for payment and the one that stores your choice. Stripe sets cookies only during checkout, to process the transaction. The md_consent cookie (and a localStorage copy) remembers Accept or Refuse for 12 months.',
    analytics:
      'Google Analytics stays off by default. We do not load the script and we do not send events — including the purchase event — until you press Accept. You can change this at any time from “Cookie settings” in the footer.',
    more: 'Details are in the cookie policy.',
  },
} as const;

export default function Confidentialitate() {
  const locale = useLocale() === 'en' ? 'en' : 'ro';
  const cookies = COOKIES[locale];

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                <ShieldCheck className="text-green-500" /> Politica de Confidențialitate
            </h1>
            <p className="text-gray-400">Ne pasă de datele tale.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <h3>1. Ce date colectăm?</h3>
            <p>Respectăm intimitatea utilizatorilor noștri. În prezent, nu colectăm date personale (nume, adresă, telefon) decât dacă ni le oferiți voluntar (de exemplu, prin înscrierea la Newsletter sau completarea formularului de contact).</p>

            <h3>2. Cum folosim datele?</h3>
            <p>Datele colectate sunt folosite exclusiv pentru:</p>
            <ul>
                <li>Comunicarea cu dumneavoastră (răspuns la email-uri).</li>
                <li>Trimiterea de materiale educaționale (dacă v-ați abonat).</li>
                <li>Îmbunătățirea experienței pe site.</li>
            </ul>

            <h3>3. Protecția Datelor</h3>
            <p>Nu vindem, nu închiriem și nu oferim datele dumneavoastră către terți. Luăm măsuri de securitate rezonabile pentru a proteja informațiile împotriva accesului neautorizat.</p>

            <h3>4. Drepturile Dumneavoastră</h3>
            <p>Conform GDPR, aveți dreptul de a solicita accesul, rectificarea sau ștergerea datelor dumneavoastră personale. Pentru orice solicitare, ne puteți contacta la adresa de email din footer.</p>

            <h3 id="cookie-uri">{cookies.title}</h3>
            <p>{cookies.body}</p>
            <p>{cookies.analytics}</p>
            <p>
              <Link href="/cookies" className="text-blue-300 underline underline-offset-2 hover:text-white">
                {cookies.more}
              </Link>
            </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}