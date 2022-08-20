import React from "react";
import firebase from "firebase/compat/app";
import { Navigate, useParams } from "react-router-dom";
import "../assets/styles/tradeingCoin.css";
import { Balance, OrderItem, TradeItem } from "../components";
import { useAuthState } from "../contexts/AuthContext";
import TradingChart from "./../components/TradingChart";
import db from "./../data/Firebase";

const TradingCoin = () => {
  const { coin } = useParams();

  const { user } = useAuthState();
  const [coinPriceLive, setCoinPriceLive] = React.useState(Number);

  const [usdtWallet, setUsdtWallet] = React.useState(Number);
  const [usdtWalletId, setUsdtWalletId] = React.useState("");

  const [coinTrade, setCoinTrade] = React.useState(Number);
  const [coinTradeId, setCoinTradeId] = React.useState("");

  const [usdtInput, setUsdtInput] = React.useState("");
  const [coinInput, setCoinInput] = React.useState("");

  const [calcOrder, setCalcOrder] = React.useState(Number);
  const [orders, setOrders] = React.useState([]);

  const [trades, setTrades] = React.useState([]);

  const usdtInputHandler = (event) => {
    setUsdtInput(Number(event.target.value));
    setCalcOrder(usdtInput * coinInput);
  };
  const coinInputHandler = (event) => {
    setCoinInput(Number(event.target.value));
    setCalcOrder(usdtInput * coinInput);
  };
  React.useEffect(() => {
    setCalcOrder(usdtInput * coinInput);
  }, [coinInput, usdtInput]);

  // * GET USDT  FROM API
  React.useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("coins")
      .where("coin", "==", "USDT")
      .onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          db.collection(user.email).doc(user.email).collection("coins").add({
            coin: "USDT",
            amount: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          db.collection(user.email)
            .doc(user.email)
            .collection("coins")
            .where("coin", "==", "USDT")
            .onSnapshot((snapshot) => {
              setUsdtWallet(snapshot.docs[0].data().amount);
              setUsdtWalletId(snapshot.docs[0].id);
            });
        }
      });
  }, [user.email]);

  // * GET COIN OR CREATE COIN
  React.useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("coins")
      .where("coin", "==", `${coin.toLocaleUpperCase()}`)
      .onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          db.collection(user.email).doc(user.email).collection("coins").add({
            coin: coin.toLocaleUpperCase(),
            amount: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          db.collection(user.email)
            .doc(user.email)
            .collection("coins")
            .where("coin", "==", `${coin.toLocaleUpperCase()}`)
            .onSnapshot((snapshot) => {
              setCoinTrade(snapshot.docs[0].data().amount);
              setCoinTradeId(snapshot.docs[0].id);
            });
        }
      });
    return () => {};
  }, [coin, user.email]);
  // * Add Order To API
  //* CREATE ORDER
  const setOrderHandler = (e) => {
    e.preventDefault();
    if (calcOrder === 0) return;
    db.collection(user.email).doc(user.email).collection("orders").add({
      coin: coin.toLocaleLowerCase(),
      amount: coinInput,
      inPrice: usdtInput,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  // * GET ORDERS FROM API
  React.useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("orders")
      .orderBy("inPrice", "desc")
      .onSnapshot((snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            coin: doc.data().coin,
            amount: Number(doc.data().amount),
            inPrice: Number(doc.data().inPrice),
          }))
        );
      });
  }, [user.email]);
  // *GET TRADES FROM API
  React.useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("trades")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTrades(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            coin: doc.data().coin,
            amount: doc.data().amount,
            inPrice: doc.data().inPrice,
          }))
        );
      });
  }, [user.email]);
  // *  ORDER TO TRADE => // DELL ORDER // ADD TRADE // USDT WALLET DEC//
  React.useEffect(() => {
    if (orders.length > 0) {
      const orderMatchFind = orders.find((item) => item.inPrice === Number(coinPriceLive));
      if (orderMatchFind !== undefined) {
        db.collection(user.email)
          .doc(user.email)
          .collection("trades")
          .add({
            coin: coin,
            amount: Number(orderMatchFind.amount),
            inPrice: Number(orderMatchFind.inPrice),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        db.collection(user.email)
          .doc(user.email)
          .collection("orders")
          .doc(orderMatchFind.id)
          .delete();

        const newWaletUsdts = usdtWallet - Number(orderMatchFind.inPrice);
        const newCoinAmount = coinTrade + Number(orderMatchFind.amount);
        db.collection(user.email).doc(user.email).collection("coins").doc(usdtWalletId).set(
          {
            amount: newWaletUsdts,
          },
          {
            merge: true,
          }
        );
        db.collection(user.email)
          .doc(user.email)
          .collection("coins")
          .doc(coinTradeId)
          .set({ amount: newCoinAmount }, { merge: true });
      }
    }
  }, [coin, coinPriceLive, coinTrade, coinTradeId, orders, usdtWallet, usdtWalletId, user.email]);
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
    binanceSocket.onmessage = function (event) {
      const BtcPriceNow = JSON.parse(event.data);
      const price = parseFloat(BtcPriceNow.p).toFixed(0);
      if (isNaN(price) === false) {
        setCoinPriceLive(Number(price));
      }
    };
  }, [coin]);

  if (!user) return <Navigate to="/" />;
  return (
    <div className="containerTrade ">
      <div className="livePrice  d-flex justify-content-between  m-2 p-1 bg-white rounded-3">
        <div className="coinName fw-bold p-3">{coin.toLocaleUpperCase()} / USDT</div>
        <div className="coinPrice fw-bolder display-6 px-4">{coinPriceLive}</div>
      </div>
      <div className="trade row   m-2 p-3 bg-white rounded-3">
        <div className="p-4 mt-5">
          <div className="coinName fw-bold text-center py-4 display-6">
            {coin.toLocaleUpperCase()} / USDT
          </div>
          <div className="input-group mb-3 px-4">
            <span
              className="input-group-text"
              style={{ padding: "8px  18px" }}
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
              style={{ padding: "8px  24px" }}
              id="inputGroup-sizing-default"
            >
              {coin.toUpperCase()}
            </span>
            <input
              value={coinInput}
              onChange={(event) => coinInputHandler(event)}
              type="number"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
        </div>
        <div className="  mb-3 px-4">
          <button
            className="btn  btn-primary w-100"
            disabled={calcOrder > usdtWallet}
            onClick={(e) => setOrderHandler(e)}
          >
            Buy
          </button>
          <span>{calcOrder > usdtWallet ? "Please Deposit USDT" : ""}</span>
        </div>
      </div>

      <div className="chart  m-2 rounded-3 ">{<TradingChart autosize className="" />}</div>
      <div className="balance  m-2 p-3 bg-white rounded-3">
        <Balance />
      </div>
      <div className="order  m-2 p-3 bg-white rounded-3">
        <h3 className="text-center">Orders</h3>
        {orders.map((order) => (
          <OrderItem
            key={order.id}
            coin={order.coin}
            amount={order.amount}
            inPrice={order.inPrice}
            id={order.id}
          />
        ))}
      </div>
      <div className="trades  m-2 p-3 bg-white rounded-3">
        <h3 className="text-center">Trades History</h3>
        {trades.map((trade) => (
          <TradeItem
            key={trade.id}
            id={trade.id}
            coin={trade.coin}
            amount={trade.amount}
            inPrice={trade.inPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default TradingCoin;