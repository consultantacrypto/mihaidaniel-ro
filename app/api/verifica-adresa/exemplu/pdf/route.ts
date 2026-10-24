import { NextResponse } from 'next/server';
import { frameAncestorsValue } from '@/lib/verifica-adresa/embed';
import { buildReportPdf } from '@/lib/verifica-adresa/pdf';
import { sampleReport } from '@/lib/verifica-adresa/sample-report';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const pdf = await buildReportPdf(sampleReport());
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="raport-exemplu.pdf"',
      'cache-control': 'public, max-age=3600',
      'content-security-policy': `frame-ancestors ${frameAncestorsValue()}`,
      'referrer-policy': 'no-referrer',
    },
  });
}
