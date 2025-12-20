import Link from 'next/link';
import Image from 'next/image';
import { dictionary, AcademyItem } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Database, Activity, BrainCircuit, ShieldCheck, TrendingUp, ArrowRight, PlayCircle, Layers, Zap } from 'lucide-react';

export const metadata = {
  title: 'Academia Crypto | Mihai Daniel',
  description: 'Platforma educațională completă. De la Bitcoin la strategii avansate de Trading.',
};

// Funcție pentru a determina culoarea și textul dificultății
const getDifficulty = (category: string) => {
  if (category.includes('FUNDAMENTE')) return { label: 'ÎNCEPĂTOR', color: 'text-green-400 border-green-500/30 bg-green-500/10' };
  if (category.includes('TRADING')) return { label: 'INTERMEDIAR', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' };
  if (category.includes('SECURITATE')) return { label: 'CRITIC', color: 'text-red-400 border-red-500/30 bg-red-500/10' };
  return { label: 'AVANSAT', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' };
};

export default function AcademyPage() {
  // 1. Alegem Articolul "Vedetă" (Featured) - Bitcoin
  const featuredArticle = dictionary.find(item => item.slug === 'ce-este-bitcoin-ghid-complet') || dictionary[0];

  // 2. Grupăm restul articolelor pe categorii
  const tradingArticles = dictionary.filter(item => item.category === 'TRADING & CHARTURI' && item.slug !== featuredArticle.slug);
  const defiArticles = dictionary.filter(item => item.category === 'DEFI & WEB3' && item.slug !== featuredArticle.slug);
  const fundamentalsArticles = dictionary.filter(item => item.category === 'BITCOIN & FUNDAMENTE' && item.slug !== featuredArticle.slug);

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 flex flex-col font-[var(--font-inter)]">
      <Navbar />
      
      {/* === HERO SECTION (NETFLIX STYLE) === */}
      <div className="relative w-full h-[600px] flex items-center">
        {/* Background Image cu Overlay */}
        <div className="absolute inset-0 z-0">
             <Image 
                src={featuredArticle.image} 
                alt="Featured" 
                fill 
                className="object-cover opacity-60"
                priority
                unoptimized={true}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        </div>

        {/* Content Featured */}
        <div className="container mx-auto px-6 relative z-10 pt-20">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    <Zap size={12} className="fill-current"/> Cursul Lunii
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl font-[var(--font-space)]">
                    {featuredArticle.term}
                </h1>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl border-l-4 border-orange-500 pl-6 bg-black/30 p-4 rounded-r-xl backdrop-blur-sm">
                    {featuredArticle.definition}
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href={`/academie/${featuredArticle.slug}`} className="bg-orange-500 hover:bg-orange-600 text-black font-black py-4 px-10 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105">
                        <PlayCircle size={20} className="fill-current"/> ÎNCEPE LECȚIA
                    </Link>
                    <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Dificultate:</div>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* === CONTENT TRACKS === */}
      <div className="container mx-auto px-6 py-12 -mt-20 relative z-20 space-y-20">
        
        {/* TRACK 1: TRADING SNIPER */}
        <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20"><Activity size={24}/></div>
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-space)]">Sniper Trading</h2>
                    <p className="text-sm text-gray-400">Analiză tehnică, indicatori și psihologia pieței.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tradingArticles.length > 0 ? tradingArticles.map(item => <Card key={item.slug} item={item} />) : (
                    <div className="text-gray-600 text-sm italic py-10">Urmează lecții noi despre Trading...</div>
                )}
            </div>
        </section>

        {/* TRACK 2: DEFI & ECOSYSTEM */}
        <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20"><BrainCircuit size={24}/></div>
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-space)]">DeFi & Web3</h2>
                    <p className="text-sm text-gray-400">Cum să fii propria ta bancă. Smart Contracts și Yield.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {defiArticles.length > 0 ? defiArticles.map(item => <Card key={item.slug} item={item} />) : (
                    <div className="text-gray-600 text-sm italic py-10">Urmează lecții noi despre DeFi...</div>
                )}
            </div>
        </section>

         {/* TRACK 3: ALTE NOȚIUNI (Dacă există) */}
         {fundamentalsArticles.length > 0 && (
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Database size={24}/></div>
                    <div>
                        <h2 className="text-2xl font-bold font-[var(--font-space)]">Alte Fundamente</h2>
                        <p className="text-sm text-gray-400">Dicționarul investitorului inteligent.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fundamentalsArticles.map(item => <Card key={item.slug} item={item} />)}
                </div>
            </section>
         )}

      </div>

      {/* CALL TO ACTION FINAL */}
      <div className="container mx-auto px-6 pb-24">
        <div className="bg-[#0a0f1e] border border-cyan-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
            <h3 className="text-3xl font-black text-white mb-4">Vrei să treci de la Teorie la Practică?</h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Academia îți oferă bazele. În comunitatea VIP aplicăm aceste baze live, în piață, pentru profit.
            </p>
            <Link href="/#consultanta" className="inline-block bg-white text-black font-bold py-4 px-10 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                Aplică pentru Mentorship
            </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// --- COMPONENTA CARD REUTILIZABILĂ ---
function Card({ item }: { item: AcademyItem }) {
    const diff = getDifficulty(item.category);
    
    return (
        <Link href={`/academie/${item.slug}`} className="group bg-[#0a0f1e] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden">
                <Image 
                    src={item.image} 
                    alt={item.term} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized={true}
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${diff.color}`}>
                    {diff.label}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {item.term}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6 flex-grow">
                    {item.definition}
                </p>
                <div className="flex items-center text-xs font-bold text-cyan-500 uppercase tracking-widest pt-4 border-t border-white/5 mt-auto">
                    Citește <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                </div>
            </div>
        </Link>
    );
}