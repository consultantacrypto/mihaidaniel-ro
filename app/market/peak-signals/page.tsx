import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TwoYearMAChart from '@/components/TwoYearMAChart';
import { getBitcoinMetrics } from '@/lib/metrics-api';
import { ArrowLeft, BrainCircuit, LineChart } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // Actualizare la fiecare oră

export const metadata = {
  title: 'Bitcoin Peak Signals | Analiză On-Chain Mihai Daniel',
  description: 'Grafice avansate pentru detectarea vârfurilor de ciclu Bitcoin. 2-Year MA Multiplier și analiză matematică.',
};

export default async function PeakSignalsPage() {
  const metrics = await getBitcoinMetrics();

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* NAVIGARE ÎNAPOI */}
        <div className="mb-8">
            <Link href="/market" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
                Înapoi la Market Dashboard
            </Link>
        </div>

        {/* HEADER IMPUNĂTOR */}
        <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
            
            <span className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 mb-6 shadow-lg backdrop-blur-md">
                <BrainCircuit size={14}/> Algoritm On-Chain v1.0
            </span>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                VÂRFURI DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CICLU</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Matematica nu minte. Folosim date istorice și medii mobile pentru a identifica științific când piața este <span className="text-red-400 font-bold">supraîncălzită</span> sau <span className="text-green-400 font-bold">subevaluată</span>.
            </p>
        </div>

        {/* GRAFIC PRINCIPAL */}
        <div className="mb-16">
            {metrics.length > 0 ? (
                <TwoYearMAChart data={metrics} />
            ) : (
                <div className="w-full h-96 bg-[#0b1221] rounded-2xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                    <LineChart size={48} className="text-gray-600 mb-4 z-10"/>
                    <p className="text-gray-400 font-mono z-10">Se încarcă datele complexe...</p>
                    <p className="text-xs text-gray-600 mt-2 font-mono z-10">Fetching blockchain history (10y+)</p>
                </div>
            )}
        </div>

        {/* SECȚIUNE EDUCATIVĂ (HOW TO USE) */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Cum funcționează?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                    Indicatorul <strong>2-Year MA Multiplier</strong> este creat pentru a fi simplu și brutal de eficient. 
                    <br/><br/>
                    În loc să ghicim "cât de sus poate ajunge Bitcoin", ne uităm la media prețului din ultimii 2 ani. Istoria ne arată că atunci când prețul crește de <strong>5 ori (x5)</strong> peste această medie, piața intră în euforie maximă și urmează prăbușirea.
                </p>
            </div>
            
            <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    Cum să îl folosești?
                </h3>
                <ul className="space-y-4">
                    <li className="flex gap-4 p-3 bg-white/5 rounded-xl items-center">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.3)]">1</div>
                        <p className="text-sm text-gray-300">Dacă linia albă atinge <span className="text-red-400 font-bold">linia roșie</span>: <br/><strong>Vinde treptat (DCA Out).</strong> Ești la vârf.</p>
                    </li>
                    <li className="flex gap-4 p-3 bg-white/5 rounded-xl items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.3)]">2</div>
                        <p className="text-sm text-gray-300">Dacă linia albă cade sub <span className="text-green-400 font-bold">linia verde</span>: <br/><strong>Cumpără agresiv.</strong> Ești la fundul sacului.</p>
                    </li>
                </ul>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}