"use client";

import { useState, useEffect } from 'react';
import { Gauge, Info } from 'lucide-react';

export default function FearGreed() {
  const [data, setData] = useState<{ value: string; value_classification: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Luăm datele oficiale de la Alternative.me (Standardul în industrie)
    fetch('https://api.alternative.me/fng/')
      .then((res) => res.json())
      .then((json) => {
        setData(json.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare Fear & Greed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="animate-pulse bg-gray-800/50 h-10 w-48 rounded-full"></div>
  );

  if (!data) return null;

  const score = parseInt(data.value);
  
  // Logica de Culori
  let color = "text-gray-400";
  let bg = "bg-gray-500/10 border-gray-500/20";
  let emoji = "😐";

  if (score <= 25) { // Extreme Fear
    color = "text-red-500";
    bg = "bg-red-900/20 border-red-500/30";
    emoji = "😱";
  } else if (score <= 45) { // Fear
    color = "text-orange-400";
    bg = "bg-orange-900/20 border-orange-500/30";
    emoji = "😨";
  } else if (score <= 55) { // Neutral
    color = "text-yellow-400";
    bg = "bg-yellow-900/20 border-yellow-500/30";
    emoji = "😐";
  } else if (score <= 75) { // Greed
    color = "text-lime-400";
    bg = "bg-lime-900/20 border-lime-500/30";
    emoji = "🤑";
  } else { // Extreme Greed
    color = "text-green-500";
    bg = "bg-green-900/20 border-green-500/30";
    emoji = "🚀";
  }

  return (
    <div className={`group relative flex items-center gap-3 px-4 py-2 rounded-full border ${bg} transition-all hover:scale-105 cursor-help`}>
      
      {/* Iconiță și Titlu */}
      <div className="flex items-center gap-2">
        <Gauge size={16} className={color} />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Sentiment:</span>
      </div>

      {/* Valoarea */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-black ${color}`}>
          {score}
        </span>
        <span className={`text-xs font-medium ${color} hidden sm:block`}>
          {data.value_classification} {emoji}
        </span>
      </div>

      {/* Tooltip la Hover (Explicație) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-black border border-gray-700 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
        <p className="text-[10px] text-gray-400 mb-1 uppercase font-bold">Cum citim asta?</p>
        <p className="text-xs text-gray-200">
            <span className="text-red-400 font-bold">Frică (0-40):</span> Oportunitate de Cumpărare.<br/>
            <span className="text-green-400 font-bold">Lăcomie (60-100):</span> Precauție / Marcare Profit.
        </p>
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-gray-700 transform rotate-45"></div>
      </div>

    </div>
  );
}