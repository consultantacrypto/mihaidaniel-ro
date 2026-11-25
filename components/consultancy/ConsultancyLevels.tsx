'use client';

import { LineChart, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ConsultancyLevels() {
  const t = useTranslations('consultancyPage.levels');

  return (
    <section className="border-b border-white/5 bg-[#0a0f1e]/40 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-500/90">
            {t('kicker')}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-gray-400 md:text-lg">{t('lead')}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-[#0a0f1e] p-6 md:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
              <Shield size={20} aria-hidden />
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-500/90">
              {t('beginnerKicker')}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white">{t('beginnerTitle')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 md:text-base">
              {t('beginnerBody')}
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0a0f1e] p-6 md:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <LineChart size={20} aria-hidden />
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/90">
              {t('traderKicker')}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white">{t('traderTitle')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 md:text-base">
              {t('traderBody')}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
