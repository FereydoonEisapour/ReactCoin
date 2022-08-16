import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CoinPriceLive from "./../components/CoinPriceLive";
const BuyFastCoins = () => {
  const { coin } = useParams();

  const [usdtWallet, setUsdtWallet] = useState(100000); //! Get Api  Send Api
  //const [usdtInput, setUsdtInput] = useState(0); //!
  const [btcInput, setBtcInput] = useState(Number); //! BTC INPUT
  const [BTCPrice, setBTCPrice] = useState(Number); //  !  BTC PRICE from Coingecko
  const [btcCanBuy, setBtcCanBuy] = useState(Number);
  const [usdtPay, setUsdtPay] = useState(Number);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const inputRef = useRef();

  const btcInputHandler = (event) => {
    const btcAmount = parseFloat(event.target.value);
    if(btcAmount===0){inputRef.current(0)}
    
    //  btcAmount.replace(/^0+/, "");
    setBtcInput(btcAmount);
    setUsdtPay((BTCPrice * btcAmount).toFixed(1));
    if (btcAmount === 0) setUsdtPay(0);
  };

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
      .then((response) => response.json())
      .then((data) => setBTCPrice(data.market_data.current_price.usd))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="">{/* <CoinPriceLive symbol={coin} /> */}</div>
      <div className="w-50 m-3 p-3 border border-1 ">
        <div className="pb-3 text-center text-dark">Buy {coin.toLocaleUpperCase()}</div>
        <div className="">
          <div className="input-group mb-3 px-4">
            <span
              className="input-group-text   border border-0"
              style={{ padding: "8px  50px" }}
              id="inputGroup-sizing-default"
            >
              {coin.toUpperCase()}
            </span>
            <input
              onChange={(event) => btcInputHandler(event)}
              value={btcInput}
              type="number"
              className="form-control  border border-0"
              min="0"
              max="21000000"
              placeholder=""
            />
          </div>

          <div className="input-group   mb-3 px-4 d-flex ">
            <span className="input-group-text w-75 border border-0 ">BTC PRICE</span>
            <span className="input-group-text w-25 border border-0 ">{BTCPrice}</span>
          </div>
        </div>
        <div className="input-group   mb-3 px-4 d-flex">
          <span className="input-group-text w-75 border border-0 ">USDT in WALLET</span>
          <span className="input-group-text w-25 border border-0 ">{usdtWallet}</span>
        </div>
        <div className="input-group   mb-3 px-4 d-flex">
          <span className="input-group-text w-75 border border-0 ">You Pay : </span>
          <span className="input-group-text w-25 border border-0 ">{usdtPay}</span>
        </div>
        <div className="  mb-3 px-4">
          <button className="btn  btn-primary w-100" disabled={usdtPay > usdtWallet}>
            Buy now
          </button>
        </div>
      </div>
    </>
  );
};

export default BuyFastCoins;
