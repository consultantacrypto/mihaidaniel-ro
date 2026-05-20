'use client';

import { ArrowRight, PlayCircle, TrendingUp, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { trackBuyCourse } from '@/lib/analytics';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative pt-20 pb-20 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="flex-1 text-center lg:text-left z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-8 backdrop-blur-md"
                >
                    <Users size={16} className="text-blue-400"/>
                    <span className="text-white font-bold">{t('badgeCount')}</span> {t('badgeLabel')}
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
                    {t('titleLine1')} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-white">
                        {t('titleHighlight')}
                    </span>
                </h1>

                <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 pl-6 border-l-2 border-blue-500/30">
                    {t('introBefore')}<b>{t('introName')}</b>{t('introAfter')}
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                    <a
                      href="#curs"
                      onClick={() => trackBuyCourse('hero_curs_section')}
                      className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] transform hover:-translate-y-1"
                    >
                        {t('ctaSystem')} <ArrowRight size={18}/>
                    </a>
                    <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md group">
                        <PlayCircle size={20} className="text-red-500 group-hover:scale-110 transition-transform"/> {t('ctaYoutube')}
                    </a>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500"/> {t('trustStrategies')}
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-500"/> {t('trustNoHype')}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative w-full max-w-[480px]">
                <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 bg-[#0a0f1e] aspect-[4/5] group">
                    <Image 
                        src="/mihai-daniel-icon.jpg" 
                        alt={t('imageAlt')}
                        fill
                        priority={true}
                        fetchPriority="high"
                        className="object-cover w-full h-full opacity-100 group-hover:scale-105 transition-transform duration-1000"
                        sizes="(max-width: 768px) 100vw, 500px"
                    />
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl z-20">
                        <div className="text-white font-bold text-lg">{t('cardName')}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{t('cardRole')}</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
