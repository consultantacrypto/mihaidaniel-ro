import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import {
  isCheckoutSessionId,
  purchaseEventFromSession,
} from '@/lib/purchase-event';

export const dynamic = 'force-dynamic';

/**
 * Confirms a Checkout session is paid before the browser sends GA4 `purchase`.
 * Visiting `?success=true` without a paid session returns `{ paid: false }`.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id');

  if (!isCheckoutSessionId(sessionId)) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[checkout/verify] STRIPE_SECRET_KEY lipsește');
    return NextResponse.json(
      { paid: false, error: 'Configurare plată indisponibilă.' },
      { status: 500 }
    );
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const purchase = purchaseEventFromSession(session);
    if (!purchase) {
      return NextResponse.json({ paid: false });
    }

    return NextResponse.json(
      { paid: true, ...purchase },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[checkout/verify] Sesiunea nu a putut fi citită:', error);
    return NextResponse.json({ paid: false }, { status: 404 });
  }
}
