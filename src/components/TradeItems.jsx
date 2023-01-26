
import React from 'react';
import PropTypes from "prop-types";
import { useAuthState } from "../contexts/AuthContext";
import firebase from "firebase/compat/app";
import { dbCoins, dbOrders } from "../data/db";
 const OrderItem = ({ coin, amount, inPrice, id, type, usdtId }) => {
  const { userEmail } = useAuthState();

  const [usdtWallet, setUsdtWallet] = React.useState(Number);
  const [usdtWalletId, setUsdtWalletId] = React.useState("");

  const [coinTrade, setCoinTrade] = React.useState(Number);
  const [coinTradeId, setCoinTradeId] = React.useState("");
  // * GET COIN OR CREATE COIN
  React.useEffect(() => {
    dbCoins(userEmail)
      .where("coin", "==", `${coin.toLocaleUpperCase()}`)
      .onSnapshot((snapshot) => {
        if (typeof snapshot.docs[0] === "undefined") {
          dbCoins(userEmail).add({
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
            });
        }
      });
    return () => { };
  }, [coin, userEmail]);
  React.useEffect(() => {
    dbCoins(userEmail)
      .where("coin", "==", "USDT")
      .onSnapshot((snapshot) => {
        setUsdtWallet(snapshot.docs[0].data().amount);
        setUsdtWalletId(snapshot.docs[0].id);
      });

  }, [userEmail])

  const deleteOrder = () => {
    if (type === true) {
      const newWaletUsdts = usdtWallet + Number(amount * inPrice);
      dbCoins(userEmail).doc(usdtWalletId).set({ amount: newWaletUsdts }, { merge: true });
      dbOrders(userEmail).doc(id).delete();
    }
    if (type === false) {
      const newCoinTrade = coinTrade + Number(amount);
      dbCoins(userEmail).doc(coinTradeId).set({ amount: newCoinTrade }, { merge: true });
      dbOrders(userEmail).doc(id).delete();
    }

  };
  return (
    <div className="d-flex justify-content-between rounded-3 px-4 py-1 m-2 order-success">
      <div className="">{coin.toUpperCase()}</div>
      <div className="">{type ? "Buy" : "Sell"}</div>
      <div className="">{amount}</div>
      <div className="">{inPrice}</div>
      <button onClick={(e) => deleteOrder(e)} className=" ">
        ❌
      </button>
    </div>
  );
};
OrderItem.propTypes = {
  id: PropTypes.string,
  usdtId: PropTypes.string,
  type: PropTypes.bool,
  coin: PropTypes.string,
  amount: PropTypes.number,
  inPrice: PropTypes.number,
};

 const TradeItem = ({ id, coin, amount, inPrice, type }) => {
    return (
        <div className="d-flex  p-2 m-2 rounded-3 trade-success border border-1" key={id}>
            <div className="px-5 col">{type ? "Buy" : "Sell"}</div>
            <div className="px-2 col">{coin.toUpperCase()}</div>
            <div className="px-2 col">{amount}</div>
            <div className="px-2 col">{inPrice}</div>
        </div>
    );
};
TradeItem.propTypes = {
    id: PropTypes.string,
    type: PropTypes.bool,
    coin: PropTypes.string,
    amount: PropTypes.number,
    inPrice: PropTypes.number,
};


 const TradeBuyFast = ({ id, coin, amount, inPrice, }) => {
    return (
        <div className="d-flex justify-content-between p-2 m-2 rounded-3 trade-success" key={id}>
            <div className="px-2">{coin.toUpperCase()}</div>
            <div className="px-2">{amount}</div>
            <div className="px-2">{inPrice}</div>
        </div>
    )
}
TradeBuyFast.propTypes = {
    id: PropTypes.string,
    coin: PropTypes.string,
    amount: PropTypes.number,
    inPrice: PropTypes.number,
};


export  {TradeBuyFast ,OrderItem,TradeItem}