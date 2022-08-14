import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const CoinPriceLive = (props) => {
  const { coin } = useParams();
  const [btcPriceBinance, setBtcPriceBinance] = useState(Number);

  useEffect(() => {
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");

    binanceSocket.onopen = function () {
      const coinL = coin;
      binanceSocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${coinL}usdt@trade`],
          id: 1,
        })
      );
    };
    binanceSocket.onmessage = function (event) {
      const BtcPriceNow = JSON.parse(event.data);
      const price = parseFloat(BtcPriceNow.p).toFixed(4);
      if (isNaN(price) === false) {
        setBtcPriceBinance(price);
      }
    };
  }, []);

  return (
    <>
      <div>{btcPriceBinance}</div>
    </>
  );
};

export default CoinPriceLive;

// let { coin } = useParams();

// const [btcPriceBinance, setBtcPriceBinance] = useState();
// const [lastBtcPriceBinance, setLastBtcPriceBinance] = useState(null);

// const [priceArrow, setPriceArrow] = useState(true);
// const [arrowColor, setArrowColor] = useState();

// useEffect(() => {
//   const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");

//   binanceSocket.onopen = function () {
//     binanceSocket.send(
//       JSON.stringify({
//         method: "SUBSCRIBE",
//         params: ["btcusdt@trade"],
//         id: 1,
//       })
//     );
//   };
//   binanceSocket.onmessage = function (event) {
//     const BtcPriceNow = JSON.parse(event.data);

//     setBtcPriceBinance(parseFloat(BtcPriceNow.p).toFixed(0));

//     if (btcPriceBinance > lastBtcPriceBinance) {
//       setPriceArrow(true);
//     }
//     setLastBtcPriceBinance(btcPriceBinance);
//   };
// }, []);

// if (btcPrice > lastBtcPrice) {
//   setPriceArrow("up");
//   console.log("up");
// }
// if (btcPrice < lastBtcPrice) {
//   setPriceArrow("down");
//   console.log("down");
// }
// lastBtcPrice=btcPrice
// if (BtcPriceNow < lastBtcPrice && isNaN(BtcPriceNow) === false) {
//   // setPriceArrow("↓");
//   setPriceArrow("down");
//   setArrowColor("red");
// } else if (BtcPriceNow > lastBtcPrice && isNaN(BtcPriceNow) === false) {
//   // setPriceArrow("↑");
//   setPriceArrow("up");
//   setArrowColor("green");
// } else if (BtcPriceNow === lastBtcPrice && isNaN(BtcPriceNow) === false) {
//   setPriceArrow("=");
//   setArrowColor("black");
// }
