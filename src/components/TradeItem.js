import React from "react";
import PropTypes from "prop-types";

const TradeItem = ({ id, coin, amount, inPrice }) => {
  return (
    <div className="d-flex justify-content-between border border-1 p-1 m-3" key={id}>
      <div className=""> You Buy </div>
      <div className="">{coin}</div>
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
