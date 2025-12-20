// --- 1. DEFINIREA TIPURILOR (STRUCTURA) ---
export type AcademyCategory = 
  | 'BITCOIN & FUNDAMENTE' 
  | 'TRADING & CHARTURI' 
  | 'DEFI & WEB3' 
  | 'SECURITATE & WALLETS' 
  | 'PSIHOLOGIE & CICLE';

export type AcademyItem = {
  slug: string;       
  term: string;       
  image: string;      
  category: AcademyCategory;
  definition: string; 
  analogy: string;    
  mihaiTake: string;  
  fullContent: string;
};

// --- 2. CONȚINUTUL ACADEMIEI ---
export const dictionary: AcademyItem[] = [
  // === ✅ ARTICOL NOU: BITCOIN ===
  {
    slug: "ce-este-bitcoin-ghid-complet",
    term: "Bitcoin (BTC)",
    category: "BITCOIN & FUNDAMENTE",
    image: "/bitcoinacademy.jpg", // Imaginea nouă încărcată de tine
    definition: "Ghidul complet despre Bitcoin. Nu este doar o monedă, este prima formă de proprietate digitală absolută din istoria omenirii.",
    analogy: "Registrul Public Indestructibil. Imaginează-ți un caiet uriaș ținut de milioane de oameni simultan. Nimeni nu poate rupe o pagină din el fără ca toți ceilalți să observe.",
    mihaiTake: "Să înțelegi Bitcoin astăzi este ca și cum ai fi înțeles Internetul în 1995. Pare ciudat, pare complicat, dar este tehnologia care va reseta modul în care funcționează lumea. Nu trebuie să fii expert IT, trebuie doar să înțelegi un lucru: Banii s-au schimbat pentru totdeauna.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Introducere: Ce este Bitcoin, cu adevărat?</h3>
      <p class="mb-4 text-gray-300">Dacă întrebi 10 oameni ce este Bitcoin, vei primi 10 răspunsuri diferite: "Bani de internet", "O schemă piramidală", "Aur Digital". Să simplificăm.</p>
      <p class="text-xl text-white font-medium mb-6 border-l-4 border-orange-500 pl-4">Bitcoin este prima formă de proprietate digitală absolută din istoria omenirii.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Până la Bitcoin:</strong> Dacă aveai bani într-o bancă, banca îi deținea, tu aveai doar o promisiune. Dacă aveai o poză pe Facebook, Facebook o putea șterge.</li>
        <li><strong>După Bitcoin:</strong> Dacă deții cheia privată (parola), nimeni – niciun guvern, nicio bancă, niciun hacker – nu îți poate confisca fondurile. Este "Bani separați de Stat".</li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Tehnologia: Cum funcționează fără șefi? (Blockchain)</h3>
      <p class="mb-4 text-gray-300">Cum poți avea un sistem financiar fără o bancă centrală? Răspunsul este o inovație numită <strong>Blockchain</strong> (Lanț de Blocuri).</p>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-6">
        <strong class="text-blue-400 block mb-2">Explicația Simplă: Registrul Public</strong>
        <p class="text-gray-300">Imaginează-ți un caiet uriaș în care sunt scrise toate tranzacțiile. În loc să fie ținut într-un seif la Banca Națională, copii ale lui sunt deținute de milioane de oameni simultan. Dacă eu vreau să trimit 1 Bitcoin, toți verifică caietele lor. Dacă toți sunt de acord, tranzacția se scrie.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Tokenomics: Matematica Rarității</h3>
      <p class="mb-4 text-gray-300">Aici stă geniul lui Satoshi Nakamoto. Bitcoin este programat să fie anti-inflaționist.</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-orange-500/20">
            <strong class="text-orange-400 block mb-2">Limita de 21 Milioane</strong>
            <p class="text-sm text-gray-400">Nu vor exista niciodată mai mult de 21.000.000 de Bitcoin. Spre deosebire de Dolari care se tipăresc infinit, Bitcoin este finit.</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Halving-ul</strong>
            <p class="text-sm text-gray-400">La fiecare 4 ani, producția de Bitcoin nou se înjumătățește. Oferta scade, cererea crește = Prețul Urcă.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Use Case: La ce e bun?</h3>
      <p class="mb-4 text-gray-300">Bitcoin are două funcții majore care evoluează în timp:</p>
      <ul class="list-disc pl-6 mb-6 space-y-4 text-gray-300">
        <li><strong>Store of Value (Aur Digital):</strong> Faza actuală. Oamenii cumpără Bitcoin pentru a-și proteja averea de inflație pe termen lung (5-10 ani). Este contul de economii suprem.</li>
        <li><strong>Medium of Exchange (Plăți):</strong> Pe măsură ce tehnologia avansează (Lightning Network), devine o monedă pentru plăți instantanee globale.</li>
      </ul>
      <p class="italic text-gray-400 mb-6">Exemplu: Să trimiți 1 Miliard $ duminică seara prin bancă durează 3 zile și costă mii de dolari. Prin Bitcoin durează 10 minute și costă câțiva dolari.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. De ce contează? Libertate.</h3>
      <p class="mb-4 text-gray-300">Dincolo de preț, Bitcoin este o mișcare pentru Libertate. Într-o lume în care guvernele pot îngheța conturile, Bitcoin este singura "ușă de ieșire".</p>
      <p class="text-white font-bold">Este un sistem financiar neutral. Bitcoin nu știe dacă ești alb sau negru, rus sau american. El doar procesează tranzacții valide.</p>
    `
  },

  // === RĂMÂN CELELALTE ARTICOLE (PLACEHOLDER SAU VIITOARE) ===
  {
    slug: "rsi-relative-strength-index-explicat",
    term: "RSI (Indicator)",
    category: "TRADING & CHARTURI",
    image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop",
    definition: "Relative Strength Index (RSI) este cel mai popular indicator de trading. Îți spune când prețul este 'prea sus' sau 'prea jos'.",
    analogy: "Turometrul Pieței. Dacă acul e pe roșu (peste 70), motorul fierbe și trebuie să încetinească.",
    mihaiTake: "Nu cumpăra niciodată când RSI e 80 pe Daily! Asta înseamnă FOMO. Profesioniștii vând când RSI e sus.",
    fullContent: `<p>Conținutul despre RSI urmează să fie actualizat...</p>`
  },
  {
    slug: "ce-este-ethereum-smart-contracts",
    term: "Ethereum (ETH)",
    category: "DEFI & WEB3",
    image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
    definition: "Ethereum nu este doar o monedă, este un calculator global. Află cum funcționează Smart Contracts și DeFi.",
    analogy: "Petrolul Digital. Bitcoin e Aurul, Ethereum e Petrolul care alimentează mașinăria DeFi.",
    mihaiTake: "Fără Ethereum, nu am avea NFT-uri, nu am avea Uniswap. Este fundația internetului viitorului (Web3).",
    fullContent: `<p>Conținutul despre Ethereum urmează să fie actualizat...</p>`
  }
];

// --- 3. LISTA TOOLTIPS (NU O SCHIMBĂM) ---
export const terms: Record<string, string> = {
  "Bitcoin": "Aur Digital. Rețea descentralizată, limitată la 21 milioane unități.",
  "Ethereum": "Platformă de Smart Contracts. Fundația DeFi și Web3.",
  "RSI": "Indicator (0-100). Peste 70 = Scump, Sub 30 = Ieftin.",
  "Blockchain": "Registru public distribuit, imposibil de falsificat.",
  "DeFi": "Finanțe Descentralizate. Bănci fără bancheri.",
  "Wallet": "Portofel digital unde îți ții cheile private.",
  "Halving": "Eveniment la 4 ani care reduce inflația Bitcoin la jumătate."
};

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