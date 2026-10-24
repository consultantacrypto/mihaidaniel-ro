import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { DISCLAIMER, PRIVACY_NOTE, formatRoDateTime } from './copy';
import { categoryLabel, exposureExtra, exposureLabel, levelLabel, signalLabel } from './risk-labels';
import type { ReportDocument } from './report';
import { OPERATOR_LINE } from './sources';

/**
 * Inter 4.1 static TTFs (OFL). They include Basic Latin, Latin-1 and Latin
 * Extended, so Romanian ă â î ș ț render in any viewer. The previous files
 * were a latin-ext unicode-range slice: they contained "A" but not "a", â or î,
 * so viewers drew empty boxes.
 */
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const HEADER_H = 78;
const FOOTER_LIMIT = 96;

const NAVY = rgb(0.027, 0.043, 0.078);
const INK = rgb(0.09, 0.12, 0.18);
const MUTED = rgb(0.37, 0.41, 0.47);
const GOLD = rgb(0.776, 0.631, 0.353);
const RULE = rgb(0.86, 0.88, 0.91);
const CARD = rgb(1, 1, 1);
const PAPER = rgb(0.965, 0.969, 0.976);
const WHITE = rgb(1, 1, 1);
const CREAM = rgb(0.98, 0.95, 0.88);
const HIGH = rgb(0.7, 0.15, 0.12);
const MID = rgb(0.72, 0.42, 0.08);
const LOW = rgb(0.05, 0.42, 0.28);

let regularBytes: Uint8Array | null = null;
let boldBytes: Uint8Array | null = null;

function readFont(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(process.cwd(), 'lib/verifica-adresa/fonts', name)));
}

type Ctx = {
  doc: PDFDocument;
  page: PDFPage;
  pages: PDFPage[];
  y: number;
  font: PDFFont;
  bold: PDFFont;
};

function widthOf(font: PDFFont, text: string, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

function splitToken(token: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (widthOf(font, token, size) <= maxWidth) return [token];
  const parts: string[] = [];
  let current = '';
  for (const ch of token) {
    const next = current + ch;
    if (widthOf(font, next, size) <= maxWidth) current = next;
    else {
      if (current) parts.push(current);
      current = ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const token of text.split(/\s+/).filter(Boolean)) {
    for (const part of splitToken(token, font, size, maxWidth)) {
      const next = current ? `${current} ${part}` : part;
      if (widthOf(font, next, size) <= maxWidth) current = next;
      else {
        if (current) lines.push(current);
        current = part;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function scoreTone(score: number | null) {
  if (score === null) return MUTED;
  if (score >= 70) return HIGH;
  if (score >= 40) return MID;
  return LOW;
}

function paintHeader(ctx: Ctx): void {
  const { page, font, bold } = ctx;
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: PAPER });
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - HEADER_H, width: PAGE_WIDTH, height: HEADER_H, color: NAVY });
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - HEADER_H, width: PAGE_WIDTH, height: 3, color: GOLD });
  page.drawText('QuickExit, LLC', {
    x: MARGIN,
    y: PAGE_HEIGHT - 34,
    size: 15,
    font: bold,
    color: WHITE,
  });
  page.drawText('Verificare portofel crypto', {
    x: MARGIN,
    y: PAGE_HEIGHT - 54,
    size: 9,
    font: font,
    color: GOLD,
  });
  const brand = 'mihaidaniel.ro';
  page.drawText(brand, {
    x: PAGE_WIDTH - MARGIN - widthOf(font, brand, 10),
    y: PAGE_HEIGHT - 34,
    size: 10,
    font,
    color: WHITE,
  });
  const kind = 'Raport de risc';
  page.drawText(kind, {
    x: PAGE_WIDTH - MARGIN - widthOf(font, kind, 9),
    y: PAGE_HEIGHT - 54,
    size: 9,
    font,
    color: rgb(0.78, 0.82, 0.88),
  });
  ctx.y = PAGE_HEIGHT - HEADER_H - 26;
}

function addPage(ctx: Ctx): void {
  ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.pages.push(ctx.page);
  paintHeader(ctx);
}

function ensure(ctx: Ctx, height: number): void {
  if (ctx.y - height < FOOTER_LIMIT) addPage(ctx);
}

