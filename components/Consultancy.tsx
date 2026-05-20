'use client';

import { useState } from 'react';
import { Crown, ArrowRight, FileText, Zap, BookOpen, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { startCheckout } from '@/lib/checkout';

export default function Consultancy() {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('home.consultancy');
  const tCommon = useTranslations('common');

  const handleOpenBooking = async () => {
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: 250,
        items: [{ item_name: 'Consultancy VIP 1-on-1', item_id: 'consultancy_vip' }],
      });
    }

    setIsLoading(true);
    try {
      await startCheckout('consultancy');
    } catch (error) {
      console.error('[Consultancy] Checkout error:', error);
      alert(
        error instanceof Error ? error.message : tCommon('checkoutError')
      );
      setIsLoading(false);
    }
  };

  return (
    <section id="consultanta" className="py-24 bg-[#050b1d] border-t border-white/5 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 rounded-lg uppercase tracking-widest text-xs font-bold shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                        <Crown size={14}/> {t('badge')}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                        {t('titleBefore')} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">{t('titleHighlight')}</span>
                    </h2>
                    
                    <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-yellow-500/50 pl-6">
                        {t('description')}
                        <span className="block mt-2 text-white font-bold">{t('descriptionBold')}</span>
                    </p>
                    
                    <div className="bg-gradient-to-br from-[#1a1500] to-black border border-yellow-500/30 p-6 rounded-2xl relative group hover:border-yellow-500/60 transition-colors">
                        <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">{t('bonusTag')}</div>
                        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-yellow-500"/> {t('packageTitle')}
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FileText size={18} className="text-yellow-600 mt-0.5"/>
                                <div className="text-sm">
                                    <span className="text-white font-bold">{t('bonus1Title')}</span> — {t('bonus1Desc')}
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <BookOpen size={18} className="text-yellow-600 mt-0.5"/>
                                <div className="text-sm">
                                    <span className="text-white font-bold">{t('bonus2Title')}</span> — {t('bonus2Desc')}
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="button"
                            onClick={handleOpenBooking}
                            disabled={isLoading}
                            aria-label={t('ctaAria')}
                            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed text-black font-black text-lg rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:scale-105 disabled:hover:scale-100 transition-transform flex items-center justify-center gap-3 cursor-pointer"
                        >
                            {isLoading ? (
                              <>
                                <Loader2 size={20} className="animate-spin" />
                                {tCommon('processing')}
                              </>
                            ) : (
                              <>
                                {t('cta')} <ArrowRight size={20}/>
                              </>
                            )}
                        </button>
                        <p className="text-sm text-gray-400 mt-3 pl-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> {t('slots')}
                            </span>
                            <Link
                              href="/consultanta-crypto"
                              className="text-yellow-400 hover:text-yellow-300 font-semibold underline-offset-4 hover:underline"
                            >
                              {t('detailsLink')}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex-1 relative w-full lg:max-w-[480px]">
                    <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl group aspect-[3/4]">
                        <Image 
                            src="/mihai-daniel-consultanta.jpg" 
                            alt={t('imageAlt')}
                            fill
                            loading="lazy"
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 480px"
                        />
                        <div className="absolute bottom-6 right-6 left-6 bg-[#0a0f1e]/90 backdrop-blur-md p-4 rounded-xl border border-yellow-500/20">
                            <div className="flex text-yellow-500 mb-1">
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                            </div>
                            <p className="text-xs text-gray-300 italic">
                                &quot;{t('testimonial')}&quot;
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}
