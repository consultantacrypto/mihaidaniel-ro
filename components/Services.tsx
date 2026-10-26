'use client';

import { ArrowUpRight, LineChart, Shield, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const ANALYSIS_URL = 'https://www.stirilecrypto.ro/analiza-tehnica?src=mihaidaniel';

/** The paid checker at /verifica-adresa is live, so the coming-soon badge stays off. */
const WALLET_CHECK_LIVE = true;

export default function Services() {
  const t = useTranslations('home.services');

  return (
    <section id="servicii" className="border-t border-white/5 bg-[#020617] py-20 md:py-24" data-testid="services">
      <div className="container mx-auto px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300/80">{t('kicker')}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">{t('title')}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">{t('lead')}</p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-yellow-300">
              <Coins size={18} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{t('consultTitle')}</p>
            </div>
            <p className="mt-5 text-3xl font-bold text-white">{t('consultPrice')}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{t('consultBody')}</p>
            <Link
              href="/consultanta-crypto"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-yellow-200"
            >
              {t('consultCta')} <ArrowUpRight size={16} />
            </Link>
          </article>

          <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-cyan-300">
              <LineChart size={18} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{t('analysisTitle')}</p>
            </div>
            <p className="mt-5 text-3xl font-bold text-white">{t('analysisPrice')}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{t('analysisBody')}</p>
            <a
              href={ANALYSIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-200"
            >
              {t('analysisCta')} <ArrowUpRight size={16} />
            </a>
          </article>

          <article className="flex flex-col rounded-3xl border border-sky-400/20 bg-sky-400/[0.04] p-6" data-testid="wallet-service">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className="flex min-w-0 items-center gap-2 text-sky-300">
                <Shield size={18} className="shrink-0" />
                <p className="text-[11px] font-semibold uppercase leading-snug tracking-[0.14em]">{t('walletTitle')}</p>
              </div>
              {WALLET_CHECK_LIVE ? null : (
                <p className="rounded-full border border-amber-300/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                  {t('walletSoon')}
                </p>
              )}
            </div>
            <p className="mt-5 text-3xl font-bold text-white">{t('walletPrice')}</p>
            <p className="mt-1 text-sm font-medium text-white">{t('walletName')}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{t('walletBody')}</p>
            <Link
              href="/verifica-adresa"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-sky-200"
            >
              {t('walletCta')} <ArrowUpRight size={16} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
