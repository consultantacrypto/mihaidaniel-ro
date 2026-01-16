"use client";

import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Crosshair, RefreshCw } from 'lucide-react';
import { getSmartMoneyRadar } from '@/app/actions/getSmartMoneyRadar';

interface SmartData {
  symbol: string;
  longRatio: number;
  shortRatio: number;
  ratio: number;
}

export default function SmartMoneyRadar() {
  const [data, setData] = useState<SmartData[]>([]);
  const [loading, setLoading] = useState(true);

  const updateData = async () => {
    try {
      const result = await getSmartMoneyRadar();
      if (result.length > 0) setData(result);
    } catch (error) {
      console.error("Radar Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b1221] p-5 rounded-2xl border border-white/10 relative overflow-hidden group shadow-2xl">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] group-hover:bg-green-500/10 transition-all duration-1000"></div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-2 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Crosshair size={20} className="text-green-400 animate-pulse" />
            </div>
            <div>
                <h3 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
                    Smart Money <span className="text-green-500">Radar</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                    Top Traderi Binance • Leverage 20x+
                </p>
            </div>
        </div>
        
        {/* Live Indicator */}
        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-[10px] text-green-400 font-bold border border-white/5 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_lime]"></div>
            LIVE
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-4 relative z-10">
        {loading ? (
           [1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse border border-white/5"/>)
        ) : (
          data.map((item) => {
            const isBullish = item.longRatio > item.shortRatio;
            const longPct = (item.longRatio * 100).toFixed(0);
            const shortPct = (item.shortRatio * 100).toFixed(0);
            const ratioColor = isBullish ? 'text-green-400' : 'text-red-400';
            const barColor = isBullish ? 'from-green-500 to-emerald-400' : 'from-red-500 to-orange-500';
            const shadowColor = isBullish ? 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
            
            return (
              <div key={item.symbol} className="bg-[#0f1629] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                
                {/* Top Row: Symbol & Ratio */}
                <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-2">
                        {item.symbol === 'BTC' && <div className="w-1 h-4 bg-yellow-500 rounded-full shadow-[0_0_10px_orange]"></div>}
                        {item.symbol === 'ETH' && <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_blue]"></div>}
                        {item.symbol === 'SOL' && <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_purple]"></div>}
                        <span className="text-lg font-black text-white tracking-tight">{item.symbol}</span>
                    </div>
                    
                    <div className="text-right">
                        <div className={`text-xl font-black ${ratioColor} tabular-nums leading-none mb-0.5 drop-shadow-sm`}>
                            {item.ratio.toFixed(2)}x
                        </div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                            L/S Ratio
                        </div>
                    </div>
                </div>

                {/* Battle Bar (Design Nou) */}
                <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                    {/* Indicator Bar */}
                    <div 
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-out bg-gradient-to-r ${barColor} ${shadowColor}`}
                        style={{ width: `${longPct}%` }}
                    >
                        {/* Glow Line at the tip */}
                        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_white]"></div>
                    </div>
                </div>

                {/* Bottom Row: Percentages */}
                <div className="flex justify-between mt-2 text-[10px] font-bold font-mono">
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
      
      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
        <span>Sursa: Binance Futures (Top Accounts)</span>
        <span className="text-green-400 font-bold animate-pulse">● Live Data</span>
      </div>

    </div>
  );
}