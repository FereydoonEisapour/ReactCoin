import React, { useEffect, useState } from "react";
import { useAuthState } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import db from "./../data/Firebase";
import firebase from "firebase/compat/app";
import { Balance } from "../components";
const Dashboard = () => {
  const { user } = useAuthState();
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    db.collection(user.email)
      .doc(user.email)
      .collection("coins")
      .onSnapshot((snapshot) => {
        setCoins(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            coin: doc.data().coin,
            amount: doc.data().amount,
          }))
        );
      });
  }, [user.email]);

  const addCoin = (e) => {
    e.preventDefault();
    db.collection(user.email).doc(user.email).collection("coins").add({
      coin: "ADA",
      amount: 100,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  if (!user) return <Navigate to="/" />;

  return (
    <div className="container d-flex  p-1  ">
      <div className="col-10 d-flex row  p-3 mx-4">
        <Balance />
        {/* {coins.map((item) => (
          <div
            className="col-5 p-4 m-2 d-flex border justify-content-around bg-info text-light display-6"
            key={item.id}
          >
            <div className="">{item.coin} </div>
            <div className=""> {item.amount}</div>
          </div>
        ))} */}
      </div>
      <div className="">
        <button onClick={(e) => addCoin(e)}>add usdt</button>
      </div>
    </div>
  );
};

export default Dashboard;
