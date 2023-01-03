import React from "react";
import "./assets/styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import { CookiesProvider } from 'react-cookie'
import { TopCoinList, CoinDetails, TradingCoin, BuyFastCoins, Login, Dashboard } from "./pages";
import { Footer } from './components'
import { Navbar } from "./components";
import {  doLoginCookie, useAuthDispatch } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { getCookie } from "./hooks/cookies";

function App() {
  const dispatch = useAuthDispatch();
  React.useEffect(() => {
    const userCookie = getCookie('user')
    if (userCookie !== "") {
      doLoginCookie(dispatch, userCookie)
    }
  }, [dispatch])
  return (
    <BrowserRouter>
      <Toaster />
      <div className="App ">
        <Navbar />
        <Routes>
          <Route path="/" element={<TopCoinList />}></Route>
          <Route path="/coin/:coin" element={<CoinDetails />}></Route>
          <Route path="/buyfast/:coin" element={<BuyFastCoins />}></Route>
          <Route path="/trade/:coin" element={<TradingCoin />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
