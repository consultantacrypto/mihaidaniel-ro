'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle2, X } from 'lucide-react';
import { trackPurchaseOnce } from '@/lib/analytics';
import {
  WHATSAPP_MESSAGES,
  coercePublicContactChannels,
  defaultPublicChannels,
  whatsappHref,
  withBookingPrefill,
  type PublicContactChannels,
  type SchedulingLocale,
} from '@/lib/scheduling';
import type { CheckoutProductType } from '@/lib/stripe';

type FeedbackStatus = 'success' | 'canceled' | null;

const COPY = {
  ro: {
    successTitle: 'Plată Confirmată! 🎉',
    consultancy:
      'Pentru a stabili data și ora sesiunii, scrie-mi pe WhatsApp. Primești și un email de confirmare.',
    consultancyCalendar:
      'Pentru a stabili data și ora, alege un loc în calendar. Dacă nu merge, scrie-mi pe WhatsApp.',
    book: 'Alege ora',
    whatsapp: 'Scrie-mi pe WhatsApp',
    emailLead: 'Sau scrie-mi pe email la',
    close: 'Închide',
    calendarTitle: 'Calendar pentru programare',
    course:
      'Pentru a primi accesul la cursul privat, te rugăm să ne scrii un mesaj cu adresa ta de Gmail (folosită pentru contul de YouTube)',
    courseVia: 'pe WhatsApp la',
    courseOr: 'sau pe email la',
    generic: 'Îți mulțumim. Verifică adresa de email pentru detaliile de acces.',
    canceled:
      'Plata a fost anulată. Dacă ai întâmpinat probleme, te rugăm să ne contactezi.',
    closeLabel: 'Închide mesajul',
  },
  en: {
    successTitle: 'Payment confirmed',
    consultancy:
      'To set the day and time, message me on WhatsApp. You also get a confirmation email.',
    consultancyCalendar:
      'Pick a time in the calendar. If that does not work, message me on WhatsApp.',
    book: 'Choose a time',
    whatsapp: 'Message me on WhatsApp',
    emailLead: 'Or email me at',
    close: 'Close',
    calendarTitle: 'Booking calendar',
    course:
      'To get access to the private course, send the Gmail address you use for YouTube',
    courseVia: 'on WhatsApp at',
    courseOr: 'or by email at',
    generic: 'Thank you. Check your email for the access details.',
    canceled: 'The payment was canceled. If something went wrong, contact me.',
    closeLabel: 'Dismiss',
  },
} as const;

function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center rounded-xl bg-green-600 py-3 text-center font-bold text-white transition-colors hover:bg-green-500"
    >
      {label}
    </a>
  );
}

