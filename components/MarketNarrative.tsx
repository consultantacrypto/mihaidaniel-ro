import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function MarketNarrative() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-y border-white/5 py-3 px-4 mb-6 backdrop-blur-sm">
      <div className="max-w-[2400px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
        
        {/* Eticheta */}
        <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-bold text-blue-300 whitespace-nowrap">
            <Lightbulb size={12} className="text-yellow-400" />
            NARAȚIUNEA SĂPTĂMÂNII
        </div>

        {/* Textul */}
        <p className="text-sm text-gray-300 leading-snug">
            <span className="text-white font-bold">Focus: Real World Assets (RWA) & AI.</span>{' '}
            BlackRock pompează lichiditate în tokenizarea activelor. Urmărește monedele care leagă Blockchain de infrastructura fizică.
        </p>

        {/* Link discret */}
        <div className="hidden md:block ml-auto">
             <span className="text-[10px] text-gray-500 flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                Vezi analiza completă <ArrowRight size={10} />
             </span>
        </div>

      </div>
    </div>
  );
}