import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CoinPriceLive from "./../components/CoinPriceLive";
import toast from "react-hot-toast";
const BuyFastCoins = () => {
  const { coin } = useParams();
  console.log(coin);
  const [USDTWallet, setUSDTWallet] = useState(100000); //! Get Api  Send Api
  const [coinPriceLive, setCoinPriceLive] = useState(Number); //*  BTC PRICE
  //const [USDTInput, setUSDTInput] = useState(0); //!
  const [USDTInput, setUSDTInput] = useState(Number); //! BTC INPUT
  const [BTCPrice, setBTCPrice] = useState(Number); //  !  BTC PRICE from Coingecko
  const [btcCanBuy, setBtcCanBuy] = useState(Number);
  const [USDTPay, setUSDTPay] = useState(Number);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const inputRef = useRef();

  const USDTInputHandler = (event) => {
    const usdtAmount = parseFloat(event.target.value);
    if (usdtAmount === 0) {
      inputRef.current(0);
    }
    if (usdtAmount > USDTWallet) {
      toast.error("not enough USDT , Please Deposit");
    } else if (usdtAmount > 0) {
      const order = USDTWallet / coinPriceLive;
      console.log(USDTWallet + ":" + coinPriceLive);
      console.log(order);
    }
    //  usdtAmount.replace(/^0+/, "");
    setUSDTInput(usdtAmount);
    setUSDTPay((BTCPrice * usdtAmount).toFixed(1));
    if (usdtAmount === 0) setUSDTPay(0);
  };

  // useEffect(() => {
  //   fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
  //     .then((response) => response.json())
  //     .then((data) => setBTCPrice(data.market_data.current_price.usd))
  //     .catch((err) => console.error(err));
  // }, []);
  // * GET COIN PRICE FROM BINANCE API
  useEffect(() => {
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");

    binanceSocket.onopen = function () {
      binanceSocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: coin === "USDT" ? [`usdc${coin}@trade`] : [`${coin}USDT@trade`],
          //   params: [`${symbol}USDT@trade`],
          id: 1,
        })
      );
    };
    binanceSocket.onmessage = function (event) {
      const BtcPriceNow = JSON.parse(event.data);
      const price = parseFloat(BtcPriceNow.p).toFixed(0);
      if (isNaN(price) === false) {
        setCoinPriceLive(Number(price));
      }
    };
  }, [coin]);
  return (
    <>
      <div className="d-flex justify-content-center align-content-center">
        <div className="w-50 m-3 p-3 rounded-4 bg-white">
          {coinPriceLive}
          <div className=" text-center text-dark p-4 fw-bold">Best Market Price </div>
          <div className=" text-center text-dark p-1 fw-bold">{coin.toUpperCase()}</div>
          <div className="">
            <div className="input-group mb-3 px-4">
              <input
                onChange={(event) => USDTInputHandler(event)}
                value={USDTInput}
                type="number"
                className="form-control "
                // min="0"
                // max="21000000"
                // placeholder=""
              />
              <span
                className="input-group-text   border border-0 fw-bold"
                style={{ padding: "8px  50px" }}
                id="inputGroup-sizing-default"
              >
                USDT
              </span>
            </div>
          </div>
          <div className="  mb-3 px-4">
            <button
              className="btn  btn-primary w-100"
              //  disabled={USDTPay > USDTWallet}
              // disabled={USDTPay > USDTWallet}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyFastCoins;

{
  /* 
          <div className="input-group   mb-3 px-4 d-flex ">
            <span className="input-group-text w-75 border border-0 ">BTC PRICE</span>
            <span className="input-group-text w-25 border border-0 ">{BTCPrice}</span>
          </div> */
}

{
  /* <div className="input-group   mb-3 px-4 d-flex">
          <span className="input-group-text w-75 border border-0  fw-bold ">USDT</span>
          <span className="input-group-text w-25 border border-0 fw-bold">{USDTWallet}</span>
        </div> */
}
{
  /* <div className="input-group   mb-3 px-4 d-flex">
          <span className="input-group-text w-75 border border-0 ">You Pay : </span>
          <span className="input-group-text w-25 border border-0 ">{USDTPay}</span>
        </div> */
}
