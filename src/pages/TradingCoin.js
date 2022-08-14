import React from "react";
import { useParams } from "react-router-dom";

const TradingCoin = () => {
  const { coin } = useParams();

  return <div>TradingCoin {coin.toUpperCase()}</div>;
};

export default TradingCoin;
