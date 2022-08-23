import React from "react";
import db from "../data/Firebase";
import { useAuthState } from "../contexts/AuthContext";
import Loading from "./Loading";
const Balance = () => {
  const { user } = useAuthState();
  const [balance, setBalance] = React.useState([]);
  React.useEffect(() => {
    db.collection(user.email).doc(user.email).collection("coins").orderBy("coin", "asc")
      .onSnapshot((snapshot) => {
        setBalance(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            coin: doc.data().coin,
            amount: doc.data().amount,
          }))
        );
      });
    return () => { };
  }, [user.email]);
  return (
    <>
      <h3 className="text-center"> Balance</h3>
      {balance ?
        balance.map((coin) => (
          <div className={`${coin.amount === 0 ? "displaynone" : ""} `} key={coin.id} >
            <div className="bg-light p-1 fw-bold rounded-2   mb-3 px-4 d-flex" >
              <span className=" col-4 ">{coin.coin.toUpperCase()} </span>
              <span className=" col-8 ">{(coin.amount).toFixed(4)}</span>
            </div>
          </div>
        )) :
        <Loading />
      }
    </>
  );
};
export default Balance;
