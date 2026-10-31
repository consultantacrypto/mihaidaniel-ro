import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isPrefetchRequest, performAffiliateRedirect } from '@/lib/affiliate';
import { recordAffiliateClick } from '@/lib/affiliate-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PRIVATE_HEADERS: Record<string, string> = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
};

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
        ...PRIVATE_HEADERS,
      },
    });
  }

  const response = NextResponse.redirect(outcome.location, 302);
  for (const [key, value] of Object.entries(PRIVATE_HEADERS)) response.headers.set(key, value);
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
