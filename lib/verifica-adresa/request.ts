import { safeEqual, sha256Hex } from './hash';
import type { CheckerEnv } from './config';

/** Hash only. The raw IP is not stored. */
export function clientIpHash(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim() || 'unknown';
  return sha256Hex(`verifica-adresa-v1|${ip}`);
}

export function cronAuthorized(request: Request, env: CheckerEnv = process.env): boolean {
  const secret = env.CRON_SECRET?.trim();
  if (!secret) return env.NODE_ENV !== 'production';
  const header = request.headers.get('authorization') ?? '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  return safeEqual(token, secret);
}
