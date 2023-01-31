import React from 'react'
import firebase from "firebase/compat/app";
import { useAuthState } from '../contexts/AuthContext';
import { dbCoins } from '../data/db';
import { Navigate } from 'react-router-dom';
function Deposit() {
    const { userEmail } = useAuthState();
    const [usdtWallet, setUsdtWallet] = React.useState(Number);
    const [usdtWalletId, setUsdtWalletId] = React.useState("");
    const [depositInput, setDepositInput] = React.useState(Number);
  
    React.useEffect(() => {
      if (userEmail) {
  
        dbCoins(userEmail)
          .where("coin", "==", "USDT")
          .onSnapshot((snapshot) => {
            if (typeof snapshot.docs[0] === "undefined") {
              dbCoins(userEmail).add({
                coin: "USDT",
                amount: 0,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            } else {
              dbCoins(userEmail)
                .where("coin", "==", "USDT")
                .onSnapshot((snapshot) => {
                  setUsdtWallet(snapshot.docs[0].data().amount);
                  setUsdtWalletId(snapshot.docs[0].id);
                });
            }
          });
      }
    }, [userEmail]);
    const depositInputHander = (e) => {
      setDepositInput(Number(e.target.value));
    };
    const depositButton = () => {
      dbCoins(userEmail)
        .doc(usdtWalletId)
        .set({ amount: usdtWallet + depositInput }, { merge: true });
    };
    React.useEffect(() => {
  
      if (!userEmail)
        return () => {
          <Navigate to="/" />;
        }
    }, [userEmail])

  return (
         <div className="col-10  col-md-5  p-2 m-2  content-cointainer  rounded-3">
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
        {
          userEmail ? (
            <button className="btn btn-primary w-100" onClick={depositButton} disabled={depositInput < 0} >
              Deposit
            </button>

          ) : (
            <button className="btn btn-primary w-100" onClick={depositButton} disabled={true} >
              Please Login
            </button>
          )
        }
      </div>
  )
}

export default Deposit