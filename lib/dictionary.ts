// --- 1. DEFINIREA TIPURILOR (STRUCTURA) ---
export type AcademyCategory = 
  | 'BITCOIN & FUNDAMENTE' 
  | 'TRADING & CHARTURI' 
  | 'DEFI & WEB3' 
  | 'SECURITATE & WALLETS' 
  | 'PSIHOLOGIE & CICLE';

export type AcademyItem = {
  slug: string;       // Link-ul (ex: ce-este-bitcoin)
  term: string;       // Titlul principal (ex: Bitcoin)
  image: string;      // Imaginea de copertă (mare)
  category: AcademyCategory;
  definition: string; // Descrierea scurtă pentru card (meta description)
  analogy: string;    // "Pe românește" - pentru cutia galbenă
  mihaiTake: string;  // Opinia ta personală - pentru cutia neagră
  fullContent: string;// Conținutul HTML complet (Articolul)
};

// --- 2. TEMPLATE PENTRU ARTICOLE NOI (COPY-PASTE ASTA CÂND SCRII) ---
/*
  {
    slug: "titlu-articol-seo",
    term: "Titlul Vizibil",
    category: "TRADING & CHARTURI",
    image: "/nume-poza.jpg",
    definition: "O propoziție scurtă care apare pe Google și în lista de carduri.",
    analogy: "O comparație simplă din viața reală.",
    mihaiTake: "Sfatul tău direct, ca de la prieten la prieten.",
    fullContent: `
      <p class="text-xl text-white font-medium mb-6">Introducere puternică...</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Subtitlu 1</h3>
      <p class="mb-4">Paragraf explicativ...</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li>Punct 1</li>
        <li>Punct 2</li>
      </ul>
    `
  },
*/

