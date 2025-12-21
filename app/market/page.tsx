'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, RefreshCw, Layers, 
  AlertTriangle, Crosshair, Lock, Zap, 
  BarChart2, Globe, TrendingUp 
} from 'lucide-react';

// === HELPER: SKELETON LOADER ===
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-white/5 animate-pulse rounded ${className}`}></div>
);

// === INTERFEȚE DATE ===
interface MarketDataState {
  btcDominance: number;
  fearGreedValue: number;
  fearGreedLabel: string;
  loading: boolean;
}

export default function MarketPage() {
  const chartContainer = useRef<HTMLDivElement>(null);
  const heatmapContainer = useRef<HTMLDivElement>(null);
  const technicalContainer = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<MarketDataState>({
    btcDominance: 0, 
    fearGreedValue: 50, fearGreedLabel: 'Neutral', loading: true
  });

  // --- 1. ENGINE: FETCH DATA (Doar ce nu luăm din widgeturi) ---
  const fetchMarketData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      const [globalRes, fgRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/global'),
        fetch('https://api.alternative.me/fng/')
      ]);

      const globalJson = await globalRes.json();
      const fgJson = await fgRes.json();

      setData({
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

  // --- 2. WIDGET: ADVANCED CHART CU VPVR (LICHIDITATE) ---
  useEffect(() => {
    if (chartContainer.current) {
        chartContainer.current.innerHTML = ""; 
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
            "backgroundColor": "rgba(5, 11, 29, 1)",
            "gridColor": "rgba(255, 255, 255, 0.05)",
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "calendar": false,
            "hide_volume": false,
            "studies": [
              "VPVR@tv-basicstudies"
            ],
            "support_host": "https://www.tradingview.com"
          }`;
        chartContainer.current.appendChild(script);
    }
  }, []);

  // --- 3. WIDGET: CRYPTO HEATMAP (TOATĂ PIAȚA) ---
  useEffect(() => {
    if (heatmapContainer.current) {
        heatmapContainer.current.innerHTML = ""; 
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
          {
            "dataSource": "Crypto",
            "blockSize": "market_cap_calc",
            "blockColor": "change",
            "locale": "en",
            "symbolUrl": "",
            "colorTheme": "dark",
            "hasTopBar": false,
            "isDataSetEnabled": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "width": "100%",
            "height": "100%"
          }`;
        heatmapContainer.current.appendChild(script);
    }
  }, []);

  // --- 4. WIDGET: TECHNICAL ANALYSIS (SPEEDOMETER) ---
  useEffect(() => {
    if (technicalContainer.current) {
        technicalContainer.current.innerHTML = ""; 
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
          {
            "interval": "1h",
            "width": "100%",
            "isTransparent": true,
            "height": "100%",
            "symbol": "BINANCE:BTCUSDT.P",
            "showIntervalTabs": true,
            "displayMode": "single",
            "locale": "en",
            "colorTheme": "dark"
          }`;
        technicalContainer.current.appendChild(script);
    }
  }, []);

  // LOGICĂ: Cycle & Strategy
  const halvingDate = new Date('2024-04-20');
  const today = new Date();
  const daysSinceHalving = Math.floor((today.getTime() - halvingDate.getTime()) / (1000 * 3600 * 24));
  
  let strategyAction = "HOLD";
  if (data.fearGreedValue < 25) strategyAction = "ACCUMULATE";
  else if (data.fearGreedValue > 75) strategyAction = "TAKE PROFIT";

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-cyan-500/30">
      <Navbar />

      {/* === HEADER === */}
      <div className="pt-28 pb-10 border-b border-white/5 bg-[#020617]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    Market Intelligence V4.0
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-[var(--font-space)] text-white mb-2">
                    PRO DATA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">DASHBOARD</span>
                </h1>
                <p className="text-gray-400 max-w-lg">
                    Lichiditate. Zone de interes. Heatmap Global. Tot ce ai nevoie pentru a nu fi lichidat.
                </p>
            </div>
            <button 
                onClick={fetchMarketData}
                className="bg-white/5 border border-white/10 hover:border-cyan-500/50 px-5 py-3 rounded-xl flex items-center gap-3 transition-all"
            >
                <RefreshCw size={18} className={`text-cyan-400 ${data.loading ? "animate-spin" : ""}`} />
                <span className="font-bold text-sm">Actualizează</span>
            </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-8">

        {/* === RÂNDUL 1: CHART PRINCIPAL + LIQUIDITY ZONES (VPVR) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chart-ul Mare (2/3 din ecran) */}
            <div className="lg:col-span-2 bg-[#050b1d] border border-white/10 rounded-3xl relative overflow-hidden flex flex-col">
                 <div className="absolute top-4 left-4 z-10 bg-[#050b1d]/90 backdrop-blur px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 pointer-events-none">
                    <Zap size={18} className="text-yellow-400"/>
                    <div>
                      <h3 className="text-white font-bold text-sm">BTC Futures + Liquidity Nodes</h3>
                      <p className="text-[10px] text-gray-400">Histograma din dreapta arată unde sunt ordinele mari (Suport/Rezistență)</p>
                    </div>
                 </div>
                 <div className="tradingview-widget-container flex-grow w-full h-full" ref={chartContainer}></div>
            </div>

            {/* Coloana Dreapta: Technicals & Sentiment */}
            <div className="flex flex-col gap-6">
                
                {/* 1. Technical Speedometer */}
                <div className="flex-1 bg-[#050b1d] border border-white/10 rounded-3xl p-4 flex flex-col relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <Activity size={16} className="text-cyan-400"/>
                        <span className="text-xs font-bold uppercase text-gray-400">Semnal Tehnic (1H)</span>
                    </div>
                    <div className="tradingview-widget-container flex-grow w-full h-full mt-6" ref={technicalContainer}></div>
                </div>

                {/* 2. Sentiment & Cycle */}
                <div className="flex-1 bg-[#050b1d] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                     <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Fear & Greed</h3>
                        <div className="text-4xl font-black text-white">{data.fearGreedValue}</div>
                        <div className={`text-sm font-bold uppercase ${data.fearGreedValue > 50 ? 'text-green-400' : 'text-red-400'}`}>{data.fearGreedLabel}</div>
                     </div>
                     <div className="border-t border-white/5 pt-4 mt-4">
                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-1">Zile Post-Halving</h3>
                        <div className="text-2xl font-bold text-white font-mono">{daysSinceHalving}</div>
                        <div className="text-[10px] text-gray-500">Target Peak: 2025</div>
                     </div>
                </div>
            </div>
        </div>

        {/* === RÂNDUL 2: MARKET HEATMAP (TOATĂ PIAȚA) === */}
        <div className="h-[500px] bg-[#050b1d] border border-white/10 rounded-3xl p-1 relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10 bg-[#050b1d]/90 backdrop-blur px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 pointer-events-none">
                <Globe size={18} className="text-blue-400"/>
                <div>
                    <h3 className="text-white font-bold text-sm">Global Market Heatmap</h3>
                    <p className="text-[10px] text-gray-400">Vezi vizual unde curg banii: BTC vs ETH vs ALTS</p>
                </div>
            </div>
            <div className="tradingview-widget-container flex-grow w-full h-full" ref={heatmapContainer}></div>
        </div>

        {/* === RÂNDUL 3: STRATEGY LOCK (CONVERSION) === */}
        <section className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                    <Crosshair className="text-cyan-400" /> Strategia VIP
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Datele de mai sus îți arată "Ce" se întâmplă. În comunitatea VIP discutăm "Cum" profităm.
                    Primești nivele exacte de intrare (Entry), ieșire (TP) și Stop Loss pentru situația actuală a lichidității.
                </p>
            </div>
            
            <a href="/#consultanta" className="group bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <Lock size={18} className="group-hover:unlock transition-all"/>
                ACCESEAZĂ SEMNALELE VIP
            </a>
        </section>

      </div>
      <Footer />
    </main>
  );
}