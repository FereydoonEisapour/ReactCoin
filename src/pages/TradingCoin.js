import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinPriceLive from "./../components/CoinPriceLive";
const TradingCoin = () => {
  const { coin } = useParams();

  const [usdtWallet, setUsdtWallet] = useState(10000); //! USDST Wallet
  const [usdtInput, setUsdtInput] = useState(0); //! USDT INPUT
  const [btcInput, setBtcInput] = useState(0); //! BTC INPUT
  const [btcCanBuy, setBtcCanBuy] = useState();
  const usdtInputHandler = (event) => {
    setUsdtInput(event.target.value);
    setBtcCanBuy(usdtInput / btcInput);
  };
  const btcInputHandler = (event) => {
    setBtcInput(event.target.value);
    setBtcCanBuy(usdtInput / btcInput);
  };
  console.log(usdtInput + ": " + btcInput);
  console.log(usdtInput / btcInput);
  const [BTC, setBTC] = useState(Number); //  !  BTC PRICE

  // if (usdtInput > 0 && btcInput > 0) {
  //   setBtcCanBuy(usdtInput / btcInput);
  // }
  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
      .then((response) => response.json())
      .then(
        (data) => setBTC(data.market_data.current_price.usd)
        //||
        // setBtcCanBuy((usdtWallet / data.market_data.current_price.usd).toFixed(4))
      )

      .catch((err) => console.error(err));
  }, []);
  // const btcBuy = () => {
  //   console.log("buy");
  //   console.log(usdtTotal, BTC);
  //   setBtcCanBuy(usdtTotal / BTC);
  // };

  return (
    <>
      <div className="">
        {BTC} {/* <CoinPriceLive symbol={coin} /> */}
      </div>
      <div className="w-50 m-3 p-3 border border-1">
        <div className="pb-3 text-center text-dark">Buy {coin.toLocaleUpperCase()}</div>
        <div className="">
          <div className="input-group mb-3 px-4">
            <span
              className="input-group-text"
              style={{ padding: "8px  44px" }}
              id="inputGroup-sizing-default"
            >
              USDT in Wallet
            </span>
            <input
              value={usdtWallet}
              readOnly
              type="number"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
          <div className="input-group mb-3 px-4">
            <span
              className="input-group-text  "
              style={{ padding: "8px  50px" }}
              id="inputGroup-sizing-default"
            >
              {coin.toUpperCase()}
            </span>
            <input
              // value={BTC}
              onChange={(event) => btcInputHandler(event)}
              type="number"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>

          <div className="input-group mb-3 px-4">
            <span
              className="input-group-text"
              style={{ padding: "8px  44px" }}
              id="inputGroup-sizing-default"
            >
              USDT
            </span>
            <input
              // value={usdtTotal}
              onChange={(event) => usdtInputHandler(event)}
              type="number"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
        </div>
        <div className="">You recived : {btcCanBuy}</div>
      </div>
    </>
  );
};

export default TradingCoin;
