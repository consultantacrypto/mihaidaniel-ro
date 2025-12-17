import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // ✅ Acum merge pentru că ai creat fișierul
import CryptoTicker from '@/components/CryptoTicker';
import LiquidationFeed from '@/components/LiquidationChart'; 
import { AlertTriangle, TrendingUp, Skull, Globe2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lichidări Crypto Global Live | Mihai Daniel',
  description: 'Vezi lichidările în timp real de pe Binance, Bybit și OKX. Analiză de piață profesională.',
};

export default function LiquidationsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col">
      <CryptoTicker />
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-6xl flex-grow">
        
        <div className="text-center mb-12">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 mb-4">
                <Globe2 size={14}/> Agregator Global
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-500">
                Pulsul Pieței Live
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Conectat direct la <span className="text-white font-bold">Binance, Bybit și OKX</span>. Vezi unde sunt lichidați traderii instituționali și de retail în milisecunda în care se întâmplă.
            </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-4 space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Skull size={80} /></div>
                    <h3 className="font-bold text-white mb-3 text-lg">Cum să citești banda?</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Acesta este un flux de date brute. Nu există filtru. Ceea ce vezi sunt bani reali pierduți de traderi reali.
                    </p>
                    <ul className="space-y-3 text-sm">
                        <li className="bg-red-900/20 border border-red-500/20 p-3 rounded-lg">
                            <strong className="text-red-400 block mb-1">Long Lichidat (Roșu)</strong>
                            <span className="text-gray-400 text-xs">Traderul a pariat că prețul va crește. Prețul a scăzut și exchange-ul i-a vândut poziția forțat. <br/><strong>Efect:</strong> Presiune de vânzare.</span>
                        </li>
                        <li className="bg-green-900/20 border border-green-500/20 p-3 rounded-lg">
                            <strong className="text-green-400 block mb-1">Short Lichidat (Verde)</strong>
                            <span className="text-gray-400 text-xs">Traderul a pariat că prețul va scădea. Prețul a crescut și exchange-ul a cumpărat forțat. <br/><strong>Efect:</strong> Presiune de cumpărare.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Globe2 size={16} className="text-blue-400"/> De ce 3 Exchange-uri?</h3>
                    <p className="text-xs text-gray-400">
                        Binance, Bybit și OKX reprezintă peste <strong>70% din volumul global</strong> de derivate crypto. Dacă vezi lichidări simultane pe toate trei, înseamnă că mișcarea prețului este autentică și violentă.
                    </p>
                </div>
            </div>

            <div className="md:col-span-8">
                <LiquidationFeed />
                
                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl flex-1 flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20} />
                        <div>
                            <strong className="text-yellow-500 text-sm block mb-1">Semnal de "Whale":</strong>
                            <p className="text-gray-400 text-xs">
                                Dacă vezi o lichidare singură de peste <strong>$100,000</strong> marcată cu ⚡, înseamnă că o "balenă" a fost prinsă pe picior greșit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="text-center border-t border-gray-800 pt-12 mt-12">
            <p className="text-gray-400 mb-6">Vrei să înțelegi cum să nu ajungi pe lista asta?</p>
            <a href="/stiri/mirajul-levierului-arma-financiara-distrugere" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <TrendingUp size={18} /> Citește Ghidul Anti-Lichidare
            </a>
        </div>

      </div>
      <Footer />
    </main>
  );
}