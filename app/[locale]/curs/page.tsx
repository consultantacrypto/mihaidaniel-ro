import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Course from '@/components/Course';
import Footer from '@/components/Footer';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Curs Trading | Mihai Daniel',
  description:
    'Învață să tranzacționezi corect cu un sistem validat. Masterclass 4K, 20+ strategii, acces pe viață.',
  path: '/curs',
  image: '/mihai-daniel-icon.jpg',
  keywords: ['curs trading crypto', 'curs bitcoin', 'masterclass trading'],
});

export default function CursPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <div className="pt-20">
        <Course />
      </div>
      <Footer />
    </main>
  );
}
