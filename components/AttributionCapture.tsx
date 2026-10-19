'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { captureAttributionFromLocation } from '@/lib/attribution';

function Capture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureAttributionFromLocation();
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
