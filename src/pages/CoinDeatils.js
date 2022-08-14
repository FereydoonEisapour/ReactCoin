import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { CoinPriceLive } from "../components";
import { TradingChart } from "../components";

const CoinDeatils = (props) => {
  const { coin } = useParams();

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`)
      .then((response) => response.json())
    //  .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div style={{ width: "80%",height:"300px" }}>
      {/* <CoinPriceLive /> */}
      <TradingChart />
    </div>
  );
};

export default CoinDeatils;

//   ath: 69045
// ath_change_percentage: -64.58471
// ath_date: "2021-11-10T14:24:11.849Z"
// atl: 67.81
// atl_change_percentage: 35960.7091
// total_volume: 23161802121
// atl_date: "2013-07-06T00:00:00.000Z"
// circulating_supply: 19120693
// current_price: 24479
// fully_diluted_valuation: 513500530923
// high_24h: 24883
// id: "bitcoin"
// image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
// last_updated: "2022-08-13T19:07:34.606Z"
// low_24h: 24112
// market_cap: 467546952720
// market_cap_change_24h: 4850673555
// market_cap_change_percentage_24h: 1.04835
// market_cap_rank: 1
// max_supply: 21000000
// name: "Bitcoin"
// price_change_24h: 261.7
// price_change_percentage_24h: 1.08064
// roi: null
// symbol: "btc"
// total_supply: 21000000
