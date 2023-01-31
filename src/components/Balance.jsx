import React from "react";
import db from "../data/Firebase";
import { useAuthState } from "../contexts/AuthContext";
import LoadingComponent from "./LoadingComponent";
import PleaseLogin from "./PleaseLogin";
const Balance = () => {
  const { userEmail } = useAuthState();
  const [balance, setBalance] = React.useState([]);
  React.useEffect(() => {
    if (userEmail) {
      const unsubscribe = db.collection(userEmail).doc(userEmail).collection('coins').orderBy('coin', 'asc')
        .onSnapshot((snapshot) => {
          setBalance(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              coin: doc.data().coin,
              amount: doc.data().amount,
            }))
          )
        })
      return () => {
        unsubscribe()
      }
    }
  }, [userEmail])

  return (
    <>
      {userEmail ?
        <div className="balance  m-2 p-3 content-cointainer rounded-3">
          <h3 className="text-center fw-bolder p-2"> Balance</h3>
          {balance.length !== 0 ?
            balance.map((coin) =>
              <div className={`${coin.amount === 0 ? "displaynone" : ""} `} key={coin.id} >
                <div className=" p-2 fw-bold rounded-2   mb-3 px-1 d-flex border    ">
                  <span className=" col-4 px-3">{coin.coin.toUpperCase()} </span>
                  <span className=" col-8 ">
                    {/* {coin.amount.toFixed(6).replace(/\.0+$/,'')} */}
                    {coin.amount.toString()}
                  </span>
                </div>
              </div>)
            :
            <div className="mt-4">
              <LoadingComponent />
            </div>
          }
        </div> :
        <>
          <h3 className="text-center fw-bolder"> Balance</h3>
          <PleaseLogin />
        </>
      }
    </>
  );
};
export default Balance;
