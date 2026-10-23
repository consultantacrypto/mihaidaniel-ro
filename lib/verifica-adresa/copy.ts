import { OPERATOR_LINE } from './sources';
import type { Network } from './networks';

export const PAGE_TITLE = 'Verifică adresa crypto înainte să trimiți banii';

export const PAGE_DESCRIPTION =
  'Raport plătit de risc pentru o adresă crypto (BTC, ETH, TRON sau SOL): listele OFAC și UE, scor de risc și expunere la mixere, hack-uri și scheme de fraudă. Informativ, fără garanție.';

export const PAGE_LEAD =
  'Un raport pentru o singură adresă crypto. Înainte de plată vezi doar dacă formatul portofelului crypto este valid și pe ce rețea se află.';

export const PAGE_LEAD_NOTE =
  'Listele de sancțiuni și scorul de risc se livrează după plată, pe ecran și într-un PDF.';

export const INPUT_LABEL = 'Adresă de portofel';

export const INPUT_HINT =
  'Detectăm automat rețeaua: Bitcoin (inclusiv bech32), Ethereum și alte rețele EVM, TRON, Solana.';

export const INPUT_PLACEHOLDER = 'bc1… / 0x… / T… / adresă Solana';

export const SUBMIT_LABEL = 'Continuă către plată';

export const SUBMIT_PENDING = 'Se verifică…';

export const EMPTY_ADDRESS = 'Introdu o adresă de portofel.';

export const INVALID_ADDRESS =
  'Format nerecunoscut. Poți verifica adrese BTC (inclusiv bech32), ETH/EVM, TRON și SOL. Verifică să nu lipsească sau să prisosească caractere.';

export const RATE_LIMIT_MESSAGE =
  'Prea multe verificări într-un interval scurt. Încearcă din nou în câteva minute.';

export const GENERIC_ERROR = 'Verificarea nu a putut fi finalizată. Încearcă din nou.';

export const NETWORK_LABELS: Record<Network, string> = {
  btc: 'Bitcoin',
  evm: 'Ethereum / EVM',
  tron: 'TRON',
  sol: 'Solana',
};

export const CHAINABUSE_LABEL = 'Vezi rapoartele publice de pe Chainabuse pentru această adresă';

export const SAFETY_TIPS = [
  'USDT (Tether) poate fi înghețat de emitent după un schimb P2P, dacă fondurile sunt raportate. Un transfer confirmat nu înseamnă că monedele rămân utilizabile.',
  'Confirmă rețeaua înainte de trimitere (de exemplu TRC-20 față de ERC-20). O adresă EVM poate primi fonduri pe mai multe lanțuri.',
  'Pentru un destinatar nou, trimite întâi o sumă mică și verifică unde a ajuns.',
  'O adresă absentă din listele de sancțiuni poate avea totuși expunere la servicii de amestecare sau la incidente publicate de alte persoane.',
  'Nu partaja seed phrase-ul și nu semna o tranzacție pe care nu o înțelegi.',
] as const;

export const SAFETY_TITLE = 'Înainte să trimiți';

export const DISCLAIMER =
  'Rezultatul este informativ și probabilistic. Nu garantează că o adresă este sau nu este implicată într-o activitate restricționată și nu constituie consultanță financiară, juridică sau de conformitate. Listele pot fi incomplete, iar actualizarea lor poate întârzia.';

export const OPERATOR_NOTE = `Operatorul și comerciantul este ${OPERATOR_LINE}. Pagina este găzduită pe mihaidaniel.ro și poate fi încorporată pe stirilecrypto.ro. Plata se face prin Stripe Checkout, pe contul QuickExit, LLC.`;

export const PRIVACY_NOTE =
  'Adresa nu este stocată împreună cu adresa IP. În Stripe trimitem doar un hash al adresei, nu adresa în clar. Pentru scorul de risc, adresa este transmisă furnizorului. Raportul rămâne disponibil printr-un link care nu poate fi ghicit, pentru o perioadă limitată, apoi este șters. Dacă lași un email, îl folosim doar ca să îți trimitem linkul.';

export const OFAC_LICENSE_NOTE =
  'Lista OFAC SDN este o lucrare a guvernului SUA și este în domeniul public. Lista UE este fișierul public consolidat al Comisiei Europene.';

export const PAY_BUTTON = 'Plătește și primește raportul';

export const PAY_UNAVAILABLE = 'Plata nu este disponibilă pe acest mediu.';

