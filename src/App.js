import React from "react";
import "./assets/styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import { CookiesProvider } from 'react-cookie'
import { TopCoinList, CoinDetails, TradingCoin, BuyFastCoins, Login, Dashboard } from "./pages";
import { Footer } from './components'
import { Navbar } from "./components";
import { doLoginCookie, useAuthDispatch } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { getCookie } from "./hooks/cookies";
import { changeTheme, useThemeDispatch, useThemeState } from "./contexts/ThemeContext";


function App() {
  const dispatch = useAuthDispatch();
  const dispatchTheme = useThemeDispatch()
  React.useEffect(() => {
    const userCookie = getCookie('user')
    if (userCookie !== "") {
      doLoginCookie(dispatch, userCookie)
    }
  }, [dispatch])

  const { theme } = useThemeState()

  React.useEffect(() => {
    const localTheme = window.localStorage.getItem('theme')
    if (localTheme) {
      if (localTheme === "dark") changeTheme(dispatchTheme, "light")
      if (localTheme === "light") changeTheme(dispatchTheme, "dark")
    }
  }, [dispatchTheme, theme])

  return (
    <BrowserRouter>
      <Toaster />
      <div className={`App ${theme === 'light' ? 'bgLight' : 'bgDark'} `}>
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
