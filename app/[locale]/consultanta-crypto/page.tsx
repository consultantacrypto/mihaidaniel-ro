import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Consultancy from '@/components/Consultancy';
import MoneyPageHero from '@/components/landing/MoneyPageHero';
import FaqSection from '@/components/landing/FaqSection';
import JsonLd from '@/components/JsonLd';
import PaymentFeedback from '@/components/PaymentFeedback';
import { buildConsultancyServiceSchema } from '@/lib/seo/schemas/service';
import { buildFaqPageSchema, CONSULTANCY_FAQ } from '@/lib/seo/schemas/faq';
import { SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';

const PAGE_PATH = '/consultanta-crypto';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = buildPageMetadata({
  title: 'Consultanță Crypto VIP 1-la-1 | Mihai Daniel',
  description:
    'Sesiune privată de 60 min: audit portofoliu crypto, corecție greșeli și strategie de exit. $250 — rezervă acum cu Mihai Daniel.',
  path: PAGE_PATH,
  locale: 'ro_RO',
  image: '/mihai-daniel-consultanta.jpg',
  keywords: [
    'consultanta crypto',
    'mentor crypto romania',
    'audit portofoliu',
    'strategie exit bitcoin',
  ],
});

export default function ConsultantaCryptoPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-yellow-500/30">
      <JsonLd
        data={[
          buildConsultancyServiceSchema(PAGE_URL),
          buildFaqPageSchema(CONSULTANCY_FAQ, PAGE_URL),
        ]}
      />

      <Suspense fallback={null}>
        <PaymentFeedback />
      </Suspense>

      <Navbar />

      <MoneyPageHero
        badge="Consultanță VIP"
        title="Consultanță Crypto"
        highlight="1-la-1 cu Mihai Daniel"
        description="O oră intensivă: audităm portofoliul, corectăm greșelile și stabilim strategia de exit. Nu teorie — banii tăi, deciziile tale."
        accent="yellow"
      />

      <Consultancy />
      <FaqSection items={CONSULTANCY_FAQ} />
      <Footer />
    </main>
  );
}
