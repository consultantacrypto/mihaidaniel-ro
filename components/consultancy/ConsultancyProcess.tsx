'use client';

import { useTranslations } from 'next-intl';
import ConsultancyCheckoutButton from '@/components/consultancy/ConsultancyCheckoutButton';

const STEP_KEYS = ['pay', 'schedule', 'session'] as const;

export default function ConsultancyProcess() {
  const t = useTranslations('consultancyPage.process');
  const tHero = useTranslations('consultancyPage.hero');

  return (
    <section className="py-20 md:py-24 border-b border-white/5">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          {t('title')}
        </h2>
        <p className="text-gray-400 text-center mb-12 leading-relaxed">
          {t('intro')}
        </p>

        <ol className="space-y-6 mb-10">
          {STEP_KEYS.map((key, index) => (
            <li
              key={key}
              className="flex gap-4 rounded-2xl border border-white/10 bg-[#0a0f1e] p-5 md:p-6"
            >
              <span
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/10 text-sm font-bold text-yellow-500"
                aria-hidden
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-white mb-1">{t(`${key}.title`)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(`${key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-gray-300 text-center text-sm md:text-base leading-relaxed mb-8">
          {t('prepare')}
        </p>

        <div className="flex justify-center">
          <ConsultancyCheckoutButton
            label={tHero('cta')}
            ariaLabel={tHero('ctaAria')}
            trackingLabel="consultanta_page_process_stripe"
          />
        </div>
      </div>
    </section>
  );
}
