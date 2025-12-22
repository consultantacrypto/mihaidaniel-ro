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
  // === ✅ ARTICOL: BITCOIN (FUNDAMENTE) ===
  {
    slug: "ce-este-bitcoin-ghid-complet",
    term: "Bitcoin (BTC)",
    category: "BITCOIN & FUNDAMENTE",
    image: "/bitcoinacademy.jpg", 
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

  // === ✅ ARTICOL NOU: ETHEREUM (DEFI & WEB3) ===
  {
    slug: "ce-este-ethereum-ghid-suprem",
    term: "Ethereum (ETH)",
    category: "DEFI & WEB3",
    image: "/ethereumexplicat.jpg",
    definition: "Ghidul Suprem. Ethereum nu este doar o monedă, este un 'World Computer'. Dacă Bitcoin este Nokia, Ethereum este iPhone-ul pe care se construiesc aplicațiile viitorului.",
    analogy: "Nokia vs iPhone. Bitcoin este telefonul robust, bun pentru apeluri (plăți). Ethereum este smartphone-ul pe care instalezi aplicații (DApps, DeFi, NFT).",
    mihaiTake: "Bitcoin ne-a dat banii digitali. Ethereum ne-a dat economia digitală. Astăzi, pe Ethereum se construiesc finanțele viitorului. Dacă Bitcoin este Regele, Ethereum este Regatul.",
    fullContent: `
        <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Ce este Ethereum? (Definiția Simplă vs. Tehnică)</h3>
        <p class="mb-4 text-gray-300">Majoritatea oamenilor cred că Ethereum este doar "a doua cea mai mare criptomonedă după Bitcoin". Este o înțelegere limitată.</p>
        
        <div class="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 mb-6">
            <strong class="text-purple-400 block mb-2">Analoga Simplă:</strong>
            <p class="text-gray-300">Gândește-te la Bitcoin ca la un telefon Nokia vechi (excelent pentru apeluri/plăți, robust, indestructibil). Gândește-te la Ethereum ca la un iPhone. Are valoare intrinsecă, dar adevărata lui putere vine din faptul că dezvoltatorii pot construi aplicații (Apps) pe el.</p>
        </div>

        <p class="mb-4 text-gray-300"><strong>Definiția Tehnică:</strong> Ethereum este un blockchain programabil, o platformă globală open-source pentru aplicații descentralizate (dApps). Este un "World Computer" (Computer Mondial) care nu poate fi oprit sau cenzurat.</p>
        <p class="mb-6 text-gray-300"><strong>Moneda:</strong> Numele rețelei este Ethereum. Numele monedei pe care o cumperi este Ether (ETH). Ether este "combustibilul" (gas) care plătește pentru utilizarea acestui computer global.</p>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Geneza: Băiatul Geniu și Viziunea (2013-2015)</h3>
        <p class="mb-4 text-gray-300">Istoria Ethereum începe cu un adolescent: Vitalik Buterin. În 2013, și-a dat seama că Bitcoin are o limitare majoră: era proiectat doar pentru bani. Vitalik a propus comunității Bitcoin să adauge un limbaj de programare complex. Comunitatea a refuzat.</p>
        <p class="italic text-gray-400 mb-4">Așa că Vitalik a spus celebra frază: "Fine, I'll do it myself" (Bine, o fac singur).</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li><strong>2013:</strong> Vitalik publică "Ethereum Whitepaper".</li>
            <li><strong>2014:</strong> Are loc vânzarea inițială (ICO), unde 1 BTC cumpăra 2.000 ETH (o investiție legendară azi).</li>
            <li><strong>30 Iulie 2015:</strong> Se lansează rețeaua ("Frontier"). Lumea crypto se schimbă pentru totdeauna.</li>
        </ul>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Inovația Supremă: Smart Contracts</h3>
        <p class="mb-4 text-gray-300">Aceasta este "sosul secret" al Ethereum. Un Smart Contract este un cod informatic care se execută singur atunci când sunt îndeplinite anumite condiții. Nu are nevoie de avocat, notar sau bancă.</p>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-[#0a0f1e] p-4 rounded-lg border border-red-500/20">
                <strong class="text-red-400 block mb-2">Lumea Veche</strong>
                <p class="text-sm text-gray-400">Vrei să vinzi o casă. Ai nevoie de agent, notar, bancă, cadastru. Durează luni, costă mii de euro.</p>
            </div>
            <div class="bg-[#0a0f1e] p-4 rounded-lg border border-green-500/20">
                <strong class="text-green-400 block mb-2">Ethereum</strong>
                <p class="text-sm text-gray-400">Scrii un contract inteligent: "Dacă A trimite 100 ETH, Token-ul casei se transferă automat la A, banii la B." Instant, transparent.</p>
            </div>
        </div>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Istoria Zbuciumată</h3>
        <p class="mb-4 text-gray-300">Ethereum nu a avut un drum lin. A trecut prin foc și sabie.</p>
        <ul class="space-y-4 text-gray-300">
            <li><strong>A. The DAO Hack (2016):</strong> Prima mare aplicație a fost hackuită (50M $). Comunitatea a dat timpul înapoi (Hard Fork) pentru a recupera banii. Așa s-a născut Ethereum Classic (ETC) - cei care au refuzat schimbarea.</li>
            <li><strong>B. ICO Boom (2017):</strong> Oricine putea crea o monedă nouă. A dus la o manie globală, cimentând Ethereum ca standard al industriei.</li>
            <li><strong>C. DeFi Summer (2020) & NFT Craze (2021):</strong> Ethereum a demonstrat că poate înlocui băncile (Uniswap) și galeriile de artă (NFT).</li>
            <li><strong>D. The Merge (2022):</strong> Cel mai complex eveniment. Trecerea de la Proof of Work (Minare) la Proof of Stake. Consumul de energie a scăzut cu 99.95%.</li>
        </ul>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Tokenomics: "Ultra Sound Money"</h3>
        <p class="mb-4 text-gray-300">După upgrade-ul EIP-1559 și The Merge, economia ETH s-a schimbat fundamental.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li><strong>Staking:</strong> Dacă blochezi ETH pentru securitate, primești dobândă. ETH devine "Internet Bond".</li>
            <li><strong>The Burn (Arderea):</strong> La fiecare tranzacție, o parte din taxă este distrusă.</li>
            <li><strong>Deflație:</strong> În activitate intensă, oferta totală scade. Asta face ETH "Ultra Sound Money".</li>
        </ul>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">6. Problema și Soluția: Layer 2</h3>
        <p class="mb-4 text-gray-300">Ethereum a devenit victima propriului succes (taxe mari). Soluția actuală este <strong>Layer 2 (L2)</strong>.</p>
        <p class="mb-4 text-gray-300">Imaginează-ți Ethereum ca pe o autostradă sigură dar lentă. L2 (Arbitrum, Optimism) sunt autobuze rapide deasupra autostrăzii. Procesează mii de tranzacții ieftin, apoi scriu rezultatul final pe Ethereum.</p>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">7. Concluzie: De ce Ethereum este Inevitabil</h3>
        <p class="mb-4 text-gray-300">Bitcoin ne-a dat banii digitali. Ethereum ne-a dat economia digitală.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li><strong>Finanțe:</strong> Stablecoins de trilioane de dolari.</li>
            <li><strong>Tokenizarea Activelor:</strong> BlackRock lansează fonduri pe Ethereum.</li>
            <li><strong>Identitate Digitală:</strong> Web3 și controlul datelor.</li>
        </ul>
        <p class="text-white font-bold border-l-4 border-purple-500 pl-4">Ethereum nu este perfect. Dar este singurul computer global descentralizat care a supraviețuit tuturor atacurilor. Dacă Bitcoin este Regele, Ethereum este Regatul.</p>
    `
  },
// === ✅ ARTICOL NOU: PORTOFELE & SECURITATE ===
  {
    slug: "portofele-crypto-hot-vs-cold-ghid",
    term: "Hot vs. Cold Wallets",
    category: "SECURITATE & WALLETS",
    image: "/hotcoldwalletacademie.jpg",
    definition: "Ghidul de Supraviețuire. Portofelul tău crypto NU conține niciun Bitcoin, ci doar cheile de acces. Învață diferența critică dintre a ține banii 'în buzunar' (Hot) și 'în seif' (Cold).",
    analogy: "Bani de buzunar vs. Seiful Băncii. Un Hot Wallet (telefon) este portofelul cu mărunțiș pentru cafea. Un Cold Wallet (Ledger) este seiful îngropat în pământ unde ții lingourile de aur.",
    mihaiTake: "Să deții crypto fără un Cold Wallet este ca și cum ai ține lingouri de aur pe o bancă în parc. Libertatea vine cu responsabilitate. Fii propria ta bancă, nu doar un client al ei.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Marea Concepție Greșită: Unde sunt banii tăi?</h3>
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-6">
        <p class="text-gray-300 mb-2">Primul lucru pe care trebuie să-l afli o să te șocheze: <strong class="text-white">Portofelul tău crypto NU conține niciun Bitcoin.</strong></p>
        <p class="text-gray-300">Spre deosebire de un portofel fizic, un portofel crypto (Wallet) este de fapt un <strong>Breloc de Chei</strong>.</p>
        <ul class="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li><strong>Blockchain-ul</strong> este seiful comun, aflat pe internet, care conține toți banii.</li>
            <li><strong>Portofelul tău</strong> conține doar Cheia Privată (parola) care îți permite să muți banii din acel seif.</li>
        </ul>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Tipuri de Portofele: Fierbinți vs. Reci</h3>
      <p class="mb-6 text-gray-300">Aici se face diferența între "bani de cheltuială" și "avere".</p>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20 relative overflow-hidden">
            <div class="absolute top-2 right-2 text-2xl opacity-20">🔥</div>
            <strong class="text-red-400 block mb-2 text-lg">A. Hot Wallets (Fierbinți)</strong>
            <p class="text-xs text-gray-500 mb-3 uppercase">Ex: MetaMask, Phantom, Trust Wallet</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Ce sunt:</strong> Aplicații pe telefon sau extensii conectate permanent la internet.</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Riscuri:</strong> Vulnerabile la hackeri, viruși și link-uri malițioase.</p>
            <p class="text-sm text-white font-bold mt-3 border-t border-white/10 pt-2">Regula: Ține aici doar bani de cheltuială.</p>
         </div>

         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-cyan-500/20 relative overflow-hidden">
            <div class="absolute top-2 right-2 text-2xl opacity-20">❄️</div>
            <strong class="text-cyan-400 block mb-2 text-lg">B. Cold Wallets (Reci)</strong>
            <p class="text-xs text-gray-500 mb-3 uppercase">Ex: Ledger, Trezor, Tangem</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Ce sunt:</strong> Dispozitive fizice (stick USB) care țin cheile OFFLINE.</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Siguranță:</strong> Hackerul nu poate apăsa butonul fizic de la distanță.</p>
            <p class="text-sm text-white font-bold mt-3 border-t border-white/10 pt-2">Regula: Aici se ține averea (HODL).</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Cele 12 Cuvinte: Seed Phrase</h3>
      <div class="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/30 mb-6 relative">
         <strong class="text-yellow-400 block mb-4 text-xl">⚠️ Regulile de Aur</strong>
         <p class="text-gray-300 mb-4">Când îți creezi un portofel, primești 12-24 de cuvinte. Aceasta este "Cheia Master". Cine are cuvintele, are banii.</p>
         <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-2"><span class="text-red-500 font-bold">1.</span> Nu le scrie niciodată digital (poze, notițe, mail).</li>
            <li class="flex items-start gap-2"><span class="text-green-500 font-bold">2.</span> Scrie-le pe hârtie sau metal și ascunde-le.</li>
            <li class="flex items-start gap-2"><span class="text-white font-bold">3.</span> Niciun "Suport Tehnic" nu îți va cere vreodată cele 12 cuvinte.</li>
         </ul>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Custodial vs. Non-Custodial</h3>
      <ul class="space-y-4 text-gray-300 mb-6">
        <li class="bg-white/5 p-4 rounded-lg">
            <strong>Custodial (Bursa/Exchange):</strong> Când ții banii pe Binance. Ei au cheia. Dacă dau faliment (FTX), pierzi tot. Tu ai doar o promisiune (IOU).
        </li>
        <li class="bg-white/5 p-4 rounded-lg">
            <strong>Non-Custodial (Self-Custody):</strong> Când muți banii pe Ledger. Tu ai cheia. Tu ești responsabil. Dacă pierzi cuvintele, nu există "Reset Password".
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Cum să nu fii jefuit: Igiena Digitală</h3>
      <p class="mb-4 text-gray-300">Securitatea nu este un soft, este un comportament.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Burner Wallets:</strong> Vrei să cumperi un NFT dubios? Folosește un portofel gol, nu pe cel principal.</li>
        <li><strong>Address Poisoning:</strong> Verifică mereu primele și ultimele 4 caractere ale adresei unde trimiți.</li>
        <li><strong>Nu te grăbi:</strong> O tranzacție greșită în crypto este ireversibilă.</li>
      </ul>
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