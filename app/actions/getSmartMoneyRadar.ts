"use server";

export async function getSmartMoneyRadar() {
  try {
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
    
    // Spionăm Binance Futures pentru Top Long/Short Ratio
    const promises = symbols.map(async (sym) => {
      // period=5m pentru date ultra-fresh
      const res = await fetch(`https://fapi.binance.com/fapi/data/topLongShortAccountRatio?symbol=${sym}&period=5m&limit=1`, {
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error(`Failed to fetch ${sym}`);
      const data = await res.json();
      const latest = data[data.length - 1]; 
      
      return {
        symbol: sym.replace("USDT", ""),
        longRatio: parseFloat(latest.longAccount), // Ex: 0.65
        shortRatio: parseFloat(latest.shortAccount), // Ex: 0.35
        ratio: parseFloat(latest.longShortRatio)
      };
    });

    return await Promise.all(promises);
    
  } catch (error) {
    console.error("Smart Money Radar API Error:", error);
    return [];
  }
}