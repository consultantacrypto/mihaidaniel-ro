import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection'; 
import TickerTape from '@/components/TickerTape'; 
import SmartMoneyWidget from '@/components/SmartMoneyWidget'; 
import InstitutionalTracker from '@/components/InstitutionalTracker'; 
import { getGlobalData, getFearGreed } from '@/lib/market-api';
import { Activity, DollarSign, Layers, BarChart3, TrendingUp, TrendingDown, Zap, ExternalLink, MonitorPlay } from 'lucide-react';
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
  const dominance = globalData ? `${globalData.btcDominance.toFixed(1)}%` : "55.2%";
  const change = globalData ? globalData.marketCapChange.toFixed(2) : "+1.2";

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans">
      <Navbar />
      <TickerTape />

      {/* --- LAYOUT FLUID PENTRU ECRANE GIGANT (TV) --- */}
      <div className="w-full max-w-[2400px] mx-auto px-4 md:px-6 xl:px-8 py-8 md:py-12">
        
        {/* 1. HEADER & GLOBAL METRICS (Full Width) */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-10 border-b border-gray-800 pb-8">
            
            {/* Titlu & Intro */}
            <div className="w-full xl:w-auto">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20">
                        <Activity className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-[var(--font-space)]">
                            MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">INTELLIGENCE</span>
                        </h1>
                    </div>
                </div>
                <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
                    Centrul de comandă instituțional. Date live din blockchain, exchange-uri și rapoarte 13F. 
                    Monitorizăm <span className="text-white font-bold">Smart Money</span> în timp real.
                </p>
            </div>

            {/* Metricile Rapide (Carduri) */}
            <div className="w-full xl:w-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {/* Market Cap */}
                <div className="bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Market Cap</div>
                    <div className="text-lg md:text-2xl font-black text-white font-[var(--font-space)]">{marketCap}</div>
                    <div className={`text-xs font-bold ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change}% (24h)
                    </div>
                </div>

                {/* Volum */}
                <div className="bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><BarChart3 size={12}/> Volum 24h</div>
                    <div className="text-lg md:text-2xl font-black text-white font-[var(--font-space)]">{volume}</div>
                    <div className="text-xs text-gray-600">Lichiditate</div>
                </div>

                {/* Dominance */}
                <div className="bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors group">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Layers size={12}/> BTC Dom</div>
                    <div className="text-lg md:text-2xl font-black text-white font-[var(--font-space)]">{dominance}</div>
                    <div className="text-xs text-gray-600">vs Altcoins</div>
                </div>

                {/* Fear & Greed */}
                <div className="bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors group relative overflow-hidden">
                     <div className={`absolute right-0 top-0 w-16 h-16 rounded-full blur-xl opacity-20 ${Number(fearGreedData.value) > 50 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Zap size={12}/> Sentiment</div>
                    <div className={`text-lg md:text-2xl font-black font-[var(--font-space)] ${Number(fearGreedData.value) > 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {fearGreedData.value}
                    </div>
                    <div className="text-xs text-gray-300 font-medium">{fearGreedData.value_classification}</div>
                </div>
            </div>
        </div>

        {/* 2. MAIN DASHBOARD GRID (12 Columns System) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
            
            {/* STÂNGA: INSTITUTIONAL TRACKER (Ocupă 9 coloane pe TV, Full pe Mobil) */}
            <div className="xl:col-span-9 flex flex-col gap-6">
                
                {/* Butoane Navigare Rapidă - AICI AM PUS BUTONUL WAW INAPOI */}
                <div className="flex flex-wrap items-center gap-3">
                     <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-mono text-green-400 font-bold tracking-wider">LIVE DATA STREAM</span>
                    </div>

                    {/* ✅ BUTONUL WAW REPARAT */}
                    <Link href="/lichidari" className="relative group overflow-hidden rounded-lg px-5 py-2.5 font-bold text-white shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 group-hover:from-yellow-500 group-hover:to-orange-500 transition-colors"></div>
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine"></div>
                        <div className="relative flex items-center gap-2 text-xs md:text-sm">
                            <Activity size={16} className="animate-pulse"/> 
                            <span>Harta Lichidărilor</span>
                            <ExternalLink size={14} className="opacity-70 group-hover:translate-x-0.5 transition-transform"/>
                        </div>
                    </Link>

                    <Link href="/raport-2026" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 transition-all text-xs md:text-sm font-bold text-blue-300">
                        <MonitorPlay size={14} /> Vezi Analiza Video
                    </Link>
                </div>

                {/* COMPONENTA PRINCIPALĂ + FIX SCROLL MOBIL */}
                {/* Am adăugat h-[80vh] pe mobil ca să forțăm bara de scroll să fie vizibilă în ecran */}
                <div className="w-full h-[75vh] md:h-auto overflow-y-auto md:overflow-visible rounded-2xl border border-gray-800 md:border-none bg-[#0a0f1e] md:bg-transparent">
                    <InstitutionalTracker />
                </div>
                
                {/* Hint vizual pentru Mobil */}
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse">
                    <span>↔️ Swipe stânga-dreapta pentru detalii</span>
                </div>
            </div>

            {/* DREAPTA: SIDEBAR WIDGETS (Sticky pe Desktop) */}
            <div className="xl:col-span-3 flex flex-col gap-6">
                
                <div className="sticky top-24 space-y-6">
                    {/* Widget Smart Money */}
                    <SmartMoneyWidget />

                    {/* Mini Ghid Vizual */}
                    <div className="bg-gradient-to-b from-[#0b1221] to-[#020617] border border-white/10 rounded-2xl p-5">
                        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest border-b border-white/5 pb-2">
                            Semnale Cheie
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Acumulare Instituțională</h4>
                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                                        Când BlackRock & Fidelity cumpără (vezi tabelul), trendul este susținut pe termen lung.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Dominanța Bitcoin {'>'} 55%</h4>
                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                                        Altcoin-urile suferă. Rămâi pe BTC până scade dominanța sub 50%.
                                    </p>
                                </div>
                            </div>
                             <div className="pt-2">
                                <Link href="/academie" className="block w-full text-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 transition-all">
                                    Accesează Academia &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        {/* 3. FOOTER SECTION */}
        <div className="mt-12 md:mt-20">
             <AffiliateSection />
        </div>

      </div>
      <Footer />
    </main>
  );
}