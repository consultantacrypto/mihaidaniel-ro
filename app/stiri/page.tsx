import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus, BrainCircuit } from 'lucide-react';

export const metadata = {
  title: 'Market Intelligence | Știri Crypto Explicate',
  description: 'Analize de piață, știri crypto traduse și explicate de Mihai Daniel.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        
        <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Market <span className="text-blue-500">Intelligence</span></h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Nu doar titluri. <span className="text-white font-bold">Analiză strategică.</span><br/>
                Înțelege impactul știrilor asupra portofoliului tău.
            </p>
        </div>

        <div className="grid gap-8 max-w-5xl mx-auto">
            {articles.map((item, idx) => (
                <Link href={`/stiri/${item.slug}`} key={idx} className="group bg-[#0a0f1e] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/20">
                    <div className="w-full md:w-72 h-64 md:h-auto shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                         <div className="absolute top-4 left-4 z-20">
                             {item.impact === 'bullish' && <span className="text-[10px] font-bold bg-green-500 text-black px-2 py-1 rounded flex items-center gap-1 shadow-lg"><TrendingUp size={12}/> BULLISH</span>}
                             {item.impact === 'bearish' && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-lg"><TrendingDown size={12}/> BEARISH</span>}
                             {item.impact === 'neutral' && <span className="text-[10px] font-bold bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-lg"><Minus size={12}/> NEUTRAL</span>}
                        </div>
                    </div>
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-3 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-blue-400">{item.category}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">{item.title}</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2">{item.summary}</p>
                        <div className="bg-blue-900/10 border-l-2 border-blue-500 pl-4 py-2 mb-6 rounded-r-lg">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase mb-1">
                                <BrainCircuit size={12}/> Mihai's Take
                            </div>
                            <p className="text-sm text-gray-300 italic line-clamp-1">"{item.mihaiTake}"</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-2 transition-transform mt-auto">
                            Citește Analiza <ArrowRight size={16} className="text-blue-500"/>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </main>
  );
}