export default function PaymentFeedback() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale: SchedulingLocale = useLocale() === 'en' ? 'en' : 'ro';
  const copy = COPY[locale];
  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';
  const typeParam = searchParams.get('type');
  const sessionId = searchParams.get('session_id');
  const productType: CheckoutProductType | null =
    typeParam === 'course' || typeParam === 'consultancy' ? typeParam : null;

  const [successHidden, setSuccessHidden] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [channels, setChannels] = useState<PublicContactChannels>(defaultPublicChannels);
  const [buyerEmail, setBuyerEmail] = useState<string | null>(null);

  if (isCanceled && !cancelVisible) {
    setCancelVisible(true);
  }

  const status: FeedbackStatus = isSuccess && !successHidden
    ? 'success'
    : !isSuccess && cancelVisible
      ? 'canceled'
      : null;

  useEffect(() => {
    if (!isCanceled) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete('canceled');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [isCanceled, searchParams, router, pathname]);

  useEffect(() => {
    if (status !== 'success') return;
    let cancelled = false;

    fetch('/api/scheduling')
      .then((response) => response.json())
      .then((data: unknown) => {
        const next = coercePublicContactChannels(data);
        if (!cancelled && next) setChannels(next);
      })
      .catch(() => {
        // Defaults stay on screen. No broken link.
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (!isSuccess || !sessionId) return;
    let cancelled = false;

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = (await response.json()) as {
          paid?: boolean;
          transactionId?: string;
          value?: number;
          currency?: string;
          productType?: string;
          itemName?: string;
          customerEmail?: string | null;
        };
        if (cancelled || !response.ok || data.paid !== true) return;
        if (typeof data.customerEmail === 'string') setBuyerEmail(data.customerEmail);
        if (
          typeof data.transactionId !== 'string' ||
          typeof data.value !== 'number' ||
          typeof data.currency !== 'string' ||
          typeof data.productType !== 'string' ||
          typeof data.itemName !== 'string'
        ) {
          return;
        }
        trackPurchaseOnce({
          transactionId: data.transactionId,
          value: data.value,
          currency: data.currency,
          productType: data.productType,
          itemName: data.itemName,
        });
      })
      .catch((error) => {
        console.error('[payment] verify failed (ignored):', error);
      });

    return () => {
      cancelled = true;
    };
  }, [isSuccess, sessionId]);

  if (!status) return null;

  if (status === 'canceled') {
    return (
      <div className="fixed top-24 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0a0f1e]/95 px-4 py-3 shadow-xl backdrop-blur-md">
          <p className="flex-1 text-sm text-gray-300">{copy.canceled}</p>
          <button
            type="button"
            onClick={() => setCancelVisible(false)}
            className="shrink-0 text-gray-500 transition-colors hover:text-white"
            aria-label={copy.closeLabel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  const isConsultancy = productType === 'consultancy';
  const message = isConsultancy
    ? WHATSAPP_MESSAGES.consultancy[locale]
    : WHATSAPP_MESSAGES.course[locale];
  const whatsappLink = channels.whatsappUrl
    ? whatsappHref(channels.whatsappUrl, message)
    : null;
  const bookingLink =
    isConsultancy && channels.bookingUrl
      ? withBookingPrefill(channels.bookingUrl, buyerEmail)
      : null;
  const embedLink =
    isConsultancy && channels.bookingEmbedUrl
      ? withBookingPrefill(channels.bookingEmbedUrl, buyerEmail)
      : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSuccessHidden(true)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-labelledby="payment-success-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-green-500/30 bg-[#0a0f1e] p-8 shadow-[0_0_60px_rgba(34,197,94,0.25)]"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/40 bg-green-500/20">
          <CheckCircle2 size={36} className="text-green-400" />
        </div>
        <h2
          id="payment-success-title"
          className="mb-4 text-center text-2xl font-bold text-white"
        >
          {copy.successTitle}
        </h2>

        <SuccessBody
          locale={locale}
          productType={productType}
          channels={channels}
          whatsappLink={whatsappLink}
          bookingLink={bookingLink}
        />

        {embedLink && (
          <iframe
            src={embedLink}
            title={copy.calendarTitle}
            className="mt-4 h-[520px] w-full rounded-xl border border-white/10 bg-white"
          />
        )}

        <button
          type="button"
          onClick={() => setSuccessHidden(true)}
          className="mt-4 w-full rounded-xl border border-white/15 py-3 font-bold text-gray-200 transition-colors hover:bg-white/5"
        >
          {copy.close}
        </button>
      </div>
    </div>
  );
}

function SuccessBody({
  locale,
  productType,
  channels,
  whatsappLink,
  bookingLink,
}: {
  locale: SchedulingLocale;
  productType: CheckoutProductType | null;
  channels: PublicContactChannels;
  whatsappLink: string | null;
  bookingLink: string | null;
}) {
  const copy = COPY[locale];

  if (productType === 'consultancy') {
    return (
      <div className="space-y-4 text-left">
        <p className="leading-relaxed text-gray-300">
          {bookingLink ? copy.consultancyCalendar : copy.consultancy}
        </p>
        {bookingLink && (
          <a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-xl bg-yellow-500 py-3 text-center font-bold text-black transition-colors hover:bg-yellow-400"
          >
            {copy.book}
          </a>
        )}
        {whatsappLink && (
          <div className="space-y-1">
            <WhatsAppButton href={whatsappLink} label={copy.whatsapp} />
            {channels.whatsappDisplay && (
              <p className="text-center text-sm text-gray-400">{channels.whatsappDisplay}</p>
            )}
          </div>
        )}
        {channels.email && (
          <p className="text-sm leading-relaxed text-gray-300">
            {copy.emailLead}{' '}
            <a
              href={`mailto:${channels.email}`}
              className="font-semibold text-green-400 hover:underline"
            >
              {channels.email}
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  if (productType === 'course') {
    return (
      <p className="text-left leading-relaxed text-gray-300">
        {copy.course}{' '}
        {whatsappLink && channels.whatsappDisplay && (
          <>
            {copy.courseVia}{' '}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-400 hover:underline"
            >
              {channels.whatsappDisplay}
            </a>{' '}
          </>
        )}
        {channels.email && (
          <>
            {copy.courseOr}{' '}
            <a
              href={`mailto:${channels.email}`}
              className="font-semibold text-green-400 hover:underline"
            >
              {channels.email}
            </a>
          </>
        )}
        .
      </p>
    );
  }

  return (
    <p className="text-left leading-relaxed text-gray-300">
      {copy.generic}
      {channels.email && (
        <>
          {' '}
          <a
            href={`mailto:${channels.email}`}
            className="font-semibold text-green-400 hover:underline"
          >
            {channels.email}
          </a>
        </>
      )}
    </p>
  );
}
