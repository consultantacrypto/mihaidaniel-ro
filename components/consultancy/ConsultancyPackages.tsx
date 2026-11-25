'use client';

import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import ConsultancyCheckoutButton from '@/components/consultancy/ConsultancyCheckoutButton';
import {
  CONSULTANCY_PACKAGE_ORDER,
  CONSULTANCY_PACKAGES,
  consultancyMessageKey,
  formatEurAmount,
  formatEurPrice,
  threeSessionCompare,
  type ConsultancyPackageId,
} from '@/lib/consultancy-packages';

const TRACKING: Record<ConsultancyPackageId, string> = {
  sesiune: 'consultanta_page_sesiune',
  'pachet-3': 'consultanta_page_pachet_3',
  'mentorat-6': 'consultanta_page_mentorat_6',
};

export default function ConsultancyPackages() {
  const t = useTranslations('consultancyPage.packages');
  const locale = useLocale() === 'en' ? 'en' : 'ro';
  const compare = threeSessionCompare();
  const singlePrice = formatEurPrice(CONSULTANCY_PACKAGES.sesiune.unitAmount, locale);

  return (
    <section id="pachete" className="scroll-mt-28 border-b border-white/5 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-500/90">
            {t('kicker')}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-400 md:text-lg">{t('lead')}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl items-stretch gap-5 lg:grid-cols-3">
          {CONSULTANCY_PACKAGE_ORDER.map((id) => {
            const pkg = CONSULTANCY_PACKAGES[id];
            const key = consultancyMessageKey(id);
            const price = formatEurPrice(pkg.unitAmount, locale);
            const name = pkg.offerName[locale];
            const highlighted = id === 'pachet-3';
            const points = [
              t(`${key}.point1`),
              id === 'sesiune' ? t(`${key}.point2`, { count: pkg.includedAnalyses }) : t(`${key}.point2`),
              id === 'sesiune' ? null : t(`${key}.point3`, { count: pkg.includedAnalyses }),
            ].filter((point): point is string => Boolean(point));

            return (
              <article
                key={id}
                className={`flex flex-col rounded-3xl border p-6 md:p-8 ${
                  highlighted
                    ? 'border-yellow-500/40 bg-gradient-to-b from-yellow-500/[0.08] to-[#0a0f1e]'
                    : 'border-white/10 bg-[#0a0f1e]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  {id === 'pachet-3' ? (
                    <span className="shrink-0 rounded-full border border-yellow-500/40 bg-yellow-500/15 px-2.5 py-1 text-xs font-bold text-yellow-300">
                      −{compare.percentOff}%
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-gray-400">{t(`${key}.duration`)}</p>
                {id === 'pachet-3' ? (
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{t(`${key}.forWho`)}</p>
                ) : null}

                <p className="mt-6 flex items-baseline gap-3 text-white">
                  <span className="text-4xl font-bold tracking-tight">
                    {formatEurAmount(pkg.unitAmount, locale)}
                  </span>
                  <span className="text-lg font-semibold text-gray-400">€</span>
                  {id === 'pachet-3' ? (
                    <span className="text-base font-medium text-gray-500 line-through">
                      {formatEurAmount(compare.fullCents, locale)} €
                    </span>
                  ) : null}
                </p>

                <p className="mt-2 min-h-5 text-sm text-gray-400">
                  {id === 'pachet-3' ? t('was', { price: singlePrice }) : null}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-gray-300">
                      <Check size={16} className="mt-0.5 shrink-0 text-yellow-400" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ConsultancyCheckoutButton
                    packageId={id}
                    fullWidth
                    label={`${t('pay')} ${price}`}
                    ariaLabel={t('payAria', { name, price })}
                    trackingLabel={TRACKING[id]}
                  />
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-gray-500">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
