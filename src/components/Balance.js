import React from "react";
import db from "../data/Firebase";
import { useAuthState } from "../contexts/AuthContext";
const Balance = () => {
  const { user } = useAuthState();
  const [balance, setBalance] = React.useState([]);
  React.useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("coins")
      .orderBy("coin", "asc")
      .onSnapshot((snapshot) => {
        setBalance(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            coin: doc.data().coin,
            amount: doc.data().amount,
          }))
        );
      });
    return () => {};
  }, [user.email]);
  return (
    <>
      <h1 className="text-center"> Balance</h1>
      {balance.map((coin) => (
        <div className="input-group   mb-3 px-4 d-flex" key={coin.id}>
          <span className="input-group-text w-50 ">{coin.coin.toUpperCase()} </span>
          <span className="input-group-text w-50 ">{coin.amount}</span>
        </div>
      ))}
    </>
  );
};
export default Balance;
