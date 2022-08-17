import React, { useState } from "react";
import { useAuthState } from "../contexts/AuthContext";
import { auth } from "./../data/Firebase";

const Login = () => {
  const { user } = useAuthState();
console.log(user)
  const [loginModal, setLoginModal] = useState(true);
  const modalHandler = (e) => {
    setLoginModal(!loginModal);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 col-12">
      <div className="form  col-6 bg-light p-3 m-3">
        <div className="inputs d-flex justify-content-center row  m-4">
          <label htmlFor="email">Email</label>
          <input className="m-2 p-2" type="email" name="email" />
          <label htmlFor="password">Password</label>
          <input className="m-2 p-2" type="password" name="password" />
        </div>
        <div className="buttons m-4">
          {loginModal ? (
            <button className="btn btn-primary col-12 ">Login</button>
          ) : (
            <button className="btn btn-primary col-12 ">Signup</button>
          )}
        </div>
        <div className="rest ">
          {loginModal ? (
            <button className="btn btn-outline-primary col-12">rest password</button>
          ) : (
            <></>
          )}
        </div>
        <div className="setlogin text-center p-2">
          {loginModal ? (
            <button className="btn btn-light" onClick={(e) => modalHandler(e)}>
              Dont have account
            </button>
          ) : (
            <button className="btn btn-light" onClick={(e) => modalHandler(e)}>
              Do have account . Please Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
