import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/Coin.css";
import { Link, NavLink } from "react-router-dom";
import CoinPirceLive from "./CoinPriceLive";
const Coin = ({ name, price, symbol, marketcap, volume, image, priceChange }) => {
  return (
    <div className="coin-container ">
      <div className="coin-row bg-light m-1 px-3">
        <div className="coin">
          <img src={image} alt="crypto" />
          <Link to={`/coin/${name}`} style={{ textDecoration: "none" }}>
            <h1>{name}</h1>
          </Link>
          <p className="coin-symbol">{symbol}</p>
        </div>
        <div className="coin-data">
          {/* <p className="coin-price">${price} </p> */}
          <div className="coin-price">
            <CoinPirceLive symbol={symbol} />
          </div>
          <p className="coin-volume">${volume.toLocaleString()}</p>

          {priceChange < 0 ? (
            <p className="coin-percent red">{priceChange.toFixed(2)}%</p>
          ) : (
            <p className="coin-percent green">{priceChange.toFixed(2)}%</p>
          )}

          <p className="coin-marketcap">Mkt Cap: ${marketcap.toLocaleString()}</p>
        </div>
        <div className="p-1 px-3 mb-2">
          <Link className="text-decoration-none" to={`/coin/trading/${symbol}`}>
            Trade
          </Link>
        </div>
      </div>
    </div>
  );
};
Coin.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  symbol: PropTypes.string,
  marketcap: PropTypes.number,
  volume: PropTypes.number,
  image: PropTypes.string,
  priceChange: PropTypes.number,
};
export default Coin;
