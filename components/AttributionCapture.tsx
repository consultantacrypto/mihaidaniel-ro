'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { captureAttributionFromLocation, syncAttributionWithConsent } from '@/lib/attribution';
import { onConsentChange } from '@/lib/consent';

function Capture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureAttributionFromLocation();
    syncAttributionWithConsent();
    return onConsentChange(() => {
      syncAttributionWithConsent();
    });
  }, [searchParams]);

  return null;
}

export default function AttributionCapture() {
  return (
    <Suspense fallback={null}>
      <Capture />
    </Suspense>
  );
}
