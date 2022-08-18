import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import CoinPriceLive from "../components/CoinPriceLive";
import { useAuthState } from "../contexts/AuthContext";
import TradingChart from "./../components/TradingChart";
import db from "./../data/Firebase";
import firebase from "firebase/compat/app";
const TradingCoin = () => {
  const { coin } = useParams();
  // const { user } = useAuthState();
  const user = { email: "epfereydoon@gmail.com" };
  const [coinPriceLive, setCoinPriceLive] = useState(Number); //  !  BTC PRICE

  const [usdtWallet, setUsdtWallet] = useState(Number); //! USDST Wallet
  const [usdtWalletId, setUsdtWalletId] = useState("");

  const [usdtInput, setUsdtInput] = useState(Number); //! USDT INPUT
  const [coinInput, setCoinInput] = useState(Number); //! BTC INPUT

  const [btcBuy, setBtcBuy] = useState(Number);
  const [orders, setOrders] = useState([]);

  const [trades, setTrades] = useState([]);

  const usdtInputHandler = (event) => {
    setUsdtInput(Number(event.target.value));
    setBtcBuy(usdtInput * coinInput);
  };
  const coinInputHandler = (event) => {
    setCoinInput(Number(event.target.value));
    setBtcBuy(usdtInput * coinInput);
  };
  useEffect(() => {
    setBtcBuy(usdtInput * coinInput);
  }, [coinInput, usdtInput]);

  // ! Get USDT
  useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("coins")
      .where("coin", "==", "USDT")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            if (change.doc.data().amount !== undefined) {
              setUsdtWallet(Number(change.doc.data().amount));
              setUsdtWalletId(change.doc.id);
            }
          }
        });
      });
  }, [user.email]);
  // ! GET
  // useEffect(() => {
  //   fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
  //     .then((response) => response.json())
  //     .then((data) => setCoinPriceLive(data.market_data.current_price.usd))

  //     .catch((err) => console.error(err));
  // }, []);

  const setOrderHandler = (e) => {
    e.preventDefault();
    if (btcBuy === 0) return;
    db.collection(user.email).doc(user.email).collection("orders").add({
      coin: coin.toLocaleLowerCase(),
      amount: coinInput,
      inPrice: usdtInput,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  // ! GET ORDERS
  useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("orders")
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
  // ! GET TRADES
  useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("trades")
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

  // const priceRef = useRef();
  // useEffect(() => {
  //   const prifeaa = Number(priceRef.current.innerText);
  //   setCoinPriceLive(prifeaa);
  // },[]);
  // // useEffect(() => {
  // if (CoinPriceLive && orders.length > 0) {
  //   setInterval(() => {
  //     // const priceNow = Number(priceRef.current.innerText);

  //     const orderMatchFind = orders.find((item) => item.inPrice === coinPriceLive);
  //     console.log(orderMatchFind);

  //     if (orderMatchFind !== undefined) {
  //       setOrders(orders.filter((item) => item.id !== orderMatchFind.id));
  //       console.log(orderMatchFind);
  //       db.collection(user.email).doc(user.email).collection("trades").add({
  //         coin: coin,
  //         amount: orderMatchFind.orderamount,
  //         inPrice: orderMatchFind.orderCointPrice,
  //       });
  //       setUsdtWallet(usdtWallet - orderMatchFind.orderCointPrice);
  //     }
  //   }, 1000); // interval time 10
  // }
  // //}, [coin, coinPriceLive, orders, usdtWallet, user.email]);

  // useEffect(() => {
  //   console.log(coinPriceLive);
  // }, [coinPriceLive]);
  useEffect(() => {
    if (orders.length > 0) {
      const orderMatchFind = orders.find((item) => item.inPrice === Number(coinPriceLive));

      // setOrders(orders.filter((item) => item.id !== orderMatchFind.id));
      //  console.log(orderMatchFind);
      if (orderMatchFind !== undefined) {
        db.collection(user.email)
          .doc(user.email)
          .collection("trades")
          .add({
            coin: coin,
            amount: Number(orderMatchFind.amount),
            inPrice: Number(orderMatchFind.inPrice),
          });
        db.collection(user.email)
          .doc(user.email)
          .collection("orders")
          .doc(orderMatchFind.id)
          .delete();
        //

        const newWaletUsdts = usdtWallet - Number(orderMatchFind.inPrice);

        db.collection(user.email).doc(user.email).collection("coins").doc(usdtWalletId).set(
          {
            amount: newWaletUsdts,
          },
          {
            merge: true,
          }
        );
        //  setUsdtWallet(usdtWallet - Number(orderMatchFind.orderCointPrice));
      }
    }
  }, [coin, coinPriceLive, orders, usdtWallet, usdtWalletId, user.email]);

  useEffect(() => {
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");

    binanceSocket.onopen = function () {
      binanceSocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: coin === "usdt" ? [`usdc${coin}@trade`] : [`${coin}usdt@trade`],
          //   params: [`${symbol}usdt@trade`],
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
    <>
      <div className="d-flex row">
        <div className="trade d-flex mb-">
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
                  value={coinInput}
                  onChange={(event) => coinInputHandler(event)}
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
                    <div className="">{item.coin}</div>
                    <div className="">{item.amount}</div>
                    <div className="">{item.inPrice}</div>
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
                    {/* <div className=""> : {item.tradeamount}</div>
                    <div className=""> {item.tradeCoinName}</div>
                    <div className=""> in {item.tradeCoinPrice} USDT</div> */}
                    <div className="">{item.coin}</div>
                    <div className="">{item.amount}</div>
                    <div className="">{item.inPrice}</div>
                  </div>
                ))
              : null}
          </div>
          <div
            className="display-3 d-flex justify-content-center align-items-center w-50"
            // ref={priceRef}
          >
            {coinPriceLive}
            {/* <CoinPriceLive symbol={coin} /> */}
          </div>
        </div>
        <div className="chart  justify-content-center mt-5">
          <div className="w-75"></div>
          {/* <TradingChart /> */}
        </div>
      </div>
    </>
  );
};

export default TradingCoin;

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
