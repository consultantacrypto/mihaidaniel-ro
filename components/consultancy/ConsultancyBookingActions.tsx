'use client';

import { Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { visibleContactHref } from '@/lib/consulting-contact';

type ConsultancyBookingActionsProps = {
  emailHref?: string | null;
  whatsappHref?: string | null;
};

export default function ConsultancyBookingActions({
  emailHref = null,
  whatsappHref = null,
}: ConsultancyBookingActionsProps) {
  const t = useTranslations('consultancyPage.hero');
  const tEmail = useTranslations('consultancyPage.emailCta');
  const tWhatsapp = useTranslations('consultancyPage.whatsappCta');
  const email = visibleContactHref('email', emailHref);
  const whatsapp = visibleContactHref('whatsapp', whatsappHref);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <a
        href="#pachete"
        aria-label={t('ctaAria')}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-500 px-10 py-4 text-lg font-bold text-black transition-colors hover:bg-yellow-400 sm:w-auto"
      >
        {t('cta')}
      </a>
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tWhatsapp('aria')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-500 sm:w-auto"
        >
          <MessageCircle size={18} className="shrink-0" aria-hidden />
          {tWhatsapp('label')}
        </a>
      ) : null}
      {email ? (
        <a
          href={email}
          aria-label={tEmail('aria')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold leading-snug text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] sm:w-auto"
        >
          <Mail size={18} className="shrink-0 text-yellow-300" aria-hidden />
          <span className="text-left">{tEmail('label')}</span>
        </a>
      ) : null}
    </div>
  );
}
