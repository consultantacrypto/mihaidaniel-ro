'use client';

import { useTranslations } from 'next-intl';

const TOPIC_KEYS = ['portfolio', 'capital', 'losses'] as const;

export default function ConsultancyTopics() {
  const t = useTranslations('consultancyPage.topics');

  return (
    <section className="pt-10 pb-20 md:py-24 border-b border-white/5 bg-[#0a0f1e]/40">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          {t('title')}
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('intro')}
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TOPIC_KEYS.map((key) => (
            <article
              key={key}
              className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 md:p-7"
            >
              <h3 className="text-lg font-bold text-white mb-3">
                {t(`${key}.title`)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t(`${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
