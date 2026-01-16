"use client";

import { useState, useEffect } from 'react';
import { Percent, Info, TrendingUp, TrendingDown } from 'lucide-react';

interface FundingData {
  symbol: string;
  rate: number;
}

export default function FundingRatesWidget() {
  const [rates, setRates] = useState<FundingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        // Luăm datele pentru BTC, ETH, SOL
        const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
        const results = await Promise.all(
          symbols.map(async (sym) => {
            const res = await fetch(`https://api.binance.com/api/v3/premiumIndex?symbol=${sym}`);
            const data = await res.json();
            return {
              symbol: sym.replace("USDT", ""),
              rate: parseFloat(data.lastFundingRate)
            };
          })
        );
        setRates(results);
        setLoading(false);
      } catch (e) {
        console.error("Funding fetch error", e);
        setLoading(false);
      }
    };

    fetchFunding();
    const interval = setInterval(fetchFunding, 60000); // Actualizare la 1 min
    return () => clearInterval(interval);
  }, []);

  // Funcție pentru interpretarea ratei
  const getStatus = (rate: number) => {
    const percentage = rate * 100;
    if (percentage > 0.03) return { color: "text-red-400", text: "Supraîncălzit (Risc)" };
    if (percentage < 0) return { color: "text-green-400", text: "Shorts Pay Longs (Bullish)" };
    return { color: "text-gray-400", text: "Neutru (Sănătos)" };
  };

  return (
    <div className="bg-[#0b1221] p-5 rounded-xl border border-white/5 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-500/20 p-1.5 rounded text-blue-400">
            <Percent size={18} />
        </div>
        <div>
            <h3 className="text-sm font-bold text-white leading-none">Funding Rates</h3>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">Costul Levierului (1h)</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
           [1, 2, 3].map(i => <div key={i} className="h-8 bg-white/5 rounded animate-pulse"/>)
        ) : (
          rates.map((item) => {
            const percent = (item.rate * 100).toFixed(4);
            const status = getStatus(item.rate);
            
            return (
              <div key={item.symbol} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white w-8">{item.symbol}</span>
                    <span className="text-[10px] text-gray-500">{status.text}</span>
                </div>
                <div className={`font-mono font-bold ${item.rate > 0 ? 'text-orange-300' : 'text-green-400'}`}>
                    {item.rate > 0 ? '+' : ''}{percent}%
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explicație simplă */}
      <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-gray-500 leading-tight flex gap-2">
        <Info size={12} className="shrink-0 mt-0.5" />
        <p>
            <span className="text-orange-300 font-bold">+</span> Longs plătesc (Bullish).<br/>
            <span className="text-green-400 font-bold">-</span> Shorts plătesc (Bearish).
        </p>
      </div>
    </div>
  );
}