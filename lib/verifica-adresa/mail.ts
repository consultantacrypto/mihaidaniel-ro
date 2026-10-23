import { Resend } from 'resend';
import type { CheckerEnv } from './config';
import { OPERATOR_LINE } from './sources';

export type ReportMailInput = {
  to: string;
  url: string;
  publicId: string;
  kind: 'report' | 'credits' | 'refund';
};

export type ReportMail = (input: ReportMailInput) => Promise<'sent' | 'skipped' | 'failed'>;

const SUBJECTS: Record<ReportMailInput['kind'], string> = {
  report: 'Raportul tău de risc',
  credits: 'Linkul pachetului de verificări',
  refund: 'Raportul nu a putut fi livrat',
};

function bodyFor(input: ReportMailInput): string {
  const intro =
    input.kind === 'credits'
      ? `Pachetul ${input.publicId} este activ. Linkul de mai jos este cheia verificărilor. Păstrează-l; nu poate fi ghicit.`
      : input.kind === 'refund'
        ? `Nu am putut livra raportul ${input.publicId}. Plata este marcată pentru rambursare. Detaliile sunt pe pagina de mai jos.`
        : `Raportul ${input.publicId} este gata. Linkul este valabil o perioadă limitată.`;
  return `${intro}\n\n${input.url}\n\nOperator: ${OPERATOR_LINE}\nPagina este găzduită pe mihaidaniel.ro.\n`;
}

/** Uses the site's existing Resend key. If it is missing, delivery stays on screen. */
export function createReportMail(env: CheckerEnv = process.env): ReportMail {
  return async (input) => {
    const apiKey = env.RESEND_API_KEY?.trim();
    if (!apiKey || !input.to) return 'skipped';
    try {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from: 'QuickExit <contact@mihaidaniel.ro>',
        to: input.to,
        subject: `${SUBJECTS[input.kind]} ${input.publicId}`,
        text: bodyFor(input),
      });
      if (result.error) return 'failed';
      return 'sent';
    } catch (error) {
      console.error('[verifica-adresa] Emailul cu linkul nu a putut fi trimis.', error);
      return 'failed';
    }
  };
}
