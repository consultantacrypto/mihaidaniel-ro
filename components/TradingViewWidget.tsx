// components/TradingViewWidget.tsx
'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificăm dacă scriptul există deja ca să nu-l dublăm
    if (container.current && !container.current.querySelector("script")) {
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      
      // Configurația JSON trebuie să fie string în interiorul scriptului
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "D",
          "timezone": "Europe/Bucharest",
          "theme": "dark",
          "style": "1",
          "locale": "ro",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
      
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "500px", width: "100%" }}>
      {/* Acest div este esențial - TradingView caută clasa asta specifică */}
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://ro.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Urmărește toate piețele pe TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);