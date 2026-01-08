import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection'; 
import TickerTape from '@/components/TickerTape'; 
import InstitutionalTracker from '@/components/InstitutionalTracker';
import WhaleWallWidget from '@/components/WhaleWallWidget'; 
import SentimentPoll from '@/components/SentimentPoll';
// ✅ IMPORT PENTRU GAMIFICATION
import AlphaStreak from '@/components/AlphaStreak'; 
import MarketNarrative from '@/components/MarketNarrative';
import { getGlobalData, getFearGreed } from '@/lib/market-api';
import { Activity, DollarSign, Layers, BarChart3, Zap, Calendar, ArrowRight, Flame, Clock, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';

const formatCurrency = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} B`;
  return `$${value.toLocaleString()}`;
};

export default async function MarketPage() {
  const globalData = await getGlobalData();
  const fearGreedData = await getFearGreed();

  const marketCap = globalData ? formatCurrency(globalData.marketCap) : "$2.40 T";
  const volume = globalData ? formatCurrency(globalData.volume) : "$85.2 B";
  const dominance = globalData ? `${globalData.btcDominance.toFixed(1)}%` : "54.2%";
  const change = globalData ? globalData.marketCapChange.toFixed(2) : "+1.2";

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER: Titlu & Ticker */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Activity className="text-white" size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    Market <span className="text-blue-500">Data</span>
                </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                Informații instituționale, sentimentul pieței și fluxurile de bani în timp real.
                <span className="hidden md:inline"> Fără zgomot, doar semnal.</span>
            </p>
        </div>

        {/* TICKER TAPE (Banda cu prețuri) */}
        <div className="mb-8">
            <TickerTape />
        </div>

        {/* LAYOUT PRINCIPAL: GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* STANGA: METRICS & INSTITUTIONAL TRACKER (Mai lat) */}
            <div className="xl:col-span-9 space-y-6">
                
                {/* 1. GLOBAL METRICS CARDS (Scrollable pe mobil) */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 snap-x">
                    
                    {/* 1. Calendar Economic (MODIFICAT AICI) */}
                    <div className="min-w-[200px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start">
                        <div className="text-indigo-300 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                            <Calendar size={12}/> Calendar Economic
                        </div>
                        <div className="space-y-2">
                            {/* Miercuri */}
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Miercuri</span>
                                <span className="text-white font-bold">ADP Employment</span>
                            </div>
                            
                            {/* Joi */}
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Joi</span>
                                <span className="text-white font-bold">Jobless Claims</span>
                            </div>

                            {/* Vineri */}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Vineri</span>
                                <span className="text-white font-bold flex items-center gap-1">NFP & Unempl. <Flame size={10} className="text-red-500"/></span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Market Cap */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Market Cap</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{marketCap}</div>
                        <div className={`text-xs font-bold ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(change) >= 0 ? '▲' : '▼'} {change}% (24h)
                        </div>
                    </div>

                    {/* 3. 24h Volume */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><BarChart3 size={12}/> Volum 24h</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{volume}</div>
                        <div className="text-xs text-gray-400">Lichiditate Globală</div>
                    </div>

                    {/* 4. BTC Dominance */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Layers size={12}/> BTC Dominance</div>
                        <div className="text-2xl font-black text-yellow-500 font-[var(--font-space)]">{dominance}</div>
                        <div className="text-xs text-gray-400">Restul e Altseason?</div>
                    </div>
                </div>

                {/* 2. NARRATIVE & SECTORS (NOU) */}
                <MarketNarrative />

                {/* 3. INSTITUTIONAL TRACKER (Tabelul Mare) */}
                <div className="bg-[#0b1221] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative z-10 md:static sticky left-0 right-0 bg-[#0a0f1e] md:bg-transparent">
                    <InstitutionalTracker />
                </div>
                
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse mt-2">
                    <span>↔️ Swipe stânga-dreapta pe tabel / ↕️ Scroll pagină</span>
                </div>
            </div>

            {/* DREAPTA: SIDEBAR WIDGETS (Sticky pe Desktop) */}
            <div className="xl:col-span-3 flex flex-col gap-6">
                
                <div className="sticky top-24 space-y-6">
                    {/* 1. VOTUL (Tribalism) */}
                    <SentimentPoll />

                    {/* ✅ 2. ALPHA STREAK (Gamification) - NOU! */}
                    <AlphaStreak />

                    {/* 3. QUANTUM WHALE RADAR */}
                    <WhaleWallWidget />

                    {/* Link Academia */}
                    <div className="pt-2">
                        <Link href="/academie" className="block w-full text-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 transition-all">
                            Accesează Academia Completă &rarr;
                        </Link>
                    </div>
                </div>

            </div>

        </div>

        <div className="mt-12 md:mt-20">
            <AffiliateSection />
        </div>

      </main>
      <Footer />
    </div>
  );
}