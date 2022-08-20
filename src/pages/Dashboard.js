import React from "react";
import { useAuthState } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import db from "./../data/Firebase";
import firebase from "firebase/compat/app";
import { Balance } from "../components";
import { dbCoins } from "../data/db";
const Dashboard = () => {
  const { user } = useAuthState();
  const [usdtWallet, setUsdtWallet] = React.useState(Number);
  const [usdtWalletId, setUsdtWalletId] = React.useState("");
  const [depositInput, setDepositInput] = React.useState(Number);

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
  const depositInputHander = (e) => {
    setDepositInput(Number(e.target.value));
  };
  const depositButton = () => {
    dbCoins(user)
      .doc(usdtWalletId)
      .set({ amount: usdtWallet + depositInput }, { merge: true });
  };

  if (!user) return <Navigate to="/" />;
  return (
    <div className="container d-flex justify-content-center  p-1 row ">
      <div className="col-6 ">
        <div className="input-group mb-3 px-4">
          <span
            className="input-group-text"
            style={{ padding: "8px  18px" }}
            id="inputGroup-sizing-default"
          >
            USDT
          </span>
          <input type="number" className="form-control" onChange={depositInputHander} />
        </div>
        <button className="btn btn-primary w-100" onClick={depositButton}>
          Deposit
        </button>
      </div>
      <div className="col-10 d-flex row  p-3 mx-4">
        <Balance />
      </div>
    </div>
  );
};

export default Dashboard;
