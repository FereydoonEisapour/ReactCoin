import React from "react";
import {
  doLogOut,
  useAuthDispatch,
  useAuthState,
} from "../contexts/AuthContext";
import "./UserInfo.css"; // Assuming you have a CSS file for styling

function UserInfo() {
  const { userEmail } = useAuthState();
  const dispatch = useAuthDispatch();

  const logOut = () => {
    doLogOut(dispatch);
  };

  return (
    <div className="user-info-container card shadow-sm p-4">
      <div className="avatar-section text-center mb-4">
        <div className="avatar rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center">
          <span style={{ fontSize: "2rem" }}>😊</span>
        </div>
        <h3 className="mt-3">Welcome!</h3>
      </div>
      <div className="email-section text-center mb-4">
        <p className="text-muted">Email:</p>
        <h5>{userEmail}</h5>
      </div>
      <div className="logout-section text-center">
        <button className="btn btn-warning px-4 py-2" onClick={logOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
