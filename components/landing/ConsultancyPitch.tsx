'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Crown, Loader2 } from 'lucide-react';
import { trackBuyConsultancy } from '@/lib/analytics';
import { startCheckout } from '@/lib/checkout';

type ConsultancyPitchProps = {
  title?: string;
  description?: string;
  showPageLink?: boolean;
  /** GA4 event_label for Stripe CTA (e.g. audit-portofoliu_stripe) */
  trackingLabel?: string;
  /** GA4 event_label for link to /consultanta-crypto */
  pageLinkTrackingLabel?: string;
};

export default function ConsultancyPitch({
  title = 'Vrei o analiză aplicată pe portofoliul tău?',
  description =
    'Rezervă o sesiune VIP 1-la-1 de 60 de minute. Audităm pozițiile, stabilim strategia de exit și iei decizii cu claritate — nu cu emoție.',
  showPageLink = true,
  trackingLabel = 'money_page_stripe',
  pageLinkTrackingLabel = 'money_page_consultanta',
}: ConsultancyPitchProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await startCheckout('consultancy', trackingLabel);
    } catch (error) {
      console.error('[ConsultancyPitch]', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Plata nu a putut fi inițiată. Încearcă din nou.'
      );
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-[#1a1500]/80 to-[#0a0f1e] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />
          <div className="relative z-10">
            <Crown className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-70 text-black font-black text-lg rounded-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  <>
                    Rezervă sesiunea — 200 €
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              {showPageLink && (
                <Link
                  href="/consultanta-crypto"
                  onClick={() => trackBuyConsultancy(pageLinkTrackingLabel)}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm underline-offset-4 hover:underline"
                >
                  Vezi detalii complete
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
