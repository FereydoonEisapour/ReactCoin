import React from 'react'
import { useAuthState } from '../contexts/AuthContext';
import { dbTrades } from '../data/db';
import Loading from './Loading';
import { TradeItem } from './TradeItems';

function Trades() {
    const { userEmail } = useAuthState();
    const [trades, setTrades] = React.useState([]);
    const [tradesCount, setTradesCount] = React.useState(-1)
    const [limitTrades, setLimitTrades] = React.useState(5)
    const [loading, setLoading] = React.useState(false)

    // *GET TRADES FROM API
    React.useEffect(() => {
        if (userEmail) {
            dbTrades(userEmail).get().then(snap => {
                setTradesCount(snap.size) // will return the collection size
               // console.log(snap.size)
            });
            dbTrades(userEmail).orderBy("timestamp", "desc").limit(limitTrades).onSnapshot((snapshot) => {
                setTrades(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    type: doc.data().type,
                    coin: doc.data().coin,
                    amount: doc.data().amount,
                    inPrice: doc.data().inPrice,
                })))
                setLoading(false)
            });
        }
    }, [userEmail, limitTrades]);

    const morelimitTrades = () => {
        setLoading(true)
        return setLimitTrades(prev => prev + 5)
    }
    return (
        <>
            {
                userEmail ?
                    <div className="trades  m-2 p-3 content-cointainer rounded-3">
                        <h3 className="text-center">Trades History</h3>
                        {tradesCount > 0 ?
                            <div className="d-flex  p-2 m-2 rounded-3 trade-success  ">
                                <div className="px-2 col">Trade</div>
                                <div className="px-2 col">Coin</div>
                                <div className="px-2 col">Amount</div>
                                <div className="px-2 col">Price</div>
                            </div> : null
                        }
                        {
                            trades.length === 0 ? <div className='d-flex  justify-content-center'>
                                <div className=' p-3 fw-bolder '>
                                    You dont have any Trade
                                </div>
                            </div> : null
                        }
                        {trades ? trades.map((trade) => (
                            <TradeItem
                                key={trade.id}
                                id={trade.id}
                                type={trade.type}
                                coin={trade.coin}
                                amount={trade.amount}
                                inPrice={trade.inPrice}
                                length={trades.length}
                            />
                        ))
                            : <Loading />}
                        <div className="d-flex justify-content-center">
                            {
                                tradesCount >= limitTrades ?
                                    <button className="btn btn-secondary  " onClick={morelimitTrades} >More Trades</button>
                                    : null
                            }
                        </div>
                    </div>
                    :
                    null
            }
        </>
    )
}

export default Trades