import firebase from "firebase/compat/app";
import React from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import db from "../data/Firebase";
import { dbCoins, dbBestMarketBuy } from "../data/db";
import { TradeBuyFast } from "../components/TradeItems";
const BuyFastCoins = () => {
  const { coin } = useParams();
  const { user } = useAuthState();
  const [usdtWallet, setUsdtWallet] = React.useState(Number);
  const [usdtWalletId, setUsdtWalletId] = React.useState("");

  const [coinTrade, setCoinTrade] = React.useState(Number);
  const [coinTradeId, setCoinTradeId] = React.useState("");

  const [coinPriceLive, setCoinPriceLive] = React.useState(Number);
  const [bestPirceTrades, setBestPriceTrades] = React.useState([]);
  const [USDTInput, setUSDTInput] = React.useState(Number);

  // * GET USDT AND COIN  FROM API
  React.useEffect(() => {
    dbCoins(user)
      .where("coin", "==", "USDT")
      .onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          dbCoins(user).add({
            coin: "USDT",
            amount: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          dbCoins(user)
            .where("coin", "==", "USDT")
            .onSnapshot((snapshot) => {
              setUsdtWallet(snapshot.docs[0].data().amount);
              setUsdtWalletId(snapshot.docs[0].id);
            });
        }
      });
  }, [user, user.email]);

  React.useEffect(() => {
    dbBestMarketBuy(user)
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
  }, [user, user.email]);

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

  const USDTInputHandler = (event) => {
    setUSDTInput(parseFloat(event.target.value));
  };
  // * GET COIN OR CREATE COIN
  React.useEffect(() => {
    dbCoins(user)
      .where("coin", "==", `${coin.toLocaleUpperCase()}`)
      .onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          db.collection(user.email).doc(user.email).collection("coins").add({
            coin: coin.toLocaleUpperCase(),
            amount: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          dbCoins(user)
            .where("coin", "==", `${coin.toLocaleUpperCase()}`)
            .onSnapshot((snapshot) => {
              setCoinTrade(snapshot.docs[0].data().amount);
              setCoinTradeId(snapshot.docs[0].id);
            });
        }
      });
  }, [coin, user, user.email]);

  const bestMarketPrice = () => {
    if (USDTInput > usdtWallet) {
      toast.error("not enough USDT , Please Deposit");
    } else if (USDTInput > 0) {
      const order = (USDTInput / coinPriceLive).toFixed(5);
      dbBestMarketBuy(user).add({
        coin: coin.toLocaleUpperCase(),
        amount: Number(order),
        inPrice: coinPriceLive,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      dbCoins(user)
        .doc(usdtWalletId)
        .set({ amount: usdtWallet - USDTInput }, { merge: true });
      dbCoins(user)
        .doc(coinTradeId)
        .set({ amount: coinTrade + Number(order) }, { merge: true });
    }
  };
  return (
    <>
      <div className="  d-flex row col-12 justify-content-center">
        <div className="col-10 col-md-6 m-3 p-3 rounded-4 bg-white">
          <div className=" text-center text-dark p-4 fw-bold">Best Market Price </div>
          <div className=" text-center text-dark p-1 fw-bold ">{coin.toUpperCase()}</div>
          <div className="">
            <div className="input-group mb-3 px-4 py-4">
              <input
                onChange={(event) => USDTInputHandler(event)}
                type="number"
                className="form-control  col-8"
              />
              <span
                className="input-group-text text-center   border border-0 fw-bold col-4"
                id="inputGroup-sizing-default">
                USDT
              </span>
            </div>
          </div>
          <div className="  mb-3 px-4">
            <button
              className="btn  btn-primary w-100"
              onClick={(e) => bestMarketPrice(e)}
              disabled={coinPriceLive === 0}
            >
              {coinPriceLive === 0 ? "Please Wait" : "Buy now"}
            </button>
          </div>
        </div>
        <div className=" col-10 col-md-7">
          <div className="d-flex justify-content-between p-2 m-2 rounded-3 trade-success">
            {/* <div className="">Buy</div> */}
            <div className="">Coin</div>
            <div className="">Amount</div>
            <div className="">Price</div>
          </div>
          {bestPirceTrades.map((trade) => (
            <TradeBuyFast
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
