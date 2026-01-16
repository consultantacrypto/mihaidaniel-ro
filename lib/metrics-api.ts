// lib/metrics-api.ts

export interface MetricPoint {
  date: string;
  price: number;
  ma2yr: number | null;
  ma2yrMultiplier: number | null;
}

export async function getBitcoinMetrics(): Promise<MetricPoint[]> {
  try {
    // 1. Folosim BINANCE API (Public & Foarte Rapid)
    // Cerem lumânări SĂPTĂMÂNALE (1w) - mult mai puține date, încărcare instantă.
    // Limit 1000 = aprox 19 ani de date săptămânale (suficient).
    const res = await fetch(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=1000',
      { next: { revalidate: 3600 } } // Cache 1 oră
    );
    
    if (!res.ok) throw new Error('Binance API failed');
    
    const rawData = await res.json();
    
    // Binance returnează array de array-uri: [openTime, open, high, low, close, ...]
    // Noi vrem doar Close Price și Time.
    const prices: number[] = rawData.map((d: any) => parseFloat(d[4]));
    const dates: number[] = rawData.map((d: any) => d[0]);

    // 2. Procesăm datele
    const metrics: MetricPoint[] = [];
    // 2 Ani = 104 Săptămâni (aprox 730 zile)
    const windowSize = 104; 

    for (let i = 0; i < prices.length; i++) {
      // Data formatată scurt (ex: "Ian '24")
      const date = new Date(dates[i]).toLocaleDateString('ro-RO', {
        year: '2-digit',
        month: 'short',
      });
      const price = prices[i];

      let ma2yr = null;
      let ma2yrMultiplier = null;

      // Calculăm MA doar dacă avem destule săptămâni în spate
      if (i >= windowSize) {
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
          sum += prices[i - j];
        }
        ma2yr = sum / windowSize;
        ma2yrMultiplier = ma2yr * 5; // Vârful de ciclu
      }

      // Salvăm datele (doar ce are sens pentru grafic)
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
    // Fallback: Returnăm un array gol ca să nu crape pagina, UI-ul va arăta un mesaj de eroare prietenos
    return [];
  }
}