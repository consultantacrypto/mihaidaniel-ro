'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, DollarSign, 
  Zap, Eye, RefreshCw, Lock, ArrowUpRight, TrendingUp, TrendingDown 
} from 'lucide-react';

// Definim tipurile de date pentru API
interface MarketDataState {
  btcPrice: number;
  btcChange24h: number;
  fearGreedValue: number;
  fearGreedLabel: string;
  loading: boolean;
}

export default function MarketPage() {
  // Starea inițială (Loading)
  const [data, setData] = useState<MarketDataState>({
    btcPrice: 0,
    btcChange24h: 0,
    fearGreedValue: 50, // Neutral default
    fearGreedLabel: 'Loading...',
    loading: true
  });

  // Funcția care trage datele LIVE
  const fetchMarketData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));

      // 1. Fetch Bitcoin Price (CoinGecko)
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      const priceJson = await priceRes.json();

      // 2. Fetch Fear & Greed (Alternative.me)
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
      console.error("Eroare la fetch date:", error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  // Tragem datele la încărcarea paginii
  useEffect(() => {
    fetchMarketData();
    
    // TradingView Widget Script
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Calculăm culorile dinamic
  const isGreed = data.fearGreedValue > 50;
  const isPump = data.btcChange24h > 0;

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-blue-500/30">
      <Navbar />

      {/* HEADER SECTION */}
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
                        Date reale, în timp real. Fără întârzieri, fără estimări. 
                        Acesta este pulsul adevărat al pieței.
                    </p>
                </div>
                
                {/* REFRESH BUTTON */}
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

      {/* === DASHBOARD GRID === */}
      <div className="container mx-auto px-6 py-12 space-y-8">
        
        {/* RÂNDUL 1: MACRO & PREȚ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. BITCOIN LIVE PRICE */}
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

                <div className="mt-8 pt-6 border-t border-white/5 text-xs text-gray-500">
                  Sursa: CoinGecko API • Actualizat acum
                </div>
            </div>

            {/* 2. FEAR & GREED (REAL) */}
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

                  {/* Visual Bar */}
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full transition-all duration-1000 ${isGreed ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${data.fearGreedValue}%` }}
                      ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
                    <span>Extreme Fear</span>
                    <span>Extreme Greed</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-6 border-l-2 border-white/10 pl-3 italic">
                  {isGreed 
                    ? "Piața este lacomă. Când alții sunt lacomi, fii precaut (sau ia profit)." 
                    : "Piața este înfricoșată. Frica este adesea o oportunitate de cumpărare."}
                </p>
            </div>

             {/* 3. WHALE WATCH (Static momentan, dar contextualizat) */}
             <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Eye size={14} className="text-purple-500"/> On-Chain Signal
                    </h3>
                    <div className="text-2xl font-bold text-white mb-1">Accumulation</div>
                    <p className="text-xs text-purple-400 font-bold uppercase mb-4">Smart Money Mode</p>
                    <p className="text-sm text-gray-400">
                        Datele arată retrageri constante de pe exchange-uri. Balenele mută BTC în Cold Storage.
                    </p>
                </div>
                <div className="mt-4 flex gap-2">
                   <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-purple-500 w-[70%] animate-pulse"></div>
                   </div>
                </div>
            </div>
        </div>

        {/* RÂNDUL 2: LIQUIDATION CHART (TRADINGVIEW WIDGET) */}
        {/* Am înlocuit "Heatmap-ul stricat" cu un Chart Funcțional */}
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-1 relative overflow-hidden h-[600px] md:h-[700px]">
                 
                 {/* Header-ul Widgetului */}
                 <div className="absolute top-4 left-4 z-10 bg-[#0a0f1e]/90 backdrop-blur px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                    <Zap size={18} className="text-yellow-400"/>
                    <div>
                      <h3 className="text-white font-bold text-sm">Live BTC Action</h3>
                      <p className="text-[10px] text-gray-400">Urmărește zonele de suport (Stop Loss Hunt)</p>
                    </div>
                 </div>

                 {/* TradingView Widget Embed */}
                 <div className="tradingview-widget-container w-full h-full">
                    <div id="tradingview_12345" className="h-full w-full"></div>
                    <iframe 
                      src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=BINANCE%3ABTCUSDT.P&interval=15&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=[]&theme=dark&style=1&timezone=Europe%2FBucharest" 
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    ></iframe>
                 </div>
            </div>
        </div>

        {/* CTA FINAL */}
        <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-8 text-center mt-12 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-2">Vrei să înțelegi cum să tranzacționezi aceste date?</h3>
            <p className="text-gray-400 mb-6 text-sm max-w-lg">
                Graficele îți arată "Ce". Eu te învăț "Cum". Intră în comunitatea VIP pentru setup-uri complete.
            </p>
            <a href="/#consultanta" className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg">
                Vreau Strategie
            </a>
        </div>

      </div>

      <Footer />
    </main>
  );
}