import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { AFFILIATE_REDIRECT_HEADERS, isPrefetchRequest, performAffiliateRedirect } from '@/lib/affiliate';
import { recordAffiliateClick } from '@/lib/affiliate-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: Promise<{ slug: string }> };

async function redirectSlug(request: NextRequest, slug: string) {
  const outcome = await performAffiliateRedirect({
    slug,
    searchParams: request.nextUrl.searchParams,
    referrer: request.headers.get('referer'),
    userAgent: request.headers.get('user-agent'),
    prefetch: isPrefetchRequest(request.headers),
    newId: () => randomBytes(9).toString('base64url'),
    record: (click) => recordAffiliateClick(click),
  });

  if (outcome.status === 404) {
    return new NextResponse('Link necunoscut.', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...AFFILIATE_REDIRECT_HEADERS,
      },
    });
  }

  const response = NextResponse.redirect(outcome.location, 302);
  // Set the exact string. validateURL() currently keeps Tangem's literal "&",
  // and this assignment keeps it that way if the URL serializer later encodes it.
  response.headers.set('Location', outcome.location);
  for (const [key, value] of Object.entries(AFFILIATE_REDIRECT_HEADERS)) response.headers.set(key, value);
  return response;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  return redirectSlug(request, slug);
}

export async function HEAD(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  return redirectSlug(request, slug);
}
