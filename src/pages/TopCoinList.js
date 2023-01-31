import React from "react";
import { Coin, LoadingComponent } from "../components";

const TopCoinList = () => {
  const [coins, setCoins] = React.useState([]);
  const [coinsListAmount, setCoinsListAmount] = React.useState(10);
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // * Fetch data ( coin ) from Api (coingecko) 
  React.useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsListAmount}&page=1&sparkline=false`
    )
      .then((response) => response.json())
      .then((data) => setCoins(data))
      .then(setLoading(false))
      .catch((err) => { setError(err); console.error(err) });
  }, [coinsListAmount]);
  // * Get more Coins from Api
  const moreCoins = () => {
    setLoading(true)
    setCoinsListAmount((prev) => prev + 10);
  };
  return (
    <div className="d-flex flex-column  align-items-center  top-coinList-container  text-center mx-2  mx-md-5 pl-3  ">
      <div className="col-12 col-md-10  mt-2">
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
      {coins.length === 0 ? <LoadingComponent /> : null}
      {error ? <div>{error}</div> : null}
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
      {coins.length > 0 ?
        <div className="d-flex align-items-center justify-content-center my-2">
          {
            loading ? <LoadingComponent />
              :
              <button className="btn btn-dark  px-5" onClick={moreCoins}>
                More
              </button>
          }
        </div>
        : null
      }
    </div>
  );
};
export default TopCoinList;