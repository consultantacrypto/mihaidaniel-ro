'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ShieldAlert, Target, Crosshair } from 'lucide-react';

interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][]; // [Preț, Cantitate]
  asks: [string, string][]; // [Preț, Cantitate]
}

export default function WhaleWallWidget() {
  const [data, setData] = useState<{ 
    bidVol: number; 
    askVol: number; 
    ratio: number;
    topBids: { price: string, vol: string }[];
    topAsks: { price: string, vol: string }[];
  } | null>(null);
  const [price, setPrice] = useState<string>("0");

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        // Luăm adâncime mare (500) ca să găsim zidurile reale
        const res = await fetch('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=100');
        const tickerRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        
        const depth: OrderBookData = await res.json();
        const ticker = await tickerRes.json();

        setPrice(parseFloat(ticker.price).toLocaleString('en-US', { maximumFractionDigits: 0 }));

        // 1. Calcul Presiune Totală
        const totalBids = depth.bids.reduce((acc, curr) => acc + parseFloat(curr[1]), 0);
        const totalAsks = depth.asks.reduce((acc, curr) => acc + parseFloat(curr[1]), 0);
        const ratio = (totalBids / (totalBids + totalAsks)) * 100;

        // 2. Găsim "Zidurile" (Cele mai mari ordine individuale)
        // Sortăm descrescător după volum și luăm top 3
        const sortedBids = [...depth.bids]
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
            .slice(0, 3)
            .map(item => ({ price: parseFloat(item[0]).toLocaleString('en-US', { maximumFractionDigits: 0 }), vol: parseFloat(item[1]).toFixed(1) }));

        const sortedAsks = [...depth.asks]
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
            .slice(0, 3)
            .map(item => ({ price: parseFloat(item[0]).toLocaleString('en-US', { maximumFractionDigits: 0 }), vol: parseFloat(item[1]).toFixed(1) }));

        setData({ bidVol: totalBids, askVol: totalAsks, ratio, topBids: sortedBids, topAsks: sortedAsks });
      } catch (error) {
        console.error("Eroare Binance API:", error);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // Actualizare rapidă (5 sec)
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-gray-800 animate-pulse h-[280px] flex items-center justify-center text-gray-500 text-xs">
        Se conectează la Binance Whale Feed...
    </div>
  );

  const isBullish = data.ratio > 50;

  return (
    <div className="bg-[#0a0f1e] border border-gray-800 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2 tracking-wider font-[var(--font-space)]">
                <Target className="w-4 h-4 text-blue-400 animate-pulse" /> WHALE RADAR
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">BTC/USDT</span>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span> LIVE
                </span>
            </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Preț Actual</div>
            <div className="text-lg font-black text-white font-[var(--font-space)]">${price}</div>
        </div>
      </div>

      {/* 1. VISUAL PRESSURE BAR */}
      <div className="mb-6">
        <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
            <span>🐂 Tauri ({data.bidVol.toFixed(0)} BTC)</span>
            <span>🐻 Urși ({data.askVol.toFixed(0)} BTC)</span>
        </div>
        <div className="relative h-4 w-full bg-gray-900 rounded-sm overflow-hidden flex">
            <div 
                className="h-full bg-green-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                style={{ width: `${data.ratio}%` }}
            ></div>
            <div 
                className="h-full bg-red-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                style={{ width: `${100 - data.ratio}%` }}
            ></div>
            
            {/* Middle Marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black/50 z-10"></div>
        </div>
      </div>

      {/* 2. ORDER BOOK DEPTH (ZIDURILE) */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        
        {/* SELL WALLS (RED) */}
        <div className="space-y-2">
            <div className="text-[9px] font-bold text-red-400 uppercase border-b border-red-500/20 pb-1 flex items-center gap-1">
                <ArrowDown size={10} /> Rezistență (Ask)
            </div>
            {data.topAsks.map((ask, i) => (
                <div key={i} className="flex justify-between items-center text-xs group/item hover:bg-red-500/10 rounded px-1 transition-colors cursor-default">
                    <span className="text-red-300 font-mono font-bold">${ask.price}</span>
                    <span className="text-gray-400 text-[10px]">{ask.vol} ₿</span>
                </div>
            ))}
        </div>

        {/* BUY WALLS (GREEN) */}
        <div className="space-y-2">
            <div className="text-[9px] font-bold text-green-400 uppercase border-b border-green-500/20 pb-1 flex items-center gap-1">
                <ArrowUp size={10} /> Suport (Bid)
            </div>
            {data.topBids.map((bid, i) => (
                <div key={i} className="flex justify-between items-center text-xs group/item hover:bg-green-500/10 rounded px-1 transition-colors cursor-default">
                    <span className="text-green-300 font-mono font-bold">${bid.price}</span>
                    <span className="text-gray-400 text-[10px]">{bid.vol} ₿</span>
                </div>
            ))}
        </div>

      </div>

      {/* Radar Effect Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-${isBullish ? 'green' : 'red'}-500/5 rounded-full blur-3xl animate-pulse`}></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full opacity-20"></div>
      </div>

    </div>
  );
}