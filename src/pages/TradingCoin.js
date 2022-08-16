import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CoinPriceLive from "../components/CoinPriceLive";
import TradingChart from "./../components/TradingChart";
const TradingCoin = () => {
  // const { coin } = useParams();
  const coin = "eth";
  const [BTC, setBTC] = useState(Number); //  !  BTC PRICE

  const [usdtWallet, setUsdtWallet] = useState(100000); //! USDST Wallet

  const [usdtInput, setUsdtInput] = useState(1); //! USDT INPUT
  const [btcInput, setBtcInput] = useState(1); //! BTC INPUT

  const [btcBuy, setBtcBuy] = useState(Number);
  const [orders, setOrders] = useState([]);

  const [trades, setTrades] = useState([]);

  const usdtInputHandler = (event) => {
    setUsdtInput(event.target.value);
    setBtcBuy(usdtInput * btcInput);
  };
  const btcInputHandler = (event) => {
    setBtcInput(event.target.value);
    setBtcBuy(usdtInput * btcInput);
  };
  useEffect(() => {
    setBtcBuy(usdtInput * btcInput);
  }, [btcInput, usdtInput]);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
      .then((response) => response.json())
      .then((data) => setBTC(data.market_data.current_price.usd))

      .catch((err) => console.error(err));
  }, []);

  const setOrderHandler = (e) => {
    e.preventDefault();
    if (btcBuy === 0) return;
    const newOrder = {
      id: Date.now(),
      ordersCoinName: coin.toUpperCase(),
      orderCoinAmount: btcInput,
      orderCointPrice: usdtInput,
    };
    setOrders([...orders, newOrder]);
    // todo  Your recent orders
    // Side	Order price	the amount of	currency	Total Amount	full	Actions
    // Buy	17,000	0.045	BTC	765 Tether	0%	Cancel the order
  };
  const priceRef = useRef();
  //const [orderMatch, setOrderMatch] = useState([]);

  useEffect(() => {
    if (BTC && orders.length > 0) {
      setInterval(() => {
        const priceNow = priceRef.current.innerText;
        // if (priceNow === orders[0].orderCointPrice) {
        //   confirmOrder();
        // }
        const orderMatchFind = orders.find((item) => item.orderCointPrice === priceNow);
        //if (orderMatchFind === true)
        if (orderMatchFind !== undefined) {
          //  setOrderMatch(orderMatchFind);
          setOrders(orders.filter((item) => item.id !== orderMatchFind.id));

          ///////////////////////////////
          const newTrade = {
            id: Date.now(),
            tradeCoinName: coin.toUpperCase(),
            tradeCoinAmount: orderMatchFind.orderCoinAmount,
            tradeCoinPrice: orderMatchFind.orderCointPrice,
          };
          setTrades([...trades, newTrade]);
          setUsdtWallet(usdtWallet - orderMatchFind.orderCointPrice);
        }
      }, 10);
    }
  }, [BTC, orders, trades, usdtWallet]);

  return (
    <>
      <div className="d-flex row">
        <div className="trade d-flex">
          <div className="w-50 m-3 p-3 border border-1">
            <div className="pb-3 text-center text-dark">Buy {coin.toLocaleUpperCase()}</div>
            <div className="">
              <div className="input-group mb-3 px-4">
                <span
                  className="input-group-text"
                  style={{ padding: "8px  44px" }}
                  id="inputGroup-sizing-default"
                >
                  USDT
                </span>
                <input
                  value={usdtInput}
                  onChange={(event) => usdtInputHandler(event)}
                  type="number"
                  className="form-control"
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
                  value={btcInput}
                  onChange={(event) => btcInputHandler(event)}
                  type="number"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <div className="input-group   mb-3 px-4 d-flex">
                <span className="input-group-text w-75 border border-0 ">USDT in WALLET</span>
                <span className="input-group-text w-25 border border-0 ">{usdtWallet}</span>
              </div>
            </div>
            <div className="">You recived : {btcBuy}</div>
            <div className="  mb-3 px-4">
              <button
                className="btn  btn-primary w-100"
                disabled={btcBuy > usdtWallet}
                onClick={(e) => setOrderHandler(e)}
              >
                Buy
              </button>
              <span>{btcBuy > usdtWallet ? "Please Deposit USDT" : ""}</span>
            </div>
            <h1>Orders</h1>
            {orders.length
              ? orders.map((item) => (
                  <div
                    className="d-flex justify-content-between border border-1 p-1 m-3"
                    key={item.id}
                  >
                    <div className="">{item.ordersCoinName}</div>
                    <div className="">{item.orderCoinAmount}</div>
                    <div className="">{item.orderCointPrice}</div>
                  </div>
                ))
              : null}
            <hr />
            <h1>Trades</h1>
            {trades.length > 0
              ? trades.map((item) => (
                  <div
                    className="d-flex justify-content-between border border-1 p-1 m-3"
                    key={item.id}
                  >
                    <div className=""> You Buy </div>
                    <div className=""> : {item.tradeCoinAmount}</div>
                    <div className=""> {item.tradeCoinName}</div>
                    <div className=""> in {item.tradeCoinPrice} USDT</div>
                  </div>
                ))
              : null}
          </div>
          <div
            className="display-3 d-flex justify-content-center align-items-center w-50"
            ref={priceRef}
          >
            {/* {BTC} */}
            <CoinPriceLive symbol={coin} />
          </div>
        </div>
        <div className="chart  justify-content-center">
          <div className="w-75"></div>
            <TradingChart />
        </div>
      </div>
    </>
  );
};

export default TradingCoin;
