import React, { useState, useEffect } from "react";

import "./assets/styles/App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TopCoinList, CoinDetails, TradingCoin ,BuyFastCoins} from "./pages";
import Navbar from "./components/Navbar";
function App() {
  return (
    <BrowserRouter>
      <div className="App ">
        <Navbar />
        <Routes>
          <Route path="/" element={<TopCoinList />}></Route>
          <Route path="/coin/:coin" element={<CoinDetails />}></Route>
          <Route path="/coin/buyfast/:coin" element={<BuyFastCoins />}></Route>
          <Route path="/coin/trading/:coin" element={<TradingCoin />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
