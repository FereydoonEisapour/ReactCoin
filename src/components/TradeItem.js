import PropTypes from "prop-types";
const TradeItem = ({ id, coin, amount, inPrice }) => {
  return (
    <div className="d-flex justify-content-between p-2 m-2 rounded-3 trade-success" key={id}>
      <div className="px-2"></div>
      <div className="">{coin.toUpperCase()}</div>
      <div className="">{amount}</div>
      <div className="">{inPrice}</div>
    </div>
  );
};
TradeItem.propTypes = {
  id: PropTypes.string,
  coin: PropTypes.string,
  amount: PropTypes.number,
  inPrice: PropTypes.number,
};
export default TradeItem;
