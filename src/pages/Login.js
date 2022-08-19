import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { doSingUp, doLogIn, useAuthDispatch, useAuthState } from "../contexts/AuthContext";

const Login = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const [loginModal, setLoginModal] = useState(true);
  const modalHandler = (e) => {
    setLoginModal(!loginModal);
  };

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  if (user) return <Navigate to="/trade/btc" />;

  const emailInputHandler = (e) => {
    setEmailInput(e.target.value);
  };
  const passwordInputHandler = (e) => {
    setPasswordInput(e.target.value);
  };
  const SignInUserWithEmailAndPassword = (e) => {
    e.preventDefault();
    doSingUp(dispatch, emailInput, passwordInput);
  };
  const LogInUserWithEmailAndPassword = (e) => {
    e.preventDefault();
    doLogIn(dispatch, emailInput, passwordInput);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 col-12">
      <div className="form  col-6 bg-light p-3 m-3">
        <div className="inputs d-flex justify-content-center row  m-4">
          <label htmlFor="email">Email</label>
          <input
            className="m-2 p-2"
            type="email"
            name="email"
            onChange={(e) => emailInputHandler(e)}
          />
          <label htmlFor="password">Password</label>
          <input
            className="m-2 p-2"
            type="password"
            name="password"
            onChange={(e) => passwordInputHandler(e)}
          />
        </div>
        <div className="buttons m-4">
          {loginModal ? (
            <button
              className="btn btn-primary col-12 "
              onClick={(e) => LogInUserWithEmailAndPassword(e)}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-primary col-12 "
              onClick={(e) => SignInUserWithEmailAndPassword(e)}
            >
              Signup
            </button>
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
