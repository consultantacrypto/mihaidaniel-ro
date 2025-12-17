import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryFilter from '@/components/CategoryFilter';
import FearGreed from '@/components/FearGreed'; 
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus, BrainCircuit, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export const metadata = {
  title: 'Market Intelligence | Știri Crypto Explicate',
  description: 'Analize de piață, știri crypto traduse și explicate de Mihai Daniel.',
};

const ITEMS_PER_PAGE = 6;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const categoryFilter = (params?.category as string) || 'all';

  // --- FILTRARE ---
  const filteredArticles = articles.filter((article) => {
    const text = (article.title + article.summary + article.category).toLowerCase();
    switch (categoryFilter) {
      case 'btc': return text.includes('bitcoin') || text.includes('btc') || text.includes('satoshi') || text.includes('halving');
      case 'eth': return text.includes('ethereum') || text.includes('eth') || text.includes('vitalik') || text.includes('blackrock');
      case 'macro': return text.includes('fomc') || text.includes('fed') || text.includes('inflatie') || text.includes('banca') || text.includes('cpi') || text.includes('trezorerie') || article.category.includes('MACRO') || article.category.includes('INSTITUȚIONAL');
      case 'alts': return text.includes('solana') || text.includes('altcoin') || text.includes('altseason') || text.includes('token') || article.category.includes('ADOPȚIE');
      case 'edu': return article.category.includes('EDUCAȚIE') || article.category.includes('PSIHOLOGIE') || article.category.includes('SECURITATE');
      default: return true;
    }
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 flex-grow">
          
          {/* --- HEADER DASHBOARD (GRID) --- */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 border-b border-white/5 pb-12">
              
              {/* Stânga: Titlu și Intro */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/20">
                    <Activity size={14} className="animate-pulse"/> Market Intelligence
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none text-white">
                    Știri & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Analize</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
                    Nu citim doar știri, citim printre rânduri. <br/>
                    <span className="text-white font-bold">Interpretare strategică</span> pentru investitorii care vor să fie cu un pas înaintea masei.
                </p>
              </div>

              {/* Dreapta: WIDGETUL WAW (Centrat pe mobil, Dreapta pe desktop) */}
              <div className="flex justify-center lg:justify-end">
                <FearGreed />
              </div>

          </div>

          {/* FILTRE */}
          <CategoryFilter />

          {/* LISTA ARTICOLE */}
          {currentArticles.length > 0 ? (
            <div className="grid gap-8 max-w-6xl mx-auto">
                {currentArticles.map((item, idx) => (
                    <Link href={`/stiri/${item.slug}`} key={item.slug} className="group bg-[#0a0f1e] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        {/* Imagine */}
                        <div className="w-full md:w-80 h-64 md:h-auto shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent opacity-60 z-10"></div>
                            <Image 
                                src={item.image} 
                                alt={item.title}
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                sizes="(max-width: 768px) 100vw, 320px" 
                                priority={idx < 2} 
                            />
                            {/* Badge Impact */}
                            <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-black/50 rounded-lg p-1">
                                {item.impact === 'bullish' && <span className="text-[10px] font-bold bg-green-500 text-black px-2 py-1 rounded flex items-center gap-1 shadow-lg"><TrendingUp size={12}/> BULLISH</span>}
                                {item.impact === 'bearish' && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-lg"><TrendingDown size={12}/> BEARISH</span>}
                                {item.impact === 'neutral' && <span className="text-[10px] font-bold bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-lg"><Minus size={12}/> NEUTRAL</span>}
                            </div>
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-mono mb-4 uppercase tracking-widest">
                                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> {item.date}</span>
                                <span className="text-blue-500 font-bold border border-blue-500/20 px-2 py-0.5 rounded">{item.category}</span>
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight font-[var(--font-space)]">
                                {item.title}
                            </h2>
                            
                            <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2 text-base md:text-lg">
                                {item.summary}
                            </p>
                            
                            {item.mihaiTake && (
                                <div className="bg-blue-900/10 border-l-2 border-blue-500 pl-4 py-3 mb-6 rounded-r-xl relative overflow-hidden">
                                    <div className="absolute right-0 top-0 opacity-5"><BrainCircuit size={40}/></div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase mb-1">
                                        <BrainCircuit size={12}/> Mihai's Take
                                    </div>
                                    <p className="text-sm text-gray-300 italic line-clamp-2 relative z-10">"{item.mihaiTake}"</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-2 transition-transform mt-auto">
                                Citește Analiza Completă <ArrowRight size={16} className="text-blue-500 group-hover:text-white transition-colors"/>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-gray-400 text-xl">Nu am găsit articole în această categorie momentan.</p>
                <Link href="/stiri" className="text-blue-400 hover:text-blue-300 mt-4 inline-flex items-center gap-2 font-bold">
                    <ChevronLeft size={16}/> Înapoi la toate știrile
                </Link>
            </div>
          )}

          {/* PAGINARE */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-20 max-w-6xl mx-auto pt-8 border-t border-white/5">
                {currentPage > 1 ? (
                    <Link href={`/stiri?page=${currentPage - 1}&category=${categoryFilter}`} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a0f1e] border border-white/10 hover:border-blue-500 text-white transition-all group hover:bg-blue-900/10">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Pagina Anterioară
                    </Link>
                ) : (
                    <button disabled className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed opacity-50">
                        <ChevronLeft size={20}/> Pagina Anterioară
                    </button>
                )}
                
                <span className="font-mono text-gray-500 text-sm bg-black/30 px-4 py-2 rounded-lg border border-white/5">
                    Pagina <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                </span>

                {currentPage < totalPages ? (
                    <Link href={`/stiri?page=${currentPage + 1}&category=${categoryFilter}`} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a0f1e] border border-white/10 hover:border-blue-500 text-white transition-all group hover:bg-blue-900/10">
                        Pagina Următoare <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                ) : (
                    <button disabled className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed opacity-50">
                        Pagina Următoare <ChevronRight size={20}/>
                    </button>
                )}
            </div>
          )}

      </div>
      <Footer />
    </main>
  );
}