import React from 'react'
import LoadingComponent from './LoadingComponent';

function BinanceLivePrice({ coin }) {
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
  return (
    <div className="livePrice  d-flex justify-content-between  m-2 p-1 content-cointainer   rounded-3">
      <div className="coinName fw-bold p-3">{coin.toLocaleUpperCase()} / USDT</div>
      <div className="coinPrice fw-bolder display-6 px-4 mt-2">{coinPriceLive === 0 ? <LoadingComponent /> : coinPriceLive}</div>
    </div>
  )
}

export default BinanceLivePrice