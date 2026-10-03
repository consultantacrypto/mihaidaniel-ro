'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startCheckout } from '@/lib/checkout';

type ConsultancyCheckoutButtonProps = {
  label: string;
  ariaLabel: string;
  trackingLabel?: string;
  className?: string;
};

export default function ConsultancyCheckoutButton({
  label,
  ariaLabel,
  trackingLabel = 'consultanta_page_stripe',
  className = '',
}: ConsultancyCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const tCommon = useTranslations('common');

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await startCheckout('consultancy', trackingLabel);
    } catch (error) {
      console.error('[ConsultancyCheckout] Checkout error:', error);
      alert(
        error instanceof Error ? error.message : tCommon('checkoutError')
      );
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      aria-label={ariaLabel}
      className={`inline-flex w-full sm:w-auto items-center justify-center gap-3 px-10 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold text-lg transition-colors ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          {tCommon('processing')}
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={20} />
        </>
      )}
    </button>
  );
}
