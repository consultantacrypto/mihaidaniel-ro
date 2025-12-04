'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialStats from '@/components/SocialStats';
// NewsFeed a fost scos pentru a nu aglomera
import CelebrityInterviews from '@/components/CelebrityInterviews';
import AiTerminal from '@/components/AiTerminal';
import Consultancy from '@/components/Consultancy';
import Course from '@/components/Course';
import { Twitter, Youtube, Linkedin, Video } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. Navigatia */}
      <Navbar />
      
      {/* 2. Zona Hero (Tu și Mesajul Principal) */}
      <Hero />
      
      {/* 3. Cifrele (Social Proof) */}
      <SocialStats />
      
      {/* 4. Interviuri cu Celebrități (Hall of Fame) - Urcat mai sus pentru autoritate */}
      <CelebrityInterviews />
      
      {/* 5. Consultanță (Produs High Ticket) */}
      <Consultancy />
      
      {/* 6. AI Terminal (Tehnologie) */}
      <AiTerminal />
      
      {/* 7. Cursul (Produs Volum) */}
      <Course />

      {/* 8. Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/50">
          <div className="container mx-auto px-6 text-center">
              <div className="font-bold text-2xl text-white tracking-wider mb-4">MIHAI DANIEL</div>
              <div className="flex justify-center gap-6 mb-8">
                  <a href="https://x.com/MIhaiDanielWeb3" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Twitter/></a>
                  <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" className="text-gray-500 hover:text-red-500 transition-colors"><Youtube/></a>
                  <a href="https://www.linkedin.com/in/mihaidanielmarius/" target="_blank" className="text-gray-500 hover:text-blue-500 transition-colors"><Linkedin/></a>
                  <a href="https://www.tiktok.com/@mihaidanielmarius?_r=1&_t=ZN-91pjNtkxoO3" target="_blank" className="text-gray-500 hover:text-pink-500 transition-colors"><Video/></a>
              </div>
              <p className="text-sm text-gray-600">© 2026 Toate drepturile rezervate. <br/> Disclaimer: Educație Financiară. Nu este sfat de investiții.</p>
          </div>
      </footer>

    </main>
  );
}