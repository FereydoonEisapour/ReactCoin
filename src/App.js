import React, { useState, useEffect } from "react";

import "./assets/styles/App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import TopCoinList from "./pages/TopCoinList";
import CoinDeatils from "./pages/CoinDeatils";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<TopCoinList />}></Route>
          <Route path="/coin/:coin" element={<CoinDeatils />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
