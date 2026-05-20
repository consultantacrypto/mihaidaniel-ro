import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MoneyPageHero from '@/components/landing/MoneyPageHero';
import LeadMagnetForm from '@/components/LeadMagnetForm';
import ConsultancyPitch from '@/components/landing/ConsultancyPitch';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Strategie Exit Bitcoin — Ghid Gratuit + Plan Personalizat | Mihai Daniel',
  description:
    'Descarcă ghidul gratuit de strategie exit bitcoin. Apoi rezervă consultanță 1-la-1 pentru un plan aplicat pe portofoliul tău.',
  path: '/strategie-exit',
  keywords: [
    'strategie exit bitcoin',
    'când să vinzi bitcoin',
    'plan exit crypto',
    'take profit bitcoin',
  ],
});

export default function StrategieExitPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-green-500/30">
      <Navbar />

      <MoneyPageHero
        badge="Strategie exit"
        title="Strategie Exit Bitcoin"
        highlight="Vinde inteligent, nu din panică"
        description="Majoritatea investitorilor pierd profitul la vârf sau la fund. Învață un framework de exit înainte să ai nevoie de el — când piața se mișcă rapid."
        accent="green"
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
        title="Vrei un plan de exit personalizat?"
        description="În sesiunea VIP stabilim nivelurile tale de take-profit, scenariile de bear market și regulile clare — ca să nu mai vinzi din emoție."
      />

      <Footer />
    </main>
  );
}
