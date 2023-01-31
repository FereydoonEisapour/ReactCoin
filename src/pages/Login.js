import React from "react";
import { Navigate } from "react-router-dom";
import { doSingUp, doLogIn, resetPass, useAuthDispatch, useAuthState } from "../contexts/AuthContext";
import { LoadingComponent } from './../components'
const Login = () => {
  const { userEmail, error } = useAuthState();
  const dispatch = useAuthDispatch();

  const [loginModal, setLoginModal] = React.useState(true);
  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [loadingg, setLoading] = React.useState(false)

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
    setLoading(true)
    doLogIn(dispatch, emailInput, passwordInput);
  };
  const resetPassword = () => {
    resetPass(dispatch, emailInput)
  }
  if (userEmail) return <Navigate to="/dashboard" />;
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 mb-0 col-12 ">
      <div className="form  col-11 col-md-6 col-lg-4  p-3 m-3 content-cointainer">

        <div className="inputs d-flex justify-content-center row  m-4">
          <label htmlFor="email" className="text-color">Email</label>
          <input
            className="m-2 p-1"
            type="email"
            name="email"
            onChange={(e) => emailInputHandler(e)}
          />
          <label htmlFor="password" className="text-color  ">Password</label>
          <input
            className="m-2 p-1"
            type="password"
            name="password"
            onChange={(e) => passwordInputHandler(e)}
          />
        </div>
        <div className="buttons m-4 text-center">
          {loginModal ?
            <button className="btn btn-primary col-8 " onClick={(e) => LogInUserWithEmailAndPassword(e)} >
              Login
            </button>
            :
            <button className="btn btn-primary col-8 " onClick={(e) => SignInUserWithEmailAndPassword(e)}>
              Signup
            </button>
          }
        </div>
        <div className="text-center">
          {loginModal ?
            <button className="btn col-8 btn-color border-0" onClick={resetPassword}> reset password</button> : <></>
          }
        </div>
        <div className="setlogin text-center p-1">
          {loginModal ?
            <button className="btn btn-color border-0" onClick={(e) => modalHandler(e)}>
              Dont have account
            </button>
            :
            <button className="btn border-0 text-color " onClick={(e) => modalHandler(e)}>
              <small> have account .Please Login</small>
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default Login;
