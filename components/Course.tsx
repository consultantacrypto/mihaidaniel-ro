'use client';

import { useState } from 'react';
import { Play, Lock, CheckCircle2, MonitorPlay, Smartphone, Infinity, Star, ChevronRight, BarChart2, Layers, Clock } from 'lucide-react';
import CryptoPaymentModal from './CryptoPaymentModal';

export default function Course() {
  const [isPaymentOpen, setPaymentOpen] = useState(false);

  return (
    <section id="curs" className="py-24 container mx-auto px-6 relative">
        <CryptoPaymentModal isOpen={isPaymentOpen} onClose={() => setPaymentOpen(false)} title="Curs Complet Trading" price={300} />

        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] -z-10 pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Sistemul Complet de Trading</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Nu este teorie. Este <span className="text-white font-bold">Enciclopedia mea personală</span>. 
                Tot ce am învățat în ani de zile, comprimat în 4 ore de conținut video esențial.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: VIDEO PREVIEW (Col 7) */}
            <div className="lg:col-span-7 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center group cursor-pointer" onClick={() => setPaymentOpen(true)}>
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all"></div>
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform z-10">
                        <Play size={40} className="text-white fill-white ml-2"/>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex gap-3 mb-2">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">PREMIUM</span>
                            <span className="bg-black/80 text-gray-300 text-xs font-bold px-2 py-1 rounded border border-white/10 flex items-center gap-1"><Clock size={12}/> 4 ORE+</span>
                        </div>
                        <div className="text-white font-bold text-xl">De la Începător la Pro Trader</div>
                    </div>
                </div>
                
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">20+</div>
                        <div className="text-xs text-gray-400 uppercase">Strategii (1m - Spot)</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">50+</div>
                        <div className="text-xs text-gray-400 uppercase">Indicatori Explicați</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">4h</div>
                        <div className="text-xs text-gray-400 uppercase">Conținut Video Pur</div>
                    </div>
                </div>
            </div>

            {/* RIGHT: CURRICULUM LIST (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">01</div>
                        <div>
                            <h4 className="font-bold text-white">Fundația Crypto</h4>
                            <p className="text-xs text-gray-400 mt-1">Platforme, Securitate, Wallet-uri. Cum să nu iei țeapă.</p>
                        </div>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">02</div>
                        <div>
                            <h4 className="font-bold text-white">Indicatori & Strategii</h4>
                            <p className="text-xs text-gray-400 mt-1">RSI, MACD, Bollinger. Strategii de la 5 min la 1 lună.</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-4 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold shrink-0">03</div>
                        <div>
                            <h4 className="font-bold text-white">Psihologie & Risk Management</h4>
                            <p className="text-xs text-gray-400 mt-1">Secretul profitului constant. Cum să gândești.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-3xl font-bold text-white">$300</span>
                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">ACCES PE VIAȚĂ</span>
                    </div>
                    <button 
                        onClick={() => setPaymentOpen(true)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                        Cumpără Accesul Acum <ChevronRight size={20}/>
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">Plată securizată Crypto (USDT). Acces Instant.</p>
                </div>
            </div>

        </div>
    </section>
  );
}