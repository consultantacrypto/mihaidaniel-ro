'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';
import type { CheckoutProductType } from '@/lib/stripe';

type FeedbackStatus = 'success' | 'canceled' | null;

const WHATSAPP_URL = 'https://wa.me/40731490099';
const CONTACT_EMAIL = 'consultantacrypto.ro@gmail.com';

function SuccessMessage({ productType }: { productType: CheckoutProductType | null }) {
  if (productType === 'consultancy') {
    return (
      <p className="text-gray-300 leading-relaxed text-left">
        Pentru a stabili data și ora sesiunii, te rugăm să ne scrii un mesaj pe WhatsApp la{' '}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 font-semibold hover:underline"
        >
          +40731490099
        </a>{' '}
        (Mihai Daniel) sau pe email la{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-green-400 font-semibold hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    );
  }

  if (productType === 'course') {
    return (
      <p className="text-gray-300 leading-relaxed text-left">
        Pentru a primi accesul la cursul privat, te rugăm să ne scrii un mesaj cu adresa ta de
        Gmail (folosită pentru contul de YouTube) pe WhatsApp la{' '}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 font-semibold hover:underline"
        >
          +40731490099
        </a>{' '}
        sau pe email la{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-green-400 font-semibold hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    );
  }

  return (
    <p className="text-gray-300 leading-relaxed text-left">
      Îți mulțumim. Verifică adresa de email pentru detaliile de acces sau contactează-ne la{' '}
      <a href={`mailto:${CONTACT_EMAIL}`} className="text-green-400 font-semibold hover:underline">
        {CONTACT_EMAIL}
      </a>
      .
    </p>
  );
}

export default function PaymentFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [productType, setProductType] = useState<CheckoutProductType | null>(null);

  useEffect(() => {
    const isSuccess = searchParams.get('success') === 'true';
    const isCanceled = searchParams.get('canceled') === 'true';
    const typeParam = searchParams.get('type');

    if (isSuccess) {
      setStatus('success');
      if (typeParam === 'course' || typeParam === 'consultancy') {
        setProductType(typeParam);
      }
    } else if (isCanceled) {
      setStatus('canceled');
    }

    if (isSuccess || isCanceled) {
      router.replace('/', { scroll: false });
    }
  }, [searchParams, router]);

  if (!status) {
    return null;
  }

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setStatus(null)}
          aria-hidden
        />
        <div
          role="dialog"
          aria-labelledby="payment-success-title"
          className="relative w-full max-w-lg rounded-2xl border border-green-500/30 bg-[#0a0f1e] p-8 shadow-[0_0_60px_rgba(34,197,94,0.25)]"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>
          <h2
            id="payment-success-title"
            className="text-2xl font-bold text-white mb-4 text-center"
          >
            Plată Confirmată! 🎉
          </h2>
          <div className="mb-6">
            <SuccessMessage productType={productType} />
          </div>
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-colors"
          >
            Închide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-24 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0a0f1e]/95 backdrop-blur-md px-4 py-3 shadow-xl">
        <p className="text-sm text-gray-300 flex-1">
          Plata a fost anulată. Dacă ai întâmpinat probleme, te rugăm să ne contactezi.
        </p>
        <button
          type="button"
          onClick={() => setStatus(null)}
          className="text-gray-500 hover:text-white transition-colors shrink-0"
          aria-label="Închide mesajul"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
