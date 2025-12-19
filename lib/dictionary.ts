// --- TIPURI PENTRU ACADEMIE ---
export type DictionaryTerm = {
  slug: string;
  term: string;
  definition: string;
  analogy: string; // "Pe românește"
  category: 'FUNDAMENTE' | 'TRADING' | 'DEFI' | 'SECURITATE' | 'MACRO';
  mihaiTake: string;
};

// 1. BAZA DE DATE EXTINSĂ (Pentru Paginile din Academie)
export const dictionary: DictionaryTerm[] = [
  {
    slug: "bitcoin",
    term: "Bitcoin (BTC)",
    category: "FUNDAMENTE",
    definition: "Prima criptomonedă descentralizată din lume, creată în 2008 de Satoshi Nakamoto. Funcționează pe un registru public (Blockchain) și are o ofertă limitată la 21 de milioane de unități.",
    analogy: "Aur Digital. Gândește-te la el ca la singura bancă din lume pe care nimeni nu o poate închide, nimeni nu o poate controla și unde tu ești singurul proprietar al cheii seifului.",
    mihaiTake: "Tati, Bitcoin nu e 'banii de internet' cu care îți iei cafea. E asigurarea ta împotriva inflației. Când băncile printează bani din nimic, Bitcoin rămâne la fel: 21 de milioane. Punct. E cea mai pură formă de proprietate privată inventată vreodată."
  },
  {
    slug: "ethereum",
    term: "Ethereum (ETH)",
    category: "FUNDAMENTE",
    definition: "O platformă blockchain open-source care permite crearea de Contracte Inteligente (Smart Contracts) și aplicații descentralizate (dApps). Moneda nativă este Ether.",
    analogy: "Petrolul Digital sau App Store-ul descentralizat. Dacă Bitcoin este Aurul (rezerva de valoare), Ethereum este infrastructura pe care se construiește tot orașul financiar al viitorului.",
    mihaiTake: "Imaginează-ți un notar robotizat, incoruptibil, care execută automat orice înțelegere, fără să ceară șpagă. Ăsta e Ethereum. Toate nebuniile cu NFT-uri, DeFi, Stablecoins trăiesc pe spatele lui. Dacă vrei să investești în 'internetul banilor', aici ești."
  },
  {
    slug: "rsi",
    term: "RSI (Relative Strength Index)",
    category: "TRADING",
    definition: "Un indicator de impuls care măsoară viteza și schimbarea mișcărilor de preț, pe o scară de la 0 la 100. Identifică condițiile de supravânzare sau supracumpărare.",
    analogy: "Turometrul mașinii. Îți spune cât de 'ambalat' este motorul prețului în acest moment.",
    mihaiTake: "Simplu: Dacă RSI e peste 70, motorul e roșu, fierbe. Nu cumpăra când toți sunt euforici! Dacă e sub 30, motorul e la relanti, e 'rece'. Acolo se fac banii, când nimeni nu vrea să cumpere."
  },
  {
    slug: "stop-loss",
    term: "Stop Loss",
    category: "TRADING",
    definition: "Un ordin plasat la broker/exchange pentru a vinde automat un activ dacă prețul scade la un anumit nivel, limitând pierderea.",
    analogy: "Centura de siguranță sau Frâna de urgență. Nu te face să mergi mai repede, dar te asigură că nu mori dacă intri în zid.",
    mihaiTake: "Dacă intri într-un trade fără Stop Loss, nu ești investitor, ești donator. Piața îți va lua tot. Stop Loss-ul este singurul mod de a spune: 'Ok, am greșit, ies afară cu o zgârietură mică înainte să îmi rup piciorul'."
  },
  {
    slug: "halving",
    term: "Halving",
    category: "FUNDAMENTE",
    definition: "Eveniment programat în codul Bitcoin care are loc la fiecare 210.000 de blocuri (aprox. 4 ani), reducând la jumătate recompensa minerilor.",
    analogy: "Criza de ofertă programată. Imaginează-ți că mâine, brusc, producția mondială de aur scade la jumătate, dar lumea vrea la fel de multe bijuterii.",
    mihaiTake: "Este mecanismul care face Bitcoin să fie opusul banilor Fiat. În timp ce Dolarul devine tot mai abundent (inflație), Bitcoin devine tot mai rar (deflație). Istoric, Halving-ul a fost scânteia pentru fiecare Bull Market major."
  },
  {
    slug: "levier",
    term: "Levier",
    category: "TRADING",
    definition: "Utilizarea capitalului împrumutat pentru a crește expunerea la un activ. Permite tranzacționarea unor sume mai mari decât cele deținute.",
    analogy: "O sabie cu două tăișuri sau un amplificator. Mărește volumul muzicii, dar mărește și zgomotul de fundal până îți spargi boxele.",
    mihaiTake: "Arma care a distrus mai mulți oameni decât orice război financiar. Levierul 100x nu te face bogat, te face lichidat. Dacă nu ești profesionist, stai departe. Pe Spot dormi liniștit, pe Levier dormi sub pod."
  }
];

