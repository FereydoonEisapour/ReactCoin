import React from "react";
import "./assets/styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TopCoinList, CoinDetails, TradingCoin, Swap, Login, Dashboard } from "./pages";
import { Footer } from './components'
import { Navbar } from "./components";
import { doLoginCookie, useAuthDispatch } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { getCookie } from "./hooks/cookies";
function App() {
  const dispatch = useAuthDispatch();

  React.useEffect(() => {
    const userCookie = getCookie('user')
    if (userCookie !== "") doLoginCookie(dispatch, userCookie)
  }, [dispatch])

  return (
    <BrowserRouter>
      <Toaster />
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path="/" element={<TopCoinList />}></Route>
          <Route path="/Details/:coin" element={<CoinDetails />}></Route>
          <Route path="/Swap/:coin" element={<Swap />}></Route>
          <Route path="/Trade/:coin" element={<TradingCoin />}></Route>
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route path="/Login" element={<Login />}></Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
