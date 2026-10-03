'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ConsultancyCheckoutButton from '@/components/consultancy/ConsultancyCheckoutButton';

export default function ConsultancyPageHero() {
  const t = useTranslations('consultancyPage.hero');

  return (
    <section className="relative pt-28 pb-10 md:pb-24 border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          <div className="flex-1 space-y-6 order-1">
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight text-white tracking-tight">
              {t('title')}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              {t('description')}
            </p>

            <div className="space-y-2">
              <p className="text-sm md:text-base font-medium text-yellow-500/90 tracking-wide">
                {t('details')}
              </p>
              <p className="text-sm text-gray-400 tracking-wide">
                {t('sessions')}
              </p>
            </div>

            <div className="pt-2">
              <ConsultancyCheckoutButton
                label={t('cta')}
                ariaLabel={t('ctaAria')}
                trackingLabel="consultanta_page_stripe"
              />
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-[440px] order-2">
            <div className="relative h-[300px] sm:h-[340px] md:h-auto md:aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e]">
              <Image
                src="/mihai-daniel-consultanta.jpg"
                alt={t('imageAlt')}
                fill
                priority
                className="object-cover object-[center_18%] md:object-top"
                sizes="(max-width: 1024px) 100vw, 440px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
