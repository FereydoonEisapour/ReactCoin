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
    <div className="d-flex flex-column  align-items-center m-2 top-coinList-container pl-3 text-center ">
      <div className="col-12 col-md-10  mt-4">
        <div className="col-12 ">
          <table className="table  ">
            <thead className="">
              <tr className="text-center d-flex  text-color">
                <th scope="col" className="col col-1  "></th>
                <th scope="col" className="col  text-center">Coin</th>
                <th scope="col" className="col d-none d-md-block ">Symbol</th>
                <th scope="col" className="col ">Price</th>
                <th scope="col" className="col ">Change</th>
                <th scope="col" className="col "></th>
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
      <div className="d-flex align-items-center justify-content-center my-2">
        <button className="btn btn-dark w-100  text-light" onClick={moreCoins}>
          More
        </button>
      </div>
    </div>
  );
};
export default TopCoinList;