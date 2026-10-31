import { NextRequest, NextResponse } from 'next/server';
import {
  clampStatsDays,
  clicksToCsv,
  dailyClicksToCsv,
  destinationFor,
  normalizeSlug,
  presentedStatsSecrets,
  statsAccess,
} from '@/lib/affiliate';
import { readAffiliateStats } from '@/lib/affiliate-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
};

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: PRIVATE_HEADERS });
}

export async function GET(request: NextRequest) {
  const access = statsAccess(process.env.AFF_STATS_KEY, presentedStatsSecrets(request.headers, request.url));
  if (access === 'missing') return new NextResponse(null, { status: 404, headers: PRIVATE_HEADERS });
  if (access === 'rejected') return json({ ok: false, error: 'Cheie invalidă.' }, 401);

  const params = request.nextUrl.searchParams;
  const rawSlug = params.get('slug');
  let slug: string | undefined;
  if (rawSlug) {
    const normalized = normalizeSlug(rawSlug);
    if (!normalized || !destinationFor(normalized)) {
      return json({ ok: false, error: 'Slug necunoscut.' }, 404);
    }
    slug = normalized;
  }

  try {
    const result = await readAffiliateStats({
      days: clampStatsDays(params.get('days')),
      slug,
      includeEvents: params.get('events') === '1' || params.get('events') === 'true',
    });
    if (!result.ok) return json({ ok: false, error: result.error }, 503);

    if (params.get('format') === 'csv') {
      const csv = result.stats.events ? clicksToCsv(result.stats.events) : dailyClicksToCsv(result.stats.rows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          ...PRIVATE_HEADERS,
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="affiliate-clicks.csv"',
        },
      });
    }

    return new NextResponse(JSON.stringify({ ok: true, ...result.stats }, null, 2), {
      status: 200,
      headers: { ...PRIVATE_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown';
    console.error('[affiliate-stats]', message);
    return json({ ok: false, error: 'Statisticile nu au putut fi citite.' }, 500);
  }
}
