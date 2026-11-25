'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ConsultancyPackageId } from '@/lib/consultancy-packages';
import { startCheckout } from '@/lib/checkout';

type ConsultancyCheckoutButtonProps = {
  packageId: ConsultancyPackageId;
  label: string;
  ariaLabel: string;
  trackingLabel?: string;
  fullWidth?: boolean;
};

export default function ConsultancyCheckoutButton({
  packageId,
  label,
  ariaLabel,
  trackingLabel = 'consultanta_page_stripe',
  fullWidth = false,
}: ConsultancyCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const tCommon = useTranslations('common');

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await startCheckout('consultancy', trackingLabel, packageId);
    } catch (error) {
      console.error('[ConsultancyCheckout] Checkout error:', error);
      alert(error instanceof Error ? error.message : tCommon('checkoutError'));
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-3 rounded-xl bg-yellow-500 px-8 py-4 text-lg font-bold text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70 ${
        fullWidth ? 'w-full' : 'w-full sm:w-auto'
      }`}
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
