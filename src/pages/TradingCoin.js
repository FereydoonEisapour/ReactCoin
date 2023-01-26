import React from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import firebase from "firebase/compat/app";
import { dbCoins, dbOrders, dbTrades } from "../data/db";
import { Balance, Loading } from "../components";
import { OrderItem } from '../components/TradeItems'
import TradingChart from "./../components/TradingChart";
import "../assets/styles/trade.css"
import "../assets/styles/tradeingCoin.css";
import { Trades, Orders } from './../components'

const TradingCoin = () => {
  const { coin } = useParams();

  const { userEmail } = useAuthState();
  const [coinPriceLive, setCoinPriceLive] = React.useState(Number);

  const [usdtWallet, setUsdtWallet] = React.useState(Number);
  const [usdtWalletId, setUsdtWalletId] = React.useState("");

  const [coinTrade, setCoinTrade] = React.useState(Number);
  const [coinTradeId, setCoinTradeId] = React.useState("");

  const [usdtInput, setUsdtInput] = React.useState("");
  const [coinInput, setCoinInput] = React.useState("");

  const [calcOrder, setCalcOrder] = React.useState(Number);
  const [orders, setOrders] = React.useState([]);



  const [orderType, setOrderType] = React.useState(true)
  const [btnDisabled, setBtnDisabled] = React.useState(false)



  React.useEffect(() => {
    if (orderType === true) {
      calcOrder > usdtWallet ? setBtnDisabled(true) : setBtnDisabled(false)
      if (usdtWallet === 0) setBtnDisabled(true)
      if (coinInput === 0) { setBtnDisabled(true) }
      if (usdtInput === 0) { setBtnDisabled(true) }
    }
    if (orderType === false) {
      coinInput > coinTrade ? setBtnDisabled(true) : setBtnDisabled(false)
      if (coinTrade === 0) { setBtnDisabled(true) }
      if (coinInput === 0) { setBtnDisabled(true) }
      if (usdtInput === 0) { setBtnDisabled(true) }
    }

  }, [calcOrder, usdtWallet, coinInput, coinTrade, orderType, usdtInput])
  const orderTypeHandler = (e) => {
    if (e.target.outerText === "Sell") setOrderType(false)
    if (e.target.outerText === "Buy") setOrderType(true)
  }
  const usdtInputHandler = (e) => {
    setUsdtInput(Number(e.target.value));
    setCalcOrder(usdtInput * coinInput);
  };
  const coinInputHandler = (e) => {
    setCoinInput(Number(e.target.value));
    setCalcOrder(usdtInput * coinInput);
  };
  React.useEffect(() => {
    setCalcOrder(usdtInput * coinInput);
  }, [coinInput, usdtInput]);

  // * GET USDT
  React.useEffect(() => {
    if (userEmail) {
      dbCoins(userEmail).where("coin", "==", "USDT").onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          dbCoins(userEmail).add({
            coin: "USDT",
            amount: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          dbCoins(userEmail).where("coin", "==", "USDT").onSnapshot((snapshot) => {
            setUsdtWallet(snapshot.docs[0].data().amount);
            setUsdtWalletId(snapshot.docs[0].id);
          });
        }
      });
    }
  }, [userEmail]);
  // * GET COIN OR CREATE COIN
  React.useEffect(() => {
    if (userEmail) {
      dbCoins(userEmail).where("coin", "==", `${coin.toLocaleUpperCase()}`).onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          dbCoins(userEmail).add({
            coin: coin.toLocaleUpperCase(),
            amount: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          dbCoins(userEmail).where("coin", "==", `${coin.toLocaleUpperCase()}`).onSnapshot((snapshot) => {
            setCoinTrade(snapshot.docs[0].data().amount);
            setCoinTradeId(snapshot.docs[0].id);
          });
        }
      });
    }

  }, [coin, userEmail]);
  //*  CREATE ORDER
  const setOrderHandler = () => {
    if (calcOrder > 0) {
      if (orderType === true) {
        dbOrders(userEmail).add({
          coin: coin.toLocaleLowerCase(),
          type: orderType,
          amount: coinInput,
          inPrice: usdtInput,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        const newWaletUsdts = usdtWallet - Number(usdtInput * coinInput);
        dbCoins(userEmail).doc(usdtWalletId).set({ amount: newWaletUsdts }, { merge: true });
      }
      if (orderType === false) {
        dbOrders(userEmail).add({
          coin: coin.toLocaleLowerCase(),
          type: orderType,
          amount: coinInput,
          inPrice: usdtInput,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        const newCoinAmount = coinTrade - Number(coinInput)
        dbCoins(userEmail).doc(coinTradeId).set({ amount: newCoinAmount }, { merge: true });
      }
    }
  };
  // // * GET ORDERS FROM API
  // React.useEffect(() => {
  //   if (userEmail) {
  //     dbOrders(userEmail).orderBy("inPrice", "desc").onSnapshot((snapshot) => {
  //       setOrders(snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         type: doc.data().type,
  //         coin: doc.data().coin,
  //         amount: Number(doc.data().amount),
  //         inPrice: Number(doc.data().inPrice),
  //       })));
  //     });
  //   }

  // }, [userEmail]);



  // *  ORDER TO TRADE => // DELL ORDER // ADD TRADE // USDT WALLET DEC//
  React.useEffect(() => {
    if (userEmail) {
      if (orders.length > 0) {
        const orderMatchFind = orders.find((item) => item.inPrice === Number(coinPriceLive));
        if (orderMatchFind !== undefined) {
          dbTrades(userEmail).add({
            coin: coin,
            type: orderMatchFind.type,
            amount: Number(orderMatchFind.amount),
            inPrice: Number(orderMatchFind.inPrice),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          dbOrders(userEmail).doc(orderMatchFind.id).delete();
          if (orderType === true) {
            const newCoinAmount = coinTrade + Number(orderMatchFind.amount);
            dbCoins(userEmail).doc(coinTradeId).set({ amount: newCoinAmount }, { merge: true });
          }
          if (orderType === false) {
            const newWaletUsdts = usdtWallet + Number(orderMatchFind.inPrice * orderMatchFind.amount);
            dbCoins(userEmail).doc(usdtWalletId).set({ amount: newWaletUsdts }, { merge: true });
          }
          navigator.vibrate(100)
        }
      }
    }

  }, [coin, coinPriceLive, coinTrade, coinTradeId, orderType, orders, usdtWallet, usdtWalletId, userEmail]);
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
      {/*  Trade */}
      <div className="trade row   m-2  content-cointainer rounded-3 ">
        <div className="trade-tabs pt-5">
          <div className="tabs " >
            <input type="radio" id="radio-1" name="tabs" checked={orderType} readOnly />
            <label className="tab text-black " htmlFor="radio-1 " onClick={e => orderTypeHandler(e)}>Buy</label>
            <input type="radio" id="radio-2" name="tabs" checked={!orderType} readOnly />
            <label className="tab text-black" htmlFor="radio-2" onClick={e => orderTypeHandler(e)}>Sell</label>
            <span className="glider  "></span>
          </div>
        </div>
        <div className="p-4 mt-2 ">
          <div className="coinName fw-bold text-center py-4 display-6">
            {coin.toLocaleUpperCase()} / USDT
          </div>
          <div className="input-group mb-3 px-4">
            <span className="input-group-text" style={{ padding: "8px  18px" }} id="inputGroup-sizing-default"> USDT</span>
            <input value={usdtInput} onChange={(e) => usdtInputHandler(e)} type="number" className="form-control" min="0" />
          </div>
          <div className="input-group mb-3 px-4">
            <span className="input-group-text  " style={{ padding: "8px  24px" }} id="inputGroup-sizing-default">
              {coin.toUpperCase()}
            </span>
            <input value={coinInput} onChange={(e) => coinInputHandler(e)} type="number" className="form-control" min="0" />
          </div>
        </div>
        <div className="  mb-3 px-4 text-center">

          {userEmail ?
            (<button className="btn  btn-primary w-50" disabled={btnDisabled}
              onClick={(e) => setOrderHandler(e)}>
              {orderType ? " Buy" : "Sell"}
            </button>)
            : (
              <button className="btn  btn-primary w-50" disabled={true}
              >
                Please Login
              </button>
            )}

        </div>
      </div>
      {/*End  Trade */}
      {/*  Trading Chart  */}
      <div className="chart  m-2 rounded-3  ">{<TradingChart />}</div>
      {/*End  Trading Chart  */}
      {/* Balance */}
      {
        userEmail ?
          (<div className="balance  m-2 p-3 content-cointainer rounded-3">
            <Balance />
          </div>)
          :
          (null)
      }
      {/*End  Balance */}
      <Orders />
      <Trades />
    </div>
  );
};

export default TradingCoin;







