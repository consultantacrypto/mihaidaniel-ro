'use client';

import { Crown, CheckCircle2, ArrowRight, FileText, Zap, BookOpen } from 'lucide-react';

export default function Consultancy() {
  return (
    <section id="consultanta" className="py-24 bg-[#050b1d] border-t border-white/5 relative overflow-hidden">
        {/* Luxury Gold Ambient */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                
                {/* TEXT + OFFERTA */}
                <div className="flex-1 space-y-8 z-10">
                    <div className="inline-flex items-center gap-2 text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 rounded-lg uppercase tracking-widest text-xs font-bold shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                        <Crown size={14}/> Inner Circle
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                        Consultanță <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">VIP 1 la 1</span>
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-yellow-500/50 pl-6">
                        O oră intensivă de "chirurgie" pe portofoliul tău. Nu discutăm teorie, rezolvăm problemele tale specifice și setăm strategia de Exit pentru Bull Market.
                    </p>
                    
                    {/* ZONA DE BONUSURI (Rich Visuals) */}
                    <div className="bg-gradient-to-br from-[#1a1500] to-black border border-yellow-500/30 p-8 rounded-2xl relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">INCLUSE GRATUIT</div>
                        
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                            <Zap size={20} className="text-yellow-500 fill-yellow-500"/> BONUSURI EXCLUSIVE ($200 Value)
                        </h4>
                        
                        <div className="space-y-4">
                            {/* Bonus 1 */}
                            <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 mt-1"><FileText size={20}/></div>
                                <div>
                                    <div className="font-bold text-white">PDF: "VC Audit Framework"</div>
                                    <div className="text-xs text-gray-400 mt-1">Lista mea personală de prompt-uri AI cu care verific orice proiect crypto în 5 minute.</div>
                                </div>
                            </div>
                            
                            {/* Bonus 2 */}
                            <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 mt-1"><BookOpen size={20}/></div>
                                <div>
                                    <div className="font-bold text-white">PDF: "AI în Investiții" (20 Pagini)</div>
                                    <div className="text-xs text-gray-400 mt-1">Ghidul complet: Cum să folosești ChatGPT și Gemini ca să îți crești profitul.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black text-lg rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-3">
                            Rezervă Sesiunea - $250
                            <ArrowRight size={20}/>
                        </button>
                        <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                           Accept maxim 2 programări pe zi pentru calitate maximă.
                        </p>
                    </div>
                </div>

                {/* IMAGINE (Business Look) */}
                <div className="flex-1 relative w-full lg:max-w-[500px]">
                    <div className="absolute inset-0 bg-yellow-500/10 blur-[100px] -z-10"></div>
                    <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl group aspect-[3/4]">
                        <img 
                            src="/business-mihai.jpg" 
                            alt="Consultanță Mihai Daniel" 
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
                            <div className="text-yellow-500 font-bold text-xl mb-1">Mihai Daniel</div>
                            <div className="text-gray-400 text-sm font-mono uppercase tracking-widest">Expert Trading & AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}