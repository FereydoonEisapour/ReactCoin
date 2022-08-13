import React from "react";

const CoinDeatils = () => {
  //   const [btcPriceBinance, setBtcPriceBinance] = useState();
  //   const [lastBtcPriceBinance, setLastBtcPriceBinance] = useState(null);

  //   const [priceArrow, setPriceArrow] = useState(true);
  //   const [arrowColor, setArrowColor] = useState();

  //   useEffect(() => {
  //     const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");

  //     binanceSocket.onopen = function () {
  //       binanceSocket.send(
  //         JSON.stringify({
  //           method: "SUBSCRIBE",
  //           params: ["btcusdt@trade"],
  //           id: 1,
  //         })
  //       );
  //     };
  //     binanceSocket.onmessage = function (event) {
  //       const BtcPriceNow = JSON.parse(event.data);

  //       setBtcPriceBinance(parseFloat(BtcPriceNow.p).toFixed(0));

  //       if (btcPriceBinance > lastBtcPriceBinance) {
  //         setPriceArrow(true);
  //       }
  //       setLastBtcPriceBinance(btcPriceBinance);
  //     };
  //   }, [btcPriceBinance, lastBtcPriceBinance]);

  return (
    <>
      <h1>Coin Details</h1>
    </>
  );
};

export default CoinDeatils;

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
