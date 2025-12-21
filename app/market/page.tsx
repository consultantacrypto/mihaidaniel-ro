'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, Zap, RefreshCw, Clock, 
  Layers, AlertTriangle, Crosshair, Lock, 
  ArrowRight, Database, TrendingUp 
} from 'lucide-react';

// Tipuri de date
interface MarketDataState {
  btcPrice: number;
  btcChange24h: number;
  btcDominance: number;
  fearGreedValue: number;
  fearGreedLabel: string;
  loading: boolean;
}

export default function MarketPage() {
  const [data, setData] = useState<MarketDataState>({
    btcPrice: 0, btcChange24h: 0, btcDominance: 0, 
    fearGreedValue: 50, fearGreedLabel: 'Loading...', loading: true
  });

  // --- 1. ENGINE: FETCH DATA ---
  const fetchMarketData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      const globalRes = await fetch('https://api.coingecko.com/api/v3/global');
      const globalJson = await globalRes.json();
      
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      const priceJson = await priceRes.json();

      const fgRes = await fetch('https://api.alternative.me/fng/');
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
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => { fetchMarketData(); }, []);

  // --- 2. LOGIC: CYCLE CLOCK CALCULATOR ---
  // Data Halving-ului: 20 Aprilie 2024
  const halvingDate = new Date('2024-04-20');
  const today = new Date();
  const daysSinceHalving = Math.floor((today.getTime() - halvingDate.getTime()) / (1000 * 3600 * 24));
  
  // Ciclul mediu de Bull Run post-halving e aprox 500-600 zile
  const cycleProgress = Math.min(100, (daysSinceHalving / 600) * 100); 

  // --- 3. LOGIC: MONEY FLOW ---
  // Definim unde sunt banii in functie de BTC Dominance
  let moneyFlowStage = 1; // 1=BTC, 2=ETH, 3=ALTS
  if (data.btcDominance > 55) moneyFlowStage = 1; // Bitcoin Season
  else if (data.btcDominance > 45) moneyFlowStage = 2; // Ethereum/Large Caps
  else moneyFlowStage = 3; // Altseason

  // --- 4. LOGIC: THE GENERAL'S ORDER ---
  let strategy = "ANALYZING...";
  let strategyColor = "text-gray-400";
  
  if (data.fearGreedValue < 20) {
      strategy = "DEPLOY CAPITAL (AGGRESSIVE BUY)";
      strategyColor = "text-green-400";
  } else if (data.fearGreedValue > 80) {
      strategy = "TAKE PROFITS (SCALE OUT)";
      strategyColor = "text-red-400";
  } else {
      strategy = "HODL & WAIT (NO ACTION)";
      strategyColor = "text-yellow-400";
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-cyan-500/30">
      <Navbar />

      {/* === HEADER: TERMINAL STATUS === */}
      <div className="pt-24 pb-8 border-b border-white/5 bg-[#020617]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest mb-2 animate-pulse">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    SYSTEM ONLINE // V 2.1
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-[var(--font-space)] tracking-tight text-white">
                    MD <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TERMINAL</span>
                </h1>
                <p className="text-gray-400 max-w-lg mt-2 font-mono text-sm">
                    Running diagnostic on Global Liquidity & Market Cycles...
                </p>
            </div>
            <button 
                onClick={fetchMarketData}
                className="bg-white/5 border border-white/10 hover:border-cyan-500/50 text-xs font-mono px-4 py-2 rounded flex items-center gap-2 transition-all hover:bg-cyan-900/10"
            >
                <RefreshCw size={12} className={data.loading ? "animate-spin" : ""} />
                {data.loading ? "FETCHING_DATA..." : "REFRESH_FEED"}
            </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-8">

        {/* === SECTION 1: THE CYCLE CLOCK (Context Temporal) === */}
        <section className="bg-[#050b1d] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Clock size={100}/></div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Visual Clock */}
                <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                        <circle cx="96" cy="96" r="88" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset={552 - (552 * cycleProgress) / 100} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-white">{daysSinceHalving}</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Zile Post-Halving</span>
                    </div>
                </div>

                {/* Context Text */}
                <div className="flex-1">
                    <h3 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Database size={14}/> Cycle Positioning System
                    </h3>
                    <h2 className="text-2xl font-bold text-white mb-4">Suntem în faza de Expansiune (Bull Run)</h2>
                    <p className="text-gray-400 leading-relaxed text-sm mb-6">
                        Istoric, Bitcoin atinge vârful la 12-18 luni după Halving. Suntem la ziua <span className="text-white font-bold">{daysSinceHalving}</span>. 
                        Asta înseamnă că suntem în "Vara" ciclului. Nu este momentul să fii Bearish. Este momentul să fii atent la exit.
                    </p>
                    
                    {/* Progress Markers */}
                    <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase border-t border-white/5 pt-4">
                        <span>Halving (Apr '24)</span>
                        <span className="text-cyan-500 font-bold animate-pulse">YOU ARE HERE</span>
                        <span>Cycle Peak (Est. Late '25)</span>
                    </div>
                </div>
            </div>
        </section>

        {/* === SECTION 2: GRID SYSTEMS (Flow & Pain) === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* MODULE A: MONEY FLOW RADAR */}
            <div className="bg-[#050b1d] border border-white/10 rounded-3xl p-8 flex flex-col">
                <h3 className="text-purple-400 font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Layers size={14}/> Liquidity Waterfall
                </h3>

                <div className="space-y-4 relative">
                    {/* Linia de conexiune */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-800 -z-0"></div>

                    {/* STAGE 1: BITCOIN */}
                    <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all ${moneyFlowStage === 1 ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'bg-[#0a0f1e] border-white/5 opacity-50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${moneyFlowStage === 1 ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-500'}`}>1</div>
                        <div>
                            <div className="text-sm font-bold text-white">Bitcoin Season</div>
                            <div className="text-xs text-gray-500">BTC Dominance: {data.loading ? "..." : data.btcDominance.toFixed(1)}%</div>
                        </div>
                        {moneyFlowStage === 1 && <div className="ml-auto text-orange-400 text-xs font-bold animate-pulse">ACTIVE FLOW</div>}
                    </div>

                    {/* STAGE 2: ETHEREUM */}
                    <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all ${moneyFlowStage === 2 ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-[#0a0f1e] border-white/5 opacity-50'}`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${moneyFlowStage === 2 ? 'bg-blue-500 text-black' : 'bg-gray-800 text-gray-500'}`}>2</div>
                        <div>
                            <div className="text-sm font-bold text-white">Large Caps (ETH/SOL)</div>
                            <div className="text-xs text-gray-500">Urmează după BTC stall</div>
                        </div>
                        {moneyFlowStage === 2 && <div className="ml-auto text-blue-400 text-xs font-bold animate-pulse">ACTIVE FLOW</div>}
                    </div>

                    {/* STAGE 3: ALTS */}
                    <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all ${moneyFlowStage === 3 ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'bg-[#0a0f1e] border-white/5 opacity-50'}`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${moneyFlowStage === 3 ? 'bg-pink-500 text-black' : 'bg-gray-800 text-gray-500'}`}>3</div>
                        <div>
                            <div className="text-sm font-bold text-white">Altseason (Mania)</div>
                            <div className="text-xs text-gray-500">High Risk / High Reward</div>
                        </div>
                        {moneyFlowStage === 3 && <div className="ml-auto text-pink-400 text-xs font-bold animate-pulse">ACTIVE FLOW</div>}
                    </div>
                </div>
            </div>

            {/* MODULE B: PAIN & SENTIMENT GAUGE */}
            <div className="bg-[#050b1d] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                 <div>
                    <h3 className="text-red-400 font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <AlertTriangle size={14}/> Risk / Reward Ratio
                    </h3>
                    
                    <div className="flex items-center justify-center mb-6">
                        <div className="text-center">
                            <div className="text-5xl font-black text-white mb-2">{data.loading ? "--" : data.fearGreedValue}</div>
                            <div className={`inline-block px-3 py-1 rounded border text-xs font-bold uppercase ${data.fearGreedValue > 50 ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
                                {data.loading ? "LOADING" : data.fearGreedLabel}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-400 uppercase">Retail Sentiment</span>
                            <span className="text-xs font-bold text-white">Super Bullish</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[75%]"></div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 mb-2">
                            <span className="text-xs text-gray-400 uppercase">Market Maker Incentive</span>
                            <span className="text-xs font-bold text-red-400">High (Dump Incoming)</span>
                        </div>
                         <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[60%]"></div>
                        </div>
                    </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-6 italic">
                    "Fii lacom când altora le e frică." - Warren Buffett
                </p>
            </div>
        </div>

        {/* === SECTION 3: THE CHEAT SHEET (Actionable) === */}
        <section className="bg-gradient-to-r from-gray-900 to-black border-t-4 border-cyan-500 rounded-b-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-white font-mono text-lg font-bold mb-2 flex items-center gap-2">
                        <Crosshair className="text-cyan-500 animate-spin-slow" /> 
                        STRATEGIC_OVERRIDE_COMMAND
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xl">
                        Pe baza datelor analizate (Ciclu, Flux, Sentiment), algoritmul recomandă următoarea acțiune pentru portofoliul tău:
                    </p>
                </div>
                
                <div className="bg-black border border-gray-800 p-6 rounded-xl min-w-[300px] text-center">
                    <div className="text-xs text-gray-600 font-mono mb-2 uppercase tracking-widest">Current Directive</div>
                    <div className={`text-2xl font-black font-mono ${strategyColor} animate-pulse`}>
                        {'>'} {strategy}
                    </div>
                </div>
             </div>
             
             <div className="mt-8 text-center">
                <a href="/#consultanta" className="inline-flex items-center gap-2 text-cyan-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors border-b border-cyan-500/30 hover:border-cyan-500 pb-1">
                    Accesează Raportul Complet în VIP <ArrowRight size={12}/>
                </a>
             </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}