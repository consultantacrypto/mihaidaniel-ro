export type LegalSection = { heading: string; paragraphs: string[] };

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Cine vinde raportul',
    paragraphs: [
      'Raportul este vândut de QuickExit, LLC (Delaware), 131 Continental Dr, Suite 305, Newark, DE 19713, US. Pagina este găzduită pe mihaidaniel.ro și poate fi afișată și în interiorul stirilecrypto.ro. Contractul de cumpărare este cu QuickExit, LLC, nu cu site-ul care încorporează pagina.',
    ],
  },
  {
    heading: 'Ce cumperi',
    paragraphs: [
      'Un raport acoperă o singură adresă. Înainte de plată vezi doar dacă formatul este recunoscut și pe ce rețea se află adresa. După plată, raportul conține potrivirea cu listele OFAC SDN și cu lista consolidată de sancțiuni financiare a UE, plus scorul, nivelul și expunerile primite de la furnizorul de risc.',
      'Un pachet înseamnă un număr de verificări, nu un raport gata făcut. Primești un link privat. Fiecare verificare consumă un credit doar dacă raportul a fost livrat.',
    ],
  },
  {
    heading: 'Preț și plată',
    paragraphs: [
      'Prețul în USD este afișat înainte de plată și poate fi schimbat din configurare. Plata se face prin Stripe Checkout, pe contul Stripe al QuickExit, LLC. Nu stocăm numărul cardului. Stripe primește suma, oferta, site-ul de pe care a pornit cererea și un hash al adresei, nu adresa în clar.',
    ],
  },
  {
    heading: 'Livrare imediată și dreptul de retragere',
    paragraphs: [
      'Raportul este conținut digital livrat imediat. Înainte de plată trebuie să bifezi că soliciți livrarea imediată și că înțelegi că îți pierzi dreptul de retragere în 14 zile, conform OUG nr. 34/2014 art. 16 lit. m, din momentul în care livrarea începe. Fără această bifă, plata nu pornește.',
      'Dacă furnizorul de risc nu răspunde după încercări repetate, raportul nu este livrat și plata acelui raport este marcată pentru rambursare. În acest caz nu ți se opune pierderea dreptului de retragere, pentru că livrarea nu a avut loc. La un pachet, o verificare eșuată nu consumă creditul.',
    ],
  },
  {
    heading: 'Ce nu este raportul',
    paragraphs: [
      'Raportul este informativ și probabilistic. Nu garantează că o adresă este sau nu este implicată într-o activitate restricționată. Nu este consultanță financiară, juridică sau de conformitate. Listele pot fi incomplete, iar scorul furnizorului este o evaluare a acestuia, nu o concluzie a QuickExit, LLC.',
    ],
  },
  {
    heading: 'Linkul',
    paragraphs: [
      'Raportul și pachetul se deschid printr-un link care nu poate fi ghicit. Linkul este valabil o perioadă limitată, afișată pe raport, apoi conținutul este șters. Cine are linkul poate vedea raportul. Nu îl trimite mai departe dacă nu vrei asta.',
    ],
  },
  {
    heading: 'Răspundere',
    paragraphs: [
      'În limita permisă de lege, răspunderea QuickExit, LLC pentru o comandă este limitată la suma plătită pentru acea comandă. Nu excludem drepturile consumatorului care nu pot fi înlăturate, inclusiv cele din OUG nr. 34/2014 acolo unde se aplică.',
    ],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Cine prelucrează datele',
    paragraphs: [
      'Operatorul este QuickExit, LLC (Delaware), 131 Continental Dr, Suite 305, Newark, DE 19713, US. Pagina rulează pe mihaidaniel.ro. Dacă pornești verificarea din stirilecrypto.ro, vezi pagina noastră într-un cadru. Adresa introdusă nu este trimisă către stirilecrypto.ro.',
    ],
  },
  {
    heading: 'Ce date folosim',
    paragraphs: [
      'Adresa de portofel și rețeaua detectată, ca să generăm raportul. Momentul consimțământului pentru livrarea imediată. Site-ul de pe care a pornit plata (mihaidaniel.ro sau stirilecrypto.ro). Identificatorul sesiunii Stripe și, dacă plata trebuie returnată, identificatorul rambursării. Opțional, un email, doar ca să îți trimitem linkul.',
    ],
  },
  {
    heading: 'Ce nu legăm',
    paragraphs: [
      'Nu stocăm adresa împreună cu adresa IP. Limitarea de trafic păstrează un hash al IP-ului, separat, pentru câteva minute. În Stripe nu trimitem adresa în clar, ci un hash. Numărul cardului rămâne la Stripe.',
    ],
  },
  {
    heading: 'Cine mai primește adresa',
    paragraphs: [
      'Furnizorul de risc (MistTrack) primește adresa și rețeaua, pentru că altfel nu poate calcula scorul. Listele OFAC și UE sunt consultate local, dintr-o copie publică. Nu trimitem adresa către Trezoreria SUA sau către Comisia Europeană în momentul verificării.',
    ],
  },
  {
    heading: 'Cât păstrăm',
    paragraphs: [
      'Raportul este păstrat până la data afișată pe el, apoi stocarea îl șterge. Comanda (fără a o alătura IP-ului) este păstrată până la 90 de zile, ca să putem rambursa și răspunde unei întrebări. Linkul pachetului expiră la data afișată pe el. Emailul, dacă l-ai lăsat, este folosit pentru trimiterea linkului și nu pentru un buletin de știri.',
    ],
  },
  {
    heading: 'Cereri',
    paragraphs: [
      'Pentru acces sau ștergere scrie la consultantacrypto.ro@gmail.com și include ID-ul raportului. Putem șterge linkul înainte de expirare. Ștergerea nu acoperă înregistrările pe care Stripe este obligat să le păstreze pentru plată.',
    ],
  },
];
