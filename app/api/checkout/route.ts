import { NextResponse } from 'next/server';
import { resolveRequestAttribution } from '@/lib/attribution';
import { buildCheckoutSessionCreateParams } from '@/lib/checkout-session';
import {
  getStripe,
  buildCheckoutLineItem,
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
    const { type, attribution: rawAttribution } = body as {
      type?: unknown;
      attribution?: unknown;
    };

    if (!isCheckoutProductType(type)) {
      return NextResponse.json(
        { error: 'Tip de produs invalid.' },
        { status: 400 }
      );
    }

    let attribution = {};
    try {
      attribution = resolveRequestAttribution(
        rawAttribution,
        request.headers.get('cookie')
      );
    } catch (error) {
      console.error('[checkout] Atribuirea UTM a fost ignorată:', error);
    }

    const session = await getStripe().checkout.sessions.create(
      buildCheckoutSessionCreateParams({
        type,
        baseUrl,
        lineItem: buildCheckoutLineItem(type),
        attribution,
      })
    );

    if (!session.url) {
      console.error('[checkout] Sesiunea Stripe nu a returnat URL');
      return NextResponse.json(
        { error: 'Nu am putut genera linkul de plată.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Expunem mesajul real de la Stripe in log-urile serverului pentru debug.
    const stripeError = error as {
      type?: string;
      code?: string;
      statusCode?: number;
      message?: string;
      raw?: { message?: string };
    };
    console.error('[Stripe Checkout Error]:', {
      message: stripeError?.message,
      type: stripeError?.type,
      code: stripeError?.code,
      statusCode: stripeError?.statusCode,
      raw: stripeError?.raw?.message,
      error,
    });
    return NextResponse.json(
      { error: 'Plata nu a putut fi inițiată. Încearcă din nou.' },
      { status: 500 }
    );
  }
}
