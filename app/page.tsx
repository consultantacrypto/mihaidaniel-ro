'use client';

// 1. Importăm funcția dynamic pentru Lazy Loading
import dynamic from 'next/dynamic';

// 2. Componentele CRITICE (rămân importate normal pentru a apărea instantaneu)
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

// 3. Componentele care pot aștepta puțin (le încărcăm dinamic pentru viteză)
// SocialStats e ușor, dar ajută să nu blocheze randarea inițială
const SocialStats = dynamic(() => import('@/components/SocialStats'), { 
  ssr: true 
});

// CelebrityInterviews are multe poze, îl încărcăm cu un placeholder (spațiu gol) ca să nu sară pagina
const CelebrityInterviews = dynamic(() => import('@/components/CelebrityInterviews'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-[#020617]/50 animate-pulse rounded-3xl" />
});

const Consultancy = dynamic(() => import('@/components/Consultancy'), { 
  ssr: true 
});

// AiTerminal e cel mai greu (logică multă). Îl încărcăm doar pe client (ssr: false) pentru performanță maximă
const AiTerminal = dynamic(() => import('@/components/AiTerminal'), { 
  ssr: false, 
  loading: () => <div className="min-h-[600px] w-full bg-[#01030c] animate-pulse" />
});

const Course = dynamic(() => import('@/components/Course'), { 
  ssr: true 
});

// Importăm iconițele pentru Footer
import { Twitter, Youtube, Linkedin, Video } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. Navigatia */}
      <Navbar />
      
      {/* 2. Zona Hero (Tu și Mesajul Principal) - SE ÎNCARCĂ PRIMA */}
      <Hero />
      
      {/* 3. Cifrele (Social Proof) - Se încarcă imediat după */}
      <SocialStats />
      
      {/* 4. Interviuri cu Celebrități */}
      <CelebrityInterviews />
      
      {/* 5. Consultanță */}
      <Consultancy />
      
      {/* 6. AI Terminal */}
      <AiTerminal />
      
      {/* 7. Cursul */}
      <Course />

      {/* 8. Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/50">
          <div className="container mx-auto px-6 text-center">
              <div className="font-bold text-2xl text-white tracking-wider mb-4">MIHAI DANIEL</div>
              <div className="flex justify-center gap-6 mb-8">
                  {/* ✅ FIX ACCESIBILITATE: Am adăugat aria-label */}
                  <a href="https://x.com/MIhaiDanielWeb3" target="_blank" className="text-gray-500 hover:text-white transition-colors" aria-label="Vizitează profilul de Twitter (X)"><Twitter/></a>
                  <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" className="text-gray-500 hover:text-red-500 transition-colors" aria-label="Vizitează canalul de YouTube"><Youtube/></a>
                  <a href="https://www.linkedin.com/in/mihaidanielmarius/" target="_blank" className="text-gray-500 hover:text-blue-500 transition-colors" aria-label="Vizitează profilul de LinkedIn"><Linkedin/></a>
                  <a href="https://www.tiktok.com/@mihaidanielmarius?_r=1&_t=ZN-91pjNtkxoO3" target="_blank" className="text-gray-500 hover:text-pink-500 transition-colors" aria-label="Vizitează profilul de TikTok"><Video/></a>
              </div>
              <p className="text-sm text-gray-600">© 2026 Toate drepturile rezervate. <br/> Disclaimer: Educație Financiară. Nu este sfat de investiții.</p>
          </div>
      </footer>

    </main>
  );
}