function text(
  ctx: Ctx,
  value: string,
  options?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number; width?: number; x?: number },
): void {
  const size = options?.size ?? 10;
  const font = options?.bold ? ctx.bold : ctx.font;
  const color = options?.color ?? INK;
  const x = options?.x ?? MARGIN;
  const maxWidth = options?.width ?? CONTENT_WIDTH;
  const lineH = size + 4;
  for (const line of wrap(value, font, size, maxWidth)) {
    ensure(ctx, lineH);
    ctx.page.drawText(line, { x, y: ctx.y, size, font, color });
    ctx.y -= lineH;
  }
  ctx.y -= options?.gap ?? 8;
}

function section(ctx: Ctx, title: string, follow = 18): void {
  ensure(ctx, 32 + follow);
  ctx.page.drawText(title.toLocaleUpperCase('ro-RO'), {
    x: MARGIN,
    y: ctx.y,
    size: 9,
    font: ctx.bold,
    color: NAVY,
  });
  ctx.y -= 7;
  ctx.page.drawRectangle({ x: MARGIN, y: ctx.y, width: 42, height: 1.6, color: GOLD });
  ctx.y -= 16;
}

function metaGrid(ctx: Ctx, items: Array<[string, string]>): void {
  const colW = (CONTENT_WIDTH - 12) / 2;
  const rowH = 38;
  for (let i = 0; i < items.length; i += 2) {
    ensure(ctx, rowH);
    const top = ctx.y;
    for (let col = 0; col < 2; col += 1) {
      const item = items[i + col];
      if (!item) continue;
      const x = MARGIN + col * (colW + 12);
      ctx.page.drawText(item[0], { x, y: top, size: 7.5, font: ctx.bold, color: MUTED });
      ctx.page.drawText(item[1], { x, y: top - 14, size: 10, font: ctx.bold, color: INK });
    }
    ctx.y = top - rowH;
  }
}

function paintFooter(page: PDFPage, font: PDFFont, bold: PDFFont, report: ReportDocument, index: number, total: number): void {
  page.drawRectangle({ x: MARGIN, y: 82, width: CONTENT_WIDTH, height: 0.8, color: GOLD });
  let y = 68;
  for (const line of wrap(DISCLAIMER, font, 7, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN, y, size: 7, font, color: MUTED });
    y -= 9;
  }
  page.drawText(OPERATOR_LINE, { x: MARGIN, y: 30, size: 7, font, color: MUTED });
  page.drawText(report.publicId, { x: MARGIN, y: 16, size: 8, font: bold, color: NAVY });
  const when = formatRoDateTime(report.createdAt);
  page.drawText(when, {
    x: MARGIN + widthOf(bold, report.publicId, 8) + 14,
    y: 16,
    size: 8,
    font,
    color: MUTED,
  });
  const pageLabel = `${index + 1} / ${total}`;
  page.drawText(pageLabel, {
    x: PAGE_WIDTH - MARGIN - widthOf(font, pageLabel, 8),
    y: 16,
    size: 8,
    font,
    color: MUTED,
  });
}

