'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, TrendingDown, AlertTriangle, BrainCircuit, History, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'Ce Înseamnă "Bear Market" și De Ce Nu Trebuie Să Te Sperie?',
    'image': [
      // ✅ LINK IMAGINE STABIL ȘI TESTAT
      'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-08T09:00:00+02:00',
    'dateModified': '2025-12-08T09:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Mihai Daniel',
      'url': 'https://mihaidaniel.ro'
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-red-500/30">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>

        <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-red-500 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-2"><BrainCircuit size={12}/> Educație Financiară</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 08 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 6 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                Ce Înseamnă &quot;Bear Market&quot; și De Ce Nu Trebuie Să Te Sperie? <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Ghidul Complet pentru Investitorul Inteligent</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-red-500/50 pl-6 italic font-[var(--font-inter)]">
                Dacă portofoliul tău e pe roșu, probabil ai auzit termenul &quot;Bear Market&quot;. Află de unde vine numele, care sunt cele 4 faze psihologice și cum să prosperi în iarna financiară.
            </p>
        </header>

        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            {/* ✅ IMAGINE CORECTATĂ */}
            <img 
                src="https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1200&auto=format&fit=crop" 
                alt="Bear Market Analysis" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            
            {/* Mihai's Take */}
            <div className="bg-[#0a1025] border border-red-900/30 p-6 rounded-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={100} className="text-white"/></div>
                <h3 className="text-red-400 font-bold mb-2 font-[var(--font-space)] flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Mihai&apos;s Take:
                </h3>
                <p className="text-sm italic text-gray-300 relative z-10">
                    &quot;Tati, nu fugi de urs. Îmbrățișează-l. Bear Market-ul este perioada în care se fac averile, doar că nota de plată o încasezi în Bull Market. Dacă înțelegi psihologia din spatele graficului, frica dispare și apare oportunitatea. Citeste ghidul ăsta ca să știi exact unde ne aflăm.&quot;
                </p>
            </div>

            <p className="lead text-xl text-white font-medium">
                Dacă ai deschis portofoliul de investiții recent și ai văzut doar culoarea roșie, probabil ai auzit termenul aruncat peste tot: <strong>&quot;Suntem într-un Bear Market&quot;</strong>.
            </p>
            <p>
                Pentru începători, sună înfricoșător. Pentru veteranii de pe Wall Street, sună a oportunitate. Dar ce înseamnă, de fapt, un Bear Market (Piață &quot;Urs&quot;)? De ce a fost ales acest animal și, cel mai important, cum îți protejezi banii când ursul atacă piața?
            </p>
            <p>
                În acest ghid complet, demontăm miturile și îți arătăm cum să supraviețuiești – și chiar să prosperi – în timpul &quot;iernii financiare&quot;.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-red-500/20 rounded-lg text-red-400"><TrendingDown size={24}/></span>
                De unde vine numele? Lupta dintre Taur și Urs
            </h3>
            <p>Înainte de a vorbi despre procente și pierderi, trebuie să înțelegem simbolismul. Termenii &quot;Bull&quot; (Taur) și &quot;Bear&quot; (Urs) descriu modul în care aceste animale își atacă prada:</p>
            <ul className="space-y-4">
                <li className="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
                    <strong className="text-green-400">🐂 Bull Market (Piața Taur):</strong> Taurul atacă lovind cu coarnele de jos în sus.<br/>
                    <em>Semnificație:</em> Prețurile cresc, optimismul este ridicat, graficele merg &quot;to the moon&quot;.
                </li>
                <li className="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
                    <strong className="text-red-400">🐻 Bear Market (Piața Urs):</strong> Ursul atacă lovind cu labele de sus în jos, strivindu-și prada.<br/>
                    <em>Semnificație:</em> Prețurile scad agresiv, pesimismul domină, investitorii vând de frică.
                </li>
            </ul>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><AlertTriangle size={24}/></span>
                Definiția Tehnică: Când devine o corecție un Bear Market?
            </h3>
            <p>Nu orice scădere de preț înseamnă Bear Market. Piețele respiră; uneori inspiră (creștere), alteori expiră (scădere). Exista o regulă nescrisă, dar acceptată universal pe Wall Street:</p>
            <ul>
                <li><strong>Corecție:</strong> O scădere de 10% - 19% față de maximul recent. Este considerată sănătoasă.</li>
                <li><strong>Bear Market:</strong> O scădere de peste 20% față de maximul istoric recent (ATH), care persistă pe o perioadă mai lungă (luni sau ani).</li>
            </ul>
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 text-sm">
                <strong>Notă pentru Crypto:</strong> În lumea criptomonedelor, volatilitatea este mult mai mare. Un &quot;Crypto Bear Market&quot; implică adesea scăderi de 70% - 85% pentru Bitcoin și chiar 90-99% pentru Altcoins.
            </div>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><BrainCircuit size={24}/></span>
                Psihologia Pieței: Cele 4 Faze ale unui Bear Market
            </h3>
            <p>Un Bear Market nu este o linie dreaptă în jos. Este un proces psihologic dureros, conceput să testeze răbdarea investitorilor. Iată prin ce trecem:</p>
            <ol className="list-decimal pl-6 space-y-4 marker:text-gray-500">
                <li><strong>Recunoașterea (Negarea):</strong> Prețurile încep să scadă de la maxime. Investitorii spun: &quot;E doar o mică corecție, voi cumpăra mai mult (Buy the Dip)&quot;. Optimismul încă există.</li>
                <li><strong>Panica:</strong> Prețurile nu își revin. Știrile economice devin negative (inflație, război, ratele dobânzilor). Investitorii încep să realizeze că trendul s-a schimbat. Începe vânzarea emoțională.</li>
                <li><strong>Stabilizarea (Capitularea):</strong> Acesta este momentul în care investitorii de retail renunță. &quot;Crypto e o țeapă&quot;, &quot;Bursa nu e de mine&quot;. Vând în pierdere doar ca să scape de stres. Prețurile ating fundul (bottom).</li>
                <li><strong>Anticiparea:</strong> Prețurile stagnează o perioadă lungă (zona de acumulare). Veștile proaste nu mai afectează prețul. &quot;Smart Money&quot; (Instituțiile) încep să cumpere în liniște, pregătind următorul Bull Market.</li>
            </ol>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><History size={24}/></span>
                Cum să Supraviețuiești (și să Faci Bani) când Ursul Atacă
            </h3>
            <p>Warren Buffett are o vorbă celebră: <em>&quot;Fii lacom când alții sunt fricoși și fricos când alții sunt lacomi.&quot;</em> Bear Market-ul este perioada în care se fac averile, dar ele se încasează abia în Bull Market. Iată 3 reguli de aur:</p>
            <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-bold text-white mb-1">1. Nu vinde în panică</h4>
                    <p className="text-sm text-gray-400">Dacă ai investit în active solide (Bitcoin, S&P 500, companii Blue Chip) și teza ta de investiție nu s-a schimbat, prețul roșu este doar &quot;zgomot&quot;. Dacă vinzi acum, transformi o pierdere &quot;pe hârtie&quot; într-una reală.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-bold text-white mb-1">2. Folosește strategia DCA (Dollar Cost Averaging)</h4>
                    <p className="text-sm text-gray-400">Nu încerca să ghicești unde este fundul prăpastiei (Catching a falling knife). În schimb, investește o sumă fixă, constant (ex: 100$ pe săptămână), indiferent de preț. Astfel, vei cumpăra mai mult când prețul e mic și mai puțin când prețul e mare, obținând un preț mediu excelent.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-bold text-white mb-1">3. Evită Leverage-ul (Banii împrumutați)</h4>
                    <p className="text-sm text-gray-400">Într-un Bear Market, volatilitatea este extremă. Lichidările masive sunt frecvente. Păstrează-te pe piața Spot (cumperi activul real). Nu risca să fii șters din piață înainte ca revenirea să înceapă.</p>
                </div>
            </div>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">Concluzie: Iarna nu durează la nesfârșit</h3>
            <p>
                Istoria piețelor financiare, de peste 100 de ani, ne arată un lucru cert: Fiecare Bear Market a fost urmat de un Bull Market care a atins noi maxime istorice. Ursul face curățenie. Elimină proiectele slabe, companiile zombie și investitorii lacomi care folosesc prea mult risc.
            </p>
            <p>
                Dacă citești acest articol și încă ești în piață, felicitări! Ești deja cu un pas înaintea mulțimii.
            </p>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">Simți că portofoliul tău sângerează și nu știi ce să faci?</h3>
            <p>
                Bear Market-ul poate fi o perioadă singuratică și stresantă. Uneori, diferența dintre a vinde pe minim și a acumula avere este o simplă discuție cu cineva care a mai trecut prin asta.
            </p>
            <p>
                Te invit la o sesiune de consultanță 1-la-1 ($250/oră), unde vom analiza portofoliul tău și vom construi o strategie personalizată de apărare și acumulare, adaptată toleranței tale la risc. Nu lăsa piața să decidă pentru tine. Preia controlul.
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Educație Financiară
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie ghidul:</span>
                <ShareButtons 
                    title="Ce Înseamnă Bear Market și De Ce Nu Trebuie Să Te Sperie?" 
                    slug="ce-inseamna-bear-market-ghid-complet" 
                />
            </div>
        </div>

        {/* CTA Consultanță - HOOK: GUIDANCE */}
        <div className="mt-12 bg-gradient-to-r from-red-900/20 to-orange-900/20 p-8 rounded-2xl border border-red-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Simți că portofoliul tău sângerează?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Bear Market-ul poate fi stresant dacă ești singur. Hai să construim o strategie personalizată de apărare și acumulare, adaptată toleranței tale la risc.
            </p>
            <Link href="/#consultanta" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <Lightbulb size={18}/> Preia Controlul - Rezervă Sesiunea
            </Link>
        </div>

      </article>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">
              © 2026 Mihai Daniel. Toate drepturile rezervate.
          </div>
      </footer>
    </main>
  );
}