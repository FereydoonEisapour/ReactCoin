import React, { useEffect, useState } from "react";
import { Coin } from "../components";

const TopCoinList = () => {
  const [coins, setCoins] = useState([]);
  const [coinsListNumber, setCoinsListNumber] = useState(10);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsListNumber}&page=1&sparkline=false`
    )
      .then((response) => response.json())
      //.then(data=>console.log(data))
      .then((data) => setCoins(data))
      .catch((err) => console.error(err));
  }, [coinsListNumber]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );
  const moreCoins = () => {
    setCoinsListNumber((prev) => prev + 10);
  };
  return (
    <div className="coin-search ">
      <div className="coin-app">
        <h1 className="coin-text"> Crypto</h1>
        <form>
          <input
            className="coin-input my-3"
            type="text"
            onChange={handleChange}
            placeholder="Search"
          />
        </form>
      </div>
      {filteredCoins.map((coin) => {
        return (
          <Coin
            key={coin.id}
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
        <button
          className="btn btn-info w-25  text-light"
          onClick={moreCoins}
        >
          More
        </button>
      </div>
    </div>
  );
};

export default TopCoinList;
