import React from "react";
import { Navigate } from "react-router-dom";
import { doSingUp, doLogIn, useAuthDispatch, useAuthState } from "../contexts/AuthContext";

const Login = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const [loginModal, setLoginModal] = React.useState(true);
  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");

  const modalHandler = () => {
    setLoginModal(!loginModal);
  };
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
  if (user) return <Navigate to="/dashboard" />;
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
            onChange={() => passwordInputHandler()}
          />
        </div>
        <div className="buttons m-4">
          {loginModal ? (
            <button
              className="btn btn-primary col-12 "
              onClick={() => LogInUserWithEmailAndPassword()}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-primary col-12 "
              onClick={() => SignInUserWithEmailAndPassword()}
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
            <button className="btn btn-light" onClick={() => modalHandler()}>
              Dont have account
            </button>
          ) : (
            <button className="btn btn-light" onClick={() => modalHandler()}>
              Do have account . Please Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