// --- 3. CONȚINUTUL ACADEMIEI ---
export const dictionary: AcademyItem[] = [
  // === CATEGORIA: FUNDAMENTE ===
  {
    slug: "ce-este-bitcoin-ghid-complet",
    term: "Bitcoin (BTC)",
    category: "BITCOIN & FUNDAMENTE",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop", 
    definition: "Ghidul complet despre Bitcoin. Nu este doar o monedă, este prima rețea de proprietate digitală descentralizată din istorie.",
    analogy: "Aur Digital. Gândește-te la el ca la singura bancă din lume pe care nimeni nu o poate închide, nimeni nu o poate controla și unde tu ești singurul proprietar al cheii seifului.",
    mihaiTake: "Tati, Bitcoin nu e 'banii de internet' cu care îți iei cafea. E asigurarea ta împotriva inflației. Când băncile printează bani din nimic, Bitcoin rămâne la fel: 21 de milioane. Punct.",
    fullContent: `
      <p class="text-xl text-white font-medium mb-6">Bitcoin nu este doar o monedă. Este prima dată în istoria umanității când avem un activ digital care nu poate fi copiat, nu poate fi falsificat și nu poate fi oprit.</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Cum funcționează de fapt?</h3>
      <p class="mb-4">Spre deosebire de banii din contul tău bancar, care sunt doar cifre într-o bază de date controlată de bancă, Bitcoin trăiește pe <strong>Blockchain</strong>. Un registru public, transparent, pe care îl deținem cu toții, dar nu îl controlează nimeni.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Descentralizat:</strong> Nu există un CEO Bitcoin. Nu există un sediu central.</li>
        <li><strong>Imuabil:</strong> Odată scrisă o tranzacție, rămâne acolo pe vecie.</li>
        <li><strong>Limitat:</strong> Vor exista doar 21.000.000 de Bitcoin. Niciunul în plus.</li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-8 mb-4">De ce are valoare?</h3>
      <p class="mb-4">Valoarea Bitcoin vine din <strong>Raritate</strong> și <strong>Securitate</strong>. Rețeaua Bitcoin este cea mai puternică rețea de calculatoare din lume (prin Proof of Work).</p>
      
      <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-orange-500 my-6">
        <p class="italic text-gray-300">"Dacă vrei să spargi rețeaua Bitcoin, ai avea nevoie de mai multă energie decât consumă o țară mică. Este practic o fortăreață de energie digitală."</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Halving-ul: Motorul Creșterii</h3>
      <p class="mb-4">La fiecare 4 ani, inflația Bitcoin se înjumătățește automat. Acest eveniment se numește <strong>Halving</strong>. Istoric, anul de după Halving a adus mereu noi maxime istorice (ATH), pentru că oferta scade în timp ce cererea crește.</p>
    `
  },

  // === CATEGORIA: TRADING ===
  {
    slug: "rsi-relative-strength-index-explicat",
    term: "RSI (Indicator)",
    category: "TRADING & CHARTURI",
    image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop",
    definition: "Relative Strength Index (RSI) este cel mai popular indicator de trading. Îți spune când prețul este 'prea sus' sau 'prea jos'.",
    analogy: "Turometrul Pieței. Dacă acul e pe roșu (peste 70), motorul fierbe și trebuie să încetinească. Dacă e jos (sub 30), motorul e la relanti și are loc să accelereze.",
    mihaiTake: "Nu cumpăra niciodată când RSI e 80 pe Daily! Asta înseamnă FOMO (Frică de a pierde ocazia). Profesioniștii vând când RSI e sus și cumpără când RSI e jos și toți plâng.",
    fullContent: `
      <p class="text-xl text-white font-medium mb-6">RSI este busola traderului. Fără el, navighezi legat la ochi. Măsoară viteza și magnitudinea mișcărilor de preț pe o scară de la 0 la 100.</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Cele două zone critice</h3>
      
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div class="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
            <strong class="text-red-400 block text-lg mb-2">Supracumpărare (Overbought) > 70</strong>
            <p class="text-sm text-gray-300">Prețul a crescut prea repede. Cumpărătorii sunt epuizați. Probabilitate mare de corecție (scădere).</p>
        </div>
        <div class="bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
            <strong class="text-green-400 block text-lg mb-2">Supravânzare (Oversold) < 30</strong>
            <p class="text-sm text-gray-300">Prețul a scăzut drastic. Vânzătorii au terminat muniția. Probabilitate mare de respingere (creștere).</p>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Divergența: Secretul Profi</h3>
      <p class="mb-4">Cel mai puternic semnal RSI nu este doar valoarea, ci <strong>Divergența</strong>:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li>Dacă Prețul face un nou Maxim, dar RSI face un Maxim mai mic -> <strong>Divergență Bearish</strong> (Urmează Scădere).</li>
        <li>Dacă Prețul face un nou Minim, dar RSI face un Minim mai mare -> <strong>Divergență Bullish</strong> (Urmează Creștere).</li>
      </ul>
    `
  },

  // === CATEGORIA: DEFI ===
  {
    slug: "ce-este-ethereum-smart-contracts",
    term: "Ethereum (ETH)",
    category: "DEFI & WEB3",
    image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
    definition: "Ethereum nu este doar o monedă, este un calculator global. Află cum funcționează Smart Contracts și DeFi.",
    analogy: "Petrolul Digital. Dacă Bitcoin este Aurul (rezerva de valoare), Ethereum este combustibilul care alimentează toată industria de aplicații descentralizate.",
    mihaiTake: "Fără Ethereum, nu am avea NFT-uri, nu am avea Uniswap, nu am avea Stablecoins. Este fundația internetului viitorului (Web3).",
    fullContent: `
       <p class="text-xl text-white font-medium mb-6">Dacă Bitcoin este calculatorul de buzunar care face un singur lucru perfect (tranzacții), Ethereum este un Smartphone pe care poți instala orice aplicație.</p>
       <h3 class="text-2xl font-bold text-white mt-8 mb-4">Smart Contracts: Avocatul Robot</h3>
       <p class="mb-4">Inovația majoră a lui Vitalik Buterin a fost <strong>Contractul Inteligent</strong>. Acesta este un cod care se execută singur: "DACĂ se întâmplă X, ATUNCI fă Y". Fără intermediari, fără avocați, fără încredere în oameni.</p>
    `
  }
];

// --- 4. LISTA PENTRU TOOLTIPS AUTOMATE (LEGACY) ---
// Aceasta rămâne pentru a genera acele mici ferestre când dai hover pe cuvinte în articole
export const terms: Record<string, string> = {
  "Bitcoin": "Aur Digital. Rețea descentralizată, limitată la 21 milioane unități.",
  "Ethereum": "Platformă de Smart Contracts. Fundația DeFi și Web3.",
  "RSI": "Indicator (0-100). Peste 70 = Scump, Sub 30 = Ieftin.",
  "Blockchain": "Registru public distribuit, imposibil de falsificat.",
  "DeFi": "Finanțe Descentralizate. Bănci fără bancheri.",
  "Wallet": "Portofel digital unde îți ții cheile private.",
  "FOMO": "Fear Of Missing Out. Frica de a pierde ocazia, care te face să cumperi sus."
};

// Funcția de generare automată a tooltips
export function enhanceContent(content: string): string {
  let enhancedContent = content;
  Object.entries(terms).forEach(([term, definition]) => {
    const regex = new RegExp(`(?<!<[^>]*)\\b(${term})\\b(?![^<]*>)`, 'g');
    enhancedContent = enhancedContent.replace(regex, (match) => {
      return `<span class="group relative cursor-help border-b border-dotted border-blue-500 hover:border-blue-400 text-blue-100 transition-colors">${match}<span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-blue-900/95 text-white text-xs rounded-lg shadow-xl border border-blue-500/30 z-50 backdrop-blur-sm pointer-events-none text-center leading-relaxed">${definition}</span></span>`;
    });
  });
  return enhancedContent;
}