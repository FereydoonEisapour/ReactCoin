import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CoinPirceLive from "./CoinPriceLive";
import { useAuthState } from '../contexts/AuthContext'
import "../assets/styles/Coin.css"
const Coin = ({ name, price, symbol, marketcap, volume, image, priceChange, id }) => {
  const { userEmail } = useAuthState()
  return (
    <div className="col-12 d-flex justify-content-center">
      <div className="col-10 ">
        <table className="table">
          <tbody >
            <tr className="text-center bg-light d-flex">
              <th scope="row" className="col-2 col-md-1">
                <img className="coin-img " src={image} alt="coin" />
              </th>
              <td className="col-3 col-md-2 text-center  fw-bold">
                <Link to={`/coin/${id}`} style={{ textDecoration: "none" }}>
                  {name}
                </Link>
              </td>
              <td className="col-2 d-none d-md-block ">
                {symbol.toUpperCase()}
              </td>
              <td className="col-3 fw-bold ">
                <CoinPirceLive symbol={symbol} />
              </td>
              <td className=" d-none d-md-block col-md-2 ">
                {priceChange < 0 ? 
                <div className=" red  ">{priceChange.toFixed(2)}%</div>
                  :
                <div className=" green">{priceChange.toFixed(2)}%</div>}
              </td>
              <td className="col-1 col-lg-2 ">
                {userEmail ?
                  <Link className="text-decoration-none " to={`/trade/${symbol}`}>
                    Trade
                  </Link>
                  :
                  <Link className="text-decoration-none " to={`/login`}>
                    Trade
                  </Link>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
Coin.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  symbol: PropTypes.string,
  marketcap: PropTypes.number,
  volume: PropTypes.number,
  image: PropTypes.string,
  priceChange: PropTypes.number,
};
export default Coin;