export const CONSENT_LABEL =
  'Solicit livrarea imediată a raportului digital și confirm că îmi pierd dreptul de retragere în 14 zile, conform OUG nr. 34/2014 art. 16 lit. m, din momentul în care livrarea începe.';

export const CONSENT_REQUIRED =
  'Bifează consimțământul pentru livrarea imediată a conținutului digital înainte de plată.';

export const ADDRESS_REQUIRED = 'Introdu adresa pentru care vrei raportul. Un raport acoperă o singură adresă.';

export const EMAIL_INVALID = 'Emailul nu pare valid. Lasă câmpul gol dacă nu vrei să primești linkul pe email.';

export const EMAIL_HINT = 'Opțional. Îl folosim doar ca să îți trimitem linkul raportului.';

export const PACK_ADDRESS_REJECTED =
  'Pachetul nu verifică o adresă la plată. După plată primești un link privat, iar fiecare verificare consumă un credit doar dacă raportul este gata.';

export const PACK_NOTE =
  'Pachetul îți dă un link privat cu mai multe verificări. Un credit se consumă doar după ce raportul este livrat.';

export const PREVIEW_ONLY =
  'Înainte de plată nu există verdict de sancțiuni și nici scor de risc. Primești doar rețeaua detectată.';

export const REFUND_PENDING_MESSAGE =
  'Raportul nu a putut fi generat. Furnizorul de risc nu a răspuns după mai multe încercări. Plata este marcată pentru rambursare. Nu am livrat un rezultat parțial.';

export const REFUNDED_MESSAGE =
  'Raportul nu a putut fi generat. Rambursarea a fost inițiată către metoda de plată folosită în Stripe.';

export const PAYMENTS_STORE_ERROR =
  'Plata este marcată activă, dar stocarea comenzilor nu este configurată.';

export const PAYMENTS_PROVIDER_ERROR =
  'Plata este marcată activă, dar furnizorul de risc nu este configurat.';

export const PAYMENTS_DISABLED_ERROR = 'Plata pentru raportul complet este dezactivată.';

export const PAYMENTS_UNAVAILABLE_ERROR =
  'Plata este marcată activă, dar contul Stripe QuickExit nu este configurat.';

export const PAYMENT_SUCCESS = 'Plata este confirmată. Raportul este mai jos.';

export const PAYMENT_CANCELLED = 'Plata a fost anulată. Nu s-a încasat nimic.';

export const EMBED_ATTRIBUTION = 'Verificare de adresă crypto găzduită de mihaidaniel.ro';

export const LEGAL_TITLE = 'Notă legală';

export const RESULT_NETWORK = 'Rețea detectată';

export const RESULT_CHECKED = 'Data verificării';

export const RESULT_LISTS = 'Liste consultate';

export const RESULT_MATCHED = 'Surse în care apare';

export const SPONSOR_DISCLOSURE_DEFAULT = 'Link sponsorizat / afiliat';

export function chainabuseUrl(address: string): string {
  return `https://www.chainabuse.com/address/${encodeURIComponent(address)}`;
}

export function formatRoDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatRoDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const text = new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hourCycle: 'h23',
  }).format(date);
  return `${text} UTC`;
}

export function formatUsd(amount: number): string {
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${text} USD`;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} și ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} și ${names[names.length - 1]}`;
}

export function verdictCopy(input: {
  sanctioned: boolean;
  sourceNames: string[];
  checkedOn: string;
}): { verdict: 'DA' | 'NU'; headline: string; explanation: string } {
  const sources = joinNames(input.sourceNames);
  if (input.sanctioned) {
    return {
      verdict: 'DA',
      headline: 'Sancționată: DA',
      explanation: `Adresa apare în ${sources}. Există expunere la sancțiuni, conform listelor consultate la ${input.checkedOn}. Trimiterea de fonduri poate fi restricționată și poate avea consecințe legale. Potrivirea nu descrie întreaga activitate a adresei.`,
    };
  }
  return {
    verdict: 'NU',
    headline: 'Sancționată: NU',
    explanation: `Nu am găsit adresa în ${sources}, la ${input.checkedOn}. Lipsa unei potriviri exacte nu exclude expunere la mixere, incidente de securitate sau scheme de fraudă și nu este o garanție.`,
  };
}

export function priceOrientation(priceLabel: string): string {
  return `Preț orientativ pentru un raport complet: ${priceLabel}.`;
}
