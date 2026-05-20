import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_EMAIL } from '@/lib/seo/constants';

export const dynamic = 'force-dynamic';

const FROM_EMAIL = 'Mihai Daniel <contact@mihaidaniel.ro>';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildInquiryEmailHtml(data: {
  agencyName: string;
  budget: string;
  timeline: string;
  email: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-top: 0;">New partnership inquiry</h2>
      <p><strong>Agency:</strong> ${escapeHtml(data.agencyName)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #666; font-size: 12px;">Sent via mihaidaniel.ro/en/partnerships</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agencyName, budget, timeline, email } = body as {
      agencyName?: unknown;
      budget?: unknown;
      timeline?: unknown;
      email?: unknown;
    };

    if (
      typeof agencyName !== 'string' ||
      !agencyName.trim() ||
      typeof budget !== 'string' ||
      !budget.trim() ||
      typeof timeline !== 'string' ||
      !timeline.trim() ||
      typeof email !== 'string' ||
      !isValidEmail(email.trim())
    ) {
      return NextResponse.json(
        { error: 'Please fill in all fields with a valid email.' },
        { status: 400 }
      );
    }

    const resend = getResendClient();
    if (!resend) {
      console.error('[partnership-inquiry] RESEND_API_KEY missing');
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const payload = {
      agencyName: agencyName.trim(),
      budget: budget.trim(),
      timeline: timeline.trim(),
      email: email.trim().toLowerCase(),
    };

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: payload.email,
      subject: `Partnership inquiry: ${payload.agencyName}`,
      html: buildInquiryEmailHtml(payload),
    });

    if (error) {
      console.error('[partnership-inquiry] Resend error:', error);
      return NextResponse.json(
        { error: 'Could not send inquiry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[partnership-inquiry] Exception:', error);
    return NextResponse.json(
      { error: 'Internal error. Please try again.' },
      { status: 500 }
    );
  }
}
