type Bucket = number[];

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterMs: number };

export type RateLimiter = {
  check: (key: string, now?: number) => RateLimitResult;
};

/**
 * In-memory sliding window. Keys are expected to already be hashes.
 * Entries older than the window are dropped, so retention stays short.
 * On serverless this limit is per instance, which is enough to slow abuse
 * without a paid store.
 */
export function createRateLimiter(options: { limit: number; windowMs: number }): RateLimiter {
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const windowStart = now - options.windowMs;
      const recent = (buckets.get(key) ?? []).filter((stamp) => stamp > windowStart);
      if (recent.length >= options.limit) {
        buckets.set(key, recent);
        const retryAfterMs = Math.max(0, recent[0] + options.windowMs - now);
        return { ok: false, retryAfterMs };
      }
      recent.push(now);
      buckets.set(key, recent);
      if (buckets.size > 5000) {
        for (const [bucketKey, stamps] of buckets) {
          if (stamps.every((stamp) => stamp <= windowStart)) buckets.delete(bucketKey);
        }
      }
      return { ok: true, remaining: options.limit - recent.length };
    },
  };
}

export const checkRateLimiter = createRateLimiter({ limit: 30, windowMs: 10 * 60 * 1000 });
export const waitlistRateLimiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });
export const checkoutRateLimiter = createRateLimiter({ limit: 8, windowMs: 60 * 60 * 1000 });
