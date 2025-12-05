'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Youtube, BrainCircuit, Crown, Menu, X, Newspaper } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <Link href="/" className="flex items-center gap-3 group cursor-pointer" aria-label="Mihai Daniel Home">
          <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl skew-x-[-10deg] shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-500"></div>
              <div className="absolute inset-[2px] bg-[#020617] rounded-[10px] skew-x-[-10deg]"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-white transform skew-x-[-10deg]">
                  <path d="M4 20V4L12 12L20 4V20" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60A5FA" />
                      <stop offset="1" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
              </svg>
          </div>
          <div className="leading-none hidden sm:block">
              <div className="font-bold text-lg tracking-wide text-white group-hover:text-blue-200 transition-colors">MIHAI DANIEL</div>
              <div className="text-[9px] text-blue-400 font-mono tracking-[0.2em] uppercase mt-1">Future Ready</div>
          </div>
      </Link>
      
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/stiri" className="hover:text-white transition-colors flex items-center gap-2">
            <Newspaper size={16}/> Știri Crypto
          </Link>
          
          <a href="/#ai" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
            <BrainCircuit size={14} className="group-hover:animate-pulse"/> Mihai AI
          </a>
          <a href="/#consultanta" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
            <Crown size={14} className="text-yellow-500"/> VIP Mentorship
          </a>
          <a href="/#curs" className="hover:text-white transition-colors">Curs Premium</a>
          
          <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 text-xs hover:bg-red-500/20 transition-all cursor-pointer" aria-label="Canal YouTube Mihai Daniel">
              <Youtube size={14}/> 
              <span className="font-mono font-bold">96.6K</span>
          </a>
      </div>

      <div className="flex items-center gap-4">
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        {/* ✅ FIX ACCESIBILITATE: aria-label adăugat */}
        <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Închide meniu" : "Deschide meniu"}>
            {mobileMenuOpen ? <X/> : <Menu/>}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden shadow-2xl animate-in slide-in-from-top-5">
             <Link href="/stiri" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 border-b border-white/5 font-bold">📰 Știri Crypto</Link>
             <a href="/#ai" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 py-2 border-b border-white/5">Mihai AI</a>
             <a href="/#consultanta" onClick={() => setMobileMenuOpen(false)} className="text-yellow-500 py-2 border-b border-white/5">VIP Mentorship</a>
             <a href="/#curs" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 py-2 border-b border-white/5">Curs Premium</a>
        </div>
      )}
    </nav>
  );
}