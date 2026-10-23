import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { formatRoDateTime } from './copy';
import { categoryLabel, exposureExtra, exposureLabel, levelLabel, signalLabel } from './risk-labels';
import type { ReportDocument } from './report';
import { OPERATOR_LINE } from './sources';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const NAVY = rgb(0.035, 0.055, 0.1);
const INK = rgb(0.1, 0.12, 0.16);
const MUTED = rgb(0.35, 0.39, 0.45);
const GOLD = rgb(0.62, 0.48, 0.22);
const RULE = rgb(0.86, 0.88, 0.9);
const WHITE = rgb(1, 1, 1);

let regularBytes: Uint8Array | null = null;
let boldBytes: Uint8Array | null = null;

function readFont(name: string): Uint8Array {
  const path = join(process.cwd(), 'lib/verifica-adresa/fonts', name);
  return new Uint8Array(readFileSync(path));
}

type Draw = {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  font: PDFFont;
  bold: PDFFont;
};

function widthOf(font: PDFFont, text: string, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (widthOf(font, next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function newPage(draw: Draw): void {
  draw.page = draw.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  draw.page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 34, width: PAGE_WIDTH, height: 34, color: NAVY });
  draw.page.drawText('QuickExit, LLC', {
    x: MARGIN,
    y: PAGE_HEIGHT - 22,
    size: 10,
    font: draw.bold,
    color: WHITE,
  });
  const brand = 'mihaidaniel.ro';
  draw.page.drawText(brand, {
    x: PAGE_WIDTH - MARGIN - widthOf(draw.font, brand, 10),
    y: PAGE_HEIGHT - 22,
    size: 10,
    font: draw.font,
    color: WHITE,
  });
  draw.y = PAGE_HEIGHT - 58;
}

function ensure(draw: Draw, height: number): void {
  if (draw.y - height < 56) newPage(draw);
}

function paragraph(draw: Draw, text: string, options?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number }) {
  const size = options?.size ?? 10;
  const font = options?.bold ? draw.bold : draw.font;
  const color = options?.color ?? INK;
  const lines = wrap(text, font, size, PAGE_WIDTH - MARGIN * 2);
  ensure(draw, lines.length * (size + 4) + (options?.gap ?? 8));
  for (const line of lines) {
    draw.page.drawText(line, { x: MARGIN, y: draw.y, size, font, color });
    draw.y -= size + 4;
  }
  draw.y -= options?.gap ?? 8;
}

function heading(draw: Draw, text: string) {
  ensure(draw, 28);
  draw.page.drawText(text, { x: MARGIN, y: draw.y, size: 13, font: draw.bold, color: NAVY });
  draw.y -= 8;
  draw.page.drawRectangle({ x: MARGIN, y: draw.y, width: 72, height: 1.5, color: GOLD });
  draw.y -= 16;
}

function row(draw: Draw, label: string, value: string) {
  ensure(draw, 32);
  draw.page.drawText(label, { x: MARGIN, y: draw.y, size: 8, font: draw.bold, color: MUTED });
  draw.y -= 12;
  paragraph(draw, value, { size: 10, gap: 8 });
}

