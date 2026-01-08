import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection'; 
import TickerTape from '@/components/TickerTape'; 
import InstitutionalTracker from '@/components/InstitutionalTracker';
import WhaleWallWidget from '@/components/WhaleWallWidget'; 
import SentimentPoll from '@/components/SentimentPoll';
import AlphaStreak from '@/components/AlphaStreak'; 
import MarketNarrative from '@/components/MarketNarrative';
import { getGlobalData, getFearGreed } from '@/lib/market-api';
import { Activity, DollarSign, Layers, BarChart3, Zap, Calendar, Flame, Clock } from 'lucide-react';
import Link from 'next/link';

// --- DEFINIȚII DE TIPURI (Pentru siguranță) ---
interface GlobalData {
  marketCap: number;
  volume: number;
  btcDominance: number;
  marketCapChange: number;
}

interface FearGreedData {
  value: number;
  value_classification: string;
}

// --- FUNCȚII UTILITARE (Blindate) ---

// 1. Formator Valută Sigur (Nu crapă la null/undefined)
const formatCurrency = (value: number | undefined | null) => {
  // Verificări de siguranță
  if (value === undefined || value === null || isNaN(value)) {
    return "$0.00";
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  
  // Formatare pentru Trilioane, Miliarde, Milioane
  if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(2)} T`;
  if (absValue >= 1e9) return `${sign}$${(absValue / 1e9).toFixed(2)} B`;
  if (absValue >= 1e6) return `${sign}$${(absValue / 1e6).toFixed(2)} M`;
  
  // Formatare standard pentru sume mici
  return `${sign}$${absValue.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
};

// 2. Stiluri pentru Fear & Greed (Logica ta: Teama -> Calm -> Lacomie -> Euforie)
const getFearGreedStyles = (value: number) => {
  if (value >= 70) return { color: 'text-green-400', text: 'EUFORIE' }; // >70
  if (value >= 50) return { color: 'text-emerald-500', text: 'LĂCOMIE' }; // 50-70
  if (value >= 30) return { color: 'text-orange-400', text: 'CALM' };    // 30-50
  return { color: 'text-red-500', text: 'TEAMĂ' };                        // <30
};

// --- COMPONENTA PRINCIPALĂ ---
export const revalidate = 60; // Revalidăm datele la fiecare 60 secunde (Cache)

export default async function MarketPage() {
  
  // 1. EXTRAGERE DATE PARALELĂ (Viteză maximă)
  let globalData: GlobalData | null = null;
  let fearGreedData: FearGreedData | null = null;

  try {
    // Cerem ambele seturi de date simultan
    const [globalRes, fgRes] = await Promise.allSettled([
      getGlobalData(),
      getFearGreed()
    ]);

    // Verificăm care a reușit și salvăm datele
    if (globalRes.status === 'fulfilled') globalData = globalRes.value;
    if (fgRes.status === 'fulfilled') fearGreedData = fgRes.value;

  } catch (error) {
    console.error("Critical API Error:", error);
    // Dacă totul pică, variabilele rămân null și folosim fallback-urile de mai jos
  }

  // 2. PREGĂTIRE VARIABILE UI (Cu plase de siguranță)
  const marketCap = formatCurrency(globalData?.marketCap);
  const volume = formatCurrency(globalData?.volume);
  const dominance = globalData?.btcDominance ? `${globalData.btcDominance.toFixed(1)}%` : "54.2%";
  const change = globalData?.marketCapChange ? globalData.marketCapChange.toFixed(2) : "+0.00";
  
  // Logică Fear & Greed
  const fgValue = fearGreedData?.value || 50;
  const { color: fgColor, text: fgText } = getFearGreedStyles(fgValue);

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER SECȚIUNE */}
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
            <Suspense fallback={<div className="h-10 bg-white/5 rounded animate-pulse"></div>}>
                <TickerTape />
            </Suspense>
        </div>

        {/* LAYOUT GRID PRINCIPAL */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* --- STANGA: CONȚINUT PRINCIPAL --- */}
            <div className="xl:col-span-9 space-y-6">
                
                {/* 1. CARDURI METRICS (Scrollable pe mobil) */}
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 snap-x hide-scrollbar">
                    
                    {/* CARD 1: CALENDAR ECONOMIC */}
                    <div className="min-w-[200px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-between h-full mr-2 md:mr-0">
                        <div className="text-indigo-300 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                            <Calendar size={12}/> Calendar Economic
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Miercuri</span>
                                <span className="text-white font-bold">ADP Employment</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Joi</span>
                                <span className="text-white font-bold">Jobless Claims</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Vineri</span>
                                <span className="text-white font-bold flex items-center gap-1">NFP & Unempl. <Flame size={10} className="text-red-500"/></span>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: MARKET CAP */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Market Cap</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{marketCap}</div>
                        <div className={`text-xs font-bold ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(change) >= 0 ? '▲' : '▼'} {change}% (24h)
                        </div>
                    </div>

                    {/* CARD 3: VOLUM */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><BarChart3 size={12}/> Volum 24h</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{volume}</div>
                        <div className="text-xs text-gray-400">Lichiditate Globală</div>
                    </div>

                    {/* CARD 4: DOMINANCE */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Layers size={12}/> BTC Dominance</div>
                        <div className="text-2xl font-black text-yellow-500 font-[var(--font-space)]">{dominance}</div>
                        <div className="text-xs text-gray-400">Restul e Altseason?</div>
                    </div>

                    {/* CARD 5: FRICĂ & LĂCOMIE */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Zap size={12}/> Frică & Lăcomie</div>
                        <div className={`text-2xl font-black font-[var(--font-space)] ${fgColor}`}>
                            {fgValue}
                        </div>
                        <div className={`text-xs font-bold uppercase ${fgColor}`}>
                            {fgText}
                        </div>
                    </div>

                </div>

                {/* 2. NARRATIVE (Sectoare Hot) */}
                <MarketNarrative />

                {/* 3. INSTITUTIONAL TRACKER (Tabelul ETF) */}
                <div className="bg-[#0b1221] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative z-10 md:static sticky left-0 right-0 bg-[#0a0f1e] md:bg-transparent">
                    <InstitutionalTracker />
                </div>
                
                {/* Hint pentru mobil */}
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse mt-2">
                    <span>↔️ Swipe stânga-dreapta pe tabel / ↕️ Scroll pagină</span>
                </div>
            </div>

            {/* --- DREAPTA: SIDEBAR WIDGETS --- */}
            <div className="xl:col-span-3 flex flex-col gap-6">
                
                <div className="sticky top-24 space-y-6">
                    {/* 1. VOTUL */}
                    <SentimentPoll />

                    {/* 2. ALPHA STREAK */}
                    <AlphaStreak />

                    {/* 3. WHALE WALL */}
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

        {/* SECTION AFILIERE */}
        <div className="mt-12 md:mt-20">
            <AffiliateSection />
        </div>

      </main>
      <Footer />
    </div>
  );
}