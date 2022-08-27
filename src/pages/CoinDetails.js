import React from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../components";
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
    <div className="d-flex col-12 justify-content-center  border-light">
      <div className="col-10 my-4 bg-light ">
        <div className="list-group  ">
          <div className="list-group-item list-group-item-action  align-items-center   d-flex gap-3 py-3">
            <img
              src={coinDetails.image.small}
              alt="twbs"
              width="32"
              height="32"
              className="rounded-circle flex-shrink-0"
            />
            <div className="d-flex gap-2 w-100 justify-content-between ">
              <div>
                <h6 className="mb-0 mx-4 text-capitalize fw-bolder">{coinDetails.id}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-start main-color">
          
          <div className="col-12 col-md-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Rank</div>
                  <div className="">{coinDetails.coingecko_rank}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Symbol</div>
                  <div className="">{(coinDetails.symbol).toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Block time</div>
                  <div className="">{coinDetails.block_time_in_minutes} min</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Hashing algorithm</div>
                  <div className="">{coinDetails.hashing_algorithm}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 my-1 bg-light p-2 ">
            <div className="  ">
              <div className=" list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 justify-content-between px-2 ">
                 
                  <div className="text-overflow">{coinDetails.description.en}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default CoinDetails;
