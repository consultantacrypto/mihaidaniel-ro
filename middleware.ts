import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { isAffiliateRedirectPath } from './lib/affiliate';
import { applyCheckerFrameHeaders } from './lib/verifica-adresa/embed';

const handleI18n = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // /r/{slug} is a redirect, not a localized page. next-intl would rewrite it to /ro/r/...
  if (isAffiliateRedirectPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const response = await handleI18n(request);
  applyCheckerFrameHeaders(request.nextUrl.pathname, response.headers);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|r/|.*\\..*).*)'],
};
