import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { stripe } from '@/lib/stripe';
import type { CheckoutProductType } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const WHATSAPP_DISPLAY = '+40731490099';
const WHATSAPP_URL = 'https://wa.me/40731490099';
const CONTACT_EMAIL = 'consultantacrypto.ro@gmail.com';

function buildConsultancyEmailHtml(customerName?: string | null): string {
  const greeting = customerName ? `Bună, ${customerName},` : 'Bună,';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <p>${greeting}</p>
      <p>Îți mulțumim pentru achiziția sesiunii de <strong>Consultanță VIP Crypto</strong>.</p>
      <p>Pentru a fixa data și ora sesiunii noastre, te rog să îmi trimiți un mesaj pe WhatsApp la
        <a href="${WHATSAPP_URL}">${WHATSAPP_DISPLAY}</a>
        sau să răspunzi la acest email pe adresa
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.
      </p>
      <p>Cu respect,<br/><strong>Mihai Daniel</strong></p>
    </div>
  `;
}

function buildCourseEmailHtml(customerName?: string | null): string {
  const greeting = customerName ? `Bună, ${customerName},` : 'Bună,';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <p>${greeting}</p>
      <p>Îți mulțumim pentru achiziția <strong>Cursului Trading Crypto Premium</strong>.</p>
      <p>Cursul este găzduit privat pe YouTube. Pentru a-ți acorda accesul, te rog să îmi trimiți adresa ta de Gmail
        (asociată contului tău de YouTube) printr-un mesaj pe WhatsApp la
        <a href="${WHATSAPP_URL}">${WHATSAPP_DISPLAY}</a>
        sau răspunzând la acest email
        (<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>).
      </p>
      <p>Cu respect,<br/><strong>Mihai Daniel</strong></p>
    </div>
  `;
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

  const isConsultancy = productType === 'consultancy';
  const subject = isConsultancy
    ? 'Confirmare Consultanță VIP - Mihai Daniel'
    : 'Acces Curs Trading Crypto Premium - Mihai Daniel';
  const html = isConsultancy
    ? buildConsultancyEmailHtml(customerName)
    : buildCourseEmailHtml(customerName);

  const { error } = await resend.emails.send({
    from: 'Mihai Daniel <contact@mihaidaniel.ro>',
    to,
    replyTo: CONTACT_EMAIL,
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
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
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
