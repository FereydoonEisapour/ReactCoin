import React from "react";
import { Navigate } from "react-router-dom";
import { doLogOut, useAuthState } from "../contexts/AuthContext";
import { getCookie } from "../hooks/cookies";

function UserInfo() {
  const { userEmail } = useAuthState();

  const logOut = () => {
    doLogOut();
  };
 

  return (
    <div>
      <div className="">
        <div className="avatar">avatar : )</div>
      </div>
      <div className="mt-3">
        <div className="">Email : {userEmail}</div>
      </div>
      <div className="mt-3 text-white fle ">
        <button className="btn col-4 btn-warning" onClick={logOut}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
