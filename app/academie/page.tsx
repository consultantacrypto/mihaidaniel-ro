import Link from 'next/link';
import { dictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, BookOpen, BrainCircuit, Activity, ShieldCheck, Database, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Academia Crypto | Dicționar Explicat de Mihai Daniel',
  description: 'Învață termenii esențiali din crypto. Fără limbaj de lemn, explicați pe înțelesul tuturor.',
};

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 flex flex-col">
      <Navbar />
      
      {/* HERO SECTION */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20 px-4 py-2 rounded-full bg-blue-900/10">
                <BookOpen size={14}/> Biblioteca Investitorului
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                Nu investi în ce <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">nu înțelegi.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                Dicționarul complet crypto. De la "Ce e Bitcoin" la strategii avansate de Trading. 
                Explicate simplu, direct, fără limbaj de lemn.
            </p>

            {/* SEARCH BAR VIZUAL */}
            <div className="relative max-w-xl mx-auto group">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                <div className="relative bg-[#0a0f1e] border border-white/10 rounded-full p-2 flex items-center shadow-2xl">
                    <Search className="text-gray-500 ml-4" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Caută un termen (ex: Halving, RSI, Ethereum)..." 
                        className="bg-transparent border-none outline-none text-white px-4 py-2 w-full placeholder:text-gray-600"
                    />
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold transition-colors">
                        Caută
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* LISTA DE TERMENI */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {dictionary.map((item) => (
                <Link href={`/academie/${item.slug}`} key={item.slug} className="group bg-[#0b1221] border border-white/5 hover:border-blue-500/50 p-6 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${
                            item.category === 'FUNDAMENTE' ? 'from-orange-500/20 to-orange-900/20 text-orange-400' :
                            item.category === 'TRADING' ? 'from-green-500/20 to-green-900/20 text-green-400' :
                            item.category === 'DEFI' ? 'from-purple-500/20 to-purple-900/20 text-purple-400' :
                            'from-blue-500/20 to-blue-900/20 text-blue-400'
                        }`}>
                            {item.category === 'FUNDAMENTE' && <Database size={24}/>}
                            {item.category === 'TRADING' && <Activity size={24}/>}
                            {item.category === 'DEFI' && <BrainCircuit size={24}/>}
                            {item.category === 'SECURITATE' && <ShieldCheck size={24}/>}
                            {item.category === 'MACRO' && <TrendingUp size={24}/>}
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 border border-white/5 px-2 py-1 rounded uppercase tracking-wider group-hover:text-white transition-colors">
                            {item.category}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {item.term}
                    </h3>
                    
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4">
                        {item.definition}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-sm font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                        Citește Explicația Completă
                    </div>
                </Link>
            ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}