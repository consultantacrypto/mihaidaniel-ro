import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryFilter from '@/components/CategoryFilter';
import FearGreed from '@/components/FearGreed';
import TickerTape from '@/components/TickerTape';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';

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

  // --- FILTRARE STANDARD (Fără Taxe) ---
  const filteredArticles = articles.filter((article) => {
    const text = (article.title + article.summary + article.category).toLowerCase();
    
    switch (categoryFilter) {
      case 'btc': 
        return text.includes('bitcoin') || text.includes('btc') || text.includes('satoshi') || text.includes('halving');
      case 'eth': 
        return text.includes('ethereum') || text.includes('eth') || text.includes('defi') || text.includes('smart contract');
      case 'macro': 
        return text.includes('macro') || text.includes('fed') || text.includes('inflatie') || text.includes('banca') || text.includes('economie');
      case 'alts': 
        return text.includes('altcoin') || text.includes('solana') || text.includes('xrp') || text.includes('cardano') || text.includes('binance');
      case 'edu': 
        return text.includes('educatie') || text.includes('ghid') || text.includes('tutorial') || text.includes('explicat');
      
      default: 
        return true; // Arată tot
    }
  });

  // --- PAGINARE ---
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const displayedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER ZONA ȘTIRI */}
        <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase mb-4 animate-pulse">
                <Terminal size={12} />
                Live Market Updates
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Intelligence</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Nu doar știri. Înțelege <span className="text-white font-bold">de ce</span> se mișcă piața.
              Analize instituționale traduse pe limba investitorilor.
            </p>
        </div>

        {/* COMPONENTE DATE PIAȚĂ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2">
                 <TickerTape />
            </div>
            <div className="md:col-span-1">
                 <FearGreed />
            </div>
        </div>

        {/* FILTRE CATEGORII */}
        <CategoryFilter />

        {/* LISTA ARTICOLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedArticles.length > 0 ? (
            displayedArticles.map((article) => (
              <Link 
                href={`/stiri/${article.slug}`} 
                key={article.id}
                className="group bg-[#0b1221] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] via-transparent to-transparent opacity-60"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md
                      ${article.impact === 'bullish' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 
                        article.impact === 'bearish' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 
                        'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      }`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-mono">
                    <Calendar size={12} />
                    {article.date}
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                     <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                        Citește Analiza
                     </span>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                        <ArrowRight size={14} className="text-gray-400 group-hover:text-white" />
                     </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">Nu am găsit articole în această categorie momentan.</p>
              <Link href="/stiri" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
                Înapoi la toate știrile
              </Link>
            </div>
          )}
        </div>

        {/* PAGINARE */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
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

      </main>
      <Footer />
    </div>
  );
}