export async function buildReportPdf(report: ReportDocument): Promise<Uint8Array> {
  if (!regularBytes) regularBytes = readFont('Inter-Regular.ttf');
  if (!boldBytes) boldBytes = readFont('Inter-SemiBold.ttf');

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`Raport ${report.publicId}`);
  doc.setAuthor('QuickExit, LLC');
  doc.setCreator('mihaidaniel.ro');
  doc.setSubject('Raport de risc pentru adresa crypto');

  const font = await doc.embedFont(regularBytes, { subset: true });
  const bold = await doc.embedFont(boldBytes, { subset: true });

  const draw: Draw = {
    doc,
    page: doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    y: 0,
    font,
    bold,
  };
  newPage(draw);
  // newPage already added a second page; drop the blank first one.
  doc.removePage(0);
  draw.page = doc.getPages()[0];

  if (report.sample) {
    ensure(draw, 36);
    draw.page.drawRectangle({
      x: MARGIN,
      y: draw.y - 18,
      width: PAGE_WIDTH - MARGIN * 2,
      height: 28,
      color: rgb(0.98, 0.94, 0.84),
      borderColor: GOLD,
      borderWidth: 1,
    });
    draw.page.drawText('EXEMPLU - DATE FICTIVE. Nu este un raport real.', {
      x: MARGIN + 10,
      y: draw.y - 8,
      size: 9,
      font: bold,
      color: GOLD,
    });
    draw.y -= 40;
  }

  paragraph(draw, 'Raport de risc pentru adresa crypto', { size: 18, bold: true, gap: 6 });
  paragraph(draw, report.sample ? 'Document ilustrativ' : 'Livrat după plată', { size: 10, color: MUTED, gap: 12 });

  row(draw, 'ID RAPORT', report.publicId);
  row(draw, 'DATA VERIFICĂRII', formatRoDateTime(report.createdAt));
  row(draw, 'DISPONIBIL PÂNĂ LA', formatRoDateTime(report.expiresAt));
  row(draw, 'SURSA CERERII', report.source);
  row(draw, 'REȚEA', report.networkLabel || report.network);
  row(draw, 'ADRESĂ', report.address || '-');

  if (report.status !== 'ready' || !report.sanctions || !report.risk) {
    heading(draw, 'Livrare');
    paragraph(draw, report.failureReason ?? 'Raportul nu a fost livrat.');
    if (report.refundId) row(draw, 'ID RAMBURSARE', report.refundId);
  } else {
    heading(draw, 'Sancțiuni');
    paragraph(draw, report.sanctions.headline, { size: 14, bold: true, gap: 6 });
    paragraph(draw, report.sanctions.explanation);
    for (const source of report.sanctions.sources) {
      const when = source.publishedOn ? `publicată ${source.publishedOn}` : `preluată ${source.fetchedOn}`;
      paragraph(draw, `${source.name}. Verificare ${source.fetchedOn}. Listă ${when}.${source.stale ? ' Lista este mai veche de 48 de ore.' : ''}`, {
        size: 9,
        color: MUTED,
        gap: 4,
      });
    }

    heading(draw, 'Scor de risc');
    const score = report.risk.score === null ? 'Indisponibil' : String(report.risk.score);
    paragraph(draw, `${score} / 100  |  Nivel: ${levelLabel(report.risk.level)}`, { size: 14, bold: true, gap: 6 });
    paragraph(draw, 'Scorul și categoriile vin de la furnizorul de risc. Nu sunt o concluzie a operatorului și nu înseamnă că adresa este sau nu este implicată într-o activitate anume.', {
      size: 9,
      color: MUTED,
    });

    if (report.risk.labels.length) {
      heading(draw, 'Semnale');
      for (const label of report.risk.labels) {
        paragraph(draw, signalLabel(label), { gap: 3 });
      }
    }

    if (report.risk.exposures.length) {
      heading(draw, 'Expunere');
      for (const item of report.risk.exposures) {
        const extra = exposureExtra(item);
        const detail = item.detail ? ` | ${item.detail}` : '';
        paragraph(
          draw,
          `${categoryLabel(item.category)} | ${exposureLabel(item.exposure)}${extra ? ` | ${extra}` : ''}${detail}`,
          { gap: 4 },
        );
      }
    }

    heading(draw, 'Înainte să trimiți');
    for (const tip of report.sanctions.tips) paragraph(draw, tip, { size: 9, gap: 4 });
  }

  heading(draw, 'Notă');
  paragraph(
    draw,
    'Rezultatul este informativ și probabilistic. Nu garantează că o adresă este sau nu este implicată într-o activitate restricționată și nu constituie consultanță financiară, juridică sau de conformitate. Listele pot fi incomplete, iar actualizarea lor poate întârzia.',
    { size: 9, color: MUTED },
  );
  paragraph(draw, `Operator: ${OPERATOR_LINE}.`, { size: 9, color: MUTED });
  paragraph(
    draw,
    'Adresa nu este stocată împreună cu adresa IP. Stripe primește doar un hash al adresei. Furnizorul de risc primește adresa pentru a calcula scorul.',
    { size: 9, color: MUTED },
  );

  const pages = doc.getPages();
  pages.forEach((page, index) => {
    page.drawRectangle({ x: MARGIN, y: 36, width: PAGE_WIDTH - MARGIN * 2, height: 0.6, color: RULE });
    const footer = `${report.publicId}  |  ${index + 1}/${pages.length}`;
    page.drawText(footer, { x: MARGIN, y: 22, size: 8, font, color: MUTED });
  });

  return doc.save();
}
