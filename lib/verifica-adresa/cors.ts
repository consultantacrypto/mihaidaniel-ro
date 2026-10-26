import { NextResponse } from 'next/server';
import { isAllowedEmbedOrigin } from './embed';
import type { CheckerEnv } from './config';

export function corsHeaders(request: Request, env: CheckerEnv = process.env): Record<string, string> {
  const origin = request.headers.get('origin')?.replace(/\/$/, '') ?? '';
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (!origin || !isAllowedEmbedOrigin(origin, env)) return headers;
  headers['Access-Control-Allow-Origin'] = origin;
  headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type';
  headers['Access-Control-Max-Age'] = '86400';
  return headers;
}

export function applyCors(request: Request, response: NextResponse, env?: CheckerEnv): NextResponse {
  for (const [name, value] of Object.entries(corsHeaders(request, env))) {
    response.headers.set(name, value);
  }
  return response;
}

export function corsPreflight(request: Request, env?: CheckerEnv): NextResponse {
  return applyCors(request, new NextResponse(null, { status: 204 }), env);
}

export function jsonCors(
  request: Request,
  body: unknown,
  init?: { status?: number; headers?: Record<string, string> },
): NextResponse {
  const response = NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: init?.headers,
  });
  return applyCors(request, response);
}
