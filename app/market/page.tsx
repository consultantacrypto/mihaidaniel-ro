import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TradingViewWidget from '@/components/TradingViewWidget';
import AffiliateSection from '@/components/AffiliateSection'; // ✅ Secțiunea de Afilieri
import { getGlobalData, getFearGreed } from '@/lib/market-api';
import { Activity, DollarSign, Layers, BarChart3, TrendingUp, TrendingDown, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Această funcție formatează numerele mari (ex: 2.4T, 80B)
const formatCurrency = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} B`;
  return `$${value.toLocaleString()}`;
};

export default async function MarketPage() {
  // 1. Aducem datele reale de pe server
  const globalData = await getGlobalData();
  const fearGreedData = await getFearGreed();

  // Date de fallback în caz că pică API-ul
  const marketCap = globalData ? formatCurrency(globalData.marketCap) : "$2.40 T";
  const volume = globalData ? formatCurrency(globalData.volume) : "$85.2 B";
  const dominance = globalData ? `${globalData.btcDominance.toFixed(1)}%` : "55.2%";
  const change = globalData ? globalData.marketCapChange.toFixed(2) : "+1.2";

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                    <Activity className="text-green-400" /> Market Intelligence
                </h1>
                <p className="text-gray-400 max-w-xl">
                    Date live din blockchain și exchange-uri. 
                    Monitorizăm pulsul pieței în timp real.
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                {/* STATUS API LIVE */}
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-mono text-green-400 font-bold">LIVE FEED ACTIVE</span>
                </div>

                {/* ✅ BUTON LICHIDĂRI - DESIGN NOU (MAKE IT POP) */}
                <Link href="/lichidari" className="relative group overflow-hidden rounded-lg px-5 py-2.5 font-bold text-white shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all">
                    {/* Background Gradient Animat */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 group-hover:from-yellow-500 group-hover:to-orange-500 transition-colors"></div>
                    
                    {/* Efect de strălucire */}
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine"></div>

                    <div className="relative flex items-center gap-2">
                        <Activity size={16} className="animate-pulse"/> 
                        <span>Harta Lichidărilor</span>
                        <ExternalLink size={14} className="opacity-70 group-hover:translate-x-0.5 transition-transform"/>
                    </div>
                </Link>
            </div>
        </div>

        {/* --- SECȚIUNEA 1: METRICI LIVE (CoinGecko) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            
            {/* Market Cap */}
            <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><DollarSign size={16}/> Global Market Cap</div>
                <div className="text-3xl font-black text-white font-[var(--font-space)]">{marketCap}</div>
                <div className={`text-xs font-bold mt-2 flex items-center gap-1 ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(change) >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {change}% (24h)
                </div>
            </div>

            {/* Volum 24h */}
            <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all"></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><BarChart3 size={16}/> Volum Total (24h)</div>
                <div className="text-3xl font-black text-white font-[var(--font-space)]">{volume}</div>
                <div className="text-xs text-gray-500 mt-2">Lichiditate în piață</div>
            </div>

            {/* BTC Dominance */}
            <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-all"></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Layers size={16}/> BTC Dominance</div>
                <div className="text-3xl font-black text-white font-[var(--font-space)]">{dominance}</div>
                <div className="text-xs text-gray-500 mt-2">Dacă scade = Altseason</div>
            </div>

            {/* Fear & Greed LIVE */}
            <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all ${Number(fearGreedData.value) > 50 ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Zap size={16}/> Fear & Greed</div>
                <div className="flex items-end gap-3">
                    <div className={`text-3xl font-black font-[var(--font-space)] ${Number(fearGreedData.value) > 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {fearGreedData.value}
                    </div>
                    <div className="text-sm font-bold text-gray-300 mb-1.5">{fearGreedData.value_classification}</div>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                        className={`h-full ${Number(fearGreedData.value) > 50 ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${fearGreedData.value}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* --- SECȚIUNEA 2: CHART INTERACTIV (TradingView) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-blue-400"/> Analiză Tehnică Live (BTC/USDT)
                    </h2>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Sursa: TradingView</span>
                </div>
                {/* AICI ESTE WIDGETUL REAL (Cu link-ul tău de afiliat) */}
                <TradingViewWidget />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">
                    Cum folosim instrumentele?
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-green-400 text-sm mb-1">1. Market Cap & Volum</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Volumul confirmă trendul. Dacă prețul crește dar volumul scade, este o capcană (Fakeout). 
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-orange-400 text-sm mb-1">2. Dominanța BTC</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Când dominanța scade sub 50% agresiv, banii se mută în Altcoins. Atunci e momentul să te uiți la ETH și SOL.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-purple-400 text-sm mb-1">3. Fear & Greed</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Cumpără când e "Fear" (frică, roșu) și vinde treptat când e "Greed" (lăcomie, verde peste 75).
                        </p>
                    </div>

                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 mt-4">
                        <p className="text-blue-300 text-xs font-bold text-center">
                            💡 Vrei să înveți să citești graficul din stânga?
                        </p>
                        <a href="/academie" className="block mt-2 text-center text-white bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-xs font-bold transition-colors">
                            Vezi Academia
                        </a>
                    </div>
                </div>
            </div>

        </div>

        {/* ✅ AICI ESTE NOUA SECȚIUNE DE AFILIERI */}
        <AffiliateSection />

      </div>
      <Footer />
    </main>
  );
}