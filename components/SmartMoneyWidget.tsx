'use client';

import React from 'react';
import { Target, Info, ShieldCheck, ExternalLink } from 'lucide-react';

// AICI ESTE "BAZA DE DATE" MANUALĂ
// O actualizăm când vrem noi, nu când vrea API-ul lor.
const analysts = [
  {
    name: "Charles Edwards",
    role: "Capriole Investments",
    accuracy: "77.8%",
    sentiment: "bullish",
    avatar: "CE" 
  },
  {
    name: "Altcoin Psycho",
    role: "Pro Trader",
    accuracy: "72.8%",
    sentiment: "bullish",
    avatar: "AP"
  },
  {
    name: "hildobby",
    role: "Data @ Dragonfly",
    accuracy: "72.4%",
    sentiment: "bullish",
    avatar: "HI"
  }
];

export default function SmartMoneyWidget() {
  return (
    <div className="bg-[#0a0f1e] border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300 shadow-2xl">
      
      {/* Background Glow Effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <Target size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white leading-none font-[var(--font-space)]">Smart Money</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Consens Live</span>
                </div>
            </div>
        </div>
      </div>

      {/* ANALYST LIST */}
      <div className="space-y-3 mb-6 relative z-10">
        {analysts.map((analyst, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all group/item">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-[#020617] border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover/item:text-white group-hover/item:border-blue-500/50 transition-colors">
                        {analyst.avatar}
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm flex items-center gap-1">
                            {analyst.name}
                            <ShieldCheck size={12} className="text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity"/>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{analyst.role}</div>
                    </div>
                </div>
                
                {/* Accuracy Badge */}
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 mb-0.5">Acuratețe</div>
                    <div className="text-sm font-black text-green-400 font-mono">{analyst.accuracy}</div>
                </div>
            </div>
        ))}
      </div>

      {/* MARKET CONSENSUS BAR */}
      <div className="relative z-10 bg-black/20 p-4 rounded-xl border border-white/5">
        <div className="flex justify-between text-xs font-bold mb-3">
            <span className="text-gray-400 flex items-center gap-1.5"><Info size={12}/> Sentiment Top 10</span>
            <span className="text-green-400 animate-pulse">PUTERNIC BULLISH</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex relative">
            <div className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-300 w-[85%] shadow-[0_0_15px_rgba(74,222,128,0.6)] relative z-10"></div>
            {/* Grid lines pe bară pentru aspect tehnic */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        
        <div className="flex justify-between text-[9px] text-gray-600 mt-2 font-mono uppercase">
            <span>Calculat matematic</span>
            <span>Sursa: Unbias.fyi</span>
        </div>
      </div>

      {/* CTA BUTON */}
      <a href="https://unbias.fyi/analysts" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600/5 border border-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all group">
         Vezi Clasamentul Complet <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform"/>
      </a>

    </div>
  );
}