import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // ✅ Am adăugat Footer
import CategoryFilter from '@/components/CategoryFilter';
import FearGreed from '@/components/FearGreed'; // ✅ Componenta Nouă
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus, BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Market Intelligence | Știri Crypto Explicate',
  description: 'Analize de piață, știri crypto traduse și explicate de Mihai Daniel.',
  keywords: ['stiri crypto', 'analiza bitcoin', 'fomc', 'educatie financiara', 'mihai daniel', 'crypto romania'],
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

  // --- 🧠 LOGICA DE FILTRARE ---
  const filteredArticles = articles.filter((article) => {
    const text = (article.title + article.summary + article.category).toLowerCase();
    
    switch (categoryFilter) {
      case 'btc':
        return text.includes('bitcoin') || text.includes('btc') || text.includes('satoshi') || text.includes('halving');
      case 'eth':
        return text.includes('ethereum') || text.includes('eth') || text.includes('vitalik') || text.includes('blackrock');
      case 'macro':
        return text.includes('fomc') || text.includes('fed') || text.includes('inflatie') || text.includes('banca') || text.includes('cpi') || text.includes('trezorerie') || article.category.includes('MACRO') || article.category.includes('INSTITUȚIONAL');
      case 'alts':
        return text.includes('solana') || text.includes('altcoin') || text.includes('altseason') || text.includes('token') || article.category.includes('ADOPȚIE');
      case 'edu':
        return article.category.includes('EDUCAȚIE') || article.category.includes('PSIHOLOGIE') || article.category.includes('SECURITATE');
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24 flex-grow">
          
          {/* HEADER PREMIUM + FEAR & GREED */}
          <div className="flex flex-col items-center mb-12 gap-6 relative">
              
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Intelligence</span>
                </h1>
                
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Nu doar titluri. <span className="text-white font-bold">Analiză strategică.</span>
                </p>
              </div>

              {/* ✅ AICI ESTE WIDGETUL */}
              <div className="animate-in slide-in-from-bottom-4 duration-700 fade-in">
                <FearGreed />
              </div>

          </div>

          {/* FILTRARE */}
          <CategoryFilter />

          {/* LISTA ARTICOLE */}
          {currentArticles.length > 0 ? (
            <div className="grid gap-8 max-w-5xl mx-auto">
                {currentArticles.map((item, idx) => (
                    <Link href={`/stiri/${item.slug}`} key={item.slug} className="group bg-[#0a0f1e] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/10">
                        <div className="w-full md:w-72 h-64 md:h-auto shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                            
                            <Image 
                                src={item.image} 
                                alt={item.title}
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                priority={idx < 2} 
                            />

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
                            
                            {item.mihaiTake && (
                                <div className="bg-blue-900/10 border-l-2 border-blue-500 pl-4 py-2 mb-6 rounded-r-lg">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase mb-1">
                                        <BrainCircuit size={12}/> Mihai's Take
                                    </div>
                                    <p className="text-sm text-gray-300 italic line-clamp-1">"{item.mihaiTake}"</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-2 transition-transform mt-auto">
                                Citește Analiza <ArrowRight size={16} className="text-blue-500 group-hover:text-white transition-colors"/>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
                <p>Nu am găsit articole în această categorie momentan.</p>
                <Link href="/stiri" className="text-blue-400 hover:underline mt-2 inline-block">Vezi toate articolele</Link>
            </div>
          )}

          {/* PAGINARE */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16 max-w-5xl mx-auto pt-8 border-t border-white/5">
                {currentPage > 1 ? (
                    <Link href={`/stiri?page=${currentPage - 1}&category=${categoryFilter}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a0f1e] border border-white/10 hover:border-blue-500 text-white transition-all group">
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
                    <Link href={`/stiri?page=${currentPage + 1}&category=${categoryFilter}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a0f1e] border border-white/10 hover:border-blue-500 text-white transition-all group">
                        Pagina Următoare <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                ) : (
                    <button disabled className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed">
                        <ChevronLeft size={20}/> Pagina Următoare
                    </button>
                )}
            </div>
          )}

      </div>
      <Footer />
    </main>
  );
}