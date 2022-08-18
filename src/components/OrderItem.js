import React, { useEffect, useState } from "react";
import db from "../data/Firebase";
import PropTypes from "prop-types";
const OrderItem = ({ coin, amount, inPrice, id }) => {
  const user = { email: "epfereydoon@gmail.com" };

  const deleteOrder = () => {
    db.collection(user.email).doc(user.email).collection("orders").doc(id).delete();
  };
  return (
    <>
      <div className="d-flex justify-content-between border border-1 p-1 m-3">
        <div className="">{coin}</div>
        <div className="">{amount}</div>
        <div className="">{inPrice}</div>
        <button onClick={(e) => deleteOrder(e)} className="btn ">
          del
        </button>
      </div>
    </>
  );
};
OrderItem.propTypes = {
  id: PropTypes.string,
  coin: PropTypes.string,
  amount: PropTypes.number,
  inPrice: PropTypes.number,
};
export default OrderItem;
