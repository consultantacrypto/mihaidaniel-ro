'use client';

import { ArrowUpRight, LineChart } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ANALYSIS_URL = 'https://www.stirilecrypto.ro/analiza-tehnica?src=mihaidaniel';

export default function ConsultancyAnalysisOption() {
  const t = useTranslations('consultancyPage.analysis');

  return (
    <section className="py-20 md:py-24 border-b border-white/5 bg-[#0a0f1e]/40">
      <div className="container mx-auto max-w-3xl px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
          {t('kicker')}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-gray-400 md:text-lg">
          {t('note')}
        </p>

        <article className="mt-10 flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex items-center gap-2 text-cyan-300">
            <LineChart size={18} aria-hidden />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em]">{t('title')}</h2>
          </div>
          <p className="mt-5 text-3xl font-bold text-white">{t('price')}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{t('body')}</p>
          <a
            href={ANALYSIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-200"
          >
            {t('cta')} <ArrowUpRight size={16} aria-hidden />
          </a>
        </article>
      </div>
    </section>
  );
}
