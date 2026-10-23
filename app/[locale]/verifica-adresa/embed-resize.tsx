'use client';

import { useEffect } from 'react';

/** Tells the parent frame how tall the checker is. The message is only a number. */
export function EmbedResize({ returnOrigin }: { returnOrigin: string }) {
  useEffect(() => {
    if (window.parent === window) return;
    const send = () => {
      const height = Math.ceil(document.documentElement.scrollHeight);
      if (!Number.isFinite(height)) return;
      window.parent.postMessage({ type: 'verifica-adresa-height', height }, returnOrigin);
    };
    send();
    const observer = new ResizeObserver(send);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [returnOrigin]);

  return null;
}
