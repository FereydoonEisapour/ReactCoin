import db from "./Firebase";

export const dbCoins = (userEmail) => {
  const dbCoins = db.collection(userEmail).doc(userEmail).collection("coins");
  return dbCoins;
};

export const dbOrders = (userEmail) => {
  const dbOrders = db.collection(userEmail).doc(userEmail).collection("orders");
  return dbOrders;
};

export const dbTrades = (userEmail) => {
  const dbTrades = db.collection(userEmail).doc(userEmail).collection("trades");
  return dbTrades;
};
export const dbBestMarketBuy = (userEmail) => {
  const dbBestMarketBuy = db.collection(userEmail).doc(userEmail).collection("bestMarketBuy");
  return dbBestMarketBuy;
};