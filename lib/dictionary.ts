// lib/dictionary.ts

// --- 1. DEFINIREA TIPURILOR (STRUCTURA) ---
export type AcademyCategory = 
  | 'BITCOIN & FUNDAMENTE' 
  | 'TRADING & CHARTURI' 
  | 'DEFI & WEB3' 
  | 'SECURITATE & WALLETS' 
  | 'PSIHOLOGIE & CICLE'
  | 'ANALIZĂ FUNDAMENTALĂ';

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

// --- 2. CONȚINUTUL ACADEMIEI (FULL CONTENT) ---
export const dictionary: AcademyItem[] = [
  // === 1. BITCOIN (FUNDAMENTE) ===
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

  // === 2. ETHEREUM (DEFI & WEB3) ===
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

  // === 3. PORTOFELE & SECURITATE ===
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

  // === 4. TOKENOMICS (ANALIZĂ FUNDAMENTALĂ) ===
  {
    slug: "tokenomics-ghid-market-cap-fdv",
    term: "Tokenomics",
    category: "ANALIZĂ FUNDAMENTALĂ",
    image: "/tokenimicsexplicat.jpg",
    definition: "Matematica din spatele câștigurilor. De ce prețul unei monede este o iluzie și ce contează cu adevărat (Market Cap vs FDV).",
    analogy: "Pizza feliată. O pizza tăiată în 100 de felii nu are mai multă mâncare decât una tăiată în 4. Doar feliile (monedele) par mai mici și mai ieftine.",
    mihaiTake: "Dacă vrei să știi dacă o monedă mai poate face 100x, nu te uita la grafic, uită-te la Market Cap. Un 0.00001$ poate fi mult mai scump decât un 60.000$ dacă există trilioane de monede.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Marea Iluzie: "Unit Bias"</h3>
      <p class="mb-4 text-gray-300">Începem cu greșeala #1 a începătorilor: Prejudecata Unității.</p>
      
      <div class="bg-red-900/10 p-6 rounded-xl border border-red-500/20 mb-6">
         <strong class="text-red-400 block mb-2">Gândirea greșită:</strong>
         <p class="text-gray-300 italic mb-2">"Bitcoin e prea scump (90.000$), nu pot lua unul întreg. Mai bine iau XRP că e doar 2$ și poate ajunge și el la 90.000$."</p>
         <p class="text-white font-bold border-t border-red-500/20 pt-2 mt-2">Realitatea: Pentru ca XRP să ajungă la prețul Bitcoin, ar trebui să valoreze mai mult decât toți banii de pe planetă.</p>
      </div>
      <p class="text-gray-300 mb-6">Prețul unei singure monede este irelevant fără context. Este ca și cum ai spune că o felie de pizza e "ieftină" fără să știi dacă pizza a fost tăiată în 4 felii sau în 1.000 de felii.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Formula Sfântă: Market Cap</h3>
      <p class="mb-4 text-gray-300">Valoarea reală a unui proiect nu este Prețul, ci Capitalizarea de Piață.</p>
      
      <div class="bg-[#0a0f1e] p-6 rounded-xl border border-blue-500/30 text-center mb-6">
        <p class="text-2xl text-blue-400 font-mono font-bold mb-2">Market Cap = Preț × Monede în Circulație</p>
        <p class="text-gray-400 text-sm">Ex: Bitcoin are preț mare x număr mic. Meme Coins au preț mic x număr infinit.</p>
      </div>
      <p class="text-gray-300 mb-6"><strong>Regula:</strong> Compară Market Cap-ul, nu prețul. Dacă un proiect nou are deja 10 Miliarde $, e greu să mai facă 100x (ar trebui să devină mai mare ca Facebook).</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Cei 3 Mușchetari ai Ofertei (Supply)</h3>
      <p class="mb-4 text-gray-300">Când citești datele pe CoinGecko, trebuie să înțelegi trei termeni critici:</p>
      <ul class="space-y-4 text-gray-300 mb-6">
         <li class="bg-white/5 p-4 rounded-lg">
            <strong class="text-green-400">🟢 Circulating Supply (În Circulație)</strong>
            <p class="text-sm text-gray-400">Câte monede sunt în piață acum. Asta determină prețul actual.</p>
         </li>
         <li class="bg-white/5 p-4 rounded-lg">
            <strong class="text-yellow-400">🟡 Total Supply (Totalul)</strong>
            <p class="text-sm text-gray-400">Câte monede există, dar unele pot fi blocate sau arse.</p>
         </li>
         <li class="bg-white/5 p-4 rounded-lg">
            <strong class="text-red-400">🔴 Max Supply (Maximul)</strong>
            <p class="text-sm text-gray-400">Câte vor exista vreodată. Bitcoin are 21M. Altele au trilioane sau sunt infinite.</p>
         </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. FDV: The Silent Killer</h3>
      <div class="bg-orange-900/10 p-6 rounded-xl border border-orange-500/20 mb-6 relative">
         <strong class="text-orange-400 block mb-2 text-lg">⚠️ Secretul VC-urilor (Venture Capital)</strong>
         <p class="text-gray-300 mb-4"><strong>FDV (Fully Diluted Valuation) = Preț Actual × Max Supply.</strong></p>
         <p class="text-gray-300">Este valoarea proiectului "în viitor", când toate monedele vor fi deblocate. Multe proiecte noi ("Worldcoin") au un Market Cap mic (par ieftine), dar un FDV monstruos. </p>
         <p class="text-white font-bold mt-2">Lecția: Nu cumpăra proiecte cu FDV uriaș și Market Cap mic. Urmează ani de inflație și vânzări agresive.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Alocarea și Vesting-ul</h3>
      <p class="mb-4 text-gray-300">Înainte să cumperi, verifică cine deține "plăcinta".</p>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
         <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <strong class="text-green-400 block mb-1">✅ Fair Launch (Bun)</strong>
            <p class="text-sm text-gray-400">Majoritatea monedelor sunt la comunitate (ex: Bitcoin).</p>
         </div>
         <div class="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
            <strong class="text-red-400 block mb-1">❌ VC Owned (Rău)</strong>
            <p class="text-sm text-gray-400">20% echipă, 30% investitori privați, doar 10% public. Când investitorii primesc monedele ("Vesting"), prețul se prăbușește.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Nu fi "Exit Liquidity"</h3>
      <p class="mb-4 text-gray-300">Tokenomics este studiul cererii și ofertei.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
         <li>Dacă oferta crește constant (inflație, deblocări), prețul scade.</li>
         <li>Dacă oferta este fixă sau scade (deflație, ca la BTC/ETH), prețul are șanse să crească.</li>
      </ul>
      <p class="text-white font-bold border-l-4 border-blue-500 pl-4">Învață să citești dincolo de preț. Un 0.00001$ poate fi mult mai scump decât un 60.000$.</p>
    `
  },

  // === 5. RSI (TRADING & CHARTURI) ===
  {
    slug: "rsi-relative-strength-index-explicat",
    term: "RSI (Relative Strength Index)",
    category: "TRADING & CHARTURI",
    image: "/rsiexplicat.jpg",
    definition: "Busola Pieței. Un oscilator care măsoară 'viteza' banilor. Îți spune dacă piața a alergat prea tare (Supra-cumpărat) și trebuie să se odihnească, sau dacă a fost pedepsită prea mult (Supravânzare).",
    analogy: "Turometrul Mașinii. Dacă motorul stă prea mult în zona roșie (peste 70), riscă să se supraîncălzească și trebuie să încetinească. Dacă e subturat (sub 30), are loc de accelerare.",
    mihaiTake: "Nu vinde doar pentru că RSI e sus! Într-un Bull Market, RSI poate sta la 90 săptămâni întregi. Secretul veteranilor nu este nivelul, ci DIVERGENȚA (când prețul urcă, dar RSI coboară).",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Ce este RSI? (Definiția Simplă)</h3>
      <p class="mb-4 text-gray-300">RSI (Relative Strength Index) este un oscilator dezvoltat în 1978 care se mișcă între 0 și 100.</p>
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-6">
        <strong class="text-blue-400 block mb-2">Scopul Principal:</strong>
        <p class="text-gray-300">Să identifice condițiile extreme. Ne spune cât de repede se mișcă piața și dacă "s-a întins prea mult".</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Nivelul 1: Citirea de Bază (Începători)</h3>
      <p class="mb-4 text-gray-300">Regula standard este simplă, dar periculoasă dacă e folosită singură:</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Zona de Supra-cumpărare (> 70)</strong>
            <p class="text-sm text-gray-400">Prețul a crescut prea repede. Probabilitate de corecție.</p>
            <p class="text-xs text-white font-bold mt-2">Acțiune: Căutăm Short.</p>
         </div>
         <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Zona de Supravânzare (< 30)</strong>
            <p class="text-sm text-gray-400">Panica a fost prea mare, vânzătorii au obosit.</p>
            <p class="text-xs text-white font-bold mt-2">Acțiune: Căutăm Long.</p>
         </div>
      </div>
      <p class="text-yellow-400 text-sm font-bold border-l-4 border-yellow-500 pl-4 mb-6">⚠️ Atenție: Într-un Bull Market puternic (cum a fost 2021), RSI poate sta peste 70 săptămâni întregi. Nu vinde doar pentru că indicatorul e sus!</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Nivelul 2: Divergențele (Secretul Veteranilor)</h3>
      <p class="mb-4 text-gray-300">Aici se face diferența dintre amatori și profesioniști. RSI-ul este cel mai puternic atunci când <strong>nu este de acord cu prețul</strong>.</p>
      
      <ul class="space-y-4 mb-6">
        <li class="bg-[#0a0f1e] p-4 rounded-lg border-l-4 border-green-500">
            <strong class="text-green-400 block text-lg">🐂 Divergența Bullish (De Cumpărare)</strong>
            <ul class="list-disc pl-5 mt-2 text-gray-400 text-sm">
                <li><strong>Prețul:</strong> Face un minim mai jos (Lower Low) - pare că scade.</li>
                <li><strong>RSI:</strong> Face un minim mai sus (Higher Low) - forța de vânzare scade.</li>
                <li><strong>Semnal:</strong> Motorul se pregătește de urcare.</li>
            </ul>
        </li>
        <li class="bg-[#0a0f1e] p-4 rounded-lg border-l-4 border-red-500">
            <strong class="text-red-400 block text-lg">🐻 Divergența Bearish (De Vânzare)</strong>
            <ul class="list-disc pl-5 mt-2 text-gray-400 text-sm">
                <li><strong>Prețul:</strong> Face un maxim mai sus (Higher High) - pare că rupe norii.</li>
                <li><strong>RSI:</strong> Face un maxim mai jos (Lower High) - cumpărătorii pierd suflu.</li>
                <li><strong>Semnal:</strong> Rechinilor le lipsește convingerea. Urmează prăbușirea.</li>
            </ul>
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Nivelul 3: RSI ca Suport și Rezistență</h3>
      <p class="mb-4 text-gray-300">Poți trasa linii de trend direct pe RSI. De asemenea, linia de 50 este crucială:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Peste 50:</strong> Suntem în Uptrend. Orice atingere a liniei de 50 e oportunitate de "Buy the Dip".</li>
        <li><strong>Sub 50:</strong> Suntem în Downtrend. Taurii nu au forță.</li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. RSI Failure Swing (Expert)</h3>
      <p class="mb-4 text-gray-300">O formațiune de precizie descrisă de creatorul Wilder, care ignoră prețul complet:</p>
      <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
        <strong class="text-white">Failure Swing Top (Semnal Sell):</strong>
        <ol class="list-decimal pl-5 mt-2 text-gray-300 text-sm space-y-1">
            <li>RSI urcă peste 70.</li>
            <li>RSI scade sub 70.</li>
            <li>RSI urcă din nou, dar nu atinge vârful anterior (Lower High).</li>
            <li>RSI sparge punctul minim anterior.</li>
        </ol>
        <p class="text-orange-400 text-xs mt-2 font-bold">Trendul s-a rupt înainte ca prețul să o arate!</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Unelte, nu Globuri de Cristal</h3>
      <p class="mb-4 text-gray-300">RSI îți spune "Cât de tare este apăsată pedala de accelerație", nu "Unde merge mașina".</p>
      <p class="text-white font-bold border-l-4 border-blue-500 pl-4">Folosește-l pentru a vedea Divergențele (când prețul minte). Nu îl folosi niciodată singur.</p>
    `
  },

  // === 6. CICLUL PIEȚEI (PSIHOLOGIE & CICLE) ===
  {
    slug: "ciclul-pietei-wyckoff-ghid-faze",
    term: "Ciclul Pieței (Market Cycles)",
    category: "PSIHOLOGIE & CICLE",
    image: "/cicluldepiataacademie.jpg",
    definition: "Harta Secretă a Banilor Mari. Piața nu se mișcă haotic, ci într-un tipar logic orchestrat de 'Smart Money'. Învață cele 4 anotimpuri: Acumulare, Mark-Up, Distribuție, Mark-Down.",
    analogy: "Cele 4 Anotimpuri. Iarna (Acumulare) e plictisitoare dar necesară. Vara (Mark-Up) e caldă și profitabilă. Toamna (Distribuție) e înșelătoare. Iarna Nucleară (Mark-Down) e fatală.",
    mihaiTake: "Piața este un mecanism de transfer al averii de la cei care nu înțeleg aceste 4 faze, către cei care le stăpânesc. Nu fi 'Exit Liquidity'. Cumpără când ești plictisit, vinde când ești euforic.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Introducere: De ce pierzi când piața pare bună?</h3>
      <p class="mb-4 text-gray-300">Ai cumpărat vreodată o monedă pentru că știrile erau fantastice, toată lumea vorbea despre ea, prețul stagna puțin... și apoi s-a prăbușit?</p>
      <p class="mb-4 text-gray-300">Ai vândut vreodată o monedă pentru că "nu făcea nimic" timp de 3 luni, doar ca să o vezi explodând a doua zi după ce ai vândut?</p>
      <p class="mb-6 text-gray-300">Nu ai avut ghinion. Ai fost victima Ciclului de Piață.</p>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <p class="text-gray-300 font-medium">Piața nu se mișcă haotic. Se mișcă într-un tipar logic, orchestrat de "Smart Money" (Balene, Instituții) pentru a transfera banii din buzunarul "Nerăbdătorilor" în buzunarul "Răbdătorilor".</p>
        <p class="text-blue-400 mt-2 text-sm">Richard Wyckoff a descifrat acest cod acum 100 de ani. Iată cele 4 anotimpuri ale banilor:</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 1: ACUMULAREA (Iarna Plictisitoare)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> După o scădere mare (Bear Market).</li>
        <li><strong>Ce se întâmplă:</strong> Prețul merge lateral (Range). Nu crește, nu scade mult. E liniște. Știrile sunt rele sau inexistente.</li>
        <li><strong>Psihologia:</strong> "Crypto e mort". Retailul (micii investitori) este plictisit, speriat și își vinde monedele în pierdere, doar ca să scape.</li>
        <li><strong>Ce fac Balenele:</strong> CUMPĂRĂ. Ei absorb oferta vândută de micii investitori disperați. Ei construiesc "cauza" pentru viitoarea creștere.</li>
      </ul>
      <p class="text-green-400 font-bold border-l-4 border-green-500 pl-4 mb-8">Lecția: Cumpără când ești plictisit, nu când ești entuziasmat. Acesta este momentul maximului de oportunitate financiară.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 2: MARK-UP (Primăvara / Vara Explozivă)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> Prețul sparge rezistența zonei de acumulare.</li>
        <li><strong>Ce se întâmplă:</strong> Începe trendul ascendent (Uptrend). Prețul face maxime în creștere (Higher Highs).</li>
        <li><strong>Psihologia:</strong> Speranța revine. Apoi Lăcomia. Apoi FOMO (Frica de a pierde ocazia). Știrile devin pozitive.</li>
        <li><strong>Ce fac Balenele:</strong> Țin de monede și încep să vândă puțin câte puțin pe măsură ce prețul urcă.</li>
      </ul>
      <p class="text-green-400 font-bold border-l-4 border-green-500 pl-4 mb-8">Lecția: Aici faci banii. Trend is your friend. Nu vinde prea devreme, dar nici nu intra "all in" la final.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 3: DISTRIBUȚIA (Toamna Înșelătoare)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> La vârful pieței (Top).</li>
        <li><strong>Ce se întâmplă:</strong> Prețul se oprește din creștere și intră iar într-un Range lateral. Volatilitatea e mare.</li>
        <li><strong>Psihologia:</strong> EUFORIE MAXIMĂ. "Bitcoin la 1 Milion!". Toată lumea e geniu. Șoferul de Uber îți dă ponturi crypto.</li>
        <li><strong>Ce fac Balenele:</strong> VÂND TOT. Ei au nevoie de cererea uriașă a mulțimii euforice pentru a-și descărca sacii uriași de monede fără a prăbuși prețul instant.</li>
        <li><strong>Capcana:</strong> Pare o pauză înainte de o nouă creștere. De fapt, este sfârșitul.</li>
      </ul>
      <p class="text-red-400 font-bold border-l-4 border-red-500 pl-4 mb-8">Lecția: Când știrile sunt perfecte, vinde. Distribuția este oglinda Acumulării.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 4: MARK-DOWN (Iarna Nucleară)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> Prețul sparge suportul distribuției.</li>
        <li><strong>Ce se întâmplă:</strong> Prăbușire. Panic Sell.</li>
        <li><strong>Psihologia:</strong> Negare ("E doar o corecție") -> Frică -> Capitulare ("Vând tot, e țeapă").</li>
        <li><strong>Ce fac Balenele:</strong> Așteaptă cu cash-ul pregătit la baza muntelui.</li>
      </ul>
      <p class="text-red-400 font-bold border-l-4 border-red-500 pl-4 mb-8">Lecția: Nu prinde cuțitul care cade. Așteaptă să înceapă din nou Faza 1.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Cum identifici unde ești ACUM?</h3>
      <p class="mb-4 text-gray-300">Nu ghici. Privește Volumul și Sentimentul.</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Acumulare (CUMPĂRĂ)</strong>
            <p class="text-sm text-gray-400">Preț Jos + Frică/Plictiseală + Volum Constant</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Distribuție (VINDE)</strong>
            <p class="text-sm text-gray-400">Preț Sus + Euforie + Volum Uriaș (dar prețul nu mai crește)</p>
         </div>
      </div>

      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <p class="text-gray-300 italic mb-4">"Piața este un mecanism de transfer al averii de la cei care nu înțeleg aceste 4 faze, către cei care le stăpânesc."</p>
        <p class="text-white font-bold">Tu în ce fază crezi că suntem?</p>
      </div>
    `
  },

  // === 7. MANAGEMENTUL RISCULUI (TRADING) ===
  {
    slug: "managementul-riscului-matematica-supravietuirii",
    term: "Managementul Riscului (Risk Management)",
    category: "TRADING & CHARTURI",
    image: "/managementulriscului.jpg",
    definition: "Matematica Supraviețuirii. Cum să pierzi de 5 ori la rând și totuși să fii pe profit. Secretul nu este să ai dreptate, ci să nu rămâi fără bani.",
    analogy: "Frânele de la mașină. Nu le ai pentru că plănuiești să faci accident, ci pentru a putea opri în siguranță când apare un obstacol neprevăzut. Fără frâne (Stop Loss), viteza te omoară.",
    mihaiTake: "Secretul pe care nu ți-l spune nimeni este că Tradingul nu este despre a avea dreptate. Este despre a nu muri. Dacă capitalul tău ajunge la zero, jocul s-a terminat. Azi învățăm cum să devenim nemuritori în piață.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Introducere: De ce falimentează traderii buni?</h3>
      <p class="mb-4 text-gray-300">Ai auzit povestea? <em>"Am avut dreptate! Știam că Bitcoin se duce la 100k! Dar m-a lichidat înainte să ajungă acolo..."</em></p>
      <p class="mb-6 text-gray-300">Aceasta este tragedia clasică. Să ai dreptate pe direcție, dar să pierzi banii.</p>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <strong class="text-blue-400 block mb-2 text-lg">Adevărul Suprem:</strong>
        <p class="text-gray-300">Tradingul nu este despre a avea dreptate. Este despre a nu muri. Dacă capitalul tău ajunge la zero, jocul s-a terminat.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">1. Regula de Aur a Supraviețuirii: 1-2% Per Trade</h3>
      <p class="mb-4 text-gray-300">Aceasta este legea pe care o respectă orice trader de pe Wall Street. Niciodată, sub nicio formă, nu risca mai mult de 1% (maxim 2%) din portofoliul tău total pe o singură tranzacție.</p>

      <div class="grid md:grid-cols-2 gap-6 mb-6">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Exemplul Corect (1%)</strong>
            <p class="text-sm text-gray-400 mb-2">Ai 10.000$. Riscul tău maxim pe un trade este <strong>100$</strong>.</p>
            <p class="text-sm text-gray-300 border-t border-white/10 pt-2">Dacă pierzi de 20 de ori la rând, încă mai ai 80% din capital. Ești încă în joc.</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Exemplul Fatal (10%)</strong>
            <p class="text-sm text-gray-400 mb-2">Dacă riști 10% pe un trade și prinzi o serie proastă de 5 pierderi (se întâmplă oricui), ai pierdut <strong>50% din bani</strong>.</p>
            <p class="text-sm text-gray-300 border-t border-white/10 pt-2">Ca să recuperezi o pierdere de 50%, trebuie să faci un profit de 100%. E matematic greu.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Raportul R:R (Risk to Reward Ratio)</h3>
      <p class="mb-4 text-gray-300">Aici se face diferența dintre amatori și profesioniști. Nu intra niciodată într-o poziție dacă nu poți câștiga de cel puțin 3 ori mai mult decât riști.</p>
      
      <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-yellow-500 mb-6">
        <p class="text-xl font-mono text-yellow-400 font-bold mb-2">R:R = 1:3</p>
        <p class="text-gray-300">Risc 100$ ca să câștig 300$.</p>
      </div>

      <p class="mb-4 text-white font-bold">Magia Matematică:</p>
      <p class="mb-4 text-gray-300">Dacă respecți raportul 1:3, poți să PIERZI în 60% din tranzacțiile tale și totuși să faci bani.</p>

      <div class="bg-[#0a0f1e] p-6 rounded-xl border border-white/10 mb-8 font-mono text-sm">
        <p class="text-gray-500 mb-2">// Scenariu: 10 Tranzacții</p>
        <div class="flex justify-between mb-1">
            <span class="text-red-400">6 pierderi x 100$</span>
            <span class="text-red-400">= -600$</span>
        </div>
        <div class="flex justify-between mb-3 border-b border-gray-700 pb-3">
            <span class="text-green-400">4 câștiguri x 300$</span>
            <span class="text-green-400">= +1200$</span>
        </div>
        <div class="flex justify-between font-bold text-lg">
            <span class="text-white">Profit Total</span>
            <span class="text-green-400">= +600$</span>
        </div>
        <p class="text-xs text-gray-500 mt-2 italic">(Deși ai greșit de mai multe ori decât ai avut dreptate!)</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Stop Loss-ul nu este o opțiune, este oxigenul</h3>
      <p class="mb-4 text-gray-300">Mersul fără Stop Loss este ca condusul fără frâne. Poate merge o vreme, dar la prima curbă strânsă (Flash Crash), ai murit.</p>

      <ul class="space-y-4 mb-6">
        <li class="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
            <strong class="text-red-400 block mb-1">❌ Stop Loss Mental? Nu există.</strong>
            <p class="text-sm text-gray-400">Emoțiile te vor bloca. <em>"Lasă că își revine, nu vând acum"</em>. Până te decizi, pierderea devine insuportabilă.</p>
        </li>
        <li class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <strong class="text-green-400 block mb-1">✅ Stop Loss Automat</strong>
            <p class="text-sm text-gray-400">Singurul prieten adevărat. Îl pui în momentul în care deschizi tranzacția.</p>
        </li>
      </ul>

      <p class="text-white font-bold mb-2">Unde îl pui?</p>
      <p class="text-gray-300 mb-6">Nu îl pui la o sumă fixă ("Vând dacă pierd 10 dolari"). Îl pui unde <strong>TEZA TA ESTE INVALIDATĂ</strong>. Dacă ai crezut că suportul ține, pune Stop Loss-ul sub suport. Dacă suportul s-a rupt, motivul pentru care ai cumpărat a dispărut. Ieși afară.</p>
    `
  },

  // === 8. LICHIDITATEA (TRADING & MARKET MECHANICS) ===
  {
    slug: "lichiditatea-explicata-orderbook-slippage-amm",
    term: "Lichiditatea (Liquidity)",
    category: "TRADING & CHARTURI",
    image: "/lichiditatea-academie.jpg",
    definition: "Oxigenul Pieței. Capacitatea de a transforma un activ în bani cash instantaneu, fără a-i prăbuși prețul. Diferența dintre a putea vinde 1 milion de dolari într-o secundă (Bitcoin) sau în 10 ani (Imobiliare).",
    analogy: "Paharul cu Apă vs. Oceanul. Dacă arunci o piatră (un ordin de vânzare) într-un pahar, apa sare peste tot (prețul se prăbușește). Dacă arunci aceeași piatră în ocean, nivelul apei nu se schimbă. Bitcoin e Oceanul, Shitcoin-urile sunt Paharul.",
    mihaiTake: "Volumul este vanitate, Lichiditatea este realitate. Poți vedea un token care a crescut 10.000% azi, dar dacă are o lichiditate de 5.000$, acea creștere este o iluzie. Nu poți marca profitul. Nu cumpăra niciodată ceva ce nu poți vinde.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Ce este Lichiditatea, de fapt?</h3>
      <p class="mb-4 text-gray-300">Mulți confundă Lichiditatea cu Volumul. Sunt diferite.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Volumul:</strong> Câți bani s-au schimbat azi (Trecut).</li>
        <li><strong>Lichiditatea:</strong> Câți bani stau în așteptare în "Carnetul de Ordine" (Prezent și Viitor).</li>
      </ul>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <strong class="text-blue-400 block mb-2 text-lg">Testul Suprem:</strong>
        <p class="text-gray-300">Ai 100.000$ în Bitcoin. Poți să-i vinzi acum? <strong>DA</strong>, prețul nu se va mișca nici măcar cu 1$.</p>
        <p class="text-gray-300 mt-2">Ai 100.000$ într-un Meme Coin obscur. Poți să-i vinzi acum? <strong>NU</strong>. Dacă încerci, vei prăbuși prețul cu 50% și vei încasa doar jumătate. Asta înseamnă "Lipsă de Lichiditate".</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. The Order Book (Carnetul de Ordine)</h3>
      <p class="mb-4 text-gray-300">Pe o bursă centralizată (Binance), lichiditatea este vizualizată prin Order Book. Sunt "Zidurile" de cumpărare și vânzare.</p>

      <div class="grid md:grid-cols-2 gap-6 mb-6">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Bid Walls (Cumpărătorii)</strong>
            <p class="text-sm text-gray-400">Ordinele care așteaptă mai jos. Ele sunt "plasa de siguranță". Cu cât sunt mai multe (Deep Liquidity), cu atât e mai greu ca prețul să scadă brusc.</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Ask Walls (Vânzătorii)</strong>
            <p class="text-sm text-gray-400">Ordinele care așteaptă mai sus. Ele acționează ca un "tavan". Trebuie să cumperi tot ce vând ei ca să urci prețul.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Inamicul Tăcut: SLIPPAGE (Alunecarea)</h3>
      <p class="mb-4 text-gray-300">Acesta este modul în care piața te taxează pentru nerăbdare în piețe ilichide.</p>
      
      <div class="bg-red-900/10 p-6 rounded-xl border border-red-500/20 mb-6">
         <strong class="text-red-400 block mb-2 text-xl">⚠️ Scenariul de Coșmar</strong>
         <p class="text-gray-300 mb-2">Vrei să vinzi rapid (Market Order) token-uri de 10.000$.</p>
         <p class="text-gray-300 mb-2">Dar în Order Book, cumpărătorii sunt așa:</p>
         <ul class="text-sm font-mono text-gray-400 mb-4 bg-black/30 p-2 rounded">
            <li>Gigel vrea de 100$ la prețul de 1.00$</li>
            <li>Costel vrea de 500$ la prețul de 0.98$</li>
            <li>Ionel vrea de 9000$ la prețul de 0.50$</li>
         </ul>
         <p class="text-white font-bold">Rezultat:</p>
         <p class="text-gray-300">Sistemul îți va vinde automat la toți, în ordine. Vei vinde majoritatea token-urilor la 0.50$, pierzând instant jumătate din bani. Acesta este Slippage-ul.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Revoluția DeFi: Liquidity Pools (AMM)</h3>
      <p class="mb-4 text-gray-300">Pe Uniswap sau PancakeSwap nu există Order Book. Există o "Piscină de Lichiditate".</p>
      <p class="mb-6 text-gray-300">Aici, utilizatorii (ca tine) devin "Banca". Tu depui o pereche de token-uri (ex: ETH + USDT) în piscină. Când cineva vrea să facă schimb, ia din piscină și plătește o taxă. Acea taxă ajunge la tine.</p>
      
      <ul class="space-y-4 mb-6">
        <li class="bg-white/5 p-4 rounded-lg border-l-4 border-purple-500">
            <strong class="text-purple-400 block mb-1">Conceptul AMM (Automated Market Maker)</strong>
            <p class="text-sm text-gray-400">Un robot matematic care echilibrează balanța. Formula clasică: <em>x * y = k</em>. Dacă iei mult ETH din piscină, robotul crește exponențial prețul ETH rămas pentru a proteja piscina.</p>
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Riscul "Rug Pull" prin Lichiditate</h3>
      <p class="mb-4 text-gray-300">Cum dau țeapă escrocii?</p>
      <ol class="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
         <li>Creează un token nou.</li>
         <li>Adaugă lichiditate inițială (pun 10.000$ reali în piscină).</li>
         <li>Lumea cumpără, prețul crește, în piscină se strâng 100.000$ reali.</li>
         <li><strong>Rug Pull:</strong> Escrocul are o funcție secretă prin care <strong>RETRAGE LIQUIDITATEA</strong>.</li>
         <li>El pleacă cu cei 100.000$, iar tu rămâi cu token-uri pe care nu le mai poți schimba nicăieri, pentru că nu mai există "piscină" în care să le vinzi.</li>
      </ol>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Apa adâncă e sigură</h3>
      <p class="mb-4 text-gray-300">Înainte să investești în orice proiect, verifică lichiditatea.</p>
      <p class="text-white font-bold border-l-4 border-yellow-500 pl-4">Nu te uita doar la "Cât pot să câștig?". Întreabă-te: "Dacă fac 1 milion de dolari, există suficienți bani în partea cealaltă ca să pot încasa?"</p>
    `
  },

  // === 9. ✅ ARTICOL NOU: STABLECOINS (DEFI & FUNDAMENTE) ===
  {
    slug: "stablecoins-ghid-usdt-usdc-dai",
    term: "Stablecoins (Monede Stabile)",
    category: "DEFI & WEB3",
    image: "/stablecoinsexplicat.jpg",
    definition: "Ancora de stabilitate în furtuna crypto. Criptomonede concepute să aibă o valoare fixă (de obicei 1$ = 1 Monedă). Sunt puntea dintre banii vechi (Fiat) și banii noi.",
    analogy: "Jetoanele de la Cazino. Când intri în cazino, nu pariezi cu bancnote de lei. Schimbi banii în jetoane de plastic. Un jeton valorează mereu 1 Leu. Le folosești ca să joci, iar la final le schimbi înapoi în bani reali. USDT este jetonul.",
    mihaiTake: "Cash is a Position. Să stai în USDT nu înseamnă că 'nu ești în piață'. Înseamnă că ai ales să fii lunetist. Stablecoins sunt 'praf de pușcă' (Dry Powder). Cine nu are USDT când piața sângerează, este doar un spectator neputincios.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. De ce avem nevoie de "Crypto care nu crește"?</h3>
      <p class="mb-4 text-gray-300">Pare un paradox. De ce ai cumpăra o criptomonedă care nu face 100x?</p>
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <strong class="text-blue-400 block mb-2 text-lg">Problema Volatilității:</strong>
        <p class="text-gray-300">Vrei să cumperi o cafea cu Bitcoin. Până ajunge comanda, prețul BTC a scăzut cu 5%. Cafeaua a devenit brusc mai scumpă. Avem nevoie de un mediu de schimb stabil.</p>
        <p class="text-gray-300 mt-2">Mai mult, când vinzi Bitcoin pe profit, nu vrei să retragi mereu în bancă (impozite, timp, comisioane). Vrei să parchezi banii digital, gata pentru următoarea oportunitate.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Cele 3 Tipuri de Stablecoins (Riscuri Diferite)</h3>
      <p class="mb-4 text-gray-300">Nu toate sunt create egal. Dacă nu știi diferența, poți pierde tot (vezi cazul Terra Luna).</p>

      <div class="grid md:grid-cols-1 gap-6 mb-6">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2 text-lg">A. Fiat-Backed (Susținute de Bani Reali)</strong>
            <p class="text-xs text-gray-500 mb-2 uppercase">Exemple: USDT (Tether), USDC (Circle)</p>
            <p class="text-sm text-gray-300"><strong>Cum funcționează:</strong> Pentru fiecare 1 USDT emis digital, compania ar trebui să aibă 1$ real (sau echivalent) într-un cont bancar.</p>
            <p class="text-sm text-red-400 mt-2"><strong>Risc:</strong> Centralizare. Compania (Tether) îți poate îngheța contul la cererea autorităților. Nu sunt banii tăi, sunt banii lor digitali.</p>
         </div>
         
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-yellow-500/20">
            <strong class="text-yellow-400 block mb-2 text-lg">B. Crypto-Backed (Susținute de Crypto)</strong>
            <p class="text-xs text-gray-500 mb-2 uppercase">Exemple: DAI</p>
            <p class="text-sm text-gray-300"><strong>Cum funcționează:</strong> Nu există o bancă. Blochezi Ethereum într-un Smart Contract și primești DAI. Este supra-colateralizat (blochezi 150$ ETH ca să scoți 100$ DAI).</p>
            <p class="text-sm text-green-400 mt-2"><strong>Avantaj:</strong> Descentralizat. Nimeni nu îți poate îngheța fondurile.</p>
         </div>

         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-600/30">
            <strong class="text-red-500 block mb-2 text-lg">C. Algorithmic (Pericol Mortal)</strong>
            <p class="text-xs text-gray-500 mb-2 uppercase">Exemple: UST (Terra - Decedată), USDD</p>
            <p class="text-sm text-gray-300"><strong>Cum funcționează:</strong> Nu au bani în spate. Se bazează pe un algoritm care creează sau distruge monede pentru a menține prețul.</p>
            <p class="text-sm text-white font-bold mt-2">VERDICT: Ferește-te de ele. Când algoritmul intră în "Spirala Morții", valoarea merge la ZERO.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. USDT vs. USDC: Războiul Titanilor</h3>
      <p class="mb-4 text-gray-300">Ce alegi?</p>
      <ul class="space-y-4 mb-6">
        <li class="bg-white/5 p-4 rounded-lg border-l-4 border-green-500">
            <strong class="text-green-400 block mb-1">USDT (Tether) - Regele Volumului</strong>
            <p class="text-sm text-gray-400">Este cel mai vechi și cel mai folosit. Este "Offshore" (necontrolat direct de SUA). Este preferat de traderi și zonele gri ale economiei. Dar auditurile lor sunt mereu controversate.</p>
        </li>
        <li class="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500">
            <strong class="text-blue-400 block mb-1">USDC (Circle) - Regele Reglementării</strong>
            <p class="text-sm text-gray-400">Este "Onshore" (SUA). Susținut de BlackRock și bănci americane. Este cel mai transparent și sigur legal, dar cel mai ușor de cenzurat de guvernul SUA.</p>
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Riscul de De-Peg (Dezlipire)</h3>
      <div class="bg-red-900/10 p-6 rounded-xl border border-red-500/20 mb-6 relative">
         <strong class="text-red-400 block mb-2 text-xl">⚠️ 1$ nu este mereu 1$</strong>
         <p class="text-gray-300 mb-2">Într-o criză majoră, oamenii vând stablecoins panicat pentru dolari reali. Dacă emitentul nu are lichiditate, prețul scade sub 1$ (0.98$, 0.90$...).</p>
         <p class="text-white font-bold">Lecția: Nu îți ține 100% din avere în stablecoins. Diversifică între USDT, USDC și Fiat (Bancă).</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Dry Powder</h3>
      <p class="mb-4 text-gray-300">În Crypto, oportunitățile apar când sângele curge pe străzi (scăderi de 30-50%).</p>
      <p class="text-white font-bold border-l-4 border-yellow-500 pl-4">Dacă ești 100% investit, nu poți profita de reduceri. Profesioniștii țin mereu 20-30% din portofoliu în Stablecoins (Dry Powder) pentru a "vâna" aceste momente.</p>
    `
  }
];

