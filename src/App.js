import React from "react";
import "./assets/styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TopCoinList, CoinDetails, TradingCoin, BuyFastCoins, Login, Dashboard } from "./pages";
import { Navbar } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <AuthProvider>
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
