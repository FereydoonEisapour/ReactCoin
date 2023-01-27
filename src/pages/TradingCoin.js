import React from "react";
import { useParams } from "react-router-dom";
import { Balance, Trades, Orders, Trade, BinanceLivePrice } from "../components";
import TradingChart from "./../components/TradingChart";
import "../assets/styles/trade.css"
import "../assets/styles/tradeingCoin.css";

const TradingCoin = () => {
  const { coin } = useParams();

  // if (!userEmail) return <Navigate to="/" />;
  return (
    <div className="containerTrade col-md-12 p-2 text-color">
      <BinanceLivePrice coin={coin} />
      <Trade coin={coin} />
      <TradingChart />
      <Balance />
      <Orders />
      <Trades />
    </div>
  );
};

export default TradingCoin;







