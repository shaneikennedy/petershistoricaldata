"use server";
import YahooFinance from "yahoo-finance2";

function oneYearAgo() {
  const d = new Date(0);
  d.setUTCMilliseconds(Date.now() - 31104000000); // 12m * 30 d/m *24hr/d * 60m/hr * 60s/m
  return d;
}
export const fetchData = async (
  symbol: string,
): Promise<
  {
    date: string;
    high: number | null;
    low: number | null;
    open: number | null;
    close: number | null;
    volume: number | null;
    adjclose?: number | null | undefined;
  }[]
> => {
  // Simulating API call delay
  const yahooFinance = new YahooFinance();
  const response = await yahooFinance.chart(symbol.toUpperCase(), {
    period1: oneYearAgo(),
    interval: "1d",
  });
  return response.quotes.map((item) => ({
    ...item,
    date: new Date(item.date).toISOString().split("T")[0],
  }));
};
