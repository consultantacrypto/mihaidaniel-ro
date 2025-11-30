'use client';

import { Play, Lock, CheckCircle2, MonitorPlay, Smartphone, Infinity, Star, ChevronRight, PlayCircle } from 'lucide-react';

export default function Course() {
  return (
    <section id="curs" className="py-24 container mx-auto px-6 relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] -z-10"></div>

        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-500/30 text-blue-400 text-xs font-bold mb-4 bg-blue-500/5">
                 <MonitorPlay size={12}/> VIDEO PLATFORM 4K
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Sistemul Complet de Trading</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Nu este un webinar pe Zoom. Este <span className="text-white font-bold">Netflix-ul Educației Financiare</span>.
                Ai acces instant la toate modulele, filmate profesional, pe care le poți revedea oricând, de oriunde.
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* PARTEA STANGA: VIDEO PLAYER EXPERIENCE */}
            <div className="flex-1 w-full relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all"></div>
                    
                    {/* Play Button */}
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 cursor-pointer group-hover:scale-110 transition-transform z-10">
                        <Play size={40} className="text-white fill-white ml-2"/>
                    </div>

                    {/* Player UI Elements */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                            <div className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wider">Lecția 1 - Preview</div>
                            <div className="text-white font-bold text-lg">Mentalitatea de Investitor</div>
                        </div>
                        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">12:45</div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                        <div className="h-full w-1/3 bg-blue-500"></div>
                    </div>
                </div>

                {/* Features Badges under video */}
                <div className="flex justify-between mt-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><Infinity size={16} className="text-blue-500"/> Acces Nelimitat</div>
                    <div className="flex items-center gap-2"><Smartphone size={16} className="text-blue-500"/> App Mobil</div>
                    <div className="flex items-center gap-2"><Star size={16} className="text-yellow-500"/> 4.9/5 Rating</div>
                </div>
            </div>

            {/* PARTEA DREAPTA: CURRICULUM (EPISOADE) */}
            <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Ce conține programul?</h3>
                    <span className="text-xs text-gray-500 font-mono">12 MODULE • 40+ ORE</span>
                </div>

                {/* Module List */}
                <div className="space-y-3">
                    {/* Modul 1 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">01</div>
                        <div className="flex-1">
                            <div className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">Bazele Crypto & Blockchain</div>
                            <div className="text-xs text-gray-500">De la Wallet la Exchange-uri. Securitate maximă.</div>
                        </div>
                        <CheckCircle2 size={18} className="text-green-500"/>
                    </div>

                    {/* Modul 2 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">02</div>
                        <div className="flex-1">
                            <div className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors">Analiză Tehnică: The Masterclass</div>
                            <div className="text-xs text-gray-500">Lumânări, Trenduri, RSI, MACD, Fibonacci.</div>
                        </div>
                        <Lock size={16} className="text-gray-600"/>
                    </div>

                    {/* Modul 3 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-sm">03</div>
                        <div className="flex-1">
                            <div className="text-white font-bold text-sm group-hover:text-yellow-400 transition-colors">Strategii de Tranzacționare</div>
                            <div className="text-xs text-gray-500">Scalping, Swing Trading și Investiții pe termen lung.</div>
                        </div>
                        <Lock size={16} className="text-gray-600"/>
                    </div>
                    
                    {/* Modul 4 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm">04</div>
                        <div className="flex-1">
                            <div className="text-white font-bold text-sm group-hover:text-green-400 transition-colors">Psihologie & Risk Management</div>
                            <div className="text-xs text-gray-500">Cum să nu pierzi banii. Planul de ieșire.</div>
                        </div>
                        <Lock size={16} className="text-gray-600"/>
                    </div>
                </div>

                <div className="pt-6">
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform">
                        Vreau Acces la Tot Cursul - $300
                        <ChevronRight size={20}/>
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">Plată unică. Acces Instant. Factură Fiscală.</p>
                </div>
            </div>

        </div>
    </section>
  );
}