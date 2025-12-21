'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, RefreshCw, Clock, Layers, 
  AlertTriangle, Crosshair, Lock, TrendingUp, 
  Info, ArrowRight, Zap 
} from 'lucide-react';

// === HELPER: SKELETON LOADER (Pt Loading Elegant) ===
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-white/5 animate-pulse rounded ${className}`}></div>
);

// === INTERFEȚE DATE ===
interface MarketDataState {
  btcPrice: number;
  btcChange24h: number;
  btcDominance: number;
  fearGreedValue: number;
  fearGreedLabel: string;
  loading: boolean;
}

export default function MarketPage() {
  const container = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<MarketDataState>({
    btcPrice: 0, btcChange24h: 0, btcDominance: 0, 
    fearGreedValue: 50, fearGreedLabel: 'Neutral', loading: true
  });

  // --- 1. ENGINE: FETCH DATA ---
  const fetchMarketData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Fetch paralel pentru viteză
      const [globalRes, priceRes, fgRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/global'),
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'),
        fetch('https://api.alternative.me/fng/')
      ]);

      const globalJson = await globalRes.json();
      const priceJson = await priceRes.json();
      const fgJson = await fgRes.json();

      setData({
        btcPrice: priceJson.bitcoin.usd,
        btcChange24h: priceJson.bitcoin.usd_24h_change,
        btcDominance: globalJson.data.market_cap_percentage.btc,
        fearGreedValue: parseInt(fgJson.data[0].value),
        fearGreedLabel: fgJson.data[0].value_classification,
        loading: false
      });
    } catch (error) {
      console.error("System Error:", error);
      // Fallback in caz de eroare API
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => { fetchMarketData(); }, []);

  // --- TRADINGVIEW WIDGET ---
  useEffect(() => {
    if (container.current) {
        container.current.innerHTML = ""; 
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
          {
            "autosize": true,
            "symbol": "BINANCE:BTCUSDT.P",
            "interval": "60",
            "timezone": "Europe/Bucharest",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "backgroundColor": "rgba(2, 6, 23, 1)",
            "gridColor": "rgba(255, 255, 255, 0.05)",
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "calendar": false,
            "hide_volume": true,
            "support_host": "https://www.tradingview.com"
          }`;
        container.current.appendChild(script);
    }
  }, []);

  // --- LOGICĂ: CALCULATOARE ---
  
  // 1. Cycle Clock
  const halvingDate = new Date('2024-04-20');
  const today = new Date();
  const daysSinceHalving = Math.floor((today.getTime() - halvingDate.getTime()) / (1000 * 3600 * 24));
  const cycleProgress = Math.min(100, (daysSinceHalving / 600) * 100); 

  // 2. Money Flow
  let moneyFlowStage = 1; 
  if (data.btcDominance > 55) moneyFlowStage = 1; 
  else if (data.btcDominance > 45) moneyFlowStage = 2; 
  else moneyFlowStage = 3; 

  // 3. Strategy Output
  let strategyAction = "HOLD";
  let strategyContext = "Piața este indecisă.";
  
  if (data.fearGreedValue < 25) {
      strategyAction = "ACCUMULATE";
      strategyContext = "Frica este extremă. Istoric, cel mai bun moment de cumpărare.";
  } else if (data.fearGreedValue > 75) {
      strategyAction = "TAKE PROFIT";
      strategyContext = "Lăcomia este extremă. Riscul de corecție este maxim.";
  } else if (moneyFlowStage === 3) {
      strategyAction = "ROTATE TO BTC";
      strategyContext = "Altseason pe final. Securizează profiturile în Bitcoin.";
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-cyan-500/30">
      <Navbar />

      {/* === HERO HEADER (Modernizat) === */}
      <div className="pt-28 pb-10 border-b border-white/5 bg-[#020617] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    Market Intelligence V3.0
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-[var(--font-space)] tracking-tight text-white mb-2">
                    MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TERMINAL</span>
                </h1>
                <p className="text-gray-400 max-w-lg text-base md:text-lg">
                    Panoul de control al investitorului inteligent. Cicluri, lichiditate și sentiment, decodificate în timp real.
                </p>
            </div>
            
            <button 
                onClick={fetchMarketData}
                disabled={data.loading}
                className="group bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 px-5 py-3 rounded-xl flex items-center gap-3 transition-all active:scale-95"
            >
                <RefreshCw size={18} className={`text-cyan-400 ${data.loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                <div className="text-left">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Data Feed</div>
                    <div className="text-sm font-bold text-white">{data.loading ? "Updating..." : "Refresh Now"}</div>
                </div>
            </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-8">

        {/* === MODULE 1: THE CYCLE CLOCK (Context Temporal) === */}
        <section className="bg-[#050b1d] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Clock size={150}/></div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                {/* Visual Clock */}
                <div className="relative w-48 h-48 flex-shrink-0 group">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle cx="96" cy="96" r="88" stroke="#06b6d4" strokeWidth="8" fill="transparent" strokeDasharray="552" strokeDashoffset={552 - (552 * cycleProgress) / 100} className="transition-all duration-1000 ease-out shadow-[0_0_20px_#06b6d4]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-black text-white font-mono tracking-tighter">
                            {daysSinceHalving}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Zile Post-Halving</span>
                    </div>
                </div>

                {/* Context Text - Lizibil */}
                <div className="flex-1">
                    <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Layers size={14}/> Macro Positioning
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Faza de Expansiune (Bull Run)
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-8 max-w-2xl">
                        Suntem în "Vara" ciclului de 4 ani. Istoric, Bitcoin atinge vârful la 12-18 luni după Halving. 
                        În acest moment, riscul de a nu fi investit este mai mare decât riscul de corecție.
                    </p>
                    
                    {/* Progress Bar Simplu */}
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" style={{ width: `${cycleProgress}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-500 uppercase">
                        <span>Halving (Apr '24)</span>
                        <span className="text-cyan-400 font-bold">AZI</span>
                        <span>Cycle Peak (Est. 2025)</span>
                    </div>
                </div>
            </div>
        </section>

        {/* === MODULE 2: GRID SYSTEMS (Flow & Sentiment) === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* A. MONEY FLOW RADAR (Vizual Imbunatatit) */}
            <div className="bg-[#050b1d] border border-white/10 rounded-3xl p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Activity size={14}/> Liquidity Flow
                        </h3>
                        <h2 className="text-xl font-bold text-white">Cascada Banilor</h2>
                    </div>
                    <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-gray-400">
                        BTC.D: <span className="text-white font-bold">{data.loading ? "..." : data.btcDominance.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="space-y-3 relative flex-1 flex flex-col justify-center">
                    {/* Linia de conectare */}
                    <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-800/50 -z-0"></div>

                    {/* STAGE 1: BTC */}
                    <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${moneyFlowStage === 1 ? 'bg-orange-500/10 border-orange-500/40 translate-x-2' : 'bg-[#0a0f1e] border-white/5 opacity-60'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 ${moneyFlowStage === 1 ? 'bg-orange-500 border-[#050b1d] text-black shadow-lg' : 'bg-gray-800 border-[#050b1d] text-gray-500'}`}>1</div>
                        <div>
                            <div className="font-bold text-white">Bitcoin Season</div>
                            <div className="text-xs text-gray-500">Lichiditatea intră în BTC</div>
                        </div>
                    </div>

                    {/* STAGE 2: ETH */}
                    <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${moneyFlowStage === 2 ? 'bg-blue-500/10 border-blue-500/40 translate-x-2' : 'bg-[#0a0f1e] border-white/5 opacity-60'}`}>
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 ${moneyFlowStage === 2 ? 'bg-blue-500 border-[#050b1d] text-black shadow-lg' : 'bg-gray-800 border-[#050b1d] text-gray-500'}`}>2</div>
                        <div>
                            <div className="font-bold text-white">Large Caps (ETH)</div>
                            <div className="text-xs text-gray-500">Profiturile din BTC se mută</div>
                        </div>
                    </div>

                    {/* STAGE 3: ALTS */}
                    <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${moneyFlowStage === 3 ? 'bg-pink-500/10 border-pink-500/40 translate-x-2' : 'bg-[#0a0f1e] border-white/5 opacity-60'}`}>
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 ${moneyFlowStage === 3 ? 'bg-pink-500 border-[#050b1d] text-black shadow-lg' : 'bg-gray-800 border-[#050b1d] text-gray-500'}`}>3</div>
                        <div>
                            <div className="font-bold text-white">Altseason (Mania)</div>
                            <div className="text-xs text-gray-500">Speculație extremă</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* B. FEAR & GREED (Gauge Style) */}
            <div className="bg-[#050b1d] border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                 {/* Gradient Background */}
                 <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 ${data.fearGreedValue > 50 ? 'bg-green-500' : 'bg-red-500'}`}></div>

                 <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <AlertTriangle size={14}/> Market Sentiment
                    </h3>
                    
                    <div className="flex flex-col items-center justify-center py-6">
                        {data.loading ? (
                            <Skeleton className="w-32 h-16 rounded-2xl" />
                        ) : (
                            <>
                                <div className="text-6xl font-black text-white font-mono mb-2 tracking-tighter">
                                    {data.fearGreedValue}
                                </div>
                                <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${data.fearGreedValue > 50 ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                                    {data.fearGreedLabel}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-6 backdrop-blur-sm relative z-10">
                    <div className="flex items-start gap-3">
                        <Info size={16} className="text-gray-400 mt-0.5" />
                        <p className="text-xs text-gray-300 leading-relaxed">
                            <strong className="text-white block mb-1">Contrarian Rule:</strong>
                            Când indexul este sub 20 (Frică Extremă), "Smart Money" acumulează. 
                            Când depășește 80 (Lăcomie), instituțiile încep distribuția (vânzarea).
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* === MODULE 3: STRATEGY HUD (Conversion Focused) === */}
        <section className="relative group overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-black border border-white/10">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
             
             <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                        <Crosshair className="text-cyan-400 animate-spin-slow" size={20} /> 
                        <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">Live Strategy Override</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 font-[var(--font-space)]">
                        Ce facem acum?
                    </h3>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Pe baza datelor curente (Ciclu Expansiv + {data.fearGreedLabel}), algoritmul indică o fereastră de oportunitate.
                    </p>
                </div>
                
                {/* The "Locked" VIP Teaser */}
                <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-1 rounded-2xl flex-shrink-0 w-full md:w-auto min-w-[320px]">
                    <div className="bg-[#050b1d] rounded-xl p-6 border border-white/5 relative overflow-hidden">
                        
                        {/* Status (Visible) */}
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <span className="text-xs text-gray-500 font-bold uppercase">Directive</span>
                            {data.loading ? <Skeleton className="w-20 h-6" /> : (
                                <span className={`text-lg font-black font-mono ${data.fearGreedValue > 70 ? 'text-red-400' : 'text-green-400'}`}>
                                    {strategyAction}
                                </span>
                            )}
                        </div>

                        {/* Hidden Details (Blurred) */}
                        <div className="space-y-3 filter blur-sm select-none opacity-50">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Entry Zone:</span> <span className="text-white">$92,400 - $93,100</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Stop Loss:</span> <span className="text-white">$89,500</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Leverage:</span> <span className="text-white">3x - 5x</span></div>
                        </div>

                        {/* Unlock Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                            <a href="/#consultanta" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                <Lock size={16} /> Deblochează Raportul VIP
                            </a>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* === MODULE 4: LIVE CHART (TradingView) === */}
        <div className="h-[600px] bg-[#050b1d] border border-white/10 rounded-3xl p-1 relative overflow-hidden flex flex-col">
             <div className="absolute top-4 left-4 z-10 bg-[#050b1d]/90 backdrop-blur px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 pointer-events-none">
                <Zap size={18} className="text-yellow-400"/>
                <div>
                  <h3 className="text-white font-bold text-sm">Live BTC Futures Liquidity</h3>
                  <p className="text-[10px] text-gray-400">Analiză tehnică în timp real</p>
                </div>
             </div>
             <div className="tradingview-widget-container flex-grow w-full h-full" ref={container}></div>
        </div>

      </div>
      <Footer />
    </main>
  );
}