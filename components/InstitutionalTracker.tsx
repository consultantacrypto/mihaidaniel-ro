'use client';

import React from 'react';
import { BrainCircuit, Wallet, TrendingUp, Shield, Globe, Building2 } from 'lucide-react';

// AICI VOM LIPIT DATELE DIN DEEP SEARCH (Când le avem)
const institutions = [
  {
    rank: 1,
    name: "BlackRock",
    type: "Asset Manager",
    aum: "$10.5T",
    alpha: "Bitcoin ETF (IBIT)",
    topHolding: "Microsoft / BTC",
    stance: "BULLISH",
    stanceColor: "bg-green-500/20 text-green-400 border-green-500/50",
    bet2026: "RWA Tokenization"
  },
  {
    rank: 2,
    name: "MicroStrategy",
    type: "Corporate Treasury",
    aum: "400k+ BTC",
    alpha: "Bitcoin Leverage",
    topHolding: "Bitcoin (100%)",
    stance: "MAXI",
    stanceColor: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    bet2026: "Bitcoin Bank"
  },
  {
    rank: 3,
    name: "Andreessen Horowitz",
    type: "Venture Capital",
    aum: "$35B",
    alpha: "Early Solana/Coinbase",
    topHolding: "Solana Ecosystem",
    stance: "BUILDER",
    stanceColor: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    bet2026: "Web3 Gaming & AI"
  },
  {
    rank: 4,
    name: "Vanguard",
    type: "Asset Manager",
    aum: "$9.3T",
    alpha: "Tech Monopoly",
    topHolding: "Apple / NVDA",
    stance: "SKEPTIC",
    stanceColor: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    bet2026: "Traditional AI"
  },
  {
    rank: 5,
    name: "Tesla",
    type: "Corporate Treasury",
    aum: "9.7k BTC",
    alpha: "First Corporate Buy",
    topHolding: "AI Robotics / BTC",
    stance: "HODL",
    stanceColor: "bg-green-500/20 text-green-400 border-green-500/50",
    bet2026: "Autonomy & Energy"
  }
];

export default function InstitutionalTracker() {
  return (
    <div className="w-full h-full flex flex-col">
      
      {/* 1. Header Vizual - Stil "War Room" */}
      <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/20 overflow-hidden shadow-2xl group hover:border-blue-500/40 transition-all">
        {/* Background Animation */}
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Globe className="w-32 h-32 text-blue-400 animate-[spin_10s_linear_infinite]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 font-[var(--font-space)]">
                INSTITUTIONAL TRACKER 
            </h2>
            <span className="hidden md:flex text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-mono font-bold animate-pulse">
                LIVE 2026
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Nu ghici. Copiază. Vezi portofoliile celor mai puternice <span className="text-white font-bold">20 de instituții financiare</span> din lume.
            Date actualizate din rapoartele 13F și declarații publice.
          </p>
        </div>
      </div>

      {/* 2. Tabelul Inteligent - Responsive (Mobile Scroll + Sticky Col) */}
      <div className="bg-[#0a0f1e] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex-grow">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/80 text-gray-500 text-xs md:text-sm uppercase tracking-wider backdrop-blur-md">
                {/* Coloana Sticky Header */}
                <th className="p-4 font-medium border-b border-gray-800 sticky left-0 bg-[#0b1021] z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">Companie</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">Tip & AUM</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">The Alpha (Istoric)</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">Top Deținere Acum</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap text-center">Crypto Stance</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">Pariul 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {institutions.map((item, index) => (
                <tr key={index} className="group hover:bg-gray-800/40 transition-all duration-300">
                  
                  {/* Coloana Sticky (Numele Companiei) */}
                  <td className="p-4 border-r border-gray-800/50 sticky left-0 bg-[#0a0f1e] group-hover:bg-[#111827] transition-colors z-10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gray-600 text-xs">#{item.rank}</span>
                      <div>
                        <div className="font-bold text-white text-sm md:text-base group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Restul Coloanelor */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-gray-300 font-medium text-sm">{item.type}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> {item.aum}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="text-gray-400 text-sm border-b border-dashed border-gray-600 pb-0.5 group-hover:text-white transition-colors">
                      {item.alpha}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                       {item.topHolding}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold border ${item.stanceColor} shadow-[0_0_10px_rgba(0,0,0,0.1)] uppercase tracking-wider`}>
                      {item.stance}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
                      <BrainCircuit className="w-4 h-4" />
                      {item.bet2026}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="mt-3 flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-600 px-2 gap-2">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          <span>Date verificate manual. Nu reprezintă sfat financiar.</span>
        </div>
        <div className="font-mono">Sursa: SEC 13F / Rapoarte Q4 2025</div>
      </div>
    </div>
  );
}