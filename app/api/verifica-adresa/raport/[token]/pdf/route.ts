import { NextResponse } from 'next/server';
import { frameAncestorsValue, isPublicToken } from '@/lib/verifica-adresa/embed';
import { buildReportPdf } from '@/lib/verifica-adresa/pdf';
import { getCheckerStore } from '@/lib/verifica-adresa/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  if (!isPublicToken(token)) {
    return NextResponse.json({ ok: false, error: 'Link invalid.' }, { status: 404 });
  }
  try {
    const report = await getCheckerStore().getReport(token);
    if (!report || report.sample) {
      return NextResponse.json({ ok: false, error: 'Raportul nu există sau a expirat.' }, { status: 404 });
    }
    const pdf = await buildReportPdf(report);
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="raport-${report.publicId}.pdf"`,
        'cache-control': 'private, no-store',
        'content-security-policy': `frame-ancestors ${frameAncestorsValue()}`,
        'referrer-policy': 'no-referrer',
      },
    });
  } catch (error) {
    console.error('[verifica-adresa] PDF-ul nu a putut fi generat.', error);
    return NextResponse.json({ ok: false, error: 'PDF-ul nu a putut fi generat.' }, { status: 500 });
  }
}
