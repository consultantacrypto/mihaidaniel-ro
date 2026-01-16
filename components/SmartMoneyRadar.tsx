"use client";

import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Crosshair, Zap, Activity } from 'lucide-react';

interface SmartData {
  symbol: string;
  longRatio: number;
  shortRatio: number;
  ratio: number;
}

export default function SmartMoneyRadar() {
  const [data, setData] = useState<SmartData[]>([]);
  const [loading, setLoading] = useState(true);

  // Funcția care trage datele direct din Browser (folosind un Proxy ca să ocolească blocajele)
  const fetchData = async () => {
    try {
      const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
      
      const results = await Promise.all(symbols.map(async (sym) => {
        // Truc: Folosim 'allorigins' pentru a accesa Binance din browser fără erori CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://fapi.binance.com/fapi/data/topLongShortAccountRatio?symbol=${sym}&period=5m&limit=1`)}`;
        
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Network response was not ok");
        
        const json = await res.json();
        const latest = json[json.length - 1];

        return {
          symbol: sym.replace("USDT", ""),
          longRatio: parseFloat(latest.longAccount),
          shortRatio: parseFloat(latest.shortAccount),
          ratio: parseFloat(latest.longShortRatio)
        };
      }));

      setData(results);
    } catch (error) {
      console.error("Radar Data Error:", error);
      // Fallback vizual (nu lăsăm gol dacă pică netul, arătăm date neutre sau cache)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Actualizare la 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b1221] rounded-2xl border border-white/10 relative overflow-hidden group shadow-2xl transition-all hover:border-blue-500/30">
      
      {/* 1. HEADER "COCKPIT" */}
      <div className="p-5 border-b border-white/5 bg-[#0f1629]/50 relative z-10">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-lg opacity-20 animate-pulse"></div>
                    <div className="bg-[#0b1221] p-2 rounded-lg border border-green-500/30 relative z-10">
                        <Crosshair size={20} className="text-green-400" />
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
                        Smart Money <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Radar</span>
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                        <Activity size={10} className="text-blue-400"/>
                        <span>Top Traderi Binance</span>
                    </div>
                </div>
            </div>
            
            {/* Live Badge Pulse */}
            <div className="flex items-center gap-1.5 bg-green-900/20 px-2 py-1 rounded border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 absolute"></div>
                <span className="text-[9px] font-bold text-green-400 ml-1">LIVE</span>
            </div>
        </div>
      </div>

      {/* 2. DATA GRID */}
      <div className="p-2 space-y-2 relative z-10">
        {loading ? (
           // Skeleton Loader (Când încarcă)
           [1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse mx-2 my-2"/>)
        ) : (
          data.map((item) => {
            const isBullish = item.longRatio > item.shortRatio;
            const longPct = (item.longRatio * 100).toFixed(0);
            const shortPct = (item.shortRatio * 100).toFixed(0);
            
            return (
              <div key={item.symbol} className="bg-[#0a0f1e] p-4 rounded-xl border border-white/5 hover:bg-[#0f1629] transition-all group/item relative overflow-hidden">
                
                {/* Background Gradient subtil per item */}
                <div className={`absolute inset-0 opacity-0 group-hover/item:opacity-10 transition-opacity bg-gradient-to-r ${isBullish ? 'from-green-500/20' : 'from-red-500/20'} to-transparent`}></div>

                {/* Top Row: Symbol & Big Ratio */}
                <div className="flex justify-between items-end mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                        {/* Coin Logo Placeholder (Circle color) */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] text-black shadow-lg
                            ${item.symbol === 'BTC' ? 'bg-yellow-500 shadow-yellow-500/20' : 
                              item.symbol === 'ETH' ? 'bg-blue-500 shadow-blue-500/20' : 
                              'bg-purple-500 shadow-purple-500/20'}`}>
                            {item.symbol[0]}
                        </div>
                        <div>
                            <span className="text-lg font-black text-white tracking-tight block leading-none">{item.symbol}</span>
                            <span className={`text-[10px] font-bold uppercase ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
                                {isBullish ? 'BULLISH' : 'BEARISH'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-right">
                         <div className="flex items-center justify-end gap-1">
                            <Zap size={12} className={isBullish ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                            <div className={`text-xl font-black ${isBullish ? 'text-green-400' : 'text-red-400'} tabular-nums leading-none`}>
                                {item.ratio.toFixed(2)}x
                            </div>
                         </div>
                        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                            Long/Short Ratio
                        </div>
                    </div>
                </div>

                {/* Battle Bar (Neon Style) */}
                <div className="relative h-2.5 bg-gray-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                    {/* Longs */}
                    <div 
                        className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-1000 ease-out flex items-center justify-start pl-1
                            ${isBullish ? 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}`}
                        style={{ width: `${longPct}%` }}
                    >
                    </div>
                    
                    {/* Shorts */}
                    <div 
                        className={`absolute top-0 bottom-0 right-0 bg-gradient-to-l from-red-600 to-orange-500 transition-all duration-1000 ease-out flex items-center justify-end pr-1
                            ${!isBullish ? 'shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
                        style={{ width: `${shortPct}%` }}
                    >
                    </div>

                    {/* Lightning Separator */}
                    <div className="absolute top-0 bottom-0 w-1 bg-white skew-x-12 blur-[1px]" style={{ left: `${longPct}%`, transition: 'left 1s ease-out' }}></div>
                </div>

                {/* Percentages */}
                <div className="flex justify-between mt-1.5 text-[9px] font-bold font-mono relative z-10">
                    <span className="text-green-400 flex items-center gap-1">
                        <TrendingUp size={10}/> {longPct}% Tauri
                    </span>
                    <span className="text-red-400 flex items-center gap-1">
                        {shortPct}% Urși <TrendingDown size={10}/>
                    </span>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>

    </div>
  );
}