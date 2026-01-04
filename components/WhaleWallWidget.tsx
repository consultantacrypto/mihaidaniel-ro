'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ShieldAlert, Activity } from 'lucide-react';

interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][]; // [Preț, Cantitate] Cumpărători
  asks: [string, string][]; // [Preț, Cantitate] Vânzători
}

export default function WhaleWallWidget() {
  const [data, setData] = useState<{ bidVol: number; askVol: number; ratio: number } | null>(null);
  const [price, setPrice] = useState<string>("0");

  useEffect(() => {
    // 1. Funcția care trage datele LIVE de la Binance (Fără intermediari)
    const fetchOrderBook = async () => {
      try {
        // Luăm primele 1000 de ordine (Adâncime mare)
        const res = await fetch('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=500');
        const tickerRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        
        const depth: OrderBookData = await res.json();
        const ticker = await tickerRes.json();

        setPrice(parseFloat(ticker.price).toLocaleString());

        // 2. Calculăm "Grosimea Zidurilor" (Volumul total BTC în așteptare)
        // Adunăm toți banii puși la bătaie de Cumpărători (Bids) vs Vânzători (Asks)
        const totalBids = depth.bids.reduce((acc, curr) => acc + parseFloat(curr[1]), 0);
        const totalAsks = depth.asks.reduce((acc, curr) => acc + parseFloat(curr[1]), 0);

        // Ratio: > 50% înseamnă presiune de cumpărare
        const ratio = (totalBids / (totalBids + totalAsks)) * 100;

        setData({ bidVol: totalBids, askVol: totalAsks, ratio });
      } catch (error) {
        console.error("Eroare Binance API:", error);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 10000); // Actualizare la 10 secunde
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-gray-800 animate-pulse h-[200px] flex items-center justify-center text-gray-500 text-xs">
        Se scanează Orderbook Binance...
    </div>
  );

  const isBullish = data.ratio > 50;

  return (
    <div className="bg-[#0a0f1e] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" /> WHALE WALLS
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">Analiza Orderbook (Binance Depth)</p>
        </div>
        <div className="text-right">
            <div className="text-xs font-mono text-gray-400">BTC Preț</div>
            <div className="text-sm font-bold text-white">${price}</div>
        </div>
      </div>

      {/* Visual Bar - Bătălia dintre Urși și Tauri */}
      <div className="relative h-6 w-full bg-gray-900 rounded-full overflow-hidden flex mb-2">
        {/* BUY WALL (Verde) */}
        <div 
            className="h-full bg-gradient-to-r from-green-900 to-green-500 transition-all duration-1000 flex items-center justify-start px-2"
            style={{ width: `${data.ratio}%` }}
        >
            <span className="text-[9px] font-bold text-white drop-shadow-md whitespace-nowrap">
                BUY {data.bidVol.toFixed(0)} BTC
            </span>
        </div>
        
        {/* SELL WALL (Roșu) */}
        <div 
            className="h-full bg-gradient-to-l from-red-900 to-red-500 transition-all duration-1000 flex items-center justify-end px-2"
            style={{ width: `${100 - data.ratio}%` }}
        >
             <span className="text-[9px] font-bold text-white drop-shadow-md whitespace-nowrap">
                SELL {data.askVol.toFixed(0)} BTC
            </span>
        </div>
      </div>

      {/* Concluzia AI */}
      <div className="flex justify-between items-center mt-3 bg-white/5 p-3 rounded-lg border border-white/5">
        <div className="text-xs text-gray-400">Presiune Piață:</div>
        <div className={`flex items-center gap-2 text-sm font-bold ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
            {isBullish ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {isBullish ? "ZIDURI DE CUMPĂRARE" : "ZIDURI DE VÂNZARE"}
        </div>
      </div>

      {/* Disclaimer Micro */}
      <div className="mt-3 text-[9px] text-gray-600 text-center">
        *Analizează ordinele limită pe o adâncime de 500 de poziții.
      </div>

      {/* Background Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-10 ${isBullish ? 'bg-green-500' : 'bg-red-500'} pointer-events-none`}></div>
    </div>
  );
}