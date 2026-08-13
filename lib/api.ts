import { Stock, Region } from "./types";
import { mockStocks } from "./mock-data";

const NGN_KEY = process.env.NEXT_PUBLIC_NGN_MARKET_API_KEY;
const FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

/**
 * Fetch live Nigerian stocks from NGN Market API
 */
async function fetchNigeriaStocks(): Promise<Stock[]> {
  if (!NGN_KEY) return [];

  try {
    const res = await fetch("https://api.ngnmarket.com/v1/companies", {
      headers: {
        Authorization: `Bearer ${NGN_KEY}`,
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) throw new Error("NGN Market API error");

    const json = await res.json();
    const companies = json.data?.data || json.data || [];

    return companies.slice(0, 20).map((item: any, index: number) => ({
      id: `ngx-${item.symbol || index}`,
      symbol: item.symbol,
      name: item.name || item.company_name || item.symbol,
      region: "nigeria" as Region,
      exchange: "NGX",
      price: Number(item.price || item.last_price || 0),
      change: Number(item.price_change || item.change || 0),
      changePercent: Number(
        item.price_change_percent || item.change_percent || 0
      ),
      volume: Number(item.volume || 0),
      marketCap: item.market_cap ? Number(item.market_cap) : undefined,
      currency: "NGN",
      sector: item.sector || undefined,
      sparkline: undefined, // can be added later
    }));
  } catch (error) {
    console.error("Failed to fetch Nigeria stocks:", error);
    return [];
  }
}

/**
 * Fetch some global stocks from Finnhub
 */
async function fetchGlobalStocks(): Promise<Stock[]> {
  if (!FINNHUB_KEY) return [];

  const symbols = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "GOOGL", "META"];

  try {
    const promises = symbols.map(async (symbol) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
      );
      if (!res.ok) return null;
      const data = await res.json();

      return {
        id: `global-${symbol}`,
        symbol,
        name: symbol, // you can improve this later with profile endpoint
        region: "global" as Region,
        exchange: "US",
        price: data.c || 0,
        change: data.d || 0,
        changePercent: data.dp || 0,
        volume: 0,
        currency: "USD",
        sparkline: undefined,
      } as Stock;
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean) as Stock[];
  } catch (error) {
    console.error("Failed to fetch global stocks:", error);
    return [];
  }
}

/**
 * Main function – tries live data, falls back to mock
 */
export async function fetchStocksByRegion(region: Region): Promise<Stock[]> {
  let liveStocks: Stock[] = [];

  if (region === "nigeria") {
    liveStocks = await fetchNigeriaStocks();
  } else if (region === "global") {
    liveStocks = await fetchGlobalStocks();
  }

  // If we got live data, use it. Otherwise fall back to mock
  if (liveStocks.length > 0) {
    return liveStocks;
  }

  // Fallback to mock data for the selected region
  return mockStocks.filter((s) => s.region === region);
}