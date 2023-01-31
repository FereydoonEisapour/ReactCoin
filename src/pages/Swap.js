import firebase from "firebase/compat/app";
import React from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import db from "../data/Firebase";
import { dbCoins, dbBestMarketBuy } from "../data/db";
import { SwapTrades } from "../components/TradeItems";

const Swap = () => {
  const { coin } = useParams();
  const { userEmail } = useAuthState();
  const [usdtWallet, setUsdtWallet] = React.useState(Number);
  const [usdtWalletId, setUsdtWalletId] = React.useState("");
  const [coinTrade, setCoinTrade] = React.useState(Number);
  const [coinTradeId, setCoinTradeId] = React.useState("");
  const [coinPriceLive, setCoinPriceLive] = React.useState(Number);
  const [swapTrades, setSwapTrades] = React.useState([]);
  const [USDTInput, setUSDTInput] = React.useState(Number);

  // * GET USDT FROM API
  React.useEffect(() => {
    if (userEmail) {
      dbCoins(userEmail)
        .where("coin", "==", "USDT")
        .onSnapshot((snapshot) => {
          setUsdtWallet(snapshot.docs[0].data().amount);
          setUsdtWalletId(snapshot.docs[0].id);
        });
    }
  }, [userEmail]);
  // * GET SWAPTRADES  FROM API
  React.useEffect(() => {
    if (userEmail) {
      dbBestMarketBuy(userEmail)
        .orderBy("timestamp", "desc")
        .limit(10)
        .onSnapshot((snapshot) => {
          setSwapTrades(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              coin: doc.data().coin,
              amount: doc.data().amount,
              inPrice: doc.data().inPrice,
            }))
          );
        });
    }
  }, [userEmail]);
  // * GET BINANCE PRICE FROM API 
  React.useEffect(() => {
    if (userEmail) {
      const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");
      binanceSocket.onopen = function () {
        binanceSocket.send(
          JSON.stringify({
            method: "SUBSCRIBE",
            //  params: coin === "usdt" ? [`usdc${coin}@trade`] : [`${coin}usdt@trade`],
            params: [`${coin.toLocaleLowerCase()}usdt@trade`],
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
    }
  }, [coin, userEmail]);
  // * GET COIN OR CREATE COIN
  const USDTInputHandler = (event) => {
    setUSDTInput(parseFloat(event.target.value));
  };
  // * GET COIN AMOUT OR CREATE 0 AMOUNT
  React.useEffect(() => {
    if (userEmail) {
      dbCoins(userEmail)
        .where("coin", "==", `${coin.toLocaleUpperCase()}`)
        .onSnapshot((snapshot) => {
          if (typeof snapshot.docs[0] === "undefined") {
            db.collection(userEmail.email).doc(userEmail.email).collection("coins").add({
              coin: coin.toLocaleUpperCase(),
              amount: 0,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            dbCoins(userEmail)
              .where("coin", "==", `${coin.toLocaleUpperCase()}`)
              .onSnapshot((snapshot) => {
                setCoinTrade(snapshot.docs[0].data().amount);
                setCoinTradeId(snapshot.docs[0].id);
              })
          }
        })
    }
  }, [coin, userEmail]);
  // * CREATE SWAP TRADE 
  const SwapCoin = () => {
    if (userEmail) {
      if (USDTInput > usdtWallet) {
        toast.error("not enough USDT , Please Deposit");
      } else if (USDTInput > 0) {
        const order = (USDTInput / coinPriceLive).toFixed(5);
        dbBestMarketBuy(userEmail).add({
          coin: coin.toLocaleUpperCase(),
          amount: Number(order),
          inPrice: coinPriceLive,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        dbCoins(userEmail)
          .doc(usdtWalletId)
          .set({ amount: usdtWallet - USDTInput }, { merge: true });
        dbCoins(userEmail)
          .doc(coinTradeId)
          .set({ amount: coinTrade + Number(order) }, { merge: true });
      }
    }
  };
  return (
    <>
      <div className="  d-flex row col-12 justify-content-center ">
        <div className="col-10 col-md-6 m-3 p-3 rounded-4  content-cointainer">
          <div className=" text-center text-color p-4 fw-bold">Swap {coin.toUpperCase()}</div>
          <div className="">
            <div className="input-group mb-3 px-4 py-4">
              <input onChange={(event) => USDTInputHandler(event)} type="number" className="form-control  col-8" />
              <span className="input-group-text text-center   border border-0 fw-bold col-4" id="inputGroup-sizing-default"> USDT </span>
            </div>
          </div>
          <div className="  mb-3 px-4">
            {userEmail ?
              <button className="btn  btn-primary w-100" onClick={(e) => SwapCoin(e)} disabled={coinPriceLive === 0}>
                {coinPriceLive === 0 ? "Please Wait" : "Buy now"}
              </button>
              :
              <div className="d-flex justify-content-center">
                <Link to="/Login" className="text-decoration-none navbar-link text-color ">
                  Please Login
                </Link>
              </div>
            }
          </div>
        </div>
        {
          userEmail ?
            <div className=" col-10 col-md-6 content-cointainer text-color rounded-4">
              <div className="d-flex justify-content-between p-2 m-2 rounded-3 trade-success ">
                <div className="">Coin</div>
                <div className="">Amount</div>
                <div className="">Price</div>
              </div>
              <hr />
              {swapTrades.map((trade) => (
                <SwapTrades
                  key={trade.id}
                  id={trade.id}
                  coin={trade.coin}
                  amount={trade.amount}
                  inPrice={trade.inPrice}
                />
              ))}
            </div>
            : null
        }
      </div>
    </>
  );
};
export default Swap;
