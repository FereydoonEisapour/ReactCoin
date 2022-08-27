import React from "react";
import { useAuthState } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

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
    <div className=" d-flex row justify-content-center col-12  ">

      <div className="col-10  col-md-5  p-2 m-2 bg-white rounded-3">
        <Balance />
      </div>
      <div className="col-10  col-md-5  p-2 m-2  bg-white  rounded-3">
        <h4 className="text-center fw-bold">Deposit USDT</h4>
        <div className="input-group mb-3  mt-3 ">
          <span
            className="input-group-text"
            style={{ padding: "8px  18px" }}
            id="inputGroup-sizing-default"
          >
            USDT
          </span>
          <input type="number" className="form-control" onChange={depositInputHander} />
        </div>
        <button className="btn btn-primary w-100" onClick={depositButton} disabled={depositInput < 0}>
          Deposit
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
