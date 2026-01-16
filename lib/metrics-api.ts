// lib/metrics-api.ts

export interface MetricPoint {
  date: string;
  price: number;
  ma2yr: number | null;
  ma2yrMultiplier: number | null;
}

// Funcție care ia datele de pe CoinGecko și calculează indicatorii
export async function getBitcoinMetrics(): Promise<MetricPoint[]> {
  try {
    // 1. Luăm tot istoricul Bitcoin (gratuit de pe CoinGecko)
    // Nota: API-ul public are limite, cache-uim rezultatul pentru 1 oră.
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max&interval=daily',
      { next: { revalidate: 3600 } } 
    );
    
    if (!res.ok) throw new Error('Failed to fetch CoinGecko data');
    
    const data = await res.json();
    const prices: [number, number][] = data.prices; // [timestamp, price]

    // 2. Procesăm datele și calculăm Media Mobilă (Moving Average)
    const metrics: MetricPoint[] = [];
    const windowSize = 730; // 2 Ani (730 zile)

    // Iterăm prin istoric
    for (let i = 0; i < prices.length; i++) {
      const [timestamp, price] = prices[i];
      const date = new Date(timestamp).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'short',
      });

      let ma2yr = null;
      let ma2yrMultiplier = null;

      // Calculăm MA doar dacă avem destule date (730 zile în spate)
      if (i >= windowSize) {
        let sum = 0;
        // Facem suma ultimelor 730 zile (pentru simplitate, buclă interioară)
        for (let j = 0; j < windowSize; j++) {
          sum += prices[i - j][1];
        }
        ma2yr = sum / windowSize;
        ma2yrMultiplier = ma2yr * 5; // Linia Roșie (Vârf = MA x 5)
      }

      // Salvăm datele (filtrăm primii ani fără MA valid pentru a nu strica graficul)
      // Începem să salvăm când avem date valide sau puțin înainte
      if (i > windowSize) { 
          metrics.push({
            date,
            price,
            ma2yr,
            ma2yrMultiplier,
          });
      }
    }

    return metrics;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return [];
  }
}