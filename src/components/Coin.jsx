import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const Coin = ({ name, price, symbol,  image, priceChange, id }) => {

  return (
    <div className="col-12 col-md-10 d-flex justify-content-center ">
      <div className="col-12 ">
        <table className="table  ">
          <tbody >
            <tr className="text-center text-color d-flex">
              <th scope="row" className="col-2 col-md-1">
                <img className="coin-img " src={image} alt="coin" />
              </th>
              <td className="col-3 col-md-2 text-center  fw-bold ">
                <Link to={`/coin/${id}`} style={{ textDecoration: "none" }}>
                  <span style={{ fontSize: "14px" }} className="navbar-link"> {name} </span>
                </Link>
              </td>
              <td className="col-2 d-none d-md-block fw-bold" style={{ fontSize: "14px" }}>
                {symbol.toUpperCase()}
              </td>
              <td className="col-3 fw-bold ">
                {price}
              </td>
              <td className=" d-none d-md-block col-md-2 fw-bold">
                {priceChange < 0 ?
                  <div className=" red  ">{priceChange.toFixed(2)}%</div>
                  :
                  <div className=" green">{priceChange.toFixed(2)}%</div>}
              </td>
              <td className="col-1 col-lg-2 fw-bold">
                  <Link className="text-decoration-none navbar-link" to={`/trade/${symbol}`}>
                    Trade
                  </Link>
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
