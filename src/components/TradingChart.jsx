
import React, { useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import useDarkMode from '../hooks/useDarkMode'
let tvScriptLoadingPromise;

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef();
  const { coin } = useParams();
  const [ theme] = useDarkMode()
  
  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_12bac') && 'TradingView' in window) {
          new window.TradingView.widget({
            width: "100%",
            height: "100%",
            symbol:  `BINANCE:${coin}USDT`,
            interval: "240",
            timezone: "Etc/UTC",
            theme: theme,
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: "tradingview_12bac",
          });
        }
      }
    },
    [coin,theme]
  );

  return (
    <div className='tradingview-widget-container  '>
      <div id='tradingview_12bac' className=''/>
    </div>
  );
}