import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {},



  // 1. Optimizare Pachete (Tree-Shaking)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 2. Optimizare Imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },

  // The paid-report PDF reads these fonts from disk at runtime.
  outputFileTracingIncludes: {
    '/api/verifica-adresa/raport/[token]/pdf': ['./lib/verifica-adresa/fonts/**/*'],
    '/api/verifica-adresa/exemplu/pdf': ['./lib/verifica-adresa/fonts/**/*'],
  },
  
  // Redirect-uri pentru trafic vechi
  async redirects() {
    // Știri moarte → stirilecrypto.ro (harta 2026-11-24).
    // Ordine: slug cu țintă proprie + perechea /en, apoi indexurile, apoi catch-all.
    // Prima potrivire câștigă. Slug-urile a căror țintă este chiar /stiri
    // nu sunt repetate: le prinde catch-all-ul.
    // redirects() din next.config rulează înainte de middleware-ul next-intl.
    const legacyStiriSlugs: Array<[string, string]> = [
      ['cortina-de-fier-financiara-europeana-mica-2026', 'https://www.stirilecrypto.ro/hub/mica'],
      // TODO: -> /hub/dac8 cand pagina e live
      ['adio-privacy-dac8-noua-realitate-2026', 'https://www.stirilecrypto.ro/stiri/carduri-crypto-raportare-anaf-taxe-mica-dac8'],
      ['ghid-supravietuire-on-chain-urmareste-balenele-nu-stirile', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['ziua-judecatii-crypto-sua-15-ianuarie-clarity-act', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['impact-dobanda-fed-bitcoin-scenarii', 'https://www.stirilecrypto.ro/stiri/corelatie-bitcoin-bursa-wall-street-dobanzi-lichiditate-etf'],
      ['harta-oficiala-mica-2026-ghid-siguranta-crypto', 'https://www.stirilecrypto.ro/stiri/harta-oficiala-mica-2026-exchange-crypto-licentiate-ue-vs-interzise'],
      ['impact-reuniune-fomc-decembrie-2025-crypto', 'https://www.stirilecrypto.ro/market-pulse'],
      ['criza-invizibila-datorii-spirala-mortii', 'https://www.stirilecrypto.ro/market-pulse'],
      ['dosarul-satoshi-cine-este-fantoma-de-70-miliarde-investigatie-2025', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['bitcoin-manipulare-sau-corectie-brutala', 'https://www.stirilecrypto.ro/market-pulse'],
      ['cosmarul-de-7-ani-bitcoin-blocat-bip38', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['sua-salveaza-japonia-crash-dolar-analiza-macro', 'https://www.stirilecrypto.ro/market-pulse'],
      ['marea-rotatie-bani-aur-argint-in-bitcoin-ethereum', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['batalia-averii-bitcoin-aur-argint-analiza-2026', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['fortareata-digitala-banca-elvetiana-crypto-securitate-2026', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['cat-dureaza-durerea-analiza-timp-vindecare-bitcoin', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['acumulare-institutionala-ethereum-dat-bmnr-2025', 'https://www.stirilecrypto.ro/stiri/bitmine-opreste-achizitii-ethereum-eth-tinta-5-procente-tom-lee'],
      ['trezoreria-sua-debt-buyback-semnal-crypto-2026', 'https://www.stirilecrypto.ro/stiri/trezoreria-sua-buyback-bonduri-lichidari-short-bitcoin-69700'],
      ['alerta-volatilitate-decizie-fed-capcana-mortala', 'https://www.stirilecrypto.ro/market-pulse'],
      ['capcana-fdv-matematica-nu-magie-crypto-tokenomics', 'https://www.stirilecrypto.ro/academie/tokenomics-ghid-market-cap-fdv'],
      ['mitul-si-realitatea-altcoin-season-2022-2026', 'https://www.stirilecrypto.ro/academie/ciclul-pietei-wyckoff-ghid-faze'],
      ['alerta-maxima-adevaratul-bitcoin-supply-shock-nu-a-inceput-inca', 'https://www.stirilecrypto.ro/stiri/punctul-de-inflexiune-ce-inseamna-intersectia-supply-in-profit-loss-si-de-ce-abia-acum-incepe-cautarea-minimului-de-cicl'],
      ['anatomia-unui-crash-de-ce-a-sangerat-piata-29-ianuarie', 'https://www.stirilecrypto.ro/market-pulse'],
      ['bitcoin-vs-aur-analiza-rece-2024-2026-store-of-value', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['de-ce-a-fost-blocata-legea-crypto-bancile-au-tras-frana', 'https://www.stirilecrypto.ro/taxe'],
      ['raport-piata-29-ianuarie-linistea-dinaintea-furtunii', 'https://www.stirilecrypto.ro/market-pulse'],
      ['qivalis-banci-europene-stablecoin', 'https://www.stirilecrypto.ro/stiri/bancile-mari-270-milioane-stablecoin-project-faro-qivalis-bcr-raiffeisen-unicredit'],
      ['sua-cftc-crypto-spot-reglementat', 'https://www.stirilecrypto.ro/stiri/intalnire-cftc-20-august-2026-reglementare-crypto-sua'],
      ['breaking-inflatie-sua-prabusire-fed-taieri-dobanzi', 'https://www.stirilecrypto.ro/market-pulse'],
      ['semnal-on-chain-bitcoin-sopr-rally', 'https://www.stirilecrypto.ro/stiri/punctul-de-inflexiune-ce-inseamna-intersectia-supply-in-profit-loss-si-de-ce-abia-acum-incepe-cautarea-minimului-de-cicl'],
      ['adio-crash-10-octombrie-clarity-act-insideri', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['analiza-piata-bitcoin-matematic-aproape-bottom', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['ce-inseamna-bear-market-ghid-complet', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['msci-unda-verde-bitcoin-mstr-salvat', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['clarity-act-adio-vestul-salbatic-crypto-2026', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['ghid-supravietuire-bear-market-iarna-crypto', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['statistica-groazei-80-la-suta-proiecte-hacuite-mor', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['china-imprimanta-nucleara-48-trilioane-short-squeeze', 'https://www.stirilecrypto.ro/market-pulse'],
      ['alarma-macro-ism-manufacturing-sua-bitcoin-tremura', 'https://www.stirilecrypto.ro/market-pulse'],
      ['mitul-halving-ului-sacru-vs-realitatea-lichiditatii', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['semnal-macro-final-ism-pmi-economie-americana-faza-parabolica', 'https://www.stirilecrypto.ro/market-pulse'],
      ['adio-altseason-ciclul-bitcoin-only', 'https://www.stirilecrypto.ro/academie/ciclul-pietei-wyckoff-ghid-faze'],
      ['bomba-financiara-jpmorgan-ethereum-oficial', 'https://www.stirilecrypto.ro/stiri/oficial-jpmorgan-aduce-jpm-coin-pe-ethereum-cea-mai-mare-banca-din-sua-muta-depozite-in-dolari-pe-un-blockchain-public'],
      ['linistea-dinaintea-furtunii-volum-bitcoin-minim-2022', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['umbrele-algoritmilor-bot-polymarket', 'https://www.stirilecrypto.ro/stiri/studiu-stanford-manipulare-bitcoin-polymarket-5-minute'],
      ['d-day-crypto-clarity-act-decizia-suprema-tarife', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['sabotaj-involuntar-trump-legea-claritatii-altseason-hoskinson', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['harta-banilor-taxe-crypto-europa-2025-2026', 'https://www.stirilecrypto.ro/taxe'],
      ['batalia-titanilor-microstrategy-vs-blackrock-viitorul-banilor', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['linistea-piata-reset-institutional-ianuarie-2026', 'https://www.stirilecrypto.ro/market-pulse'],
      ['matematica-industriala-bitcoin-aur-argint-cost-productie', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['batalia-titanilor-bitcoin-vs-ethereum-clarity-act', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['atac-27-milioane-link-malitios', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['soc-california-confisca-bitcoin-inactiv-exchange', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['gdp-sua-crestere-economica-bitcoin', 'https://www.stirilecrypto.ro/market-pulse'],
      ['riscuri-quantum-computing-bitcoin-explicat', 'https://www.stirilecrypto.ro/interviuri/bitcoin-in-fata-revolutiei-cuantice-un-dialog-despre-criptografie-timp-si-incredere'],
      ['s-a-rupt-ceasul-ciclu-4-ani-bitcoin-mort-2026', 'https://www.stirilecrypto.ro/academie/ciclul-pietei-wyckoff-ghid-faze'],
      ['bitmine-1-miliard-ethereum-staking-supply-shock', 'https://www.stirilecrypto.ro/stiri/bitmine-opreste-achizitii-ethereum-eth-tinta-5-procente-tom-lee'],
      ['marea-decuplare-wall-street-vs-crypto', 'https://www.stirilecrypto.ro/market-pulse'],
      ['nu-asteptati-altcoin-season-vine-sezonul-celor-20', 'https://www.stirilecrypto.ro/academie/ciclul-pietei-wyckoff-ghid-faze'],
      ['semnalul-asteptat-russell-2000-maxime-istorice-urmeaza-altcoins', 'https://www.stirilecrypto.ro/academie/ciclul-pietei-wyckoff-ghid-faze'],
      ['alerta-boj-lebada-neagra-japonia-bitcoin-18-decembrie', 'https://www.stirilecrypto.ro/market-pulse'],
      ['fed-injectie-31-miliarde-repo-revelion-2026', 'https://www.stirilecrypto.ro/market-pulse'],
      ['lectia-din-iran-bitcoin-crescut-2653-banii-murit', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['paradoxul-macro-gdp-relatia-secreta', 'https://www.stirilecrypto.ro/market-pulse'],
      ['sfarsitul-celui-mai-mare-secret-financiar-japonia-boj-2025', 'https://www.stirilecrypto.ro/market-pulse'],
      ['alerta-ledger-date-personale-expuse-global-e', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['enigma-usdt-europa-de-ce-coinbase-a-scos-dar-binance-nu', 'https://www.stirilecrypto.ro/stiri/coinbase-converteste-automat-usdt-14-stablecoin-uri-30-octombrie-mica-ce-faci-romania'],
      ['fenomenul-corporate-fomo-companii-acumulare-bitcoin', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['furtul-secolului-282-milioane-dolari-hardware-wallet-jaf-crypto', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['graficul-secret-cost-productie-bitcoin-suport-67k', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['jaful-243-milioane-coinbase-fake-agent-vishing', 'https://www.stirilecrypto.ro/hub/securitate'],
      ['macelul-silentios-5-trilioane-evaporate-fara-stiri', 'https://www.stirilecrypto.ro/market-pulse'],
      ['marea-demitizare-ciclu-4-ani-ism-macro', 'https://www.stirilecrypto.ro/academie/ciclul-pietei-wyckoff-ghid-faze'],
      ['peter-schiff-bufon-sau-geniu-bitcoin-aur-editorial', 'https://www.stirilecrypto.ro/hub/bitcoin'],
      ['zidul-datorie-sua-2026-faliment-matematic-bitcoin', 'https://www.stirilecrypto.ro/market-pulse'],
      ['alerta-craciun-bitcoin-24h-liniste-artificiala', 'https://www.stirilecrypto.ro/market-pulse'],
      ['alerta-matinala-smart-money-pariaza-80k-clarity-act', 'https://www.stirilecrypto.ro/stiri/ce-este-clarity-reglementare-crypto'],
      ['capcana-polymarket-boti-arbitraj-scam-explicat', 'https://www.stirilecrypto.ro/stiri/studiu-stanford-manipulare-bitcoin-polymarket-5-minute'],
      ['china-ban-2-0-bitcoin-scadere-xinjiang-mining-blackout', 'https://www.stirilecrypto.ro/market-pulse'],
      ['razboiul-lichiditatii-sua-vs-japonia-cine-castiga-bitcoin', 'https://www.stirilecrypto.ro/market-pulse'],
      ['saptamana-in-care-banii-s-au-mutat-wall-street-vs-bitcoin', 'https://www.stirilecrypto.ro/market-pulse'],
    ];

    const toSc = (source: string, destination: string) => ({
      source,
      destination,
      permanent: true,
    });

    return [
      // Dezactivat pentru Faza 3 (portal /en) — nu redirecta /en către home
      // {
      //   source: '/en',
      //   destination: '/',
      //   permanent: true,
      // },
      {
        source: '/blogs/crypto-news',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/cursuri',
        destination: '/#curs',
        permanent: true,
      },
      {
        source: '/consultanta',
        destination: '/consultanta-crypto',
        permanent: true,
      },
      {
        source: '/en/consultanta',
        destination: '/en/consultanta-crypto',
        permanent: true,
      },
      {
        source: '/products/consultanta-crypto',
        destination: '/consultanta-crypto',
        permanent: true,
      },
      {
        source: '/products/consultanta',
        destination: '/consultanta-crypto',
        permanent: true,
      },
      ...legacyStiriSlugs.flatMap(([slug, destination]) => [
        toSc(`/stiri/${slug}`, destination),
        toSc(`/en/stiri/${slug}`, destination),
      ]),
      toSc('/stiri', 'https://www.stirilecrypto.ro/stiri'),
      toSc('/en/stiri', 'https://www.stirilecrypto.ro/stiri'),
      toSc('/market', 'https://www.stirilecrypto.ro/market'),
      toSc('/en/market', 'https://www.stirilecrypto.ro/market'),
      toSc('/stiri/:path*', 'https://www.stirilecrypto.ro/stiri'),
      toSc('/en/stiri/:path*', 'https://www.stirilecrypto.ro/stiri'),
    ];
  },
};

export default withNextIntl(nextConfig);