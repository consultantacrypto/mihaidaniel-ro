import { articles } from '@/lib/articles';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, BrainCircuit, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

// Aceasta funcție generează paginile statice la build (Super Fast)
export async function generateStaticParams() {
  return articles.map((post) => ({
    slug: post.slug,
  }));
}

export default function NewsPage({ params }: { params: { slug: string } }) {
  const post = articles.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/#news" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16}/> Înapoi la Dashboard
        </Link>

        {/* Header Articol */}
        <div className="mb-10">
            <div className="flex gap-4 mb-4 text-xs font-mono uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-2"><Calendar size={14}/> {post.date}</span>
                <span className="flex items-center gap-2 text-blue-400"><Tag size={14}/> {post.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{post.title}</h1>
            
            {/* Mihai's Take Box */}
            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4 items-start">
                <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400 shrink-0 mt-1"><BrainCircuit size={24}/></div>
                <div>
                    <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-1">Mihai's Analysis</h3>
                    <p className="text-lg text-gray-200 italic">"{post.mihaiTake}"</p>
                </div>
            </div>
        </div>

        {/* Imagine */}
        <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
        </div>

        {/* Conținut (HTML) */}
        <div 
            className="prose prose-invert prose-lg max-w-none text-gray-300 prose-headings:text-white prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Footer */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Vrei să profiți de această mișcare?</h3>
            <p className="text-gray-400 mb-6">Învață cum să tranzacționezi știrile în Cursul Complet.</p>
            <Link href="/#curs" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform inline-block">
                Vezi Cursul
            </Link>
        </div>

      </div>
    </main>
  );
}