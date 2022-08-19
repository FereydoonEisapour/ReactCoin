import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import CoinPriceLive from "../components/CoinPriceLive";
import { useAuthState } from "../contexts/AuthContext";
import TradingChart from "./../components/TradingChart";
import db from "./../data/Firebase";
import firebase from "firebase/compat/app";
import "../assets/styles/tradeingCoin.css";
import { OrderItem, TradeItem, Balance } from "../components";
const TradingCoin = () => {
  const { coin } = useParams();

  // const { user } = useAuthState();
  const user = { email: "epfereydoon@gmail.com" };
  const [coinPriceLive, setCoinPriceLive] = useState(Number); //*  COIN PRICE LIVE

  const [usdtWallet, setUsdtWallet] = useState(Number); //* USDT Wallet
  const [usdtWalletId, setUsdtWalletId] = useState("");

  const [coinTrade, setCoinTrade] = useState(Number);
  const [coinTradeId, setCoinTradeId] = useState("");

  const [usdtInput, setUsdtInput] = useState(""); //*   USDT INPUT
  const [coinInput, setCoinInput] = useState(""); //*   BTC INPUT

  const [calcOrder, setCalcOrder] = useState(Number);
  const [orders, setOrders] = useState([]);

  const [trades, setTrades] = useState([]);

  const usdtInputHandler = (event) => {
    setUsdtInput(Number(event.target.value));
    setCalcOrder(usdtInput * coinInput);
  };
  const coinInputHandler = (event) => {
    setCoinInput(Number(event.target.value));
    setCalcOrder(usdtInput * coinInput);
  };
  useEffect(() => {
    setCalcOrder(usdtInput * coinInput);
  }, [coinInput, usdtInput]);

  // * GET USDT AND COIN  FROM API
  useEffect(() => {
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
  useEffect(() => {
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
  }, []);

  // * GET
  // useEffect(() => {
  //   fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
  //     .then((response) => response.json())
  //     .then((data) => setCoinPriceLive(data.market_data.current_price.usd))

  //     .catch((err) => console.error(err));
  // }, []);

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
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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
        //

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
        //  setUsdtWallet(usdtWallet - Number(orderMatchFind.orderCointPrice));
      }
    }
  }, [coin, coinPriceLive, coinTrade, coinTradeId, orders, usdtWallet, usdtWalletId, user.email]);
  // * GET COIN PRICE FROM BINANCE API
  useEffect(() => {
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
  // * IF NOT LOGED

  if (!user) return <Navigate to="/" />;
  return (
    <div className="containerTrade ">
      <div className="livePrice  d-flex justify-content-between  m-2 p-1 bg-white rounded-3">
        <div className="coinName fw-bold p-3">{coin.toLocaleUpperCase()} / USDT</div>
        <div className="coinPrice fw-bolder display-6 px-4">{coinPriceLive}</div>
      </div>
      {/* ////////////////////////////// */}
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
        {/* <div className="">You recived : {calcOrder}</div> */}
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

// <div className="d-flex row">
//   <div className="trade d-flex mb-">
//     <div className="w-50 m-3 p-3 border border-1">
//       <div className="pb-3 text-center text-dark">Buy {coin.toLocaleUpperCase()}</div>
//       <div className="">
//         <div className="input-group mb-3 px-4">
//           <span
//             className="input-group-text"
//             style={{ padding: "8px  44px" }}
//             id="inputGroup-sizing-default"
//           >
//             USDT
//           </span>
//           <input
//             value={usdtInput}
//             onChange={(event) => usdtInputHandler(event)}
//             type="number"
//             className="form-control"
//           />
//         </div>

//         <div className="input-group mb-3 px-4">
//           <span
//             className="input-group-text  "
//             style={{ padding: "8px  50px" }}
//             id="inputGroup-sizing-default"
//           >
//             {coin.toUpperCase()}
//           </span>
//           <input
//             value={coinInput}
//             onChange={(event) => coinInputHandler(event)}
//             type="number"
//             className="form-control"
//             aria-label="Sizing example input"
//             aria-describedby="inputGroup-sizing-default"
//           />
//         </div>
//         <div className="input-group   mb-3 px-4 d-flex">
//           <span className="input-group-text w-75 border border-0 ">USDT in WALLET</span>
//           <span className="input-group-text w-25 border border-0 ">{usdtWallet}</span>
//         </div>
//       </div>
//       <div className="">You recived : {calcOrder}</div>
//       <div className="  mb-3 px-4">
//         <button
//           className="btn  btn-primary w-100"
//           disabled={calcOrder > usdtWallet}
//           onClick={(e) => setOrderHandler(e)}
//         >
//           Buy
//         </button>
//         <span>{calcOrder > usdtWallet ? "Please Deposit USDT" : ""}</span>
//       </div>
//       <h1>Orders</h1>

//       {orders.map((order) => (
//         <OrderItem
//           key={order.id}
//           coin={order.coin}
//           amount={order.amount}
//           inPrice={order.inPrice}
//           id={order.id}
//         />
//       ))}

//       <hr />
//       <h1>Trades</h1>
//       {trades.map((trade) => (
//         <TradeItem
//           key={trade.id}
//           id={trade.id}
//           coin={trade.coin}
//           amount={trade.amount}
//           inPrice={trade.inPrice}
//         />
//       ))}
//     </div>
//     <div className="display-3 d-flex justify-content-center align-items-center w-50">
//       {coinPriceLive}
//       {/* <CoinPriceLive symbol={coin} /> */}
//     </div>
//   </div>
//   <div className="chart  justify-content-center mt-5">
//     <div className="w-75"></div>
//     {/* <TradingChart /> */}
//   </div>
// </div>;

// useEffect(() => {
//   // ! Get USDT
//   db.collection(user.email)
//     .doc(user.email)
//     .collection("coins")
//     .where("coin", "==", "USDT")
//     .onSnapshot((snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           if (change.doc.data().amount !== undefined) {
//             setUsdtWallet(change.doc.data().amount);
//             setUsdtWalletId(change.doc.id);
//           }
//         }
//         if (change.type === "modified") {
//           console.log("Modified city: ", change.doc.data());
//         }
//         if (change.type === "removed") {
//           console.log("Removed city: ", change.doc.data());
//         }
//       });
//     });
// }, [user.email]);
