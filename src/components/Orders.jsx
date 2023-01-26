import React from 'react'
import { useAuthState } from '../contexts/AuthContext';
import { dbOrders } from '../data/db';
import Loading from './Loading';
import { OrderItem } from './TradeItems';

function Orders() {
    const { userEmail } = useAuthState();
    const [orders, setOrders] = React.useState([]);
    // * GET ORDERS FROM API
    React.useEffect(() => {
        if (userEmail) {
            dbOrders(userEmail).orderBy("inPrice", "desc").onSnapshot((snapshot) => {
                setOrders(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    type: doc.data().type,
                    coin: doc.data().coin,
                    amount: Number(doc.data().amount),
                    inPrice: Number(doc.data().inPrice),
                })));
            });
        }

    }, [userEmail]);

    return (
        <>
            {
                userEmail ?
                    <div className="order  m-2 p-3 content-cointainer rounded-3">
                        <h3 className="text-center">Orders</h3>
                        {
                            orders.length === 0 ? <div className='d-flex  justify-content-center'>
                            <div className=' p-3 fw-bolder '>
                                You dont have any Order
                            </div>
                        </div> : null
                        }
                        {orders ? orders.map((order) => (
                            <OrderItem
                                key={order.id}
                                coin={order.coin}
                                type={order.type}
                                amount={order.amount}
                                inPrice={order.inPrice}
                                id={order.id}
                            // usdtId={usdtWalletId}
                            />
                        )) : <Loading />}
                    </div>
                    :
                    null
            }
        </>
    )
}

export default Orders