import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus, BrainCircuit, ChevronLeft, ChevronRight, Snowflake } from 'lucide-react';

export const metadata = {
  title: 'Market Intelligence | Știri Crypto Explicate',
  description: 'Analize de piață, știri crypto traduse și explicate de Mihai Daniel.',
  keywords: ['stiri crypto', 'analiza bitcoin', 'fomc', 'educatie financiara', 'mihai daniel', 'crypto romania', 'curs crypto'],
};

// Configurare: Câte articole vrei pe pagină?
const ITEMS_PER_PAGE = 6;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  // Calculăm paginarea
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-red-500/30 relative overflow-hidden">
      
      {/* 🎄 BACKGROUND FESTIV PREMIUM (Stratul 0 - Atmosfera) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. Glow Roșu-Auriu în partea de sus (Efect de Șemineu/Sărbătoare) */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-red-900/20 via-amber-900/10 to-transparent blur-[120px] opacity-60"></div>
        
        {/* 2. Ninsoare Digitală (Praf de stele - CSS pur, invizibilă pentru performanță) */}
        <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}></div>
      </div>

      {/* CONȚINUTUL PAGINII (Stratul 1 - Interactiv) */}
      <div className="relative z-10">
        <Navbar />
        
        <div className="container mx-auto px-6 py-24">
            
            {/* HEADER FESTIV */}
            <div className="text-center mb-20 relative">
                {/* Badge de Sezon - Pulsează discret */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/30 text-red-200 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in shadow-[0_0_15px_rgba(220,38,38,0.15)] backdrop-blur-md">
                    <Snowflake size={12} className="text-red-400 animate-pulse" /> Winter Edition 2025
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                    Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">Intelligence</span>
                </h1>
                
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Nu doar titluri. <span className="text-white font-bold">Analiză strategică.</span><br/>
                    Închidem anul 2025 în forță. Pregătește-ți portofoliul pentru 2026.
                </p>
            </div>

            <div className="grid gap-8 max-w-5xl mx-auto">
                {currentArticles.map((item, idx) => (
                    <Link href={`/stiri/${item.slug}`} key={idx} className="group bg-[#0a0f1e]/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-red-500/40 transition-all hover:shadow-2xl hover:shadow-red-900/10">
                        <div className="w-full md:w-72 h-64 md:h-auto shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                            
                            {/* Imagine Optimizată */}
                            <Image 
                                src={item.image} 
                                alt={item.title}
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                priority={idx < 2} 
                            />

                            <div className="absolute top-4 left-4 z-20">
                                {item.impact === 'bullish' && <span className="text-[10px] font-bold bg-green-500 text-black px-2 py-1 rounded flex items-center gap-1 shadow-lg"><TrendingUp size={12}/> BULLISH</span>}
                                {item.impact === 'bearish' && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-lg"><TrendingDown size={12}/> BEARISH</span>}
                                {item.impact === 'neutral' && <span className="text-[10px] font-bold bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-lg"><Minus size={12}/> NEUTRAL</span>}
                            </div>
                        </div>
                        
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-3 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="text-blue-400 group-hover:text-red-400 transition-colors">{item.category}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">{item.title}</h2>
                            <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2">{item.summary}</p>
                            
                            {item.mihaiTake && (
                                <div className="bg-gradient-to-r from-blue-900/10 to-transparent border-l-2 border-blue-500 pl-4 py-2 mb-6 rounded-r-lg group-hover:border-red-500/50 transition-colors">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 group-hover:text-red-400 uppercase mb-1 transition-colors">
                                        <BrainCircuit size={12}/> Mihai's Take
                                    </div>
                                    <p className="text-sm text-gray-300 italic line-clamp-1">"{item.mihaiTake}"</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-2 transition-transform mt-auto">
                                Citește Analiza <ArrowRight size={16} className="text-blue-500 group-hover:text-red-500 transition-colors"/>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* PAGINARE */}
            <div className="flex justify-center items-center gap-4 mt-16 max-w-5xl mx-auto pt-8 border-t border-white/5 relative z-20">
                {currentPage > 1 ? (
                    <Link href={`/stiri?page=${currentPage - 1}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a0f1e] border border-white/10 hover:border-red-500 text-white transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Pagina Anterioară
                    </Link>
                ) : (
                    <button disabled className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed">
                        <ChevronLeft size={20}/> Pagina Anterioară
                    </button>
                )}
                
                <span className="font-mono text-gray-500 text-sm">
                    Pagina <span className="text-white font-bold">{currentPage}</span> din {totalPages}
                </span>

                {currentPage < totalPages ? (
                    <Link href={`/stiri?page=${currentPage + 1}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a0f1e] border border-white/10 hover:border-red-500 text-white transition-all group">
                        Pagina Următoare <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                ) : (
                    <button disabled className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed">
                        Pagina Următoare <ChevronRight size={20}/>
                    </button>
                )}
            </div>

        </div>
      </div>
    </main>
  );
}