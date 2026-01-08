import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection'; 
import TickerTape from '@/components/TickerTape'; 
import InstitutionalTracker from '@/components/InstitutionalTracker';
import WhaleWallWidget from '@/components/WhaleWallWidget'; 
import SentimentPoll from '@/components/SentimentPoll';
import AlphaStreak from '@/components/AlphaStreak'; // ✅ Gamification
import MarketNarrative from '@/components/MarketNarrative';
import { getGlobalData, getFearGreed } from '@/lib/market-api';
import { Activity, DollarSign, Layers, BarChart3, Zap, Calendar, ArrowRight, Flame, Clock, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';

// Funcție helper pentru formatarea numerelor mari ($2.4 T, $85 B)
const formatCurrency = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} B`;
  return `$${value.toLocaleString()}`;
};

export default async function MarketPage() {
  // 1. Fetch Data (Server Side)
  const globalData = await getGlobalData();
  const fearGreedData = await getFearGreed();

  // 2. Pregătire variabile pentru UI (cu valori fallback safe)
  const marketCap = globalData ? formatCurrency(globalData.marketCap) : "$2.40 T";
  const volume = globalData ? formatCurrency(globalData.volume) : "$85.2 B";
  const dominance = globalData ? `${globalData.btcDominance.toFixed(1)}%` : "54.2%";
  const change = globalData ? globalData.marketCapChange.toFixed(2) : "+1.2";

  // Helper pentru culoarea Fear & Greed
  const fgValue = fearGreedData?.value || 50;
  const fgColor = fgValue >= 75 ? 'text-green-500' : fgValue >= 50 ? 'text-green-400' : fgValue >= 25 ? 'text-orange-400' : 'text-red-500';

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* === HEADER SECȚIUNE === */}
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

        {/* === TICKER TAPE (Banda cu prețuri live) === */}
        <div className="mb-8">
            <TickerTape />
        </div>

        {/* === GRID LAYOUT PRINCIPAL === */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* --- STANGA: METRICS & CHARTURI (Coloana lată) --- */}
            <div className="xl:col-span-9 space-y-6">
                
                {/* 1. CARDURI METRICS (Scrollable orizontal pe mobil) */}
                {/* AM SCHIMBAT md:grid-cols-4 în md:grid-cols-5 CA SĂ ÎNCAPĂ ȘI FEAR & GREED */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 snap-x hide-scrollbar">
                    
                    {/* CARD 1: CALENDAR ECONOMIC */}
                    <div className="min-w-[200px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-between">
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

                    {/* CARD 2: MARKET CAP */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Market Cap</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{marketCap}</div>
                        <div className={`text-xs font-bold ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(change) >= 0 ? '▲' : '▼'} {change}% (24h)
                        </div>
                    </div>

                    {/* CARD 3: VOLUM 24H */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><BarChart3 size={12}/> Volum 24h</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{volume}</div>
                        <div className="text-xs text-gray-400">Lichiditate Globală</div>
                    </div>

                    {/* CARD 4: BTC DOMINANCE */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Layers size={12}/> BTC Dominance</div>
                        <div className="text-2xl font-black text-yellow-500 font-[var(--font-space)]">{dominance}</div>
                        <div className="text-xs text-gray-400">Restul e Altseason?</div>
                    </div>

                    {/* CARD 5: FEAR & GREED (ADĂUGAT ÎNAPOI ✅) */}
                    <div className="min-w-[160px] bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Zap size={12}/> Fear & Greed</div>
                        <div className={`text-2xl font-black font-[var(--font-space)] ${fgColor}`}>
                            {fearGreedData ? fearGreedData.value : "--"}
                        </div>
                        <div className="text-xs text-gray-400 uppercase">
                            {fearGreedData ? fearGreedData.value_classification : "Loading..."}
                        </div>
                    </div>

                </div>

                {/* 2. COMPONENTA NARRATIVE (Sectoare Hot) */}
                <MarketNarrative />

                {/* 3. INSTITUTIONAL TRACKER (Tabelul ETF/Funds) */}
                <div className="bg-[#0b1221] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative z-10 md:static sticky left-0 right-0 bg-[#0a0f1e] md:bg-transparent">
                    <InstitutionalTracker />
                </div>
                
                {/* Hint pentru mobil la tabel */}
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse mt-2">
                    <span>↔️ Swipe stânga-dreapta pe tabel / ↕️ Scroll pagină</span>
                </div>
            </div>

            {/* --- DREAPTA: SIDEBAR WIDGETS (Sticky pe Desktop) --- */}
            <div className="xl:col-span-3 flex flex-col gap-6">
                
                <div className="sticky top-24 space-y-6">
                    {/* 1. VOTUL (Sentiment Poll) */}
                    <SentimentPoll />

                    {/* 2. ALPHA STREAK (Gamification - Login Zilnic) */}
                    <AlphaStreak />

                    {/* 3. QUANTUM WHALE RADAR (On-Chain Data) */}
                    <WhaleWallWidget />

                    {/* 4. Link Academia */}
                    <div className="pt-2">
                        <Link href="/academie" className="block w-full text-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 transition-all">
                            Accesează Academia Completă &rarr;
                        </Link>
                    </div>
                </div>

            </div>

        </div>

        {/* === FOOTER SECTION: LINK-URI AFILIERE === */}
        <div className="mt-12 md:mt-20">
            <AffiliateSection />
        </div>

      </main>
      <Footer />
    </div>
  );
}