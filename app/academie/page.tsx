import Link from 'next/link';
import Image from 'next/image';
import { dictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, BookOpen, Database, Activity, BrainCircuit, ShieldCheck, TrendingUp, ArrowRight, Lock } from 'lucide-react';

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
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-500/20 px-4 py-2 rounded-full bg-cyan-900/10">
                <BookOpen size={14}/> Biblioteca Investitorului
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                Nu investi în ce <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">nu înțelegi.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                Crypto Wiki de România. De la "Ce e Bitcoin" la strategii avansate. 
                Explicate simplu, direct, fără limbaj de lemn.
            </p>
        </div>
      </div>

      {/* LISTA DE ARTICOLE */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {dictionary.map((item) => (
                <Link href={`/academie/${item.slug}`} key={item.slug} className="group bg-[#0b1221] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col h-full">
                    
                    {/* IMAGINEA */}
                    <div className="relative w-full aspect-video overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] to-transparent opacity-60 z-10"></div>
                        {item.image && (
                           <Image 
                             src={item.image} 
                             alt={item.term} 
                             fill 
                             className="object-cover group-hover:scale-110 transition-transform duration-700"
                             unoptimized={true}
                           />
                        )}
                        
                        {/* ICONIȚE CATEGORII - ACTUALIZATE PENTRU NOILE TIPURI */}
                        <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-black/50 rounded-lg p-1.5 border border-white/10">
                             {item.category === 'BITCOIN & FUNDAMENTE' && <Database size={16} className="text-orange-400"/>}
                             {item.category === 'TRADING & CHARTURI' && <Activity size={16} className="text-green-400"/>}
                             {item.category === 'DEFI & WEB3' && <BrainCircuit size={16} className="text-purple-400"/>}
                             {item.category === 'SECURITATE & WALLETS' && <ShieldCheck size={16} className="text-blue-400"/>}
                             {item.category === 'PSIHOLOGIE & CICLE' && <TrendingUp size={16} className="text-yellow-400"/>}
                        </div>
                    </div>
                    
                    {/* TEXTUL */}
                    <div className="p-6 flex flex-col flex-grow">
                        {/* Culoarea textului de categorie în funcție de tip */}
                        <span className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${
                            item.category === 'BITCOIN & FUNDAMENTE' ? 'text-orange-400' :
                            item.category === 'TRADING & CHARTURI' ? 'text-green-400' :
                            item.category === 'DEFI & WEB3' ? 'text-purple-400' :
                            'text-cyan-500'
                        }`}>
                            {item.category}
                        </span>
                        
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
                            {item.term}
                        </h3>
                        
                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6 flex-grow">
                            {item.definition}
                        </p>

                        <div className="flex items-center text-sm font-bold text-white group-hover:text-cyan-400 transition-colors pt-4 border-t border-white/5 mt-auto">
                            Citește Ghidul <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}