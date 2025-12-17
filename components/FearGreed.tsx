"use client";

import { useState, useEffect } from 'react';
import { Gauge, Zap } from 'lucide-react';

export default function FearGreed() {
  const [data, setData] = useState<{ value: string; value_classification: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.alternative.me/fng/')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) setData(json.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="w-[320px] h-[160px] animate-pulse bg-gray-800/50 rounded-3xl border border-white/10"></div>;
  if (!data) return null;

  const score = parseInt(data.value);
  
  let strokeColor = "#9ca3af";
  let textColor = "text-gray-400";
  
  if (score <= 25) { strokeColor = "#ef4444"; textColor = "text-red-500"; }
  else if (score <= 45) { strokeColor = "#fb923c"; textColor = "text-orange-400"; }
  else if (score <= 55) { strokeColor = "#facc15"; textColor = "text-yellow-400"; }
  else if (score <= 75) { strokeColor = "#a3e635"; textColor = "text-lime-400"; }
  else { strokeColor = "#22c55e"; textColor = "text-green-500"; }

  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="relative group">
      {/* Container Principal - Design Glassmorphism Solid */}
      <div className="relative w-[320px] bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        
        {/* Header Mic */}
        <div className="flex items-center gap-2 mb-4 w-full justify-center opacity-70 border-b border-white/5 pb-2">
            <Gauge size={14} className="text-blue-400"/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Market Sentiment</span>
        </div>

        {/* --- VITEZOMETRU --- */}
        <div className="relative w-48 h-24 overflow-hidden mb-2">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (score / 100))}
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                />
            </svg>
            
            <div 
                className="absolute bottom-0 left-1/2 w-1.5 h-[88%] bg-white origin-bottom transition-transform duration-1000 ease-out z-10 rounded-full"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            >
                <div className="w-3 h-3 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-lg"></div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full z-20 border-4 border-[#0f172a]"></div>
        </div>

        {/* --- SCOR --- */}
        <div className="text-center">
            <div className={`text-5xl font-black font-mono leading-none ${textColor} tracking-tighter drop-shadow-lg`}>
                {score}
            </div>
            <div className={`text-xs font-bold uppercase tracking-widest ${textColor} flex items-center justify-center gap-2 mt-2 bg-black/20 py-1 px-3 rounded-full`}>
                {data.value_classification}
                {score > 50 && <Zap size={12} className="animate-pulse text-yellow-400"/>}
            </div>
        </div>

      </div>
    </div>
  );
}