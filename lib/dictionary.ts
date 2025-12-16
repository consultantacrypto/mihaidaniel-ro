// Baza de date cu termeni și definiții scurte
export const terms: Record<string, string> = {
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

// Funcția care "injectează" tooltips în text
export function enhanceContent(content: string): string {
  let enhancedContent = content;

  Object.entries(terms).forEach(([term, definition]) => {
    // Regex complex: Găsește cuvântul doar dacă NU e deja într-un tag HTML (ca să nu stricăm link-uri sau poze)
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