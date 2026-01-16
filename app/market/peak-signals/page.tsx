import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBitcoinMetrics } from '@/lib/metrics-api';
import { ArrowLeft, BrainCircuit, LineChart } from 'lucide-react';
import Link from 'next/link';
// ✅ FIX: Import Dinamic pentru a opri randarea pe server a graficului
import dynamic from 'next/dynamic';

const TwoYearMAChart = dynamic(() => import('@/components/TwoYearMAChart'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-[#0b1221] rounded-2xl flex items-center justify-center border border-white/10">
        <p className="text-gray-500 animate-pulse">Se încarcă graficul...</p>
    </div>
  )
});

export const revalidate = 3600;

export const metadata = {
  title: 'Bitcoin Peak Signals | Analiză On-Chain Mihai Daniel',
  description: 'Grafice avansate pentru detectarea vârfurilor de ciclu Bitcoin.',
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

        {/* HEADER */}
        <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
            
            <span className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 mb-6 shadow-lg backdrop-blur-md">
                <BrainCircuit size={14}/> Algoritm On-Chain v1.0
            </span>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                VÂRFURI DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CICLU</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Analiză matematică folosind <span className="text-white font-bold">2-Year MA Multiplier</span> pentru a identifica supraîncălzirea pieței.
            </p>
        </div>

        {/* GRAFIC PRINCIPAL */}
        <div className="mb-16">
            {metrics.length > 0 ? (
                <TwoYearMAChart data={metrics} />
            ) : (
                <div className="w-full h-96 bg-[#0b1221] rounded-2xl flex flex-col items-center justify-center border border-white/10 relative p-8 text-center">
                    <LineChart size={48} className="text-red-500 mb-4"/>
                    <h3 className="text-xl font-bold text-white">Datele nu pot fi încărcate</h3>
                    <p className="text-gray-400 mt-2">API-ul Binance nu răspunde momentan. Încearcă un refresh.</p>
                </div>
            )}
        </div>

        {/* SECȚIUNE EDUCATIVĂ */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4">Cum funcționează?</h3>
                <p className="text-gray-400 leading-relaxed">
                    Indicatorul urmărește media prețului pe 2 ani (Linia Verde). Când prețul crește de 5 ori peste această medie (Linia Roșie), istoric a marcat vârful ciclului.
                </p>
            </div>
            <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4">Strategie</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-red-400 font-bold">Linia Roșie:</span> Vinde (DCA Out).</li>
                    <li className="flex gap-2"><span className="text-green-400 font-bold">Linia Verde:</span> Cumpără (Acumulare).</li>
                </ul>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}