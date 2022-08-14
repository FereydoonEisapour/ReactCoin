import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TradingViewWidget, { Themes, IntervalTypes } from "react-tradingview-widget";
import styled from "styled-components";

const TradingChart = () => {
  const { coin } = useParams();
  const tradingRef = useRef(null);
  const [symbol, setSymbol] = useState("BTCUSDT");

  useEffect(() => {
    //  console.log(tradingRef.current.props.symbol);
    setSymbol(`${coin.toUpperCase()}USDT`);
  }, [coin]);

  return (
    <div>
      <TradingViewWidget
        symbol={symbol}
        theme={Themes.LIGHT}
        locale="en"
        ref={tradingRef}
        IntervalTypes={IntervalTypes.W}
      />
    </div>
  );
};
export default TradingChart;
