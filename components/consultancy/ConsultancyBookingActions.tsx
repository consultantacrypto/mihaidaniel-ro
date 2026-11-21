'use client';

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConsultancyCheckoutButton from '@/components/consultancy/ConsultancyCheckoutButton';

const BOOKING_EMAIL = 'contact@stirilecrypto.ro';
const BOOKING_SUBJECT = 'Rezervare consultație 1 la 1';

export function consultancyBookingMailto(): string {
  return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(BOOKING_SUBJECT)}`;
}

type ConsultancyBookingActionsProps = {
  trackingLabel: string;
};

export default function ConsultancyBookingActions({
  trackingLabel,
}: ConsultancyBookingActionsProps) {
  const t = useTranslations('consultancyPage.hero');
  const tEmail = useTranslations('consultancyPage.emailCta');

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <ConsultancyCheckoutButton
        label={t('cta')}
        ariaLabel={t('ctaAria')}
        trackingLabel={trackingLabel}
      />
      <a
        href={consultancyBookingMailto()}
        aria-label={tEmail('aria')}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 text-white font-semibold text-base leading-snug transition-colors"
      >
        <Mail size={18} className="shrink-0 text-yellow-300" aria-hidden />
        <span className="text-left">{tEmail('label')}</span>
      </a>
    </div>
  );
}
