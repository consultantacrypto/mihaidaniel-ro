'use client';

// 1. Importăm funcția dynamic pentru Lazy Loading
import dynamic from 'next/dynamic';

// 2. Componentele CRITICE (rămân importate normal pentru a apărea instantaneu)
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
// ✅ IMPORTĂM NOUL FOOTER GLOBAL
import Footer from '@/components/Footer';

// 3. Componentele care pot aștepta puțin (le încărcăm dinamic pentru viteză)
const SocialStats = dynamic(() => import('@/components/SocialStats'), { 
  ssr: true 
});

const CelebrityInterviews = dynamic(() => import('@/components/CelebrityInterviews'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-[#020617]/50 animate-pulse rounded-3xl" />
});

const Consultancy = dynamic(() => import('@/components/Consultancy'), { 
  ssr: true 
});

const AiTerminal = dynamic(() => import('@/components/AiTerminal'), { 
  ssr: false, 
  loading: () => <div className="min-h-[600px] w-full bg-[#01030c] animate-pulse" />
});

const Course = dynamic(() => import('@/components/Course'), { 
  ssr: true 
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. Navigatia */}
      <Navbar />
      
      {/* 2. Zona Hero (Tu și Mesajul Principal) - SE ÎNCARCĂ PRIMA */}
      <Hero />
      
      {/* 3. Cifrele (Social Proof) */}
      <SocialStats />
      
      {/* 4. Interviuri cu Celebrități */}
      <CelebrityInterviews />
      
      {/* 5. Consultanță */}
      <Consultancy />
      
      {/* 6. AI Terminal */}
      <AiTerminal />
      
      {/* 7. Cursul */}
      <Course />

      {/* 8. FOOTER GLOBAL (Cel nou, cu Disclaimer și Legal) */}
      <Footer />

    </main>
  );
}