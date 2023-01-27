import React from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import firebase from "firebase/compat/app";
import { dbCoins, dbOrders, dbTrades } from "../data/db";
import { Balance, Loading } from "../components";

import TradingChart from "./../components/TradingChart";
import "../assets/styles/trade.css"
import "../assets/styles/tradeingCoin.css";
import { Trades, Orders } from './../components'
import Trade from "../components/Trade";

const TradingCoin = () => {
  const { coin } = useParams();

  // const { userEmail } = useAuthState();
  const [coinPriceLive, setCoinPriceLive] = React.useState(Number);

  // * GET COIN PRICE FROM BINANCE API
  React.useEffect(() => {
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");
    binanceSocket.onopen = function () {
      binanceSocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          //  params: coin === "usdt" ? [`usdc${coin}@trade`] : [`${coin}usdt@trade`],
          params: [`${coin}usdt@trade`],
          id: 1,
        })
      );
    };
    binanceSocket.onmessage = function (e) {
      const BtcPriceNow = JSON.parse(e.data);
      const price = parseFloat(BtcPriceNow.p).toFixed(0);
      if (isNaN(price) === false) {
        setCoinPriceLive(Number(price));
      }
    };
  }, [coin]);
  // if (!userEmail) return <Navigate to="/" />;
  return (
    <div className="containerTrade col-md-12 p-2 text-color">
      {/* Live Price from Binance  */}
      <div className="livePrice  d-flex justify-content-between  m-2 p-1 content-cointainer   rounded-3">
        <div className="coinName fw-bold p-3">{coin.toLocaleUpperCase()} / USDT</div>
        <div className="coinPrice fw-bolder display-6 px-4 mt-2">{coinPriceLive === 0 ? <Loading /> : coinPriceLive}</div>
      </div>
      {/*End Live Price from Binance  */}
      <Trade coin={coin} />
      <TradingChart />
      <Balance />
      <Orders />
      <Trades />
    </div>
  );
};

export default TradingCoin;







