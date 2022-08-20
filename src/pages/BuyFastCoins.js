import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CoinPriceLive from "./../components/CoinPriceLive";
import toast from "react-hot-toast";
import db from "../data/Firebase";
import { useAuthState } from "../contexts/AuthContext";
import firebase from "firebase/compat/app";
import { TradeItem } from "../components";
const BuyFastCoins = () => {
  const { coin } = useParams();
  //  const { user } = useAuthState();
  const user = { email: "epfereydoon@gmail.com" };

  const [usdtWallet, setUsdtWallet] = useState(Number); //* USDT Wallet
  const [usdtWalletId, setUsdtWalletId] = useState("");

  const [coinTrade, setCoinTrade] = useState(Number);
  const [coinTradeId, setCoinTradeId] = useState("");

  const [coinPriceLive, setCoinPriceLive] = useState(Number); //*  BTC PRICE
  const [bestPirceTrades, setBestPriceTrades] = useState([]);
  //const [USDTInput, setUSDTInput] = useState(0); //!
  const [USDTInput, setUSDTInput] = useState(Number); //! BTC INPUT

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

  useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("bestMarketBuy")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setBestPriceTrades(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            coin: doc.data().coin,
            amount: doc.data().amount,
            inPrice: doc.data().inPrice,
          }))
        );
      });

    return () => {};
  }, [user.email]);

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

  const USDTInputHandler = (event) => {
    setUSDTInput(parseFloat(event.target.value));
  };
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
  }, [coin, user.email]);

  const bestMarketPrice = () => {
    if (USDTInput > usdtWallet) {
      toast.error("not enough USDT , Please Deposit");
    } else if (USDTInput > 0) {
      const order = (USDTInput / coinPriceLive).toFixed(5);
      db.collection(user.email)
        .doc(user.email)
        .collection("bestMarketBuy")
        .add({
          coin: coin.toLocaleUpperCase(),
          amount: Number(order),
          inPrice: coinPriceLive,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

      db.collection(user.email)
        .doc(user.email)
        .collection("coins")
        .doc(usdtWalletId)
        .set(
          {
            amount: usdtWallet - USDTInput,
          },
          {
            merge: true,
          }
        );
      db.collection(user.email)
        .doc(user.email)
        .collection("coins")
        .doc(coinTradeId)
        .set(
          {
            amount: coinTrade + Number(order),
          },
          {
            merge: true,
          }
        );
    }
  };

  return (
    <>
      <div className="  d-flex row col-12 justify-content-center">
        <div className="col-6 m-3 p-3 rounded-4 bg-white">
          {coinPriceLive}
          <div className=" text-center text-dark p-4 fw-bold">Best Market Price </div>
          <div className=" text-center text-dark p-1 fw-bold">{coin.toUpperCase()}</div>
          <div className="">
            <div className="input-group mb-3 px-4">
              <input
                onChange={(event) => USDTInputHandler(event)}
                // value={USDTInput}
                type="number"
                className="form-control "
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
              onClick={(e) => bestMarketPrice(e)}
            >
              Buy now
            </button>
          </div>
        </div>

        <div className=" col-8">
          <div className="d-flex justify-content-between p-2 m-2 rounded-3 trade-success">
            <div className="">Buy</div>
            <div className="">Coin</div>
            <div className="">Amount</div>
            <div className="">Price</div>
          </div>
          {bestPirceTrades.map((trade) => (
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
