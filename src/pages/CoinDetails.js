import React from "react";
import { useParams } from "react-router-dom";
import { LoadingComponent } from "../components";
const CoinDetails = () => {
  const { coin } = useParams();
  const [coinDetails, setCoinDetails] = React.useState("");
  React.useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => setCoinDetails(data))
      .catch((err) => console.error(err));
  }, [coin]);
  return coinDetails ? (
    <div className="d-flex  justify-content-center   top-coinList-container m-4 fw-bold ">
      <div className="col-11 my-4 text-color ">
        <div className="list-group  border border-1">
          <div className="list-group-item list-group-item-action  align-items-center   d-flex gap-3 py-3 content-cointainer">
            <img
              src={coinDetails.image.small}
              alt="twbs"
              width="32"
              height="32"
              className="rounded-circle flex-shrink-0"
            />
            <div className="d-flex gap-2 w-100 justify-content-between text-color">
              <div>
                <h6 className="mb-0 mx-4 text-capitalize fw-bolder">{coinDetails.id}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-start content-cointainer">
          
          <div className="col-12 col-md-4  ">
            <div className="list-group w-auto p-1 ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3 content-cointainer">
                <div className="d-flex gap-2 w-100 justify-content-between text-color">
                  <div className="">Rank</div>
                  <div className="">{coinDetails.coingecko_rank}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 ">
            <div className="list-group w-auto p-1">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3 content-cointainer">
                <div className="d-flex gap-2 w-100 justify-content-between text-color ">
                  <div className="">Symbol</div>
                  <div className="">{(coinDetails.symbol).toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4  ">
            <div className="list-group w-auto p-1">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3 content-cointainer">
                <div className="d-flex gap-2 w-100 justify-content-between text-color">
                  <div className="">Block time</div>
                  <div className="">{coinDetails.block_time_in_minutes} min</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4   ">
            <div className="list-group w-auto p-1 ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3 content-cointainer">
                <div className="d-flex gap-2 w-100 justify-content-between  text-color">
                  <div className="">Hashing algorithm</div>
                  <div className="">{coinDetails.hashing_algorithm}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 my-1 text-color p-2 border border-1 rounded-2  ">
            <div className="p-1  ">
              <div className=" list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 justify-content-between px-2 ">
                  <p className="text-overflow letter">{coinDetails.description.en}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : (
    <LoadingComponent />
  );
};

export default CoinDetails;
