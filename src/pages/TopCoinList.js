import React from "react";
import { Coin } from "../components";

const TopCoinList = () => {
  const [coins, setCoins] = React.useState([]);
  const [coinsListNumber, setCoinsListNumber] = React.useState(10);
  React.useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsListNumber}&page=1&sparkline=false`
    )
      .then((response) => response.json())
      .then((data) => setCoins(data))
      //  .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, [coinsListNumber]);
  const moreCoins = () => {
    setCoinsListNumber((prev) => prev + 10);
  };
  return (
    <div className="coin-search m-3 ">
      <div className="col-12 d-flex justify-content-center">
        <div className="col-10 ">
          <table className="table">
            <thead className="">
              <tr className="text-center bg-light d-flex">
                <th scope="col" className="col-2 col-md-1"></th>
                <th scope="col" className="col-3 col-md-2 text-center">Coin</th>
                <th scope="col" className="d-none d-md-block col-md-2">Symbol</th>
                <th scope="col" className="col-3 ">Price</th>
                <th scope="col" className="d-none d-md-block col-md-2">Change</th>
                <th scope="col" className="col-2 col-lg-2"></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      {coins.map((coin) => {
        return (
          <Coin
            key={coin.id}
            id={coin.id}
            name={coin.name}
            price={coin.current_price}
            symbol={coin.symbol}
            marketcap={coin.total_volume}
            volume={coin.market_cap}
            image={coin.image}
            priceChange={coin.price_change_percentage_24h}
          />
        );
      })}
      <div className="d-flex align-items-center justify-content-center my-3">
        <button className="btn btn-info w-25  text-light" onClick={moreCoins}>
          More
        </button>
      </div>
    </div>
  );
};

export default TopCoinList;



{/* <div className="coin-container">
        <div className="coin-row bg-light m-1 px-3">
          <div className="coin">
            <div></div>
            <h1 className="px-5">Coin</h1>
            <div className="coin-symbol">Symbol</div>
          </div>
          <div className="d-flex px-1 ">
            <p className="px-5">Price</p>
            <p className="px-5">Volume</p>
            <p className="px-5">Change</p>
          </div>
        </div>
      </div> */}