// 2. LISTA SIMPLĂ PENTRU TOOLTIPS (Legacy + New)
// Aici combinăm termenii vechi cu cei noi pentru a genera tooltips în articole
export const terms: Record<string, string> = {
  // Termenii noi din Academie (mapați automat)
  "Bitcoin": "Aur Digital. Prima criptomonedă descentralizată, cu ofertă limitată la 21 milioane.",
  "Ethereum": "Platformă pentru Smart Contracts. Petrolul digital al ecosistemului crypto.",
  "RSI": "Indicator de impuls (0-100). Peste 70 = Scump (Vinde). Sub 30 = Ieftin (Cumpără).",
  "Stop Loss": "Ordin automat de ieșire pentru a limita pierderile. Centura de siguranță în trading.",
  "Levier": "Tranzacționare cu bani împrumutați. Amplifică profiturile, dar și pierderile.",
  
  // Termenii vechi (păstrați pentru continuitate)
  "SOPR": "Spent Output Profit Ratio. Indicator care arată dacă, în medie, cei care vând acum sunt pe profit sau pierdere.",
  "Halving": "Eveniment programat la fiecare 4 ani care înjumătățește recompensa minerilor Bitcoin, reducând inflația.",
  "Hashrate": "Puterea totală de calcul a rețelei Bitcoin. Cu cât e mai mare, cu atât rețeaua e mai sigură.",
  "DeFi": "Decentralized Finance. Servicii financiare (împrumuturi, dobânzi) fără bănci, direct pe blockchain.",
  "FOMC": "Federal Open Market Committee. Comitetul din SUA care decide ratele dobânzilor și printează dolari.",
  "Whale": "O 'Balenă' este un investitor care deține cantități masive de Crypto (ex: peste 1.000 BTC) și poate influența prețul.",
  "Bear Market": "Perioadă lungă de scădere a prețurilor, caracterizată prin pesimism și frică în piață.",
  "Bull Market": "Perioadă de creștere susținută a prețurilor, caracterizată prin optimism și lăcomie.",
  "Cold Wallet": "Un portofel crypto deconectat de la internet (ex: Ledger), considerat cel mai sigur mod de stocare.",
  "Smart Money": "Capitalul instituțional (fonduri, bănci, balene). Ei cumpără de obicei când piața scade și vând când crește.",
  "BlackRock": "Cel mai mare gestionar de active din lume (10 Trilioane $). Intrarea lor în Crypto a legitimat Bitcoin-ul.",
  "Altseason": "Perioadă în care monedele alternative (Altcoins) cresc mult mai repede decât Bitcoin.",
  "MiCA": "Markets in Crypto-Assets. Legea europeană care reglementează strict piața crypto începând cu 2025.",
  "FED": "Rezerva Federală a SUA (Banca Centrală). Deciziile lor dictează lichiditatea globală.",
  "ATH": "All-Time High. Cel mai mare preț atins vreodată de o monedă.",
  "Volatilitate": "Măsura în care prețul fluctuează rapid. Oportunitate pentru traderi, risc pentru investitori.",
  "Lichiditate": "Cât de ușor poți vinde sau cumpăra un activ fără a-i afecta prețul major.",
  "Staking": "Procesul de a bloca monede pentru a susține o rețea blockchain, primind în schimb recompense (dobândă)."
};

// 3. FUNCȚIA DE TOOLTIPS (Rămâne neschimbată, funcționează perfect)
export function enhanceContent(content: string): string {
  let enhancedContent = content;

  Object.entries(terms).forEach(([term, definition]) => {
    // Regex complex: Găsește cuvântul doar dacă NU e deja într-un tag HTML
    const regex = new RegExp(`(?<!<[^>]*)\\b(${term})\\b(?![^<]*>)`, 'g');
    
    // Înlocuim cuvântul cu structura HTML pentru Tooltip
    enhancedContent = enhancedContent.replace(regex, (match) => {
      return `
        <span class="group relative cursor-help border-b border-dotted border-blue-500 hover:border-blue-400 text-blue-100 transition-colors">
          ${match}
          <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-blue-900/95 text-white text-xs rounded-lg shadow-xl border border-blue-500/30 z-50 backdrop-blur-sm pointer-events-none text-center leading-relaxed">
            ${definition}
            <svg class="absolute text-blue-900/95 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
          </span>
        </span>
      `;
    });
  });

  return enhancedContent;
}