import PropTypes from "prop-types";
const TradeItem = ({ id, coin, amount, inPrice, type }) => {
  return (
    <div className="d-flex justify-content-between p-2 m-2 rounded-3 trade-success" key={id}>
      <div className="px-2">{type ? "Buy" : "Sell"}</div>
      <div className="px-2">{coin.toUpperCase()}</div>
      <div className="px-2">{amount}</div>
      <div className="px-2">{inPrice}</div>
    </div>
  );
};
TradeItem.propTypes = {
  id: PropTypes.string,
  type: PropTypes.bool,
  coin: PropTypes.string,
  amount: PropTypes.number,
  inPrice: PropTypes.number,
};
export default TradeItem;
