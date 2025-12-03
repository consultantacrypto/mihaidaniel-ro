import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const metadata = {
  title: 'Știri Crypto & Analize | Mihai Daniel',
  description: 'Cele mai importante știri din piața crypto, explicate și analizate de Mihai Daniel.',
};

export default function NewsArchive() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        
        {/* Header */}
        <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Market <span className="text-blue-500">Intelligence</span></h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Arhiva completă de analize. Înțelege piața înainte să faci o mișcare.
            </p>
        </div>

        {/* Grid cu TOATE articolele */}
        <div className="grid gap-8">
            {articles.map((item, idx) => (
                <Link href={`/stiri/${item.slug}`} key={idx} className="group bg-[#0a0f1e] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:border-blue-500/30 transition-all hover:bg-[#0f1629]">
                    
                    {/* Imagine (Thumbnail) */}
                    <div className="w-full md:w-64 h-48 shrink-0 rounded-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                         <div className="absolute top-3 left-3 z-20">
                             {item.impact === 'bullish' && <span className="text-[10px] font-bold bg-green-500 text-black px-2 py-1 rounded flex items-center gap-1"><TrendingUp size={12}/> BULLISH</span>}
                             {item.impact === 'bearish' && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"><TrendingDown size={12}/> BEARISH</span>}
                             {item.impact === 'neutral' && <span className="text-[10px] font-bold bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1"><Minus size={12}/> NEUTRAL</span>}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-3 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-blue-400">{item.category}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2">{item.summary}</p>
                        
                        <div className="flex items-center gap-2 text-sm font-bold text-blue-500 group-hover:translate-x-2 transition-transform">
                            Citește Analiza Completă <ArrowRight size={16}/>
                        </div>
                    </div>

                </Link>
            ))}
        </div>

      </div>
    </main>
  );
}