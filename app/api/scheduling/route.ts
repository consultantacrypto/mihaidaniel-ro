import { NextResponse } from 'next/server';
import { getContactChannels } from '@/lib/contact-channels';

export const dynamic = 'force-dynamic';

/** Public scheduling links. No secrets. Missing booking URL is null. */
export async function GET() {
  return NextResponse.json(getContactChannels(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
