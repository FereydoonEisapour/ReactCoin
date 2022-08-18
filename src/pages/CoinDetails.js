import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { CoinPriceLive } from "../components";
import { TradingChart } from "../components";
import DetailsCoinItem from "../components/DetailsCoinItem";

const CoinDetails = (props) => {
  const { coin } = useParams();

  const [coinDetails, setCoinDetails] = useState("");

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`)
      .then((response) => response.json())
      //  .then((data) => console.log(data))
      .then((data) => setCoinDetails(data))
      .catch((err) => console.error(err));
  }, [coin]);

  return coinDetails ? (
    <div className="d-flex col-12 justify-content-center  border-light">
      <div className="col-10 my-4 bg-light ">
        <div className="list-group w-auto ">
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
                <h6 className="mb-0 mx-4 text-capitalize ">{coinDetails.id}</h6>
              </div>
              <div className=" text-nowrap">{/* <CoinPriceLive /> */} not working</div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-start main-color">
          <div className="col-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Rank</div>
                  <div className="">{coinDetails.coingecko_rank}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Symbol</div>
                  <div className="">{coinDetails.symbol}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Block time</div>
                  <div className="">{coinDetails.block_time_in_minutes} min</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className="">Hashing algorithm</div>
                  <div className="">{coinDetails.hashing_algorithm}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 my-1 bg-light">
            <div className="list-group w-auto ">
              <div className="list-group-item list-group-item-action  align-items-center d-flex gap-3 py-3">
                <div className="d-flex gap-2 w-100 justify-content-between ">
                  <div className=""></div>
                  <div className="">{coinDetails.description.en}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center align-content-center">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default CoinDetails;
