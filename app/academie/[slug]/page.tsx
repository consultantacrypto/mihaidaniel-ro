import { dictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = dictionary.find((t) => t.slug === slug);
  return {
    title: term ? `${term.term} - Ce înseamnă? | Academia Crypto` : 'Termen Necunoscut',
    description: term?.definition,
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = dictionary.find((t) => t.slug === slug);

  if (!term) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Termen Negăsit</h1>
            <Link href="/academie" className="text-blue-400 hover:underline">Înapoi la Academie</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-6 py-24 max-w-4xl flex-grow">
        <Link href="/academie" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wider">
            <ArrowLeft size={16}/> Înapoi la Dicționar
        </Link>

        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8">
            <span className="text-blue-500 font-mono text-sm border border-blue-500/20 bg-blue-900/10 px-3 py-1 rounded mb-4 inline-block">
                {term.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                {term.term}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed font-light border-l-4 border-white/20 pl-6">
                {term.definition}
            </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid gap-8">
            
            {/* 1. ANALOGIA */}
            <div className="bg-[#0b1221] border border-white/5 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400"><Lightbulb size={24}/></div>
                    <h2 className="text-2xl font-bold text-white">Pe Românește</h2>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                    {term.analogy}
                </p>
            </div>

            {/* 2. MIHAI'S TAKE (Valoarea Maximă) */}
            <div className="relative bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={100}/>
                </div>
                
                <div className="relative z-10">
                    <h3 className="text-blue-400 font-black text-sm uppercase tracking-[0.2em] mb-4">Mihai's Take</h3>
                    <div className="flex gap-4">
                        <div className="w-1 bg-blue-500 rounded-full shrink-0"></div>
                        <p className="text-lg md:text-xl text-white font-medium italic leading-relaxed">
                            "{term.mihaiTake}"
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. SOFT SELL (Call to Action) */}
            <div className="mt-8 bg-[#0a0f1e] border border-green-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">Vrei să înveți să aplici asta practic?</h4>
                    <p className="text-gray-400 text-sm">
                        Teoria e bună, dar practica aduce profit. În cursul meu explic exact cum să folosești {term.term} în piața reală.
                    </p>
                </div>
                <Link href="/#curs" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-900/20 whitespace-nowrap">
                    Vezi Cursul Crypto
                </Link>
            </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}