function scoreCards(ctx: Ctx, report: ReportDocument): void {
  const sanctions = report.sanctions;
  const risk = report.risk;
  if (!sanctions || !risk) return;
  const height = 118;
  const gap = 12;
  const cardW = (CONTENT_WIDTH - gap) / 2;
  ensure(ctx, height + 8);
  const bottom = ctx.y - height;
  const accent = sanctions.sanctioned ? HIGH : LOW;
  const tone = scoreTone(risk.score);

  ctx.page.drawRectangle({
    x: MARGIN,
    y: bottom,
    width: cardW,
    height,
    color: CARD,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  ctx.page.drawRectangle({ x: MARGIN, y: bottom, width: 3, height, color: tone });
  ctx.page.drawText('SCOR DE RISC', { x: MARGIN + 16, y: bottom + height - 22, size: 8, font: ctx.bold, color: MUTED });
  const scoreText = risk.score === null ? '—' : String(risk.score);
  ctx.page.drawText(scoreText, { x: MARGIN + 16, y: bottom + 48, size: 32, font: ctx.bold, color: tone });
  const scoreW = widthOf(ctx.bold, scoreText, 32);
  ctx.page.drawText('/ 100', { x: MARGIN + 22 + scoreW, y: bottom + 56, size: 11, font: ctx.font, color: MUTED });
  ctx.page.drawText(`Nivel ${levelLabel(risk.level)}`, {
    x: MARGIN + 16,
    y: bottom + 32,
    size: 10,
    font: ctx.bold,
    color: INK,
  });
  const barW = cardW - 32;
  const fill = risk.score === null ? 0 : Math.max(0, Math.min(100, risk.score)) / 100;
  ctx.page.drawRectangle({ x: MARGIN + 16, y: bottom + 16, width: barW, height: 6, color: rgb(0.9, 0.91, 0.93) });
  if (fill > 0) {
    ctx.page.drawRectangle({ x: MARGIN + 16, y: bottom + 16, width: Math.max(4, barW * fill), height: 6, color: tone });
  }

  const right = MARGIN + cardW + gap;
  ctx.page.drawRectangle({
    x: right,
    y: bottom,
    width: cardW,
    height,
    color: CARD,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  ctx.page.drawRectangle({ x: right, y: bottom, width: 3, height, color: accent });
  ctx.page.drawText('LISTE DE SANCȚIUNI', { x: right + 16, y: bottom + height - 22, size: 8, font: ctx.bold, color: MUTED });
  const headlineLines = wrap(sanctions.headline, ctx.bold, 16, cardW - 32);
  let hy = bottom + 62;
  for (const line of headlineLines.slice(0, 2)) {
    ctx.page.drawText(line, { x: right + 16, y: hy, size: 16, font: ctx.bold, color: accent });
    hy -= 20;
  }
  const sub = sanctions.sanctioned ? 'Potrivire exactă în listele consultate.' : 'Nicio potrivire exactă în listele consultate.';
  const subLines = wrap(sub, ctx.font, 9, cardW - 32);
  let sy = bottom + 28;
  for (const line of subLines.slice(0, 2)) {
    ctx.page.drawText(line, { x: right + 16, y: sy, size: 9, font: ctx.font, color: MUTED });
    sy -= 12;
  }
  ctx.y = bottom - 16;
}

export async function buildReportPdf(report: ReportDocument): Promise<Uint8Array> {
  if (!regularBytes) regularBytes = readFont('Inter-Regular.ttf');
  if (!boldBytes) boldBytes = readFont('Inter-SemiBold.ttf');

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`Verificare portofel crypto ${report.publicId}`);
  doc.setAuthor('QuickExit, LLC');
  doc.setCreator('mihaidaniel.ro');
  doc.setSubject('Raport de risc pentru adresă crypto');

  const font = await doc.embedFont(regularBytes, { subset: true });
  const bold = await doc.embedFont(boldBytes, { subset: true });
  const ctx: Ctx = { doc, page: null as unknown as PDFPage, pages: [], y: 0, font, bold };
  addPage(ctx);

  if (report.sample) {
    const bannerH = 42;
    ensure(ctx, bannerH + 8);
    const bottom = ctx.y - bannerH + 10;
    ctx.page.drawRectangle({
      x: MARGIN,
      y: bottom,
      width: CONTENT_WIDTH,
      height: bannerH,
      color: CREAM,
      borderColor: GOLD,
      borderWidth: 0.8,
    });
    ctx.page.drawText('EXEMPLU · DATE FICTIVE', {
      x: MARGIN + 12,
      y: bottom + 24,
      size: 9,
      font: bold,
      color: rgb(0.45, 0.32, 0.08),
    });
    ctx.page.drawText('Cifrele și potrivirile nu provin dintr-o verificare.', {
      x: MARGIN + 12,
      y: bottom + 10,
      size: 8.5,
      font,
      color: rgb(0.4, 0.32, 0.14),
    });
    ctx.y = bottom - 16;
  }

  text(ctx, 'Verifică portofelul înainte să trimiți bani', { size: 18, bold: true, gap: 4 });
  text(ctx, report.sample ? 'Document ilustrativ' : 'Livrat după plată', { size: 10, color: MUTED, gap: 14 });

  metaGrid(ctx, [
    ['ID RAPORT', report.publicId],
    ['DATA VERIFICĂRII', formatRoDateTime(report.createdAt)],
    ['DISPONIBIL PÂNĂ LA', formatRoDateTime(report.expiresAt)],
    ['SURSA CERERII', report.source],
  ]);

  const addressLines = wrap(report.address || '—', font, 10, CONTENT_WIDTH - 28);
  const addressH = 36 + addressLines.length * 14;
  ensure(ctx, addressH + 8);
  const addressBottom = ctx.y - addressH;
  ctx.page.drawRectangle({
    x: MARGIN,
    y: addressBottom,
    width: CONTENT_WIDTH,
    height: addressH,
    color: CARD,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  ctx.page.drawText(`ADRESĂ CRYPTO · ${report.networkLabel || report.network}`, {
    x: MARGIN + 14,
    y: addressBottom + addressH - 16,
    size: 7.5,
    font: bold,
    color: MUTED,
  });
  let ay = addressBottom + addressH - 32;
  for (const line of addressLines) {
    ctx.page.drawText(line, { x: MARGIN + 14, y: ay, size: 10, font, color: INK });
    ay -= 14;
  }
  ctx.y = addressBottom - 18;

  if (report.status !== 'ready' || !report.sanctions || !report.risk) {
    section(ctx, 'Livrare');
    text(ctx, report.failureReason ?? 'Raportul nu a fost livrat.');
    if (report.refundId) {
      text(ctx, 'ID RAMBURSARE', { size: 8, bold: true, color: MUTED, gap: 2 });
      text(ctx, report.refundId);
    }
  } else {
    scoreCards(ctx, report);
    text(ctx, report.sanctions.explanation, { size: 10, gap: 8 });
    text(
      ctx,
      'Scorul și categoriile vin de la furnizorul de risc. Nu sunt o concluzie a operatorului.',
      { size: 8.5, color: MUTED, gap: 12 },
    );

    section(ctx, 'Surse');
    for (const source of report.sanctions.sources) {
      const when = source.publishedOn ? `listă publicată ${source.publishedOn}` : `preluată ${source.fetchedOn}`;
      const flags = [
        `Verificare ${source.fetchedOn}`,
        when,
        source.matched ? 'potrivire' : 'fără potrivire',
        source.stale ? 'listă mai veche de 48 de ore' : '',
      ].filter(Boolean);
      text(ctx, source.name, { size: 10, bold: true, gap: 2 });
      text(ctx, flags.join(' · '), { size: 8.5, color: MUTED, gap: 8 });
    }

    if (report.risk.labels.length) {
      section(ctx, 'Semnale');
      for (const label of report.risk.labels) text(ctx, signalLabel(label), { gap: 3 });
    }

    if (report.risk.exposures.length) {
      section(ctx, 'Expunere', 52);
      for (const item of report.risk.exposures) {
        const extra = exposureExtra(item).replaceAll(' | ', ' · ');
        const headline = `${categoryLabel(item.category)} · ${exposureLabel(item.exposure)}${extra ? ` · ${extra}` : ''}`;
        const headLines = wrap(headline, ctx.bold, 10, CONTENT_WIDTH);
        const detailLines = item.detail ? wrap(item.detail, ctx.font, 8.5, CONTENT_WIDTH) : [];
        ensure(ctx, headLines.length * 14 + detailLines.length * 12.5 + 8);
        text(ctx, headline, { size: 10, bold: true, gap: 2 });
        if (item.detail) text(ctx, item.detail, { size: 8.5, color: MUTED, gap: 8 });
        else ctx.y -= 6;
      }
    }

    section(ctx, 'Înainte să trimiți');
    for (const tip of report.sanctions.tips) text(ctx, tip, { size: 9, gap: 5 });
    text(ctx, report.sanctions.chainabuseLabel, { size: 9, gap: 2 });
    text(ctx, report.sanctions.chainabuseUrl, { size: 8, color: MUTED, gap: 8 });
  }

  section(ctx, 'Notă');
  text(ctx, PRIVACY_NOTE, { size: 8.5, color: MUTED, gap: 6 });
  text(ctx, `Operator: ${OPERATOR_LINE}.`, { size: 8.5, color: MUTED, gap: 4 });

  const total = ctx.pages.length;
  ctx.pages.forEach((page, index) => paintFooter(page, font, bold, report, index, total));
  return doc.save();
}
