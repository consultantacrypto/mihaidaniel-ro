'use client';

import { ArrowRight, PlayCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        {/* Elemente de Fundal */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* TEXT & CTA */}
            <div className="flex-1 text-center lg:text-left z-10">
                {/* Social Proof Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/20 text-blue-300 text-sm font-bold mb-8 backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-white">280.000+</span> Oameni în Comunitate
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8"
                >
                    Trading-ul nu este <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-white">
                        Joc de Noroc.
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 border-l-2 border-white/10 pl-6"
                >
                    Sunt <b>Mihai Daniel</b>. Învață să citești piața, să elimini emoțiile și să folosești tehnologia (AI) în avantajul tău. <br/>
                    Trecem de la "pariuri" la matematică și disciplină.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                >
                    <a href="#curs" className="group px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)] transform hover:-translate-y-1">
                        Start Curs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </a>
                    <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                        <PlayCircle size={20} className="text-red-500"/> Analize Live
                    </a>
                </motion.div>

                {/* Micro Stats */}
                <div className="mt-12 pt-8 border-t border-white/5 flex gap-8 justify-center lg:justify-start text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-500"/>
                        <span>Strategii Validate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-blue-500"/>
                        <span>Fără Promisiuni False</span>
                    </div>
                </div>
            </div>

            {/* IMAGINE HERO */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-1 relative w-full max-w-[500px]"
            >
                <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/30 bg-[#0a0f1e] aspect-[4/5] group">
                    <img 
                        src="/hero-mihai.jpg" 
                        alt="Mihai Daniel Mentor" 
                        className="object-cover w-full h-full opacity-100 group-hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* Live Market Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-2xl">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Market Status</span>
                            </div>
                            <div className="text-white font-bold text-lg">Active Analysis</div>
                        </div>
                        <div className="text-right">
                             <span className="text-xs text-blue-400 font-mono block">BTC Dominance</span>
                             <span className="text-white font-mono font-bold">58.2%</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </motion.div>
        </div>
    </section>
  );
}