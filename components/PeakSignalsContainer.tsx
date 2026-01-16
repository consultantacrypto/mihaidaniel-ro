"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LineChart, RefreshCw, AlertTriangle } from 'lucide-react';

// Importăm graficul dinamic AICI, unde avem voie (în Client Component)
const TwoYearMAChart = dynamic(() => import('@/components/TwoYearMAChart'), { 
  ssr: false,
  loading: () => <div className="h-96 w-full bg-[#0b1221] rounded-2xl animate-pulse" />
});

export default function PeakSignalsContainer() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Funcția de fetch
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);

      // Fetch de la Binance (Rapid)
      const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=500');
      
      if (!res.ok) throw new Error("Binance API error");
      
      const rawData = await res.json();
      const processedData = processBinanceData(rawData);
      
      setData(processedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="w-full h-96 bg-[#0b1221] border border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white">Eroare conexiune date</h3>
        <button onClick={fetchData} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition flex items-center gap-2">
          <RefreshCw size={16} /> Încearcă din nou
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-96 bg-[#0b1221] border border-white/10 rounded-2xl flex flex-col items-center justify-center relative">
        <LineChart className="text-blue-500 mb-4 animate-bounce" size={48} />
        <p className="text-blue-300 font-mono text-sm">Se analizează Blockchain-ul...</p>
      </div>
    );
  }

  return <TwoYearMAChart data={data} />;
}

// Helper procesare date
function processBinanceData(rawData: any[]) {
  const windowSize = 104; // 2 ani
  const metrics = [];
  const prices = rawData.map((d: any) => parseFloat(d[4]));
  const dates = rawData.map((d: any) => d[0]);

  for (let i = 0; i < prices.length; i++) {
    if (i >= windowSize) {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) { sum += prices[i - j]; }
      const ma2yr = sum / windowSize;
      
      metrics.push({
        date: new Date(dates[i]).toLocaleDateString('ro-RO', { year: '2-digit', month: 'short' }),
        price: prices[i],
        ma2yr: ma2yr,
        ma2yrMultiplier: ma2yr * 5
      });
    }
  }
  return metrics;
}