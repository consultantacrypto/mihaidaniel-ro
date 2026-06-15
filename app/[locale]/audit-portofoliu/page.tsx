import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MoneyPageHero from '@/components/landing/MoneyPageHero';
import LeadMagnetForm from '@/components/LeadMagnetForm';
import ConsultancyPitch from '@/components/landing/ConsultancyPitch';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Audit Portofoliu Crypto — Ghid Gratuit + Consultanță | Mihai Daniel',
  description:
    'Descarcă gratuit ghidul de audit portofoliu crypto. Apoi rezervă o sesiune 1-la-1 pentru analiză aplicată pe pozițiile tale.',
  path: '/audit-portofoliu',
  keywords: [
    'audit portofoliu crypto',
    'analiză portofoliu bitcoin',
    'consultanță crypto românia',
  ],
});

export default function AuditPortofoliuPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Audit Portofoliu', path: '/audit-portofoliu' },
        ])}
      />
      <Navbar />

      <MoneyPageHero
        badge="Resursă gratuită"
        title="Audit Portofoliu Crypto"
        highlight="Framework aplicabil în 20 de minute"
        description="Învață cum să evaluezi riscul, expunerea și calitatea activelor din portofoliu — înainte să pierzi capital pe o decizie emoțională."
        accent="blue"
      />

      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-xl">
          <LeadMagnetForm
            title="Ghid gratuit: AI-ul tău de Trading"
            description="Tutorial despre cum să folosești ChatGPT în investiții și trading — trimis instant pe email."
          />
        </div>
      </section>

      <ConsultancyPitch
        title="Vrei o analiză aplicată pe portofoliul tău?"
        description="Rezervă o sesiune VIP 1-la-1 de 60 de minute. Parcurgem pozițiile tale reale, identificăm riscurile și iei decizii cu claritate."
        trackingLabel="audit-portofoliu_stripe"
        pageLinkTrackingLabel="audit-portofoliu_consultanta_page"
      />

      <Footer />
    </main>
  );
}
