"use client";

import { useState, useEffect } from 'react';
import { Activity, Zap } from 'lucide-react';

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

  if (loading) return <div className="h-12 w-48 animate-pulse bg-gray-800/50 rounded-lg border border-white/5"></div>;
  if (!data) return null;

  const score = parseInt(data.value);
  
  // Culori Neon pentru Text și Glow
  let colorClass = "text-gray-400";
  let barGradient = "from-gray-500 to-gray-700";
  let glowShadow = "shadow-[0_0_15px_rgba(107,114,128,0.3)]";

  if (score <= 25) { 
      colorClass = "text-red-500"; 
      barGradient = "from-red-600 via-red-500 to-red-900"; 
      glowShadow = "shadow-[0_0_20px_rgba(239,68,68,0.4)]";
  } else if (score <= 45) { 
      colorClass = "text-orange-400"; 
      barGradient = "from-orange-600 via-orange-500 to-orange-900"; 
      glowShadow = "shadow-[0_0_20px_rgba(251,146,60,0.4)]";
  } else if (score <= 55) { 
      colorClass = "text-yellow-400"; 
      barGradient = "from-yellow-500 via-yellow-400 to-yellow-700"; 
      glowShadow = "shadow-[0_0_20px_rgba(250,204,21,0.4)]";
  } else if (score <= 75) { 
      colorClass = "text-lime-400"; 
      barGradient = "from-lime-500 via-lime-400 to-lime-700"; 
      glowShadow = "shadow-[0_0_20px_rgba(163,230,53,0.4)]";
  } else { 
      colorClass = "text-green-500"; 
      barGradient = "from-green-600 via-green-500 to-green-900"; 
      glowShadow = "shadow-[0_0_20px_rgba(34,197,94,0.4)]";
  }

  // Calcul poziție marker (0% - 100%)
  const position = score + "%";

  return (
    <div className="flex flex-col gap-2 w-full max-w-[300px]">
      
      {/* Header Mic: Titlu + Scor */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2 text-gray-500">
            <Activity size={12} className={colorClass} />
            <span>Market Sentiment</span>
        </div>
        <div className={`flex items-center gap-1 ${colorClass}`}>
            <span className="text-lg font-black">{score}</span>
            <span className="opacity-80 text-[10px]">{data.value_classification}</span>
        </div>
      </div>

      {/* --- BARĂ HOLOGRAFICĂ --- */}
      <div className="relative h-2 w-full bg-[#0f172a] rounded-full overflow-hidden border border-white/5">
        
        {/* Background Gradient (Static) */}
        <div className="absolute inset-0 w-full h-full opacity-20 bg-gradient-to-r from-red-900 via-yellow-900 to-green-900"></div>
        
        {/* Cursorul Activ (Linia care arată scorul) */}
        <div 
            className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-out bg-gradient-to-r ${barGradient} ${glowShadow}`}
            style={{ width: position }}
        >
            {/* Scânteie la capătul barei */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white blur-[1px]"></div>
        </div>

      </div>

      {/* Mesaj Scurt */}
      <div className="text-[10px] text-gray-600 text-right">
        {score < 25 ? "Oportunitate (Frică Extremă)" : score > 75 ? "Precauție (Lăcomie)" : "Piață Neutră"}
      </div>

    </div>
  );
}