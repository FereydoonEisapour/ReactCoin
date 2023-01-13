import React from "react";
import { Navigate } from "react-router-dom";
import {
  doLogOut,
  useAuthDispatch,
  useAuthState,
} from "../contexts/AuthContext";


function UserInfo() {
  const { userEmail } = useAuthState();
  const dispatch = useAuthDispatch();
  const logOut = () => {
    doLogOut(dispatch);
  };

  // console.log(userEmail);

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
