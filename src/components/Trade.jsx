import React, { useEffect, useState } from 'react';
import { dbCoins, dbOrders, dbTrades } from '../data/db';
import firebase from 'firebase/compat/app';
import { useAuthState } from '../contexts/AuthContext';
import PleaseLogin from './PleaseLogin';

function Trade({ coin }) {
    const { userEmail } = useAuthState();

    const [coinPriceLive, setCoinPriceLive] = useState(0);
    const [usdtWallet, setUsdtWallet] = useState(0);
    const [usdtWalletId, setUsdtWalletId] = useState("");
    const [coinTrade, setCoinTrade] = useState(0);
    const [coinTradeId, setCoinTradeId] = useState("");
    const [usdtInput, setUsdtInput] = useState("");
    const [coinInput, setCoinInput] = useState("");
    const [calcOrder, setCalcOrder] = useState(0);
    const [orders, setOrders] = useState([]);
    const [orderType, setOrderType] = useState(true);
    const [btnDisabled, setBtnDisabled] = useState(false);

    // Update button state based on validation
    useEffect(() => {
        const isBuy = orderType;
        const isSell = !orderType;

        const isInvalidBuy = isBuy && (calcOrder > usdtWallet || !usdtWallet || !coinInput || !usdtInput);
        const isInvalidSell = isSell && (coinInput > coinTrade || !coinTrade || !coinInput || !usdtInput);

        setBtnDisabled(isInvalidBuy || isInvalidSell);
    }, [calcOrder, usdtWallet, coinInput, coinTrade, orderType, usdtInput]);

    // Handle input changes
    const handleUsdtInput = (e) => {
        const value = Number(e.target.value);
        setUsdtInput(value);
        setCalcOrder(value * coinInput);
    };

    const handleCoinInput = (e) => {
        const value = Number(e.target.value);
        setCoinInput(value);
        setCalcOrder(usdtInput * value);
    };

    // Fetch wallet balances
    useEffect(() => {
        if (userEmail) {
            const unsubscribeUsdt = dbCoins(userEmail)
                .where("coin", "==", "USDT")
                .onSnapshot((snapshot) => {
                    if (snapshot.docs[0]) {
                        setUsdtWallet(snapshot.docs[0].data().amount);
                        setUsdtWalletId(snapshot.docs[0].id);
                    }
                });

            const unsubscribeCoin = dbCoins(userEmail)
                .where("coin", "==", coin.toUpperCase())
                .onSnapshot((snapshot) => {
                    if (!snapshot.docs[0]) {
                        dbCoins(userEmail).add({
                            coin: coin.toUpperCase(),
                            amount: 0,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        });
                    } else {
                        setCoinTrade(snapshot.docs[0].data().amount);
                        setCoinTradeId(snapshot.docs[0].id);
                    }
                });

            return () => {
                unsubscribeUsdt();
                unsubscribeCoin();
            };
        }
    }, [userEmail, coin]);

    // Fetch orders
    useEffect(() => {
        if (userEmail) {
            const unsubscribeOrders = dbOrders(userEmail)
                .orderBy("inPrice", "desc")
                .onSnapshot((snapshot) => {
                    setOrders(snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        amount: Number(doc.data().amount),
                        inPrice: Number(doc.data().inPrice),
                    })));
                });

            return () => unsubscribeOrders();
        }
    }, [userEmail]);

    // Place order
    const handleOrder = async () => {
        if (calcOrder <= 0) return;

        try {
            const newOrder = {
                coin: coin.toLowerCase(),
                type: orderType,
                amount: coinInput,
                inPrice: usdtInput,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            };

            await dbOrders(userEmail).add(newOrder);

            if (orderType) {
                const updatedUsdt = usdtWallet - calcOrder;
                await dbCoins(userEmail).doc(usdtWalletId).update({ amount: updatedUsdt });
            } else {
                const updatedCoin = coinTrade - coinInput;
                await dbCoins(userEmail).doc(coinTradeId).update({ amount: updatedCoin });
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    // Match orders with live price
    useEffect(() => {
        if (userEmail && orders.length > 0) {
            const matchedOrder = orders.find(order => order.inPrice === coinPriceLive);

            if (matchedOrder) {
                dbTrades(userEmail).add({
                    coin,
                    type: matchedOrder.type,
                    amount: matchedOrder.amount,
                    inPrice: matchedOrder.inPrice,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });

                dbOrders(userEmail).doc(matchedOrder.id).delete();

                if (matchedOrder.type) {
                    dbCoins(userEmail).doc(coinTradeId).update({
                        amount: coinTrade + matchedOrder.amount,
                    });
                } else {
                    dbCoins(userEmail).doc(usdtWalletId).update({
                        amount: usdtWallet + matchedOrder.inPrice * matchedOrder.amount,
                    });
                }

                navigator.vibrate(100);
            }
        }
    }, [coinPriceLive, orders, userEmail, coinTrade, coinTradeId, usdtWallet, usdtWalletId]);

    // Fetch live price from Binance
    useEffect(() => {
        const socket = new WebSocket("wss://stream.binance.com:9443/ws");

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    method: "SUBSCRIBE",
                    params: [`${coin}usdt@trade`],
                    id: 1,
                })
            );
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const price = parseFloat(data.p).toFixed(0);
            if (!isNaN(price)) setCoinPriceLive(Number(price));
        };

        return () => socket.close();
    }, [coin]);

    return (
        <div className="trade row m-2 content-container rounded-3">
            <div className="trade-tabs pt-3">
                <div className="tabs">
                    <input type="radio" id="radio-1" name="tabs" checked={orderType} readOnly />
                    <label className="tab text-black" htmlFor="radio-1" onClick={() => setOrderType(true)}>Buy</label>
                    <input type="radio" id="radio-2" name="tabs" checked={!orderType} readOnly />
                    <label className="tab text-black" htmlFor="radio-2" onClick={() => setOrderType(false)}>Sell</label>
                    <span className="glider"></span>
                </div>
            </div>
            <div className="p-3 mt-2">
                <div className="coinName fw-bold text-center py-4 display-6">
                    {coin.toUpperCase()} / USDT
                </div>
                <div className="input-group mb-3 px-4">
                    <span className="input-group-text" style={{ padding: "8px 18px" }}>USDT</span>
                    <input value={usdtInput} onChange={handleUsdtInput} type="number" className="form-control" min="0" />
                </div>
                <div className="input-group mb-3 px-4">
                    <span className="input-group-text" style={{ padding: "8px 24px" }}>{coin.toUpperCase()}</span>
                    <input value={coinInput} onChange={handleCoinInput} type="number" className="form-control" min="0" />
                </div>
            </div>
            <div className="mb-3 px-4 text-center">
                {userEmail ? (
                    <button className="btn btn-primary w-50" disabled={btnDisabled} onClick={handleOrder}>
                        {orderType ? "Buy" : "Sell"}
                    </button>
                ) : (
                    <PleaseLogin />
                )}
            </div>
        </div>
    );
}

export default Trade;
