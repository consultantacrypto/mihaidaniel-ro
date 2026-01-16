"use client";

import { useState, useEffect } from 'react';
import { Target, Users } from 'lucide-react';
// Importăm acțiunea nouă
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
    const interval = setInterval(updateData, 60000); // Refresh la 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b1221] p-5 rounded-xl border border-white/5 relative overflow-hidden group">
      {/* Background Effect */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all"></div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <div className="bg-green-500/20 p-1.5 rounded text-green-400 animate-pulse">
            <Target size={18} />
        </div>
        <div>
            <h3 className="text-sm font-bold text-white leading-none">Smart Money Radar</h3>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">Top Traderi Binance (Long vs Short)</p>
        </div>
      </div>

      <div className="space-y-5 relative z-10">
        {loading ? (
           [1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded animate-pulse"/>)
        ) : (
          data.map((item) => {
            const isBullish = item.longRatio > item.shortRatio;
            const longPct = (item.longRatio * 100).toFixed(0);
            const shortPct = (item.shortRatio * 100).toFixed(0);
            
            return (
              <div key={item.symbol} className="space-y-1.5">
                {/* Info Bar */}
                <div className="flex justify-between items-end px-1">
                    <span className={`font-black text-sm ${item.symbol === 'BTC' ? 'text-yellow-500' : 'text-white'}`}>
                        {item.symbol}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
                        {isBullish ? 'Balenele Cumpără 🐂' : 'Balenele Vând 🐻'}
                    </span>
                </div>

                {/* The Battle Bar */}
                <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex relative shadow-inner">
                    {/* Longs (Green) */}
                    <div 
                        style={{ width: `${longPct}%` }} 
                        className="h-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-start pl-1.5 transition-all duration-1000"
                    >
                        <span className="text-[8px] font-black text-black">{longPct}%</span>
                    </div>
                    
                    {/* Shorts (Red) */}
                    <div 
                        style={{ width: `${shortPct}%` }} 
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-end pr-1.5 transition-all duration-1000"
                    >
                        <span className="text-[8px] font-black text-white">{shortPct}%</span>
                    </div>

                    {/* Middle Marker */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black/50 -translate-x-1/2"></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explicație simplă */}
      <div className="mt-5 pt-3 border-t border-white/5 text-[10px] text-gray-500 leading-tight flex gap-2">
        <Users size={12} className="shrink-0 mt-0.5 text-blue-400" />
        <p>
            Ce fac <strong className="text-gray-300">Top 20% Traderi</strong>? <br/>
            <span className="text-green-400 font-bold">Verde</span> = Smart Money pariază pe creștere.
        </p>
      </div>
    </div>
  );
}