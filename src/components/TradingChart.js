import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TradingViewWidget, { Themes, IntervalTypes } from "react-tradingview-widget";

const TradingChart = ({ height, width }) => {
  const { coin } = useParams();
  const [symbol, setSymbol] = useState("BTCUSDT");
  const tradingRef = useRef(null);

  useEffect(() => {
    //  console.log(tradingRef.current.props.symbol);
    setSymbol(`${coin.toUpperCase()}USDT`);
  }, [coin]);

  return (
    <TradingViewWidget
      height={height}
      width={width}
      symbol={symbol}
      theme={Themes.LIGHT}
      locale="en"
      ref={tradingRef}
      IntervalTypes={IntervalTypes.D}
      autosize
    />
  );
};
export default TradingChart;
