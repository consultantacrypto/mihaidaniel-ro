'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dictionary, AcademyItem } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Activity, BrainCircuit, Database, PlayCircle, Zap, Search, X, ArrowUpRight, BookOpen } from 'lucide-react';

// Culori și etichete pentru dificultate
const getDifficulty = (category: string) => {
  if (category.includes('FUNDAMENTE')) return { label: 'Start', color: 'bg-green-500/20 text-green-400 border-green-500/20' };
  if (category.includes('TRADING')) return { label: 'Trading', color: 'bg-orange-500/20 text-orange-400 border-orange-500/20' };
  if (category.includes('DEFI')) return { label: 'DeFi', color: 'bg-purple-500/20 text-purple-400 border-purple-500/20' };
  return { label: 'Pro', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' };
};

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('TOATE');

  // Hero Article (Bitcoin)
  const featuredArticle = dictionary.find(item => item.slug === 'ce-este-bitcoin-ghid-complet') || dictionary[0];

  // Logică de Filtrare
  const filteredArticles = dictionary.filter((item) => {
    if (searchQuery === '' && activeFilter === 'TOATE' && item.slug === featuredArticle.slug) return false;
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'TOATE' || item.category.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const isSearching = searchQuery.length > 0 || activeFilter !== 'TOATE';

  // Grupăm articolele pentru layout-ul Bento
  const tradingArticles = filteredArticles.filter(item => item.category === 'TRADING & CHARTURI');
  const defiArticles = filteredArticles.filter(item => item.category === 'DEFI & WEB3');
  const fundamentalsArticles = filteredArticles.filter(item => item.category === 'BITCOIN & FUNDAMENTE');

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-orange-500/30">
      <Navbar />
      
      {/* === 1. CINEMATIC HERO (IMMERSIVE) === */}
      {!isSearching && (
        <div className="relative w-full min-h-[85vh] flex items-end pb-20 overflow-hidden">
             {/* Background Image cu efecte */}
             <div className="absolute inset-0 z-0">
                 <Image 
                    src={featuredArticle.image} 
                    alt="Featured" 
                    fill 
                    className="object-cover opacity-80 scale-105 animate-in fade-in duration-1000"
                    priority
                    unoptimized={true}
                 />
                 {/* Gradient Complex pentru profunzime */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent"></div>
             </div>

             <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500 text-black text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse">
                        <Zap size={14} className="fill-current"/> Cursul Lunii
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tight font-[var(--font-space)] drop-shadow-2xl">
                        {featuredArticle.term}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-xl backdrop-blur-sm">
                        {featuredArticle.definition}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href={`/academie/${featuredArticle.slug}`} className="group bg-white text-black font-black py-4 px-12 rounded-full flex items-center gap-2 transition-all hover:bg-gray-200 hover:scale-105 shadow-xl">
                            <PlayCircle size={24} className="fill-black group-hover:scale-110 transition-transform"/> 
                            ÎNCEPE ACUM
                        </Link>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* === 2. INTERFACE BAR (STICKY & GLASS) === */}
      <div className={`sticky top-20 z-40 transition-all duration-500 ${!isSearching ? '-mt-10' : 'mt-10'}`}>
        <div className="container mx-auto px-4 md:px-12">
            <div className="bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/10 p-2 md:p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Caută subiecte..." 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={16}/></button>}
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    {['TOATE', 'FUNDAMENTE', 'TRADING', 'DEFI'].map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                                activeFilter === filter 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                                : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* === 3. BENTO GRID LAYOUT === */}
      <div className="container mx-auto px-4 md:px-12 py-20 space-y-32">
        
        {!isSearching && (
            <>
                {/* SECTION 1: TRADING (BENTO) */}
                <section>
                    <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-orange-400 mb-2 font-mono text-sm tracking-widest"><Activity size={16}/> MODULE 01</div>
                            <h2 className="text-4xl md:text-5xl font-black font-[var(--font-space)]">Sniper Trading</h2>
                        </div>
                        <div className="hidden md:block text-right text-gray-500 max-w-xs text-sm">
                            De la analiză tehnică la psihologia pieței. Învață să citești graficul ca un profesionist.
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                        {tradingArticles.map((item, index) => (
                            // Facem primul element să ocupe 2 coloane pentru efectul Bento
                            <BentoCard key={item.slug} item={item} large={index === 0} />
                        ))}
                    </div>
                </section>

                {/* SECTION 2: DEFI (BENTO REVERSED) */}
                <section>
                    <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-purple-400 mb-2 font-mono text-sm tracking-widest"><BrainCircuit size={16}/> MODULE 02</div>
                            <h2 className="text-4xl md:text-5xl font-black font-[var(--font-space)]">DeFi & Web3</h2>
                        </div>
                        <div className="hidden md:block text-right text-gray-500 max-w-xs text-sm">
                            Fii propria ta bancă. Smart Contracts, Yield Farming și viitorul internetului.
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                        {defiArticles.map((item, index) => (
                             // Aici putem face al doilea element mare, sau tot primul, pentru variație
                            <BentoCard key={item.slug} item={item} large={index === 0} />
                        ))}
                    </div>
                </section>

                 {/* SECTION 3: FUNDAMENTE */}
                 <section>
                    <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-green-400 mb-2 font-mono text-sm tracking-widest"><Database size={16}/> MODULE 03</div>
                            <h2 className="text-4xl md:text-5xl font-black font-[var(--font-space)]">Fundamente</h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {fundamentalsArticles.map((item) => (
                            <div key={item.slug} className="col-span-1 h-[350px]">
                                <BentoCard item={item} />
                            </div>
                        ))}
                    </div>
                </section>
            </>
        )}

        {/* SEARCH RESULTS */}
        {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
                {filteredArticles.map(item => <BentoCard key={item.slug} item={item} />)}
                {filteredArticles.length === 0 && (
                    <div className="col-span-3 text-center py-20">
                        <p className="text-2xl text-gray-500">Nu am găsit rezultate.</p>
                    </div>
                )}
            </div>
        )}

      </div>

      {/* CTA FOOTER */}
      {!isSearching && (
      <div className="container mx-auto px-4 md:px-12 pb-24">
        <div className="rounded-[3rem] bg-gradient-to-r from-gray-900 to-black border border-white/10 p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] group-hover:bg-purple-500/20 transition-colors duration-1000"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                {/* ✅ AICI ERA EROAREA: Am înlocuit "->" cu "&rarr;" */}
                <h3 className="text-4xl md:text-6xl font-black text-white mb-6 font-[var(--font-space)]">
                    Teorie &rarr; Practică &rarr; Profit
                </h3>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                    Academia e doar începutul. În grupul VIP nu doar învățăm, ci executăm tranzacții live pe baza acestor informații.
                </p>
                <Link href="/#consultanta" className="inline-flex items-center gap-3 bg-white text-black font-bold text-lg py-5 px-12 rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    Aplică pentru Mentorship <ArrowUpRight />
                </Link>
            </div>
        </div>
      </div>
      )}

      <Footer />
    </main>
  );
}

// --- COMPONENTA BENTO CARD (PREMIUM) ---
function BentoCard({ item, large = false }: { item: AcademyItem, large?: boolean }) {
    const diff = getDifficulty(item.category);
    
    return (
        <Link 
            href={`/academie/${item.slug}`} 
            className={`group relative overflow-hidden rounded-3xl bg-[#0a0f1e] border border-white/5 hover:border-white/20 transition-all duration-500 ${large ? 'md:col-span-2' : 'md:col-span-1'}`}
        >
            {/* Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src={item.image} 
                    alt={item.term} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                    unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <div className="mb-auto flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${diff.color}`}>
                        {diff.label}
                    </span>
                    <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                        <ArrowUpRight size={16} className="text-white"/>
                    </div>
                </div>

                <div>
                    <h3 className={`font-black text-white mb-3 font-[var(--font-space)] leading-tight ${large ? 'text-4xl' : 'text-2xl'}`}>
                        {item.term}
                    </h3>
                    <p className={`text-gray-300 line-clamp-2 leading-relaxed ${large ? 'text-lg max-w-lg' : 'text-sm'}`}>
                        {item.definition}
                    </p>
                </div>
            </div>
        </Link>
    );
}