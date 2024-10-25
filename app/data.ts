"use server";
import yahooFinance from "yahoo-finance2";

function oneYearAgo() {
  const d = new Date(0);
  d.setUTCMilliseconds(Date.now() - 31104000000); // 12m * 30 d/m *24hr/d * 60m/hr * 60s/m
  return d;
}
export const fetchData = async (symbol: string) => {
  // Simulating API call delay
  const response = await yahooFinance.historical(symbol.toUpperCase(), {
    period1: oneYearAgo(),
    interval: "1d",
  });
  return response.map((item) => ({
    ...item,
    date: new Date(item.date).toISOString().split("T")[0],
  }));
};
