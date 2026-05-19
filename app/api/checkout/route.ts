import { NextResponse } from 'next/server';
import {
  stripe,
  CHECKOUT_PRODUCTS,
  type CheckoutProductType,
} from '@/lib/stripe';

export const dynamic = 'force-dynamic';

function isCheckoutProductType(value: unknown): value is CheckoutProductType {
  return value === 'course' || value === 'consultancy';
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[checkout] STRIPE_SECRET_KEY lipsește');
      return NextResponse.json(
        { error: 'Configurare plată indisponibilă.' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error('[checkout] NEXT_PUBLIC_BASE_URL lipsește');
      return NextResponse.json(
        { error: 'Configurare URL indisponibilă.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type } = body as { type?: unknown };

    if (!isCheckoutProductType(type)) {
      return NextResponse.json(
        { error: 'Tip de produs invalid.' },
        { status: 400 }
      );
    }

    const product = CHECKOUT_PRODUCTS[type];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      allow_promotion_codes: true,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: product.unitAmount,
            product_data: {
              name: product.name,
            },
          },
        },
      ],
      success_url: `${baseUrl}/?success=true&type=${type}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        type,
      },
    });

    if (!session.url) {
      console.error('[checkout] Sesiunea Stripe nu a returnat URL');
      return NextResponse.json(
        { error: 'Nu am putut genera linkul de plată.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[checkout] Eroare Stripe:', error);
    return NextResponse.json(
      { error: 'Plata nu a putut fi inițiată. Încearcă din nou.' },
      { status: 500 }
    );
  }
}
