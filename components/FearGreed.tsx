"use client";

import { useState, useEffect } from 'react';
import { Gauge, Info, Zap } from 'lucide-react';

export default function FearGreed() {
  const [data, setData] = useState<{ value: string; value_classification: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.alternative.me/fng/')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setData(json.data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare Fear & Greed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="w-full h-32 animate-pulse bg-gray-800/30 rounded-2xl border border-white/5"></div>
  );

  if (!data) return null;

  const score = parseInt(data.value);
  
  // Culori Dinamice Neon
  let colorClass = "text-gray-400";
  let strokeColor = "#9ca3af";
  let glowColor = "rgba(156, 163, 175, 0.2)"; // Shadow color

  if (score <= 25) { // Extreme Fear
    colorClass = "text-red-500";
    strokeColor = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.5)";
  } else if (score <= 45) { // Fear
    colorClass = "text-orange-400";
    strokeColor = "#fb923c";
    glowColor = "rgba(251, 146, 60, 0.5)";
  } else if (score <= 55) { // Neutral
    colorClass = "text-yellow-400";
    strokeColor = "#facc15";
    glowColor = "rgba(250, 204, 21, 0.5)";
  } else if (score <= 75) { // Greed
    colorClass = "text-lime-400";
    strokeColor = "#a3e635";
    glowColor = "rgba(163, 230, 53, 0.5)";
  } else { // Extreme Greed
    colorClass = "text-green-500";
    strokeColor = "#22c55e";
    glowColor = "rgba(34, 197, 94, 0.5)";
  }

  // Calcul rotație ac (0 la 180 grade)
  // 0 score = -90deg (stanga), 100 score = 90deg (dreapta)
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="relative group w-full max-w-sm">
      {/* Background Container cu efect Glass */}
      <div className="relative overflow-hidden bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:border-white/20 transition-all duration-500">
        
        {/* Glow de fundal */}
        <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 rounded-full blur-[60px] opacity-20 transition-colors duration-700"
            style={{ backgroundColor: strokeColor }}
        ></div>

        <div className="flex flex-col items-center relative z-10">
            {/* Titlu */}
            <div className="flex items-center gap-2 mb-4 opacity-70">
                <Gauge size={16} className="text-white"/>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Market Sentiment</span>
            </div>

            {/* Vitezometrul SVG */}
            <div className="relative w-48 h-24 mb-2">
                {/* Arcul de fundal (Gri) */}
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                    
                    {/* Arcul Colorat (Progres) */}
                    <path 
                        d="M 20 100 A 80 80 0 0 1 180 100" 
                        fill="none" 
                        stroke={strokeColor} 
                        strokeWidth="12" 
                        strokeLinecap="round" 
                        strokeDasharray="251.2" // Circumferinta semi-cercului
                        strokeDashoffset={251.2 - (251.2 * (score / 100))} // Calcul umplere
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
                    />
                </svg>

                {/* Acul Indicator */}
                <div 
                    className="absolute bottom-0 left-1/2 w-[2px] h-[80px] bg-white origin-bottom transition-transform duration-1000 ease-out rounded-full shadow-[0_0_10px_white]"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                >
                    <div className="w-3 h-3 bg-white rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 shadow-lg"></div>
                </div>
            </div>

            {/* Scorul Numeric */}
            <div className="text-center mt-[-10px]">
                <div className={`text-5xl font-black font-mono tracking-tighter ${colorClass} drop-shadow-lg`}>
                    {score}
                </div>
                <div className={`text-sm font-bold uppercase tracking-widest ${colorClass} mt-1 flex items-center justify-center gap-2`}>
                    {data.value_classification}
                    {score > 50 ? <Zap size={14} className="animate-pulse"/> : <Info size={14}/>}
                </div>
            </div>
        </div>

        {/* Tooltip Hover (Informatii extra) */}
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl backdrop-blur-md">
            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Semnificație</p>
            <p className="text-sm text-white mb-1">
                {score < 25 ? "Oportunitate istorică de cumpărare (Capitulare)." : 
                 score > 75 ? "Piața e supraîncălzită. Posibilă corecție." : 
                 "Piață indecisă. Așteaptă confirmare."}
            </p>
            <p className="text-[10px] text-gray-500 mt-2">Update: Zilnic (ora 03:00 UTC)</p>
        </div>

      </div>
    </div>
  );
}