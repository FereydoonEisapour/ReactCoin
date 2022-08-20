import db from "../data/Firebase";
import PropTypes from "prop-types";
import { useAuthState } from "../contexts/AuthContext";
const OrderItem = ({ coin, amount, inPrice, id }) => {
  const { user } = useAuthState();
  const deleteOrder = () => {
    db.collection(user.email).doc(user.email).collection("orders").doc(id).delete();
  };
  return (
    <div className="d-flex justify-content-between rounded-3 px-4 py-1 m-2 order-success">
      <div className="">{coin.toUpperCase()}</div>
      <div className="">{amount}</div>
      <div className="">{inPrice}</div>
      <button onClick={(e) => deleteOrder(e)} className=" ">
        ❌
      </button>
    </div>
  );
};
OrderItem.propTypes = {
  id: PropTypes.string,
  coin: PropTypes.string,
  amount: PropTypes.number,
  inPrice: PropTypes.number,
};
export default OrderItem;
