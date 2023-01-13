import React from "react";

import toast from "react-hot-toast";


import { auth } from "../data/Firebase";
import { setCookie, removeCookie, getCookie } from "../hooks/cookies";

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

function reducer(currentState, newState) {
  return { ...currentState, ...newState };
}
function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (!context) throw new Error("useAuthState must be used in AuthProvider");
  return context;
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (!context) throw new Error("useAuthDispatch must be used in AuthProvider");
  return context;
}
const initialState = {
  user: null,
  userEmail: null,
  error: null,
  status: false,
};

function AuthProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{props.children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
function doSingUp(dispatch, emailInput, passwordInput) {
  auth
    .createUserWithEmailAndPassword(emailInput, passwordInput)
    .then((result) => {
      dispatch({
        user: result.user,
      })
        .then(
          document.cookies.set('user', emailInput, { path: '/' })
        )
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email alredy in use . Please login ");
      }
    });
}
function doLogIn(dispatch, emailInput, passwordInput) {
  auth.signInWithEmailAndPassword(emailInput, passwordInput)
    .then((result) => {
      dispatch({
        user: result.user,
        userEmail: result.user.email
      });
      removeCookie('user')
      setCookie('user', result.user.email)

    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        toast.error("Email not found , Please Signup");
      }
    });
}
function resetPass(dispatch, emailInput) {
  auth.sendPasswordResetEmail(emailInput)
    .then(() => {
      toast.success("We send reset password link to your Mail");
    })
    .catch((error) => {
      toast.error(error.code);
    });
}
function doLoginCookie(dispatch, userCookie) {
  initialState.userEmail = userCookie
  dispatch({
    // user: userCookie,
    userEmail: userCookie
  })
}
function doLogOut(dispatch) {
  dispatch({
    userEmail: null
  })
  removeCookie('user')
}

export { AuthProvider, useAuthState, useAuthDispatch, doSingUp, doLogIn, resetPass, doLoginCookie, doLogOut };

