import React from "react";
import { useParams } from "react-router-dom";
const CoinPriceLive = ({ symbol }) => {
  const { coin } = useParams();
  const [btcPriceBinance, setBtcPriceBinance] = React.useState(Number);
  React.useEffect(() => {
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");
    binanceSocket.onopen = function () {
      binanceSocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: symbol === "usdt" ? [`usdc${symbol}@trade`] : [`${symbol}usdt@trade`],
          //   params: [`${symbol}usdt@trade`],
          id: 1,
        })
      );
    };
    binanceSocket.onmessage = function (event) {
      const BtcPriceNow = JSON.parse(event.data);
      const price = parseFloat(BtcPriceNow.p).toFixed(0);
      if (isNaN(price) === false) {
        setBtcPriceBinance(price);
      }
    };
  }, [coin, symbol]);
  return (
    <>
      <div>
        {btcPriceBinance ? (
          btcPriceBinance
        ) : (
          <div className="spinner-grow spinner-grow-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </>
  );
};
export default CoinPriceLive;
