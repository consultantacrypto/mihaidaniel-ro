'use client';

import { useTranslations } from 'next-intl';

const ITEM_KEYS = ['session', 'analyses', 'delivery', 'scope', 'educational'] as const;

export default function ConsultancyIncluded() {
  const t = useTranslations('consultancyPage.included');

  return (
    <section className="pt-10 pb-20 md:py-24 border-b border-white/5 bg-[#0a0f1e]/40">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h2>

        <ul className="space-y-4">
          {ITEM_KEYS.map((key) => (
            <li
              key={key}
              className="flex gap-4 rounded-2xl border border-white/10 bg-[#0a0f1e] p-5 md:p-6"
            >
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-500"
                aria-hidden
              />
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {t(key)}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-gray-400 text-sm md:text-base leading-relaxed text-center">
          {t('listPrice')}
        </p>
      </div>
    </section>
  );
}