// --- 3. LISTA TERMENI & LINK-URI (INTERCONECTARE) ---
// Aici definim termenul, explicația scurtă (tooltip) și link-ul către articolul mare (dacă există)
export const terms: Record<string, { def: string, url?: string }> = {
  "Bitcoin": {
    def: "Aur Digital. Rețea descentralizată, limitată la 21 milioane unități.",
    url: "/academie/ce-este-bitcoin-ghid-complet"
  },
  "Ethereum": {
    def: "Platformă de Smart Contracts. Fundația DeFi și Web3.",
    url: "/academie/ce-este-ethereum-ghid-suprem"
  },
  "RSI": {
    def: "Indicator (0-100). Măsoară dacă piața e supra-cumpărată (>70) sau supra-vândută (<30).",
    url: "/academie/rsi-relative-strength-index-explicat"
  },
  "Blockchain": {
    def: "Registru public distribuit, imposibil de falsificat.",
    url: "/academie/ce-este-bitcoin-ghid-complet" 
  },
  "DeFi": {
    def: "Finanțe Descentralizate. Bănci fără bancheri, bazate pe cod.",
    url: "/academie/ce-este-ethereum-ghid-suprem"
  },
  "Wallet": {
    def: "Portofel digital. Nu ține banii, ci cheile tale private.",
    url: "/academie/portofele-crypto-hot-vs-cold-ghid"
  },
  "Cold Wallet": {
    def: "Portofel hardware (offline). Cel mai sigur mod de a păstra crypto.",
    url: "/academie/portofele-crypto-hot-vs-cold-ghid"
  },
  "Halving": {
    def: "Eveniment la 4 ani care reduce inflația Bitcoin la jumătate.",
    url: "/academie/ce-este-bitcoin-ghid-complet"
  },
  "Market Cap": {
    def: "Valoarea totală a unei monede (Preț x Monede în circulație).",
    url: "/academie/tokenomics-ghid-market-cap-fdv"
  },
  "Smart Money": {
    def: "Investitorii instituționali (Balene, Fonduri). Cei care fac piața.",
    url: "/academie/ciclul-pietei-wyckoff-ghid-faze"
  },
  "Acumulare": {
    def: "Faza în care balenele cumpără în liniște, înainte de explozia prețului.",
    url: "/academie/ciclul-pietei-wyckoff-ghid-faze"
  },
  "Lichiditatea": {
    def: "Capacitatea de a vinde rapid fără slippage.",
    url: "/academie/lichiditatea-explicata-orderbook-slippage-amm"
  },
  "Stablecoin": {
    def: "Monedă stabilă (1$ = 1 Coin). Puntea dintre Fiat și Crypto.",
    url: "/academie/stablecoins-ghid-usdt-usdc-dai"
  },
  "USDT": {
    def: "Tether. Cel mai popular Stablecoin. Regele volumului.",
    url: "/academie/stablecoins-ghid-usdt-usdc-dai"
  },
  "USDC": {
    def: "USD Coin. Stablecoin reglementat în SUA, susținut de bănci.",
    url: "/academie/stablecoins-ghid-usdt-usdc-dai"
  }
};

