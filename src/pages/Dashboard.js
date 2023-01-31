import React from "react";
import { useAuthState } from "../contexts/AuthContext";
import { Balance, Deposit } from "../components";
import UserInfo from "../components/UserInfo";
const Dashboard = () => {
  const { userEmail } = useAuthState();

  return (
    <div className=" d-flex row justify-content-center col-12  text-color">
      {userEmail ?
          <div className="col-10  col-md-5  p-2 m-2 content-cointainer rounded-3 ">
            <UserInfo />
          </div>
        : null
      }
      <Deposit />
      <div className="col-10  col-md-5  p-2 m-2 content-cointainer rounded-3">
        <Balance />
      </div>
    </div>
  );
};

export default Dashboard;
