import { randomBytes } from 'node:crypto';
import { storeCredentials, type CheckerEnv } from './config';
import type { CheckerOrder, CreditPass } from './report';
import type { ReportDocument } from './report';

const PREFIX = 'ac:v1:';

export function newToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function newPublicId(): string {
  return `QE-${randomBytes(4).toString('hex').toUpperCase()}`;
}

function orderKey(nonce: string): string {
  return `${PREFIX}order:${nonce}`;
}

function sessionKey(sessionId: string): string {
  return `${PREFIX}session:${sessionId}`;
}

function reportKey(token: string): string {
  return `${PREFIX}report:${token}`;
}

function creditKey(token: string): string {
  return `${PREFIX}credit:${token}`;
}

function lockKey(key: string): string {
  return `${PREFIX}lock:${key}`;
}

export interface CheckerStore {
  saveOrder(order: CheckerOrder, ttlSeconds: number): Promise<void>;
  getOrderByNonce(nonce: string): Promise<CheckerOrder | null>;
  bindSession(sessionId: string, nonce: string, ttlSeconds: number): Promise<void>;
  getOrderBySession(sessionId: string): Promise<CheckerOrder | null>;
  saveReport(report: ReportDocument, ttlSeconds: number): Promise<void>;
  getReport(token: string): Promise<ReportDocument | null>;
  saveCredits(pass: CreditPass, ttlSeconds: number): Promise<void>;
  getCredits(token: string): Promise<CreditPass | null>;
  acquireLock(key: string, ttlSeconds: number): Promise<boolean>;
  releaseLock(key: string): Promise<void>;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function createMemoryStore(now: () => number = Date.now): CheckerStore {
  const values = new Map<string, { value: string; expiresAt: number }>();

  const read = (key: string): string | null => {
    const entry = values.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= now()) {
      values.delete(key);
      return null;
    }
    return entry.value;
  };

  const write = (key: string, value: string, ttlSeconds: number) => {
    values.set(key, { value, expiresAt: now() + ttlSeconds * 1000 });
  };

  return {
    async saveOrder(order, ttlSeconds) {
      write(orderKey(order.nonce), JSON.stringify(order), ttlSeconds);
      if (order.stripeSessionId) write(sessionKey(order.stripeSessionId), order.nonce, ttlSeconds);
    },
    async getOrderByNonce(nonce) {
      return parseJson<CheckerOrder>(read(orderKey(nonce)));
    },
    async bindSession(sessionId, nonce, ttlSeconds) {
      const order = parseJson<CheckerOrder>(read(orderKey(nonce)));
      if (!order) throw new Error('Comanda lipsește.');
      order.stripeSessionId = sessionId;
      write(orderKey(nonce), JSON.stringify(order), ttlSeconds);
      write(sessionKey(sessionId), nonce, ttlSeconds);
    },
    async getOrderBySession(sessionId) {
      const nonce = read(sessionKey(sessionId));
      if (!nonce) return null;
      return parseJson<CheckerOrder>(read(orderKey(nonce)));
    },
    async saveReport(report, ttlSeconds) {
      write(reportKey(report.token), JSON.stringify(report), ttlSeconds);
    },
    async getReport(token) {
      return parseJson<ReportDocument>(read(reportKey(token)));
    },
    async saveCredits(pass, ttlSeconds) {
      write(creditKey(pass.token), JSON.stringify(pass), ttlSeconds);
    },
    async getCredits(token) {
      return parseJson<CreditPass>(read(creditKey(token)));
    },
    async acquireLock(key, ttlSeconds) {
      if (read(lockKey(key))) return false;
      write(lockKey(key), '1', ttlSeconds);
      return true;
    },
    async releaseLock(key) {
      values.delete(lockKey(key));
    },
  };
}

async function redisCommand(
  url: string,
  token: string,
  args: Array<string | number>,
  fetchImpl: FetchLike,
): Promise<unknown> {
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Stocarea comenzilor a răspuns cu HTTP ${response.status}.`);
  }
  const payload = (await response.json()) as { result?: unknown; error?: string };
  if (payload.error) throw new Error('Comanda de stocare a eșuat.');
  return payload.result ?? null;
}

export function createUpstashStore(
  credentials: { url: string; token: string },
  fetchImpl: FetchLike = fetch,
): CheckerStore {
  const call = (args: Array<string | number>) =>
    redisCommand(credentials.url, credentials.token, args, fetchImpl);

  const read = async (key: string): Promise<string | null> => {
    const result = await call(['GET', key]);
    return typeof result === 'string' ? result : null;
  };

  const write = async (key: string, value: string, ttlSeconds: number) => {
    await call(['SET', key, value, 'EX', ttlSeconds]);
  };

  return {
    async saveOrder(order, ttlSeconds) {
      await write(orderKey(order.nonce), JSON.stringify(order), ttlSeconds);
      if (order.stripeSessionId) await write(sessionKey(order.stripeSessionId), order.nonce, ttlSeconds);
    },
    async getOrderByNonce(nonce) {
      return parseJson<CheckerOrder>(await read(orderKey(nonce)));
    },
    async bindSession(sessionId, nonce, ttlSeconds) {
      const order = parseJson<CheckerOrder>(await read(orderKey(nonce)));
      if (!order) throw new Error('Comanda lipsește.');
      order.stripeSessionId = sessionId;
      await write(orderKey(nonce), JSON.stringify(order), ttlSeconds);
      await write(sessionKey(sessionId), nonce, ttlSeconds);
    },
    async getOrderBySession(sessionId) {
      const nonce = await read(sessionKey(sessionId));
      if (!nonce) return null;
      return parseJson<CheckerOrder>(await read(orderKey(nonce)));
    },
    async saveReport(report, ttlSeconds) {
      await write(reportKey(report.token), JSON.stringify(report), ttlSeconds);
    },
    async getReport(token) {
      return parseJson<ReportDocument>(await read(reportKey(token)));
    },
    async saveCredits(pass, ttlSeconds) {
      await write(creditKey(pass.token), JSON.stringify(pass), ttlSeconds);
    },
    async getCredits(token) {
      return parseJson<CreditPass>(await read(creditKey(token)));
    },
    async acquireLock(key, ttlSeconds) {
      const result = await call(['SET', lockKey(key), '1', 'NX', 'EX', ttlSeconds]);
      return result === 'OK';
    },
    async releaseLock(key) {
      await call(['DEL', lockKey(key)]);
    },
  };
}

export function getCheckerStore(env: CheckerEnv = process.env): CheckerStore {
  const credentials = storeCredentials(env);
  if (!credentials) {
    throw new Error('Stocarea comenzilor nu este configurată.');
  }
  return createUpstashStore(credentials);
}
