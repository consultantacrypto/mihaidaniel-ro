'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, DollarSign, 
  Zap, Eye, RefreshCw, TrendingUp, TrendingDown 
} from 'lucide-react';

interface MarketDataState {
  btcPrice: number;
  btcChange24h: number;
  fearGreedValue: number;
  fearGreedLabel: string;
  loading: boolean;
}

export default function MarketPage() {
  const container = useRef<HTMLDivElement>(null); // Referință pentru containerul graficului
  const [data, setData] = useState<MarketDataState>({
    btcPrice: 0,
    btcChange24h: 0,
    fearGreedValue: 50,
    fearGreedLabel: 'Loading...',
    loading: true
  });

  const fetchMarketData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      const priceJson = await priceRes.json();
      const fgRes = await fetch('https://api.alternative.me/fng/');
      const fgJson = await fgRes.json();

      setData({
        btcPrice: priceJson.bitcoin.usd,
        btcChange24h: priceJson.bitcoin.usd_24h_change,
        fearGreedValue: parseInt(fgJson.data[0].value),
        fearGreedLabel: fgJson.data[0].value_classification,
        loading: false
      });
    } catch (error) {
      console.error("Eroare fetch:", error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  // --- FIX: TRADINGVIEW WIDGET SCRIPT INJECTION ---
  useEffect(() => {
    // Curățăm containerul înainte de a adăuga scriptul (pentru a evita dublurile la refresh)
    if (container.current) {
        container.current.innerHTML = ""; 
    }

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
      
    if (container.current) {
        container.current.appendChild(script);
    }
  }, []);

  const isGreed = data.fearGreedValue > 50;
  const isPump = data.btcChange24h > 0;

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-blue-500/30">
      <Navbar />

      <div className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
                        <Activity size={14} /> Live Connections Active
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-[var(--font-space)] mb-2">
                        Market Intelligence
                    </h1>
                    <p className="text-gray-400 max-w-xl">
                        Date reale. Urmărește prețul BTC Futures și zonele de lichiditate în timp real.
                    </p>
                </div>
                <button 
                  onClick={fetchMarketData}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all active:scale-95"
                >
                  <RefreshCw size={16} className={data.loading ? "animate-spin" : ""} />
                  {data.loading ? "Actualizez..." : "Refresh Date"}
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-8">
        
        {/* DATA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. BTC PRICE */}
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] ${isPump ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <DollarSign size={14} className="text-blue-500"/> Bitcoin Price (USD)
                </h3>
                <div className="flex items-baseline gap-4 mt-4">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    ${data.loading ? "..." : data.btcPrice.toLocaleString()}
                  </h2>
                </div>
                <div className={`inline-flex items-center gap-1 mt-2 font-bold ${isPump ? 'text-green-400' : 'text-red-400'}`}>
                    {isPump ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                    {data.loading ? "..." : `${data.btcChange24h.toFixed(2)}%`} (24h)
                </div>
            </div>

            {/* 2. FEAR & GREED */}
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${isGreed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={14}/> Market Sentiment
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-5xl font-black text-white">{data.loading ? "--" : data.fearGreedValue}</span>
                     <div className={`px-4 py-1 rounded-full border text-xs font-bold uppercase ${isGreed ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                        {data.loading ? "..." : data.fearGreedLabel}
                     </div>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full transition-all duration-1000 ${isGreed ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${data.fearGreedValue}%` }}
                      ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-6 border-l-2 border-white/10 pl-3 italic">
                  {isGreed ? "Lăcomie mare. Atenție la corecții." : "Frică în piață. Oportunitate posibilă."}
                </p>
            </div>

             {/* 3. WHALE WATCH */}
             <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Eye size={14} className="text-purple-500"/> On-Chain Signal
                    </h3>
                    <div className="text-2xl font-bold text-white mb-1">Accumulation</div>
                    <p className="text-xs text-purple-400 font-bold uppercase mb-4">Smart Money Mode</p>
                    <p className="text-sm text-gray-400">
                        Datele arată retrageri constante de pe exchange-uri.
                    </p>
                </div>
                <div className="mt-4 flex gap-2">
                   <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-purple-500 w-[70%] animate-pulse"></div>
                   </div>
                </div>
            </div>
        </div>

        {/* TRADINGVIEW CHART - FUNCTIONAL ACUM */}
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-1 relative overflow-hidden h-[600px] md:h-[700px] flex flex-col">
                 <div className="absolute top-4 left-4 z-10 bg-[#0a0f1e]/90 backdrop-blur px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 pointer-events-none">
                    <Zap size={18} className="text-yellow-400"/>
                    <div>
                      <h3 className="text-white font-bold text-sm">Live BTC Futures</h3>
                      <p className="text-[10px] text-gray-400">Suport & Rezistență în Timp Real</p>
                    </div>
                 </div>
                 
                 {/* CONTAINERUL PENTRU SCRIPT */}
                 <div className="tradingview-widget-container flex-grow w-full h-full" ref={container}>
                    <div className="tradingview-widget-container__widget w-full h-full"></div>
                 </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-8 text-center mt-12 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-2">Vrei strategie completă?</h3>
            <p className="text-gray-400 mb-6 text-sm max-w-lg">
                Intră în comunitatea VIP pentru a învăța cum să tranzacționezi aceste zone.
            </p>
            <a href="/#consultanta" className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg">
                Vreau VIP
            </a>
        </div>

      </div>
      <Footer />
    </main>
  );
}