'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { trackBuyConsultancy } from '@/lib/analytics';
import { startCheckout } from '@/lib/checkout';

type ConsultancyProps = {
  stripeTrackingLabel?: string;
  pageTrackingLabel?: string;
};

export default function Consultancy({
  stripeTrackingLabel = 'home_stripe',
  pageTrackingLabel = 'home_consultanta_page',
}: ConsultancyProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('home.consultancy');
  const tCommon = useTranslations('common');

  const handleOpenBooking = async () => {
    setIsLoading(true);
    try {
      await startCheckout('consultancy', stripeTrackingLabel);
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
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                        {t('title')}
                    </h2>
                    
                    <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-yellow-500/50 pl-6">
                        {t('description')}
                    </p>

                    <p className="text-sm md:text-base font-medium text-yellow-500/90 tracking-wide">
                        {t('details')}
                    </p>

                    <div className="pt-2">
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
                        <p className="text-sm text-gray-400 mt-3 pl-2">
                            <Link
                              href="/consultanta-crypto"
                              onClick={() => trackBuyConsultancy(pageTrackingLabel)}
                              className="text-yellow-400 hover:text-yellow-300 font-semibold underline-offset-4 hover:underline"
                            >
                              {t('detailsLink')}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex-1 relative w-full lg:max-w-[480px]">
                    <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl aspect-[3/4]">
                        <Image 
                            src="/mihai-daniel-consultanta.jpg" 
                            alt={t('imageAlt')}
                            fill
                            loading="lazy"
                            className="object-cover object-top w-full h-full"
                            sizes="(max-width: 1024px) 100vw, 480px"
                        />
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}
