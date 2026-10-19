import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getContactChannels } from '@/lib/contact-channels';
import { buildConsultancyEmailHtml, buildCourseEmailHtml } from '@/lib/purchase-email';
import { inboxEmail } from '@/lib/scheduling';
import { getStripe } from '@/lib/stripe';
import type { CheckoutProductType } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendPurchaseEmail(
  to: string,
  productType: CheckoutProductType,
  customerName?: string | null
): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.error('[webhook] RESEND_API_KEY lipsește — emailul nu a fost trimis');
    return;
  }

  const channels = getContactChannels();
  const isConsultancy = productType === 'consultancy';
  const subject = isConsultancy
    ? 'Confirmare Consultanță VIP - Mihai Daniel'
    : 'Acces Curs Trading Crypto Premium - Mihai Daniel';
  const html = isConsultancy
    ? buildConsultancyEmailHtml(channels, customerName)
    : buildCourseEmailHtml(channels, customerName);

  const { error } = await resend.emails.send({
    from: 'Mihai Daniel <contact@mihaidaniel.ro>',
    to,
    replyTo: inboxEmail(channels),
    subject,
    html,
  });

  if (error) {
    console.error('[webhook] Eroare Resend:', error);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET lipsește');
    return NextResponse.json(
      { error: 'Webhook neconfigurat.' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Lipsește semnătura Stripe.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('[webhook] Verificare semnătură eșuată:', error);
    return NextResponse.json(
      { error: 'Semnătură webhook invalidă.' },
      { status: 400 }
    );
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const productType = session.metadata?.type as CheckoutProductType | undefined;

  console.log('[webhook] Plată finalizată:', {
    sessionId: session.id,
    customerEmail,
    customerName,
    productType,
    clientReferenceId: session.client_reference_id,
    utm_source: session.metadata?.utm_source,
    utm_medium: session.metadata?.utm_medium,
    utm_campaign: session.metadata?.utm_campaign,
    utm_content: session.metadata?.utm_content,
  });

  if (
    customerEmail &&
    (productType === 'course' || productType === 'consultancy')
  ) {
    try {
      await sendPurchaseEmail(customerEmail, productType, customerName);
    } catch (error) {
      console.error('[webhook] Excepție la trimiterea emailului:', error);
    }
  } else {
    console.warn('[webhook] Email sau tip produs lipsă — email ne trimis');
  }

  return NextResponse.json({ received: true });
}