// --- 4. FUNCȚIA DE PROCESARE TEXT (LINK-URI INTELIGENTE) ---
export function enhanceContent(content: string): string {
  let enhancedContent = content;
  
  // Sortăm termenii după lungime (descrescător) ca să nu înlocuim "Wallet" în interiorul lui "Cold Wallet"
  const sortedTerms = Object.keys(terms).sort((a, b) => b.length - a.length);

  sortedTerms.forEach((term) => {
    const info = terms[term];
    // Regex care caută cuvântul, dar ignoră dacă e deja într-un link sau tag HTML
    const regex = new RegExp(`(?<!<[^>]*)\\b(${term})\\b(?![^<]*>)`, 'g');
    
    enhancedContent = enhancedContent.replace(regex, (match) => {
      // Dacă avem URL, facem link. Dacă nu, doar tooltip.
      if (info.url) {
        return `
          <a href="${info.url}" class="group relative inline-block text-blue-400 font-medium hover:text-blue-300 transition-colors border-b border-blue-500/30 hover:border-blue-400 cursor-pointer">
            ${match}
            <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-blue-900/95 text-white text-xs rounded-lg shadow-xl border border-blue-500/30 z-50 backdrop-blur-sm pointer-events-none text-center leading-relaxed normal-case font-normal">
              ${info.def}
              <span class="block mt-2 text-blue-300 font-bold text-[10px] uppercase tracking-wider">Click pentru Ghid Complet →</span>
            </span>
          </a>
        `;
      } else {
        return `
          <span class="group relative cursor-help border-b border-dotted border-gray-500 hover:border-gray-300 text-gray-300 transition-colors">
            ${match}
            <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900/95 text-white text-xs rounded-lg shadow-xl border border-gray-700 z-50 backdrop-blur-sm pointer-events-none text-center leading-relaxed">
              ${info.def}
            </span>
          </span>
        `;
      }
    });
  });
  
  return enhancedContent;
}