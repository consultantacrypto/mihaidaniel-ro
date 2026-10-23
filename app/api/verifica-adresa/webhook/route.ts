import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getQuickexitStripe, planAddressCheckerFulfillment } from '@/lib/verifica-adresa/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stub. Verifies the QuickExit Stripe signature and recognises
 * product=address_checker. It does not deliver a report and does not
 * call MistTrack. Point Stripe at this URL only after setting
 * QUICKEXIT_STRIPE_SECRET_KEY and QUICKEXIT_STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.QUICKEXIT_STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret || !process.env.QUICKEXIT_STRIPE_SECRET_KEY?.trim()) {
    return NextResponse.json(
      { ok: false, error: 'Webhook-ul QuickExit nu este configurat.', stub: true, fulfilled: false },
      { status: 503 },
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'Lipsește semnătura Stripe.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getQuickexitStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('[verifica-adresa] Semnătură webhook invalidă.', error);
    return NextResponse.json({ ok: false, error: 'Semnătură webhook invalidă.' }, { status: 400 });
  }

  const plan = planAddressCheckerFulfillment({
    type: event.type,
    data: { object: event.data.object as { id?: string; payment_status?: string | null; metadata?: Record<string, string> | null } },
  });

  if (plan.action === 'stub') {
    console.log('[verifica-adresa] Webhook stub, fără livrare.', {
      sessionId: plan.sessionId,
      offerId: plan.offerId,
      credits: plan.credits,
      source: plan.source,
      addressSha256: plan.addressSha256,
    });
  }

  return NextResponse.json({
    received: true,
    stub: true,
    fulfilled: false,
    action: plan.action,
  });
}
