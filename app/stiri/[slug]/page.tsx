import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { 
  Calendar, Clock, ArrowLeft, 
  TrendingUp, TrendingDown, Activity, 
  AlertTriangle, ShieldAlert, Zap, 
  BrainCircuit, Lock, Lightbulb, History 
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Generăm rutele statice pentru viteză maximă (SSG)
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// 2. Generăm Metadata SEO automat
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: 'Articol Inexistent' };

  return {
    title: `${article.title} | Mihai Daniel`,
    description: article.summary,
    openGraph: { images: [article.image] },
  };
}

// 3. Pagina Universală "Cameleon"
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // --- LOGICA DE DESIGN DINAMIC (AICI E MAGIA) ---
  const getTheme = () => {
    switch (article.impact) {
      case 'bullish':
        return { 
          color: 'green', 
          accent: 'text-green-400', 
          border: 'border-green-500/20', 
          bg: 'bg-green-500/10',
          gradient: 'from-green-400 to-emerald-600',
          selection: 'selection:bg-green-500/30',
          icon: TrendingUp,
          ctaTitle: 'Pregătește-te pentru oportunitate',
          ctaText: 'Când piața crește, trebuie să știi când să intri și când să ieși. Hai să facem strategia.',
          ctaIcon: Zap
        };
      case 'bearish':
        return { 
          color: 'red', 
          accent: 'text-red-500', 
          border: 'border-red-500/20', 
          bg: 'bg-red-900/10', // Mai închis pentru dramatic
          gradient: 'from-red-500 to-orange-600',
          selection: 'selection:bg-red-500/30',
          icon: AlertTriangle,
          ctaTitle: 'Nu pierde bani din neștiință',
          ctaText: 'Piețele volatile sunt periculoase fără plan. Securizează-ți portofoliul acum.',
          ctaIcon: ShieldAlert
        };
      default: // Neutral / Educație / Psihologie
        return { 
          color: 'orange', // Gold pentru educație
          accent: 'text-orange-400', 
          border: 'border-orange-500/20', 
          bg: 'bg-orange-500/10',
          gradient: 'from-orange-400 to-yellow-400',
          selection: 'selection:bg-orange-500/30',
          icon: BrainCircuit,
          ctaTitle: 'Investește în educația ta',
          ctaText: 'Emoțiile te costă bani. Ai nevoie de o strategie clară, nu de reacții la știri.',
          ctaIcon: Lightbulb
        };
    }
  };

  const theme = getTheme();
  const ThemeIcon = theme.icon;
  const CtaIcon = theme.ctaIcon;

  // Schema SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'image': [article.image],
    'datePublished': new Date(article.date).toISOString(),
    'author': [{ '@type': 'Person', 'name': 'Mihai Daniel', 'url': 'https://mihaidaniel.ro' }]
  };

  return (
    <main className={`min-h-screen flex flex-col bg-[#020617] text-white ${theme.selection}`}>
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>

        {/* HEADER DINAMIC */}
        <header className="mb-10 text-center md:text-left">
            <div className={`flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest ${theme.accent} mb-4 justify-center md:justify-start font-[var(--font-space)]`}>
                <span className={`${theme.bg} px-3 py-1 rounded-full border ${theme.border} flex items-center gap-2`}>
                    <ThemeIcon size={12}/> {article.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> {article.date}</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 5 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                {/* Highlight pe ultima parte a titlului dacă conține ":" */}
                {article.title.includes(':') ? (
                    <>
                        {article.title.split(':')[0]}: <br/>
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>
                            {article.title.split(':')[1]}
                        </span>
                    </>
                ) : article.title}
            </h1>

            <p className={`text-xl text-gray-300 leading-relaxed border-l-4 ${theme.border.replace('/20', '/50')} pl-6 italic font-[var(--font-inter)]`}>
                {article.summary}
            </p>
        </header>

        {/* IMAGINE */}
        <div className={`relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border ${theme.border} shadow-2xl group`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60"></div>
            <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            />
        </div>

        {/* CONȚINUT + MIHAI'S TAKE */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            
            {article.mihaiTake && (
                <div className="bg-[#0a1025] border border-gray-800 p-6 rounded-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={100} className="text-white"/></div>
                    <h3 className={`${theme.accent} font-bold mb-2 font-[var(--font-space)] flex items-center gap-2`}>
                        <span className={`w-2 h-2 bg-current rounded-full animate-pulse`}></span> Mihai's Take:
                    </h3>
                    <p className="text-sm italic text-gray-300 relative z-10">"{article.mihaiTake}"</p>
                </div>
            )}

            {/* Aici se injectează HTML-ul tău curat din articles.ts */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* FOOTER */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Analist
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie analiza:</span>
                <ShareButtons title={article.title} slug={article.slug} />
            </div>
        </div>

        {/* CTA DINAMIC */}
        <div className={`mt-12 bg-gradient-to-r ${theme.bg.replace('bg-', 'from-').replace('/10', '/20')} to-gray-900/50 p-8 rounded-2xl border ${theme.border} text-center`}>
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">
                {theme.ctaTitle}
            </h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                {theme.ctaText}
            </p>
            <Link href="/#consultanta" className={`inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1`}>
                <CtaIcon size={18}/> Rezervă Sesiunea ($250)
            </Link>
        </div>

      </article>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">© 2026 Mihai Daniel. Toate drepturile rezervate.</div>
      </footer>
    </main>
  );
}