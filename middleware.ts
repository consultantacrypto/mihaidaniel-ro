import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { applyCheckerFrameHeaders } from './lib/verifica-adresa/embed';

const handleI18n = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = await handleI18n(request);
  applyCheckerFrameHeaders(request.nextUrl.pathname, response.headers);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
