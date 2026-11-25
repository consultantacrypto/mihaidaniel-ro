'use client';

import { Calendar, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { bookingAnchorHref } from '@/lib/consultancy-packages';

const BOOKING_EMAIL = 'contact@stirilecrypto.ro';
const BOOKING_SUBJECT = 'Rezervare consultație 1 la 1';

export function consultancyBookingMailto(): string {
  return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(BOOKING_SUBJECT)}`;
}

type ConsultancyBookingActionsProps = {
  bookingHref?: string | null;
};

export default function ConsultancyBookingActions({
  bookingHref = null,
}: ConsultancyBookingActionsProps) {
  const t = useTranslations('consultancyPage.hero');
  const tEmail = useTranslations('consultancyPage.emailCta');
  const tBooking = useTranslations('consultancyPage.bookingCta');
  const calendarHref = bookingAnchorHref(bookingHref);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <a
        href="#pachete"
        aria-label={t('ctaAria')}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-500 px-10 py-4 text-lg font-bold text-black transition-colors hover:bg-yellow-400 sm:w-auto"
      >
        {t('cta')}
      </a>
      {calendarHref ? (
        <a
          href={calendarHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tBooking('aria')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] sm:w-auto"
        >
          <Calendar size={18} className="shrink-0 text-yellow-300" aria-hidden />
          {tBooking('label')}
        </a>
      ) : null}
      <a
        href={consultancyBookingMailto()}
        aria-label={tEmail('aria')}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold leading-snug text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] sm:w-auto"
      >
        <Mail size={18} className="shrink-0 text-yellow-300" aria-hidden />
        <span className="text-left">{tEmail('label')}</span>
      </a>
    </div>
  );
}
