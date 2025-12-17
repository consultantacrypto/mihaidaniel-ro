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

  if (loading) return <div className="w-64 h-32 animate-pulse bg-gray-800/50 rounded-2xl border border-white/10"></div>;
  if (!data) return null;

  const score = parseInt(data.value);
  
  // Culori Neon
  let strokeColor = "#9ca3af";
  let textColor = "text-gray-400";
  
  if (score <= 25) { strokeColor = "#ef4444"; textColor = "text-red-500"; }
  else if (score <= 45) { strokeColor = "#fb923c"; textColor = "text-orange-400"; }
  else if (score <= 55) { strokeColor = "#facc15"; textColor = "text-yellow-400"; }
  else if (score <= 75) { strokeColor = "#a3e635"; textColor = "text-lime-400"; }
  else { strokeColor = "#22c55e"; textColor = "text-green-500"; }

  // Rotație ac: 0 = -90deg, 100 = 90deg
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="relative group w-auto inline-block">
      {/* Container Principal */}
      <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl px-8 py-4 shadow-2xl flex flex-col items-center justify-center min-w-[280px]">
        
        {/* Titlu Mic */}
        <div className="flex items-center gap-2 mb-2 opacity-60">
            <Gauge size={12} className="text-white"/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Sentiment</span>
        </div>

        {/* --- VITEZOMETRU --- */}
        <div className="relative w-40 h-20 overflow-hidden">
            {/* SVG Arc */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Background Track */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                {/* Active Track */}
                <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (score / 100))}
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
            </svg>
            
            {/* Acul Indicator (Absolut Centrat) */}
            <div 
                className="absolute bottom-0 left-1/2 w-1 h-[85%] bg-white origin-bottom transition-transform duration-1000 ease-out z-10"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            >
                <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_white]"></div>
            </div>
            
            {/* Pivot Central */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full z-20 border-4 border-[#0f172a]"></div>
        </div>

        {/* --- SCOR & ETICHETĂ --- */}
        <div className="text-center mt-2">
            <div className={`text-4xl font-black font-mono leading-none ${textColor}`}>
                {score}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest ${textColor} flex items-center justify-center gap-1 mt-1`}>
                {data.value_classification}
                {score > 50 && <Zap size={10} className="animate-pulse"/>}
            </div>
        </div>

      </div>
    </div>
  );
}