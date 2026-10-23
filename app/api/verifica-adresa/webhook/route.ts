import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { fulfillPaidOrder } from '@/lib/verifica-adresa/fulfillment';
import { productionFulfillDeps } from '@/lib/verifica-adresa/runtime';
import { getQuickexitStripe, planAddressCheckerFulfillment } from '@/lib/verifica-adresa/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * QuickExit Stripe webhook. Verifies the signature, then delivers the report
 * or the credit pass. A second delivery of the same session does not call
 * MistTrack again and does not create a second refund.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.QUICKEXIT_STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret || !process.env.QUICKEXIT_STRIPE_SECRET_KEY?.trim()) {
    return NextResponse.json({ ok: false, error: 'Webhook-ul QuickExit nu este configurat.' }, { status: 503 });
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
    data: {
      object: event.data.object as {
        id?: string;
        payment_status?: string | null;
        metadata?: Record<string, string> | null;
        payment_intent?: string | { id?: string | null } | null;
      },
    },
  });

  if (plan.action !== 'fulfill') {
    return NextResponse.json({ received: true, fulfilled: false, action: plan.action });
  }

  try {
    const deps = await productionFulfillDeps();
    const order = await fulfillPaidOrder(
      {
        nonce: plan.checkoutNonce,
        stripeSessionId: plan.sessionId,
        paymentIntentId: plan.paymentIntentId,
      },
      deps,
    );
    return NextResponse.json({
      received: true,
      fulfilled: order.status !== 'pending',
      status: order.status,
      source: order.source,
    });
  } catch (error) {
    console.error('[verifica-adresa] Webhook-ul nu a putut livra raportul.', error);
    return NextResponse.json({ ok: false, error: 'Livrarea nu a putut fi finalizată.' }, { status: 500 });
  }
}
