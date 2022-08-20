import db from "./Firebase";

export const dbCoins = (user) => {
  const dbCoins = db.collection(user.email).doc(user.email).collection("coins");
  return dbCoins;
};

export const dbOrders = (user) => {
  const dbOrders = db.collection(user.email).doc(user.email).collection("orders");
  return dbOrders;
};

export const dbTrades = (user) => {
  const dbTrades = db.collection(user.email).doc(user.email).collection("trades");
  return dbTrades;
};
export const dbBestMarketBuy = (user) => {
  const dbBestMarketBuy = db.collection(user.email).doc(user.email).collection("bestMarketBuy");
  return dbBestMarketBuy;
};
