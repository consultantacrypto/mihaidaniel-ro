'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, TrendingUp, TrendingDown, DollarSign, 
  Zap, AlertTriangle, Eye, BarChart3, Lock, RefreshCw 
} from 'lucide-react';

export default function MarketPage() {
  // SIMULĂM DATELE (În V2 le tragem din API)
  const marketData = {
    macroScore: 65, // 0-100 (Lichiditate)
    btcPrice: 94250,
    sentiment: 72, // Greed
    liquidations24h: '145M',
    whalesAction: 'ACCUMULATING' // Selling / Accumulating
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-blue-500/30">
      <Navbar />

      {/* HEADER SECTION */}
      <div className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
                        <Activity size={14} /> Live Market Data
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-[var(--font-space)] mb-2">
                        Market Intelligence
                    </h1>
                    <p className="text-gray-400 max-w-xl">
                        Nu te baza pe zvonuri. Bazează-te pe date. Aici vezi "motorul" pieței: 
                        Lichiditate, Balene și Lichidări.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Actualizare:</div>
                    <div className="flex items-center gap-2 text-green-400 font-mono">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live Connection
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* === DASHBOARD GRID === */}
      <div className="container mx-auto px-6 py-12 space-y-8">
        
        {/* MODULE 1: MACRO COMPASS (THE MIHAI INDEX) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0a0f1e] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <DollarSign size={14} className="text-blue-500"/> Macro Liquidity
                        </h3>
                        <h2 className="text-3xl font-bold text-white">The Mihai Index</h2>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-bold text-sm">
                        RISK ON 🟢
                    </div>
                </div>

                <div className="relative h-4 bg-gray-800 rounded-full mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-400 to-green-500 opacity-50 rounded-full"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-gray-900 rounded shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-1000" style={{ left: `${marketData.macroScore}%` }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 uppercase">FED Balance</div>
                        <div className="text-lg font-bold">7.2T <span className="text-xs text-red-400">(-0.1%)</span></div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 uppercase">Net Liquidity</div>
                        <div className="text-lg font-bold text-green-400">6.1T <span className="text-xs text-green-400">(+0.5%)</span></div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 uppercase">Trend</div>
                        <div className="text-lg font-bold text-yellow-400">Neutral</div>
                    </div>
                </div>
            </div>

            {/* MODULE 2: ON-CHAIN WHALES */}
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-purple-500/30 transition-all">
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Eye size={14} className="text-purple-500"/> Whale Watch
                    </h3>
                    <div className="text-4xl font-black text-white mb-2">Accumulation</div>
                    <p className="text-sm text-gray-400 mb-6">Balenele retrag BTC de pe exchange-uri în portofele reci (Cold Storage).</p>
                </div>
                
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Binance Inflow (1h)</span>
                        <span className="text-red-400 font-mono font-bold">+240 BTC</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Coinbase Outflow (24h)</span>
                        <span className="text-green-400 font-mono font-bold">-1,200 BTC</span>
                    </div>
                </div>
            </div>
        </div>

        {/* MODULE 3: SENTIMENT & LIQUIDATIONS HEATMAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sentiment */}
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                 <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Fear & Greed</h3>
                 <div className="w-32 h-32 rounded-full border-8 border-green-500/20 flex items-center justify-center relative mb-4">
                    <div className="absolute inset-0 rounded-full border-t-8 border-green-500 rotate-45"></div>
                    <span className="text-3xl font-black text-green-500">{marketData.sentiment}</span>
                 </div>
                 <div className="text-white font-bold">Greed (Lăcomie)</div>
                 <div className="text-xs text-gray-500">Retailul începe să intre.</div>
            </div>

            {/* Total Liquidations */}
            <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                 <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Lichidări (24h)</h3>
                 <div className="text-4xl font-black text-red-500 mb-2">${marketData.liquidations24h}</div>
                 <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-green-500 h-full w-[30%]"></div> {/* Shorts */}
                    <div className="bg-red-500 h-full w-[70%]"></div>   {/* Longs */}
                 </div>
                 <div className="flex justify-between text-[10px] mt-2 font-bold uppercase">
                    <span className="text-green-500">Shorts Rekt</span>
                    <span className="text-red-500">Longs Rekt</span>
                 </div>
            </div>

            {/* HEATMAP VISUAL (PLACEHOLDER V1) */}
            <div className="lg:col-span-2 bg-[#0a0f1e] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center group">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                 {/* Bule animate (CSS only for now) */}
                 <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                 <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-bounce"></div>
                 
                 <Zap size={48} className="text-yellow-400 mb-4 relative z-10" />
                 <h3 className="text-2xl font-bold text-white relative z-10 mb-2">Liquidation Heatmap</h3>
                 <p className="text-sm text-gray-400 relative z-10 mb-6 max-w-xs">
                    Vezi unde sunt ordinele de Stop Loss ale traderilor și unde va ataca prețul.
                 </p>
                 <button className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                    <Lock size={12}/> Disponibil în curând
                 </button>
            </div>
        </div>

        {/* CTA FINAL */}
        <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-8 text-center mt-12">
            <h3 className="text-xl font-bold text-white mb-2">Datele sunt Putere</h3>
            <p className="text-gray-400 mb-6 text-sm">
                Acesta este doar începutul. În versiunea următoare, aceste date vor fi conectate live la API-uri instituționale.
            </p>
            <button className="text-blue-400 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                <RefreshCw size={14} className="animate-spin-slow"/> Refresh Data
            </button>
        </div>

      </div>

      <Footer />
    </main>
  );
}