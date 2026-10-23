import { OPERATOR_LINE } from './sources';
import type { Network } from './networks';

export const PAGE_TITLE = 'Verifică adresa crypto înainte să trimiți';

export const PAGE_DESCRIPTION =
  'Verifică gratuit dacă o adresă BTC, ETH, TRON sau SOL apare pe listele publice de sancțiuni OFAC și UE înainte să trimiți fonduri. Rezultat informativ, fără garanție.';

export const PAGE_LEAD =
  'Introdu o adresă de portofel. Îți spunem dacă apare, exact, în listele publice de sancțiuni consultate — înainte să trimiți fonduri.';

export const PAGE_LEAD_NOTE =
  'Verificarea gratuită acoperă doar listele de sancțiuni. Nu măsoară expunerea la mixere, incidente sau scheme de fraudă.';

export const INPUT_LABEL = 'Adresă de portofel';

export const INPUT_HINT =
  'Detectăm automat rețeaua: Bitcoin (inclusiv bech32), Ethereum și alte rețele EVM, TRON, Solana.';

export const INPUT_PLACEHOLDER = 'bc1… / 0x… / T… / adresă Solana';

export const SUBMIT_LABEL = 'Verifică adresa';

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

export const OPERATOR_NOTE = `Operatorul acestui instrument și comerciantul pentru raportul complet de risc (când plata este activată) este ${OPERATOR_LINE}. Pagina este găzduită pe mihaidaniel.ro.`;

export const PRIVACY_NOTE =
  'Adresele verificate nu sunt stocate legate de adresa IP. Limitarea de trafic păstrează doar un hash al IP-ului, pentru câteva minute. Cache-ul listelor conține datele publice ale listelor, nu interogările vizitatorilor.';

export const OFAC_LICENSE_NOTE =
  'Lista OFAC SDN este o lucrare a guvernului SUA și este în domeniul public. Lista UE este fișierul public consolidat al Comisiei Europene.';

export const FULL_REPORT_TITLE = 'Raport complet de risc (în curând)';

export const FULL_REPORT_BODY =
  'Verificarea de mai sus spune doar dacă adresa apare pe listele de sancțiuni. Raportul complet va arăta expunerea la mixere, la incidente de tip hack și la scheme de fraudă, printr-un furnizor specializat. Prețul se stabilește din configurare.';

export const FULL_REPORT_PRICE_NOTE =
  'Sugestia de preț este orientativă. Plata prin Stripe Checkout, pe contul QuickExit, LLC, este dezactivată în această versiune.';

export const FULL_REPORT_PAYMENT_ON =
  'Plata se face prin Stripe Checkout, pe contul QuickExit, LLC. După plată, sesiunea este înregistrată; generarea automată a raportului rămâne oprită în această versiune.';

export const FULL_REPORT_PACKS_NOTE =
  'Pachetele de credite sunt opționale și rămân inactive până când plata este pornită.';

export const WAITLIST_TITLE = 'Anunță-mă când apare raportul complet';

export const WAITLIST_LABEL = 'Email';

export const WAITLIST_BUTTON = 'Vreau să fiu anunțat';

export const WAITLIST_PENDING = 'Se trimite…';

export const WAITLIST_SUCCESS = 'Te-am notat. Îți scriem când raportul complet este disponibil.';

export const WAITLIST_INVALID = 'Introdu o adresă de email validă.';

export const WAITLIST_FAIL = 'Nu am putut înregistra emailul acum.';

export const WAITLIST_MAILTO = 'Trimite emailul direct';

export const PAY_BUTTON = 'Continuă către plată';

export const PAYMENTS_DISABLED_ERROR = 'Plata pentru raportul complet este dezactivată.';

export const PAYMENTS_UNAVAILABLE_ERROR =
  'Plata este marcată activă, dar contul Stripe QuickExit nu este configurat.';

export const PAYMENT_SUCCESS =
  'Stripe a înregistrat sesiunea. Generarea automată a raportului complet nu este încă pornită în această versiune.';

export const PAYMENT_CANCELLED = 'Plata a fost anulată. Nu s-a încasat nimic prin acest flux.';

export const EMBED_ATTRIBUTION = 'Verificare găzduită de mihaidaniel.ro';

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

export function formatUsd(amount: number): string {
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${text} USD`;
}

export function verdictCopy(input: {
  sanctioned: boolean;
  sourceNames: string[];
  checkedOn: string;
}): { verdict: 'DA' | 'NU'; headline: string; explanation: string } {
  const sources = input.sourceNames.join(', ');
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
