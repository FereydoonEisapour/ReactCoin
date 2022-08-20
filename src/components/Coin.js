import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CoinPirceLive from "./CoinPriceLive";
const Coin = ({ name, price, symbol, marketcap, volume, image, priceChange, id }) => {
  return (
    <div className="coin-container">
      <div className="coin-row bg-light m-1 px-3">
        <div className="coin">
          <img src={image} alt="crypto" />
          <h1>{name}</h1>
          <p className="coin-symbol">{symbol}</p>
        </div>
        <div className="coin-data">
          <div className="coin-price">
            <CoinPirceLive symbol={symbol} />
          </div>
          <p className="coin-volume">${volume.toLocaleString()}</p>

          {priceChange < 0 ? (
            <p className="coin-percent red">{priceChange.toFixed(2)}%</p>
          ) : (
            <p className="coin-percent green">{priceChange.toFixed(2)}%</p>
          )}
        </div>
        <div className="coin-btn p-1 px-3 mb-3 d-flex align-items-center justify-content-between ">
          <Link className="text-decoration-none px-3" to={`/trade/${symbol}`}>
            Trade
          </Link>
          <Link to={`/coin/${id}`} style={{ textDecoration: "none" }}>
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
Coin.propTypes = {
  id:PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  symbol: PropTypes.string,
  marketcap: PropTypes.number,
  volume: PropTypes.number,
  image: PropTypes.string,
  priceChange: PropTypes.number,
};
export default Coin;
